"""Unit tests for app.utils.validators"""
import pytest
from app.utils.validators import (
    validate_email,
    validate_password,
    validate_disability_type,
    validate_severity,
    validate_activity_type,
)


class TestValidateEmail:
    def test_valid_email(self):
        assert validate_email('user@example.com') is True

    def test_valid_email_with_subdomain(self):
        assert validate_email('user@mail.example.co.in') is True

    def test_valid_email_with_plus(self):
        assert validate_email('user+tag@example.com') is True

    def test_invalid_email_no_at(self):
        assert validate_email('userexample.com') is False

    def test_invalid_email_no_domain(self):
        assert validate_email('user@') is False

    def test_invalid_email_empty(self):
        assert validate_email('') is False

    def test_invalid_email_spaces(self):
        assert validate_email('user @example.com') is False


class TestValidatePassword:
    def test_valid_password(self):
        assert validate_password('Secure123') is True

    def test_valid_password_min_length(self):
        assert validate_password('abcd1234') is True

    def test_invalid_password_too_short(self):
        assert validate_password('Ab1') is False

    def test_invalid_password_no_number(self):
        assert validate_password('SecurePassword') is False

    def test_invalid_password_no_letter(self):
        assert validate_password('12345678') is False

    def test_invalid_password_empty(self):
        assert validate_password('') is False

    def test_valid_password_exactly_8_chars(self):
        assert validate_password('abcde123') is True


class TestValidateDisabilityType:
    def test_valid_mobility(self):
        assert validate_disability_type('mobility') is True

    def test_valid_visual(self):
        assert validate_disability_type('visual') is True

    def test_valid_hearing(self):
        assert validate_disability_type('hearing') is True

    def test_valid_cognitive(self):
        assert validate_disability_type('cognitive') is True

    def test_invalid_type(self):
        assert validate_disability_type('unknown') is False

    def test_invalid_empty(self):
        assert validate_disability_type('') is False

    def test_invalid_uppercase(self):
        assert validate_disability_type('Mobility') is False


class TestValidateSeverity:
    def test_valid_mild(self):
        assert validate_severity('mild') is True

    def test_valid_moderate(self):
        assert validate_severity('moderate') is True

    def test_valid_severe(self):
        assert validate_severity('severe') is True

    def test_invalid_severity(self):
        assert validate_severity('extreme') is False

    def test_invalid_empty(self):
        assert validate_severity('') is False


class TestValidateActivityType:
    def test_valid_commute(self):
        assert validate_activity_type('commute') is True

    def test_valid_event(self):
        assert validate_activity_type('event') is True

    def test_valid_daily_routine(self):
        assert validate_activity_type('daily_routine') is True

    def test_valid_shopping(self):
        assert validate_activity_type('shopping') is True

    def test_valid_medical(self):
        assert validate_activity_type('medical') is True

    def test_valid_custom(self):
        assert validate_activity_type('custom') is True

    def test_invalid_type(self):
        assert validate_activity_type('gym') is False

    def test_invalid_empty(self):
        assert validate_activity_type('') is False
