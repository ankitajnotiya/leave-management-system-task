from django.contrib import admin
from .models import LeaveRequest, UserProfile

@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = [
        'applicant_name', 'employee_identifier', 'leave_type', 'start_date', 'end_date', 
        'status', 'total_days', 'created_at'
    ]
    list_filter = ['status', 'leave_type', 'created_at']
    search_fields = ['applicant_name', 'employee_identifier', 'leave_reason']
    readonly_fields = ['created_at', 'total_days']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Leave Information', {
            'fields': ('employee', 'applicant_name', 'employee_identifier', 'leave_type', 'start_date', 'end_date', 'leave_reason')
        }),
        ('Status & Timeline', {
            'fields': ('status', 'created_at')
        }),
    )

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_leaves', 'remaining_leaves']
    search_fields = ['user__username']
    readonly_fields = ['user']
