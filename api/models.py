from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import AbstractUser, BaseUserManager, Permission

class UserRole(models.Model):
    role=models.TextField(max_length=255)
    def __str__(self) -> str:
        return self.role


class CustomUserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, password, **extra_fields)

class CustomUser(AbstractUser):
    first_name=models.CharField(max_length=255, null=True,default="Station")
    last_name=models.CharField(max_length=255, null=True,default="Station")
    role = models.CharField(max_length=50, null=False)
    cws_code = models.CharField(max_length=50, null=True,default="All")
    cws_name = models.CharField(max_length=100, null=True,default="All")

    objects = CustomUserManager()
    
    def logout(self):
     self.refresh_token = None  
     self.save()

    class Meta:
        unique_together = ('username',)

# Override the related_name for groups and user_permissions
CustomUser._meta.get_field('groups').remote_field.related_name = 'custom_user_groups'
CustomUser._meta.get_field('user_permissions').remote_field.related_name = 'custom_user_permissions'



        
