from rest_framework import serializers

class TutorRequestSerializer(serializers.Serializer):
    subject = serializers.ChoiceField(choices=['reading', 'math'])
    age_band = serializers.ChoiceField(choices=['5-6', '7-8'])
    question = serializers.CharField(max_length=300)
    learner_answer = serializers.CharField(max_length=200)
    expected_answer = serializers.CharField(max_length=200)
    is_correct = serializers.BooleanField()
    hint = serializers.CharField(max_length=300, required=False, allow_blank=True)
    explanation = serializers.CharField(max_length=500, required=False, allow_blank=True)
