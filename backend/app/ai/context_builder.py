class ContextBuilder:

    def build_context(self, user_profile, activity_input):
        context = {
            'disabilities': user_profile.get('disabilities', []),
            'preferences': user_profile.get('preferences', {}),
            'assistive_devices': user_profile.get('assistive_devices', []),
            'location': user_profile.get('location', {}),
            'activity': {
                'description': activity_input.get('description', ''),
                'activity_type': activity_input.get('activity_type', 'custom'),
                'date': activity_input.get('date', ''),
                'time': activity_input.get('time', ''),
                'destination': activity_input.get('destination', ''),
                'notes': activity_input.get('notes', ''),
            },
        }
        return context
