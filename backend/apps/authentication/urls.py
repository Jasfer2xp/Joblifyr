from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CompleteProfileAPIView,
    CountriesAPIView,
    CitiesAPIView,
    GoogleCallbackAPIView,
    GoogleLoginAPIView,
    LoginAPIView,
    MeAPIView,
    RegisterAPIView,
    VerifyCodeAPIView,
)

urlpatterns = [
    path('countries/', CountriesAPIView.as_view(), name='countries'),
    path('cities/', CitiesAPIView.as_view(), name='cities'),
    path('register/', RegisterAPIView.as_view(), name='api-register'),
    path('verify-code/', VerifyCodeAPIView.as_view(), name='api-verify-code'),
    path('login/', LoginAPIView.as_view(), name='api-login'),
    path('me/', MeAPIView.as_view(), name='api-me'),
    path('complete-profile/', CompleteProfileAPIView.as_view(), name='complete-profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('google/login/', GoogleLoginAPIView.as_view(), name='google-login'),
    path('google/callback/', GoogleCallbackAPIView.as_view(), name='google-callback'),
]
