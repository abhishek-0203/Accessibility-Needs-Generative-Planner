import json


class PromptBuilder:

    SYSTEM_PROMPT = (
        "You are an expert accessibility planning assistant. Your role is to create "
        "detailed, practical, and safe activity plans for people with various disabilities. "
        "Consider mobility limitations, sensory impairments, cognitive needs, and assistive "
        "technology requirements. Always prioritize safety, comfort, and independence. "
        "Provide step-by-step plans with specific accessibility considerations for each step. "
        "Respond ONLY with valid JSON."
    )

    def build_prompt(self, context):
        disabilities_desc = self._format_disabilities(context.get('disabilities', []))
        preferences_desc = self._format_preferences(context.get('preferences', {}))
        devices_desc = ', '.join(context.get('assistive_devices', [])) or 'None specified'

        activity = context.get('activity', {})
        location = context.get('location', {})

        user_prompt = f"""Create an accessibility-optimized activity plan based on the following:

**User Profile:**
- Disabilities: {disabilities_desc}
- Preferences: {preferences_desc}
- Assistive Devices: {devices_desc}
- Location: {location.get('city', 'Not specified')}, {location.get('state', '')}, {location.get('country', '')}

**Activity Details:**
- Description: {activity.get('description', 'General activity')}
- Type: {activity.get('activity_type', 'custom')}
- Date: {activity.get('date', 'Not specified')}
- Time: {activity.get('time', 'Not specified')}
- Destination: {activity.get('destination', 'Not specified')}
- Additional Notes: {activity.get('notes', 'None')}

**Required JSON Response Format:**
{{
    "title": "Plan title",
    "summary": "Brief overview of the plan",
    "steps": [
        {{
            "step_number": 1,
            "title": "Step title",
            "description": "Detailed description",
            "time_estimate": "Estimated time for this step",
            "accessibility_notes": "Specific accessibility considerations",
            "tools_needed": ["list of tools or assistive devices needed"]
        }}
    ],
    "alternative_options": ["Alternative approaches if primary plan is not feasible"],
    "recommended_tools": ["Assistive tools or apps recommended"],
    "weather_advisory": "Weather-related accessibility advice if applicable"
}}"""

        return [
            {'role': 'system', 'content': self.SYSTEM_PROMPT},
            {'role': 'user', 'content': user_prompt},
        ]

    def _format_disabilities(self, disabilities):
        if not disabilities:
            return 'None specified'
        parts = []
        for d in disabilities:
            parts.append(f"{d.get('type', 'unknown')} ({d.get('severity', 'unspecified')} severity)")
        return '; '.join(parts)

    def _format_preferences(self, preferences):
        if not preferences:
            return 'None specified'
        parts = [f"{k}: {v}" for k, v in preferences.items()]
        return '; '.join(parts)
