from django.test import TestCase
from django.core.exceptions import ValidationError
from .models import MerchantKYC


class MerchantKYCTestCase(TestCase):
    def test_invalid_status_change_approved_to_draft(self):
        """Test that changing status from approved to draft raises ValidationError"""
        # Create a KYC instance with approved status
        kyc = MerchantKYC.objects.create(
            merchant_name="Test Merchant",
            business_name="Test Business",
            business_type="Retail",
            expected_volume="100000.00",
            status="approved"
        )
        
        # Try to change status to draft
        kyc.status = "draft"
        
        # Should raise ValidationError
        with self.assertRaises(ValidationError) as context:
            kyc.clean()
        
        self.assertIn('Cannot change status from approved to draft', str(context.exception))
    
    def test_invalid_status_change_rejected_to_approved(self):
        """Test that changing status from rejected to approved directly raises ValidationError"""
        # Create a KYC instance with rejected status
        kyc = MerchantKYC.objects.create(
            merchant_name="Test Merchant",
            business_name="Test Business",
            business_type="Retail",
            expected_volume="100000.00",
            status="rejected"
        )
        
        # Try to change status directly to approved
        kyc.status = "approved"
        
        # Should raise ValidationError
        with self.assertRaises(ValidationError) as context:
            kyc.clean()
        
        self.assertIn('Cannot change status from rejected to approved directly', str(context.exception))
