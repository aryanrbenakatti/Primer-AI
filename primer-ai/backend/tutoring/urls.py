from django.urls import path
from .views import TutorRespondView
urlpatterns = [path('respond/', TutorRespondView.as_view(), name='tutor-respond')]
