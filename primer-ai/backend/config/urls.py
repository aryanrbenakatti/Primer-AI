from django.contrib import admin
from django.urls import include, path
from django.http import JsonResponse


def health(_request):
    return JsonResponse({'status': 'ok', 'service': 'primer-ai-api'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/health/', health),
    path('api/v1/tutor/', include('tutoring.urls')),
    path('api/v1/activities/', include('learning.urls')),
]
