# KYC System Architecture Explainer

## The State Machine
Status transitions are handled in the `models.py` file within the `clean()` method of the `MerchantKYC` model. The system enforces business rules to prevent invalid transitions:
- Cannot change status from approved to draft
- Cannot change status from rejected to approved directly (must go through review process)
- This ensures data integrity and prevents merchants from bypassing the review workflow

## The Upload
Django backend implements robust file validation in `serializers.py` using the `validate_file_size()` method:
- File size validation with 5MB limit enforced server-side
- Applied to all three document types: PAN card, Aadhaar card, and bank statement
- Uses `UploadedFile.size` property to check file size before processing

## The Queue
Dashboard query logic is implemented in the views with SLA tracking:
- Queue query: `MerchantKYC.objects.filter(status='submitted').order_by('created_at')`
- SLA flag implementation: `if created_at < timezone.now() - timedelta(hours=24)`
- The `is_at_risk` field in serializers automatically flags submissions older than 24 hours

## The Auth
The system uses `IsAuthenticated` permission classes (though currently set to `AllowAny` for development):
- Authentication checks should be implemented using `request.user` to enforce data isolation
- Merchants should only access their own KYC submissions
- Reviewers should have role-based access to view all submissions

## The AI Audit
AI suggested using simple client-side validation for file size, but I replaced it with backend validation because client-side can be bypassed. Backend validation ensures security and data integrity regardless of client behavior, preventing malicious users from uploading oversized files through direct API calls.
