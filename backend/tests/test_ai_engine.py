"""Unit tests for the AI engine pipeline."""
import pytest
import json
from unittest.mock import patch, MagicMock
from bson.objectid import ObjectId

from app.ai.context_builder import ContextBuilder
from app.ai.prompt_builder import PromptBuilder
from app.ai.response_parser import ResponseParser
from app.ai.plan_enricher import PlanEnricher


class TestContextBuilder:
    def setup_method(self):
        self.builder = ContextBuilder()

    def test_builds_context_with_all_fields(self):
        profile = {
            'disabilities': [{'type': 'mobility', 'severity': 'moderate'}],
            'preferences': {'preferred_transport': 'public'},
            'assistive_devices': ['wheelchair'],
            'location': {'city': 'Mumbai'},
        }
        activity = {
            'description': 'Visit doctor',
            'activity_type': 'medical',
            'date': '2026-04-20',
            'time': '09:00',
            'destination': 'City Hospital',
            'notes': 'Need ramp access',
        }
        context = self.builder.build_context(profile, activity)

        assert context['disabilities'] == profile['disabilities']
        assert context['preferences'] == profile['preferences']
        assert context['assistive_devices'] == ['wheelchair']
        assert context['location']['city'] == 'Mumbai'
        assert context['activity']['description'] == 'Visit doctor'
        assert context['activity']['activity_type'] == 'medical'
        assert context['activity']['destination'] == 'City Hospital'

    def test_handles_empty_profile(self):
        context = self.builder.build_context({}, {})
        assert context['disabilities'] == []
        assert context['preferences'] == {}
        assert context['assistive_devices'] == []
        assert context['activity']['description'] == ''

    def test_handles_missing_activity_fields(self):
        context = self.builder.build_context({}, {'description': 'Go shopping'})
        assert context['activity']['description'] == 'Go shopping'
        assert context['activity']['activity_type'] == 'custom'
        assert context['activity']['destination'] == ''


class TestPromptBuilder:
    def setup_method(self):
        self.builder = PromptBuilder()

    def test_returns_list_of_messages(self):
        context = {
            'disabilities': [{'type': 'visual', 'severity': 'mild'}],
            'preferences': {'preferred_transport': 'public'},
            'assistive_devices': ['cane'],
            'location': {'city': 'Delhi'},
            'activity': {
                'description': 'Go to the market',
                'activity_type': 'shopping',
                'date': '2026-04-20',
                'time': '10:00',
                'destination': 'Sarojini Market',
                'notes': '',
            },
        }
        messages = self.builder.build_prompt(context)
        assert isinstance(messages, list)
        assert len(messages) == 2
        assert messages[0]['role'] == 'system'
        assert messages[1]['role'] == 'user'

    def test_system_prompt_contains_key_instructions(self):
        context = {'disabilities': [], 'preferences': {}, 'assistive_devices': [],
                   'location': {}, 'activity': {}}
        messages = self.builder.build_prompt(context)
        system_content = messages[0]['content']
        assert 'accessibility' in system_content.lower()
        assert 'JSON' in system_content

    def test_user_prompt_includes_disability_info(self):
        context = {
            'disabilities': [{'type': 'mobility', 'severity': 'severe'}],
            'preferences': {}, 'assistive_devices': [],
            'location': {'city': 'Pune'},
            'activity': {'description': 'Go to the gym', 'activity_type': 'custom',
                         'date': '', 'time': '', 'destination': '', 'notes': ''},
        }
        messages = self.builder.build_prompt(context)
        user_content = messages[1]['content']
        assert 'mobility' in user_content
        assert 'severe' in user_content
        assert 'Pune' in user_content

    def test_format_disabilities_empty(self):
        result = self.builder._format_disabilities([])
        assert result == 'None specified'

    def test_format_disabilities_multiple(self):
        result = self.builder._format_disabilities([
            {'type': 'mobility', 'severity': 'mild'},
            {'type': 'visual', 'severity': 'moderate'},
        ])
        assert 'mobility' in result
        assert 'visual' in result

    def test_format_preferences_empty(self):
        result = self.builder._format_preferences({})
        assert result == 'None specified'


class TestResponseParser:
    def setup_method(self):
        self.parser = ResponseParser()

    def test_parses_valid_json(self):
        raw = json.dumps({
            'title': 'Test Plan',
            'summary': 'A test summary.',
            'steps': [
                {
                    'step_number': 1,
                    'title': 'Step 1',
                    'description': 'Do something',
                    'time_estimate': '10 min',
                    'accessibility_notes': 'Use ramp',
                    'tools_needed': ['Wheelchair'],
                }
            ],
            'alternative_options': ['Take taxi'],
            'recommended_tools': ['AccessRide'],
            'weather_advisory': 'Clear skies',
        })
        plan = self.parser.parse_response(raw)
        assert plan['title'] == 'Test Plan'
        assert len(plan['steps']) == 1
        assert plan['steps'][0]['step_number'] == 1

    def test_fills_defaults_for_missing_optional_fields(self):
        raw = json.dumps({'title': 'Minimal', 'summary': 'Short', 'steps': []})
        plan = self.parser.parse_response(raw)
        assert 'alternative_options' in plan
        assert 'recommended_tools' in plan
        assert 'weather_advisory' in plan

    def test_fills_defaults_for_missing_required_fields(self):
        raw = json.dumps({'summary': 'Only summary'})
        plan = self.parser.parse_response(raw)
        assert 'title' in plan
        assert 'steps' in plan

    def test_fallback_on_invalid_json(self):
        plan = self.parser.parse_response('this is not json at all')
        assert 'title' in plan
        assert 'parse_warning' in plan
        assert plan['steps'] == []

    def test_step_defaults_filled(self):
        raw = json.dumps({
            'title': 'Plan',
            'summary': 'Summary',
            'steps': [{'description': 'Just a description'}],
        })
        plan = self.parser.parse_response(raw)
        step = plan['steps'][0]
        assert 'step_number' in step
        assert 'title' in step
        assert 'time_estimate' in step
        assert 'tools_needed' in step

    def test_empty_string_response(self):
        plan = self.parser.parse_response('')
        assert plan['steps'] == []


class TestPlanEnricher:
    def setup_method(self):
        self.enricher = PlanEnricher()

    def test_adds_generation_note(self):
        plan = {'title': 'Plan', 'summary': 'Summary', 'steps': []}
        result = self.enricher.enrich_plan(plan, {})
        assert 'generation_note' in result
        assert 'AI' in result['generation_note']

    def test_adds_generated_at_timestamp(self):
        plan = {'title': 'Plan', 'steps': []}
        result = self.enricher.enrich_plan(plan, {})
        assert 'generated_at' in result

    def test_adds_activity_type(self):
        plan = {'title': 'Plan', 'steps': []}
        result = self.enricher.enrich_plan(plan, {'activity_type': 'medical'})
        assert result['activity_type'] == 'medical'

    def test_adds_route_info_when_destination_given(self):
        plan = {'title': 'Plan', 'steps': []}
        result = self.enricher.enrich_plan(plan, {'destination': 'City Hospital'})
        assert 'route_info' in result
        assert result['route_info']['destination'] == 'City Hospital'

    def test_no_route_info_when_no_destination(self):
        plan = {'title': 'Plan', 'steps': []}
        result = self.enricher.enrich_plan(plan, {})
        assert 'route_info' not in result

    def test_adds_weather_info_when_date_given(self):
        plan = {'title': 'Plan', 'steps': []}
        result = self.enricher.enrich_plan(plan, {'date': '2026-04-20'})
        assert 'weather_info' in result
        assert result['weather_info']['date'] == '2026-04-20'
