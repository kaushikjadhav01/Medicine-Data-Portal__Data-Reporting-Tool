from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.role == "ADMIN":
            return True
        return False

class IsPartner(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.role != "ADMIN":
            return True
        return False