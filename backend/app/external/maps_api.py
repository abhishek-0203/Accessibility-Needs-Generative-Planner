class MapsAPI:

    @staticmethod
    def get_accessible_route(origin, destination):
        return {
            'status': 'placeholder',
            'note': 'Google Maps API key is required for real route data.',
            'origin': origin,
            'destination': destination,
            'accessible_route': None,
            'estimated_time': None,
            'accessibility_features': [],
        }

    @staticmethod
    def get_venue_accessibility(place_name):
        return {
            'status': 'placeholder',
            'note': 'Google Maps API key is required for venue accessibility data.',
            'place_name': place_name,
            'wheelchair_accessible': None,
            'accessible_entrance': None,
            'accessible_restroom': None,
        }
