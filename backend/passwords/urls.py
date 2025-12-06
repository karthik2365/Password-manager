from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PasswordEntryViewSet, register, login

router = DefaultRouter()
router.register(r'entries', PasswordEntryViewSet, basename='passwordentry')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
]
