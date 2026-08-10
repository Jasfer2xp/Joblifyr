from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, make_password, check_password
from django.utils import timezone
from datetime import timedelta

from .models import JoblifyrUser, PendingVerification
from .mailer import send_django_verification_email

class RegisterAPIView(APIView):
    def post(self, request):
        data = request.data
        email = data.get('email', '').strip().lower()
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        password = data.get('password', '')

        if not email or not first_name or not last_name or not password:
            return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if len(password) < 8:
            return Response({'error': 'Password must be at least 8 characters.'}, status=status.HTTP_400_BAD_REQUEST)

        if JoblifyrUser.objects.filter(email=email).exists():
            return Response({'error': 'An account with this email address already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate 6-digit code
        code = PendingVerification.generate_code()
        password_hash = make_password(password)
        expires_at = timezone.now() + timedelta(minutes=15)

        # Remove existing pending attempt if any
        PendingVerification.objects.filter(email=email).delete()

        pending = PendingVerification.objects.create(
            email=email,
            first_name=first_name,
            last_name=last_name,
            password_hash=password_hash,
            verification_code=code,
            expires_at=expires_at
        )

        # Send email via Gmail SMTP
        sent = send_django_verification_email(email, first_name, code)
        if not sent:
            pending.delete()
            return Response({'error': 'Failed to send verification email. Please check your email address.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            'message': 'Verification code sent to your email address.',
            'status': 'pending_verification',
            'email': email
        }, status=status.HTTP_200_OK)


class VerifyCodeAPIView(APIView):
    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        code = request.data.get('verification_code', '').strip()

        if not email or not code:
            return Response({'error': 'Email address and verification code are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            pending = PendingVerification.objects.get(email=email)
        except PendingVerification.DoesNotExist:
            return Response({'error': 'No pending registration found for this email address. Please register again.'}, status=status.HTTP_404_NOT_FOUND)

        if pending.is_expired():
            pending.delete()
            return Response({'error': 'Verification code has expired. Please register again.'}, status=status.HTTP_400_BAD_REQUEST)

        if pending.verification_code != code:
            pending.attempts += 1
            pending.save()
            if pending.attempts >= 5:
                pending.delete()
                return Response({'error': 'Too many failed attempts. Pending registration cancelled for security.'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': 'Invalid verification code. Please check your email.'}, status=status.HTTP_400_BAD_REQUEST)

        # CODE VERIFIED! Create user in active database
        user = JoblifyrUser.objects.create(
            username=pending.email,
            email=pending.email,
            first_name=pending.first_name,
            last_name=pending.last_name,
            password=pending.password_hash
        )

        pending.delete()

        return Response({
            'success': True,
            'message': 'Account verified and created successfully.',
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name
            }
        }, status=status.HTTP_201_CREATED)


class LoginAPIView(APIView):
    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')

        if not email or not password:
            return Response({'error': 'Please enter both email and password.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = JoblifyrUser.objects.get(email=email)
        except JoblifyrUser.DoesNotExist:
            return Response({'error': 'Account does not exist or has not been verified yet. Please register first.'}, status=status.HTTP_401_UNAUTHORIZED)

        if not check_password(password, user.password):
            return Response({'error': 'Incorrect password. Please try again.'}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({
            'success': True,
            'message': 'Logged in successfully.',
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name
            }
        }, status=status.HTTP_200_OK)
