from django.urls import path
from .views import AdminUserListView, AdminUserDetailView

urlpatterns = [
    path('', AdminUserListView.as_view(), name='admin-user-list'),
    path('<str:user_id>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
]
