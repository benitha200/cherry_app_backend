from django.contrib import admin
from cws.models import Cws
from .models import CustomUser


# Register your models here.

admin.site.register(Cws)
admin.site.register(CustomUser)
