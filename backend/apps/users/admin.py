from django.contrib import admin

from .models import JoblifyrUser


@admin.register(JoblifyrUser)
class JoblifyrUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'auth_provider', 'role', 'is_verified', 'created_at')
    search_fields = ('email', 'first_name', 'last_name', 'google_id')
    list_filter = ('auth_provider', 'role', 'is_verified')
