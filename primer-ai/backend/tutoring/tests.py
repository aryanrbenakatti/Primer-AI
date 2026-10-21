from django.test import SimpleTestCase, override_settings
from rest_framework.test import APIClient
from .services import fallback_message

class TutorApiTests(SimpleTestCase):
    def setUp(self):
        self.client = APIClient()

    @override_settings(GEMINI_API_KEY='')
    def test_tutor_uses_local_fallback_without_api_key(self):
        response = self.client.post('/api/v1/tutor/respond/', {
            'subject':'reading', 'age_band':'5-6', 'question':'Which word starts with m?',
            'learner_answer':'Sun', 'expected_answer':'Moon', 'is_correct':False,
            'hint':'Listen for the first sound.', 'explanation':'Moon starts with m.'
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['source'], 'local')
        self.assertIn('first sound', response.data['message'])

    def test_invalid_subject_is_rejected(self):
        response = self.client.post('/api/v1/tutor/respond/', {
            'subject':'science', 'age_band':'5-6', 'question':'q',
            'learner_answer':'a', 'expected_answer':'a', 'is_correct':True
        }, format='json')
        self.assertEqual(response.status_code, 400)
