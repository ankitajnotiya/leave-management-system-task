import os
import django
from django.contrib.auth.models import User

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def create_seed_data():
    """Create initial seed data for testing"""
    
    # Create Reviewer account
    reviewer, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@example.com',
            'is_staff': True,
            'is_superuser': True,
        }
    )
    if created:
        reviewer.set_password('admin123')
        reviewer.save()
        print("Created reviewer: admin/admin123")
    
    # Create Merchant accounts
    merchants_data = [
        {'username': 'test1', 'email': 'test1@example.com'},
        {'username': 'test2', 'email': 'test2@example.com'},
    ]
    
    for merchant_data in merchants_data:
        merchant, created = User.objects.get_or_create(
            username=merchant_data['username'],
            defaults={'email': merchant_data['email']}
        )
        if created:
            merchant.set_password('test123')
            merchant.save()
            print(f"Created merchant: {merchant_data['username']}/test123")

if __name__ == '__main__':
    create_seed_data()
