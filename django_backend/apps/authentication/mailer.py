from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def send_django_verification_email(to_email, first_name, code):
    formatted_code = f"{code[:3]} {code[3:]}"
    subject = f"Your 6-Digit Joblifyr Verification Code: {code}"
    
    html_message = f"""
    <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 550px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; text-align: center;">
        <div style="display: inline-block; width: 48px; height: 48px; background: #4F52E6; border-radius: 12px; line-height: 48px; color: #ffffff; font-weight: bold; font-size: 24px; margin-bottom: 20px;">J</div>
        <h2 style="color: #0A0F1D; font-size: 24px; margin: 0 0 10px 0;">Verify Your Email Address</h2>
        <p style="color: #64748b; font-size: 14px; margin-bottom: 25px;">Hello {first_name}, please use the 6-digit security code below to complete your Joblifyr account creation.</p>
        
        <div style="background: #F4F3FF; border: 1px solid #e0e7ff; border-radius: 16px; padding: 20px; margin: 20px 0;">
            <span style="font-family: monospace, Courier; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #4F52E6;">{formatted_code}</span>
        </div>
        
        <p style="color: #94a3b8; font-size: 12px; margin-top: 25px;">This code expires in 15 minutes. If you did not request this, please ignore this email.</p>
    </div>
    """

    try:
        sent = send_mail(
            subject=subject,
            message=f"Hello {first_name}, your Joblifyr verification code is: {code}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_email],
            html_message=html_message,
            fail_silently=False
        )
        return sent > 0
    except Exception as e:
        logger.error(f"Django mailer error: {e}")
        return False
