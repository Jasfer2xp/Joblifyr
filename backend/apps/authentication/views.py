import logging
import random
import secrets
from datetime import timedelta
from urllib.parse import urlencode

import requests
from django.conf import settings
from django.contrib.auth import authenticate
from django.core import signing
from django.core.mail import send_mail
from django.db import transaction
from django.http import HttpResponseRedirect
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.models import JoblifyrUser

from .models import PendingVerification

logger = logging.getLogger(__name__)

STATE_SALT = 'joblifyr-google-oauth-state'
STATE_MAX_AGE = 600


def _user_payload(user):
    return {
        'id': user.id,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'role': user.role,
        'auth_provider': user.auth_provider,
        'avatar_url': user.avatar_url,
        'is_verified': user.is_verified,
    }


def _issue_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }


def _frontend_redirect(path='/auth/callback', **params):
    base = f"{settings.FRONTEND_URL.rstrip('/')}{path}"
    if params:
        return f"{base}?{urlencode(params)}"
    return base


def send_verification_email(to_email, first_name, code):
    formatted_code = f'{code[:3]} {code[3:]}'
    subject = f'Your 6-Digit Joblifyr Verification Code: {code}'
    html_message = f"""
    <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 550px; margin: 0 auto;">
        <h2>Verify Your Email Address</h2>
        <p>Hello {first_name}, use this code to complete your Joblifyr account:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4F52E6;">{formatted_code}</p>
        <p style="color: #94a3b8; font-size: 12px;">This code expires in 15 minutes.</p>
    </div>
    """
    try:
        return send_mail(
            subject=subject,
            message=f'Hello {first_name}, your Joblifyr verification code is: {code}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_email],
            html_message=html_message,
            fail_silently=False,
        ) > 0
    except Exception as exc:
        logger.error('Verification email failed: %s', exc)
        return False


class RegisterAPIView(APIView):
    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        first_name = request.data.get('first_name', '').strip()
        last_name = request.data.get('last_name', '').strip()
        password = request.data.get('password', '')
        role = request.data.get('role', JoblifyrUser.Role.JOB_SEEKER)

        if not email or not first_name or not password:
            return Response({'error': 'Email, name, and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if len(password) < 8:
            return Response({'error': 'Password must be at least 8 characters.'}, status=status.HTTP_400_BAD_REQUEST)

        if JoblifyrUser.objects.filter(email=email).exists():
            return Response({'error': 'An account with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        if role not in JoblifyrUser.Role.values:
            role = JoblifyrUser.Role.JOB_SEEKER

        code = f'{random.randint(0, 999999):06d}'
        PendingVerification.objects.filter(email=email).delete()
        pending = PendingVerification.objects.create(
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
            role=role,
            verification_code=code,
            expires_at=timezone.now() + timedelta(minutes=15),
        )

        if not send_verification_email(email, first_name, code):
            pending.delete()
            return Response(
                {'error': 'Failed to send verification email. Check SMTP settings.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {
                'message': 'Verification code sent to your email address.',
                'status': 'pending_verification',
                'email': email,
            },
            status=status.HTTP_200_OK,
        )


class VerifyCodeAPIView(APIView):
    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        code = request.data.get('verification_code', '').strip()

        if not email or not code:
            return Response(
                {'error': 'Email address and verification code are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            pending = PendingVerification.objects.get(email=email)
        except PendingVerification.DoesNotExist:
            return Response(
                {'error': 'No pending registration found. Please register again.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if pending.is_expired():
            pending.delete()
            return Response({'error': 'Verification code has expired.'}, status=status.HTTP_400_BAD_REQUEST)

        if pending.verification_code != code:
            pending.attempts += 1
            pending.save(update_fields=['attempts'])
            if pending.attempts >= 5:
                pending.delete()
                return Response({'error': 'Too many failed attempts.'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': 'Invalid verification code.'}, status=status.HTTP_400_BAD_REQUEST)

        user = JoblifyrUser.objects.create_user(
            email=pending.email,
            first_name=pending.first_name,
            last_name=pending.last_name,
            password=pending.password,
            role=pending.role,
            auth_provider=JoblifyrUser.AuthProvider.EMAIL,
            is_verified=True,
        )
        pending.delete()

        tokens = _issue_tokens(user)
        return Response(
            {
                'success': True,
                'message': 'Account verified and created successfully.',
                'user': _user_payload(user),
                'tokens': tokens,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginAPIView(APIView):
    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')

        if not email or not password:
            return Response({'error': 'Please enter both email and password.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=email, password=password)
        if user is None:
            return Response(
                {'error': 'Invalid email or password, or account not verified.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        tokens = _issue_tokens(user)
        return Response(
            {
                'success': True,
                'message': 'Logged in successfully.',
                'user': _user_payload(user),
                'tokens': tokens,
            },
            status=status.HTTP_200_OK,
        )


class MeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'user': _user_payload(request.user)})


class GoogleLoginAPIView(APIView):
    """Start Google OAuth — browser redirect to Google consent screen."""

    def get(self, request):
        if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
            return Response(
                {'error': 'Google OAuth is not configured on the server.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return_path = request.query_params.get('return_to', '/jobs')
        state = signing.dumps(
            {'nonce': secrets.token_urlsafe(16), 'return_to': return_path},
            salt=STATE_SALT,
        )

        params = {
            'client_id': settings.GOOGLE_CLIENT_ID,
            'redirect_uri': settings.GOOGLE_REDIRECT_URI,
            'response_type': 'code',
            'scope': 'openid email profile',
            'access_type': 'online',
            'prompt': 'select_account',
            'state': state,
        }
        google_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
        return HttpResponseRedirect(google_url)


class GoogleCallbackAPIView(APIView):
    """Google redirects here after consent. Creates/logs in user, redirects to frontend with JWT."""

    def get(self, request):
        error = request.query_params.get('error')
        if error:
            return HttpResponseRedirect(_frontend_redirect(error=error, error_description='Google sign-in was cancelled.'))

        code = request.query_params.get('code')
        state = request.query_params.get('state')
        if not code or not state:
            return HttpResponseRedirect(_frontend_redirect(error='missing_code', error_description='Missing OAuth code.'))

        try:
            state_data = signing.loads(state, salt=STATE_SALT, max_age=STATE_MAX_AGE)
            return_path = state_data.get('return_to', '/jobs')
        except signing.BadSignature:
            return HttpResponseRedirect(_frontend_redirect(error='invalid_state', error_description='Invalid OAuth state.'))

        if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
            return HttpResponseRedirect(_frontend_redirect(error='config', error_description='Google OAuth not configured.'))

        try:
            token_response = requests.post(
                'https://oauth2.googleapis.com/token',
                data={
                    'code': code,
                    'client_id': settings.GOOGLE_CLIENT_ID,
                    'client_secret': settings.GOOGLE_CLIENT_SECRET,
                    'redirect_uri': settings.GOOGLE_REDIRECT_URI,
                    'grant_type': 'authorization_code',
                },
                timeout=15,
            )
            token_response.raise_for_status()
            token_data = token_response.json()
        except requests.RequestException as exc:
            logger.error('Google token exchange failed: %s', exc)
            return HttpResponseRedirect(_frontend_redirect(error='token_exchange', error_description='Google token exchange failed.'))

        access_token = token_data.get('access_token')
        if not access_token:
            return HttpResponseRedirect(_frontend_redirect(error='no_token', error_description='No access token from Google.'))

        try:
            userinfo_response = requests.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                headers={'Authorization': f'Bearer {access_token}'},
                timeout=15,
            )
            userinfo_response.raise_for_status()
            profile = userinfo_response.json()
        except requests.RequestException as exc:
            logger.error('Google userinfo failed: %s', exc)
            return HttpResponseRedirect(_frontend_redirect(error='userinfo', error_description='Failed to fetch Google profile.'))

        google_id = profile.get('sub')
        email = (profile.get('email') or '').lower().strip()
        if not google_id or not email:
            return HttpResponseRedirect(_frontend_redirect(error='profile', error_description='Google profile incomplete.'))

        if not profile.get('email_verified'):
            return HttpResponseRedirect(_frontend_redirect(error='unverified', error_description='Google email not verified.'))

        first_name = profile.get('given_name') or profile.get('name', '').split(' ')[0] or 'User'
        last_name = profile.get('family_name') or ''
        if not last_name and profile.get('name'):
            parts = profile['name'].split(' ', 1)
            if len(parts) > 1:
                last_name = parts[1]
        avatar_url = profile.get('picture')

        try:
            with transaction.atomic():
                user = JoblifyrUser.objects.filter(google_id=google_id).first()
                if user:
                    updated = False
                    if avatar_url and user.avatar_url != avatar_url:
                        user.avatar_url = avatar_url
                        updated = True
                    if updated:
                        user.save(update_fields=['avatar_url', 'updated_at'])
                else:
                    existing = JoblifyrUser.objects.filter(email=email).first()
                    if existing:
                        if existing.google_id and existing.google_id != google_id:
                            return HttpResponseRedirect(
                                _frontend_redirect(
                                    error='duplicate',
                                    error_description='This email is linked to a different Google account.',
                                )
                            )
                        existing.google_id = google_id
                        existing.auth_provider = JoblifyrUser.AuthProvider.GOOGLE
                        existing.is_verified = True
                        if avatar_url:
                            existing.avatar_url = avatar_url
                        if not existing.first_name:
                            existing.first_name = first_name
                        if not existing.last_name:
                            existing.last_name = last_name
                        existing.save()
                        user = existing
                    else:
                        user = JoblifyrUser.objects.create_user(
                            email=email,
                            first_name=first_name,
                            last_name=last_name,
                            google_id=google_id,
                            avatar_url=avatar_url,
                            auth_provider=JoblifyrUser.AuthProvider.GOOGLE,
                            is_verified=True,
                        )
        except Exception as exc:
            logger.exception('Google user persistence failed: %s', exc)
            return HttpResponseRedirect(_frontend_redirect(error='database', error_description='Could not save user.'))

        tokens = _issue_tokens(user)
        redirect_url = _frontend_redirect(
            access=tokens['access'],
            refresh=tokens['refresh'],
            return_to=return_path,
        )
        return HttpResponseRedirect(redirect_url)
