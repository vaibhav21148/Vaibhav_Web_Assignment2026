"""
Custom DRF permissions for role-based access control.
These must be used *after* IsAuthenticated in the permission chain.
"""
from rest_framework.permissions import BasePermission


class IsManager(BasePermission):
    """
    Grants access to users whose role is 'manager' or 'admin'.
    Admins are implicitly managers for all domains.
    """
    message = 'Access restricted to managers and administrators.'

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ('manager', 'admin')
        )


class IsAdmin(BasePermission):
    """
    Grants access only to users with the 'admin' role.
    """
    message = 'Access restricted to administrators only.'

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == 'admin'
        )
