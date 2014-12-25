from django.contrib import admin

from authentication.models import Account

@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    pass

