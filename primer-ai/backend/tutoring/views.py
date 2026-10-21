from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import TutorRequestSerializer
from .services import explain_answer

class TutorRespondView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = TutorRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        message, source = explain_answer(data)
        return Response({'message': message, 'source': source}, status=status.HTTP_200_OK)
