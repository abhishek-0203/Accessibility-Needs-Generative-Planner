import json


class ResponseParser:

    REQUIRED_FIELDS = ['title', 'summary', 'steps']

    def parse_response(self, raw_response):
        try:
            plan = json.loads(raw_response)
        except json.JSONDecodeError:
            return self._fallback_plan(raw_response)

        for field in self.REQUIRED_FIELDS:
            if field not in plan:
                plan[field] = self._default_value(field)

        plan.setdefault('alternative_options', [])
        plan.setdefault('recommended_tools', [])
        plan.setdefault('weather_advisory', 'No weather advisory available.')

        for i, step in enumerate(plan.get('steps', [])):
            step.setdefault('step_number', i + 1)
            step.setdefault('title', f'Step {i + 1}')
            step.setdefault('description', '')
            step.setdefault('time_estimate', 'N/A')
            step.setdefault('accessibility_notes', '')
            step.setdefault('tools_needed', [])

        return plan

    def _default_value(self, field):
        defaults = {
            'title': 'Accessibility Plan',
            'summary': 'Generated accessibility plan.',
            'steps': [],
        }
        return defaults.get(field, '')

    def _fallback_plan(self, raw_text):
        return {
            'title': 'Accessibility Plan',
            'summary': raw_text[:500] if raw_text else 'Plan content could not be parsed.',
            'steps': [],
            'alternative_options': [],
            'recommended_tools': [],
            'weather_advisory': 'No weather advisory available.',
            'parse_warning': 'Response was not valid JSON and was stored as summary text.',
        }
