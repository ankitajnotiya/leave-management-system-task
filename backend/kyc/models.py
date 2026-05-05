from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from decimal import Decimal


class LeaveRequest(models.Model):
    LEAVE_TYPE_CHOICES = [
        ('sick', 'Sick Leave'),
        ('casual', 'Casual Leave'),
        ('earned', 'Earned Leave'),
        ('maternity', 'Maternity Leave'),
        ('paternity', 'Paternity Leave'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leave_requests')
    applicant_name = models.CharField(max_length=100, default='Unknown')
    employee_identifier = models.CharField(max_length=50, default='')
    leave_type = models.CharField(max_length=20, choices=LEAVE_TYPE_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    leave_reason = models.TextField()
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    def clean(self):
        # Check if end_date is after start_date
        if self.end_date and self.start_date and self.end_date < self.start_date:
            raise ValidationError('End date must be after start date.')
        
        # Check if status is being changed
        if self.pk:
            old_instance = LeaveRequest.objects.get(pk=self.pk)
            old_status = old_instance.status
            new_status = self.status
            
            # Cannot go from approved to pending
            if old_status == 'approved' and new_status == 'pending':
                raise ValidationError('Cannot change status from approved to pending.')
    
    @property
    def total_days(self):
        """Calculate total days of leave"""
        if self.start_date and self.end_date:
            return (self.end_date - self.start_date).days + 1
        return 0
    
    def __str__(self):
        return f"{self.applicant_name} - {self.leave_type} ({self.start_date} to {self.end_date})"


class UserProfile(models.Model):
    """Extended User model for leave balance"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    total_leaves = models.IntegerField(default=20)
    remaining_leaves = models.IntegerField(default=20)
    
    def __str__(self):
        return f"{self.user.username} - {self.remaining_leaves}/{self.total_leaves} leaves"
