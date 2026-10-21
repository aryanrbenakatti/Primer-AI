from django.test import SimpleTestCase
from .engine import choose_next_action
from .data import ACTIVITIES

class LearningEngineTests(SimpleTestCase):
    def test_repeated_errors_trigger_reteaching(self):
        self.assertEqual(choose_next_action(False, 1, 2), 'reteach')
    def test_first_error_gets_hint(self):
        self.assertEqual(choose_next_action(False, 0, 0), 'give_hint')
    def test_activity_bank_contains_both_subjects(self):
        self.assertEqual({a['subject'] for a in ACTIVITIES}, {'reading', 'math'})
