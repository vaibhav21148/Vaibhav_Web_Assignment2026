"""
URL routes for the users app.

All paths use trailing slashes (Django convention).

Mounted at /api/auth/ in the root urls.py, giving:
  POST /api/auth/register/
  POST /api/auth/login/
  POST /api/auth/token/refresh/
  GET  /api/auth/me/
"""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, MeView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='auth-token-refresh'),
    path('me/', MeView.as_view(), name='auth-me'),
]
