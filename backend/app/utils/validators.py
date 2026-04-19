import re

VALID_DISABILITY_TYPES = ['mobility', 'visual', 'hearing', 'cognitive']
VALID_SEVERITIES = ['mild', 'moderate', 'severe']
VALID_ACTIVITY_TYPES = ['commute', 'event', 'daily_routine', 'shopping', 'medical', 'custom']


def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_password(password):
    if len(password) < 8:
        return False
    has_letter = any(c.isalpha() for c in password)
    has_number = any(c.isdigit() for c in password)
    return has_letter and has_number


def validate_disability_type(dtype):
    return dtype in VALID_DISABILITY_TYPES


def validate_severity(severity):
    return severity in VALID_SEVERITIES


def validate_activity_type(atype):
    return atype in VALID_ACTIVITY_TYPES
