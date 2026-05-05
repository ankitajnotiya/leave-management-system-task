from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from .models import LeaveRequest, UserProfile


class LeaveRequestSerializer(serializers.ModelSerializer):
    total_days = serializers.ReadOnlyField()
    
    class Meta:
        model = LeaveRequest
        fields = [
            'id', 'employee', 'applicant_name', 'employee_identifier', 
            'leave_type', 'start_date', 'end_date', 'leave_reason', 'status', 'created_at', 'total_days'
        ]
        read_only_fields = ['id', 'created_at', 'total_days']
        extra_kwargs = {
            'applicant_name': {'required': True},
            'employee_identifier': {'required': False}
        }
    
    def validate(self, data):
        # Validate that end_date is after start_date
        if 'start_date' in data and 'end_date' in data:
            if data['end_date'] < data['start_date']:
                raise serializers.ValidationError('End date must be after start date.')
        
        # Check for overlapping leave requests
        if self.instance is None:  # Creating new leave request
            employee = data.get('employee')
            start_date = data.get('start_date')
            end_date = data.get('end_date')
            
            if employee and start_date and end_date:
                overlapping_leaves = LeaveRequest.objects.filter(
                    employee=employee,
                    start_date__lte=end_date,
                    end_date__gte=start_date,
                    status='approved'
                )
                if overlapping_leaves.exists():
                    raise serializers.ValidationError('You already have approved leave during this period.')
        
        return data


class LeaveRequestListSerializer(serializers.ModelSerializer):
    applicant_name = serializers.CharField(read_only=True)
    employee_identifier = serializers.CharField(read_only=True)
    total_days = serializers.ReadOnlyField()
    is_overdue = serializers.SerializerMethodField()
    
    class Meta:
        model = LeaveRequest
        fields = [
            'id', 'applicant_name', 'employee_identifier', 'leave_type', 'start_date', 
            'end_date', 'status', 'created_at', 'total_days', 'is_overdue'
        ]
    
    def get_is_overdue(self, obj):
        """Check if request is pending for more than 48 hours"""
        if obj.status == 'pending' and obj.created_at:
            time_threshold = timezone.now() - timedelta(hours=48)
            return obj.created_at < time_threshold
        return False


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'username', 'total_leaves', 'remaining_leaves']
        read_only_fields = ['id', 'username']
