import re
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password as django_validate_password


def validate_indian_mobile(mobile):
    """Validate Indian mobile number format."""
    if not mobile:
        raise ValidationError("Mobile number is required.")
    
    # Remove any spaces, dashes, or plus signs
    mobile_clean = re.sub(r'[\s\-\+]', '', mobile)
    
    # Check for valid Indian mobile patterns
    patterns = [
        r'^[6-9]\d{9}$',  # 10-digit starting with 6-9
        r'^91[6-9]\d{9}$',  # 12-digit with country code
        r'^\+91[6-9]\d{9}$',  # 13-digit with +91
    ]
    
    if not any(re.match(pattern, mobile_clean) for pattern in patterns):
        raise ValidationError(
            "Please enter a valid Indian mobile number (10 digits starting with 6, 7, 8, or 9)."
        )
    
    return mobile_clean


def validate_aadhaar_format(aadhaar):
    """Basic Aadhaar number format validation."""
    if not aadhaar:
        raise ValidationError("Aadhaar number is required.")
    
    # Remove spaces
    aadhaar_clean = aadhaar.replace(' ', '')
    
    # Check if it's 12 digits
    if not re.match(r'^\d{12}$', aadhaar_clean):
        raise ValidationError("Aadhaar number must be exactly 12 digits.")
    
    # Basic checksum validation (simplified Verhoeff algorithm check)
    # In production, use proper Aadhaar validation libraries
    
    return aadhaar_clean


def validate_strong_password(password):
    """Enhanced password validation for government systems."""
    if not password:
        raise ValidationError("Password is required.")
    
    # Use Django's built-in validators first
    django_validate_password(password)
    
    # Additional government-grade requirements
    errors = []
    
    if len(password) < 8:
        errors.append("Password must be at least 8 characters long.")
    
    if not re.search(r'[A-Z]', password):
        errors.append("Password must contain at least one uppercase letter.")
    
    if not re.search(r'[a-z]', password):
        errors.append("Password must contain at least one lowercase letter.")
    
    if not re.search(r'\d', password):
        errors.append("Password must contain at least one number.")
    
    if not re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>?]', password):
        errors.append("Password must contain at least one special character.")
    
    # Check for common patterns
    common_patterns = [
        r'(.)\1{2,}',  # Repeated characters (aaa, 111)
        r'(012|123|234|345|456|567|678|789|890)',  # Sequential numbers
        r'(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)',  # Sequential letters
    ]
    
    for pattern in common_patterns:
        if re.search(pattern, password.lower()):
            errors.append("Password should not contain repeated or sequential characters.")
            break
    
    if errors:
        raise ValidationError(errors)
    
    return password


def validate_employee_id(employee_id, municipality):
    """Validate employee ID format for officers."""
    if not employee_id:
        return employee_id
    
    # Basic format validation - customize based on municipality requirements
    if not re.match(r'^[A-Z0-9\-/]{4,20}$', employee_id.upper()):
        raise ValidationError(
            "Employee ID must be 4-20 characters long and contain only letters, numbers, hyphens, and forward slashes."
        )
    
    return employee_id.upper()


def validate_government_email(email):
    """Validate government email domains for officers."""
    if not email:
        raise ValidationError("Email is required.")
    
    # List of valid government domains
    gov_domains = [
        '.gov.in',
        '.nic.in',
        '.municipal.gov.in',
        '.corp.in',
        # Add more as needed
    ]
    
    # For officers, email should be from government domain
    # This validation can be enabled/disabled based on requirements
    email_lower = email.lower()
    
    # For now, we'll just log this for reference
    # Uncomment to enforce government email requirement for officers
    # is_gov_email = any(domain in email_lower for domain in gov_domains)
    # if not is_gov_email:
    #     raise ValidationError(
    #         "Officers must use official government email addresses ending with .gov.in or .nic.in"
    #     )
    
    return email


def validate_department_name(department):
    """Validate department name format."""
    if not department:
        return department
    
    # Basic validation for department names
    if len(department) < 2 or len(department) > 100:
        raise ValidationError("Department name must be between 2 and 100 characters.")
    
    if not re.match(r'^[a-zA-Z\s\&\-\.]+$', department):
        raise ValidationError(
            "Department name can only contain letters, spaces, ampersands, hyphens, and periods."
        )
    
    return department.title()


def validate_pincode(pincode):
    """Validate Indian pincode format."""
    if not pincode:
        return pincode
    
    # Indian pincodes are 6 digits
    if not re.match(r'^\d{6}$', pincode):
        raise ValidationError("Pincode must be exactly 6 digits.")
    
    return pincode


def sanitize_name(name):
    """Sanitize and validate names."""
    if not name:
        raise ValidationError("Name is required.")
    
    # Remove extra spaces and title case
    name_clean = ' '.join(name.strip().split())
    
    if len(name_clean) < 2 or len(name_clean) > 100:
        raise ValidationError("Name must be between 2 and 100 characters.")
    
    # Allow letters, spaces, apostrophes, hyphens, and periods
    if not re.match(r'^[a-zA-Z\s\'\-\.]+$', name_clean):
        raise ValidationError(
            "Name can only contain letters, spaces, apostrophes, hyphens, and periods."
        )
    
    return name_clean.title()


def validate_age_eligibility(birth_date):
    """Validate age eligibility for services."""
    from datetime import date
    
    if not birth_date:
        return birth_date
    
    today = date.today()
    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    
    if age < 0:
        raise ValidationError("Birth date cannot be in the future.")
    
    if age > 150:
        raise ValidationError("Please enter a valid birth date.")
    
    return birth_date