from rest_framework.response import Response
from rest_framework.views import APIView
from .data import ACTIVITIES

class ActivityListView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        subject = request.query_params.get('subject')
        if subject and subject not in ('reading', 'math'):
            return Response({'detail': 'subject must be reading or math'}, status=400)
        rows = [a for a in ACTIVITIES if not subject or a['subject'] == subject]
        # Expected answers are intentionally omitted from list responses.
        return Response([{k: v for k, v in item.items() if k != 'answer'} for item in rows])
