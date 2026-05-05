from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import LeaveRequest, UserProfile
from .serializers import LeaveRequestSerializer, LeaveRequestListSerializer, UserProfileSerializer


class EmployeesListView(APIView):
    """
    View to get all employees for selection dropdown
    """
    permission_classes = [permissions.AllowAny]  # For now, will implement proper auth later
    
    def get(self, request):
        """Get all employees list"""
        users = User.objects.all()
        employees = []
        for user in users:
            employees.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'employee_id': f'EMP{str(user.id).zfill(3)}',
                'full_name': user.username.capitalize()
            })
        return Response(employees)


class CurrentUserView(APIView):
    """
    View to get current user information
    """
    permission_classes = [permissions.AllowAny]  # For now, will implement proper auth later
    
    def get(self, request):
        """Get current user information"""
        # For demo, return first user info
        first_user = User.objects.first()
        if first_user:
            return Response({
                'id': first_user.id,
                'username': first_user.username,
                'email': first_user.email,
                'employee_id': f'EMP{str(first_user.id).zfill(3)}',
                'full_name': first_user.username.capitalize()
            })
        return Response({'error': 'No user found'}, status=404)


class LeaveRequestView(APIView):
    """
    View for employees to submit and view their leave requests
    """
    permission_classes = [permissions.AllowAny]  # For now, will implement proper auth later
    
    def post(self, request):
        """Create a new leave request"""
        data = request.data.copy()
        
        # For now, use first user as employee (simplified for demo)
        if not data.get('employee'):
            first_user = User.objects.first()
            if first_user:
                data['employee'] = first_user.id
        
        # Ensure applicant_name and employee_identifier are properly set
        if not data.get('applicant_name'):
            data['applicant_name'] = data.get('applicant_name', 'Unknown')
        if not data.get('employee_identifier'):
            data['employee_identifier'] = data.get('employee_identifier', '')
        
        print("Data being sent to serializer:", data)
        serializer = LeaveRequestSerializer(data=data)
        if serializer.is_valid():
            leave_request = serializer.save()
            return Response(
                LeaveRequestSerializer(leave_request).data,
                status=status.HTTP_201_CREATED
            )
        else:
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        """Get employee's own leave requests (simplified - will need proper auth)"""
        # For now, return all requests - in production, filter by employee
        leave_requests = LeaveRequest.objects.all().order_by('-created_at')
        serializer = LeaveRequestListSerializer(leave_requests, many=True)
        return Response(serializer.data)


class LeaveQueueView(APIView):
    """
    View for admins to see all leave requests
    """
    permission_classes = [permissions.AllowAny]  # For now, will implement role-based auth later
    
    def get(self, request):
        """Get all leave requests for admins"""
        # In production, add role-based check here
        leave_requests = LeaveRequest.objects.all().order_by('-created_at')
        serializer = LeaveRequestListSerializer(leave_requests, many=True)
        return Response(serializer.data)


@api_view(['GET', 'PUT'])
@permission_classes([permissions.AllowAny])
def leave_request_detail_view(request, pk):
    """
    Get or update a specific leave request
    """
    leave_request = get_object_or_404(LeaveRequest, pk=pk)
    
    if request.method == 'GET':
        serializer = LeaveRequestSerializer(leave_request)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        old_status = leave_request.status
        serializer = LeaveRequestSerializer(leave_request, data=request.data, partial=True)
        
        if serializer.is_valid():
            updated_request = serializer.save()
            
            # Implement leave balance deduction logic
            new_status = updated_request.status
            if old_status != 'approved' and new_status == 'approved':
                # Status changed to approved - deduct leave balance
                try:
                    user_profile = UserProfile.objects.get(user=updated_request.employee)
                    leave_days = updated_request.total_days
                    
                    if user_profile.remaining_leaves >= leave_days:
                        user_profile.remaining_leaves -= leave_days
                        user_profile.save()
                    else:
                        # Rollback the approval if insufficient leaves
                        updated_request.status = 'pending'
                        updated_request.save()
                        return Response(
                            {'error': f'Insufficient leave balance. Available: {user_profile.remaining_leaves}, Required: {leave_days}'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                except UserProfile.DoesNotExist:
                    # Create user profile if it doesn't exist
                    UserProfile.objects.create(
                        user=updated_request.employee,
                        remaining_leaves=20 - leave_days
                    )
            
            return Response(LeaveRequestSerializer(updated_request).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    """
    View to get user profile and leave balance
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        """Get user profile with leave balance"""
        # For now, use first user (simplified for demo)
        user = User.objects.first()
        if user:
            try:
                profile = UserProfile.objects.get(user=user)
                serializer = UserProfileSerializer(profile)
                return Response(serializer.data)
            except UserProfile.DoesNotExist:
                # Create profile if it doesn't exist
                profile = UserProfile.objects.create(user=user)
                serializer = UserProfileSerializer(profile)
                return Response(serializer.data)
        
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
