# core/permissions.py
from rest_framework.permissions import BasePermission
from .models import Purchase

class CanDownloadReport(BasePermission):
    """Allow download if user owns the report."""
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        return Purchase.objects.filter(user=request.user, report=obj).exists()
