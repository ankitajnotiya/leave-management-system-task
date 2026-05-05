from django.urls import path
from .views import LeaveRequestView, LeaveQueueView, leave_request_detail_view, UserProfileView, CurrentUserView, EmployeesListView

app_name = 'kyc'

urlpatterns = [
    path('employees/', EmployeesListView.as_view(), name='employees-list'),
    path('current-user/', CurrentUserView.as_view(), name='current-user'),
    path('leave/', LeaveRequestView.as_view(), name='leave-request'),
    path('queue/', LeaveQueueView.as_view(), name='leave-queue'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('<int:pk>/', leave_request_detail_view, name='leave-detail'),
]
