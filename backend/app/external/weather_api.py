class WeatherAPI:

    @staticmethod
    def get_forecast(location, date):
        return {
            'status': 'placeholder',
            'note': 'Weather API key is required for real forecast data.',
            'location': location,
            'date': date,
            'temperature': None,
            'conditions': None,
            'precipitation_chance': None,
            'accessibility_impact': 'Unable to assess without weather data.',
        }
