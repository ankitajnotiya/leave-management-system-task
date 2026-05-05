export interface LeaveRequestData {
  id?: number;
  employee?: number;
  applicant_name?: string;
  employee_identifier?: string;
  leave_type: 'sick' | 'casual' | 'earned' | 'maternity' | 'paternity';
  start_date: string;
  end_date: string;
  leave_reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  total_days?: number;
  is_overdue?: boolean;
}

export interface UserProfile {
  id?: number;
  user?: number;
  username?: string;
  total_leaves: number;
  remaining_leaves: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string;
}
