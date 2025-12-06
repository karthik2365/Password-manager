from rest_framework import serializers
from django.contrib.auth.models import User
from .models import PasswordEntry

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class PasswordEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = PasswordEntry
        fields = ['id', 'website', 'username', 'password', 'url', 'created_at']
        
    def create(self, validated_data):
        # Assign the user from the context
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
