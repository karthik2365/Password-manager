from django.contrib import admin
from .models import PasswordEntry

@admin.register(PasswordEntry)
class PasswordEntryAdmin(admin.ModelAdmin):
    list_display = ('website', 'username', 'user', 'created_at')
    search_fields = ('website', 'username')
    list_filter = ('created_at',)
