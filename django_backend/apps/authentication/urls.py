from django.urls import path
from .views import RegisterAPIView, VerifyCodeAPIView, LoginAPIView

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='api-register'),
    path('verify-code/', VerifyCodeAPIView.as_view(), name='api-verify-code'),
    path('login/', LoginAPIView.as_view(), name='api-login'),
]
