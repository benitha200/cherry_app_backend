from rest_framework import serializers
from django.core.serializers import serialize
from farmers.models import Farmer,FarmerAndFarmDetails
from .models import  CustomUser
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken,TokenError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from cws.models import Cws,StationSettings
# from stationsettings.models import StationSettings

class FarmerSerializer(serializers.ModelSerializer):
    class Meta:
        model=Farmer
        fields='__all__'

class FarmerAndFarmSerializer(serializers.ModelSerializer):
    class Meta:
        model=FarmerAndFarmDetails
        fields='__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

# class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
#     def validate(self, attrs):
#         data = super().validate(attrs)
#         refresh = self.get_token(self.user)
#         data['refresh'] = str(refresh)
#         data['access'] = str(refresh.access_token)

#         # Save the refresh token to the user model
#         user = User.objects.get(username=self.user)
#         user.refresh_token = str(refresh)
#         user.save()

#         return data

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        print(attrs)
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        user = CustomUser.objects.get(username=self.user)
        data['email'] = user.email 
        data['role'] = user.role 
        data['cws_code'] = user.cws_code 
        data['cws_name'] = user.cws_name

        if user.cws_code is not None and user.cws_name is not None:
            cws = Cws.objects.filter(cws_code=user.cws_code).first()

            if cws:
                cws_info = StationSettings.objects.filter(cws_id=cws.id)[:2]
                serialized_data = serialize('json', cws_info)
                data['cws'] = serialized_data
                user.refresh_token = str(refresh)
                user.save()
            else:
                print("CWS not found for the given code.")
        else:
            user.refresh_token = str(refresh)
            user.save()

        return data
# class CustomUserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomUser
#         fields = ['id', 'username', 'role', 'cws_code', 'cws_name','password']

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        # Hash the password before saving
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'role', 'cws_code', 'cws_name', 'password']



class CustomTokenLogoutSerializer:
    def validate(self, attrs):
        refresh = attrs.get('refresh')
        if refresh:
            try:
                RefreshToken(refresh).blacklist()
            except Exception as e:
                # Handle exceptions if needed
                pass

        return {}
    
class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    default_error_message = {
        'bad_token': ('Token is expired or invalid')
    }

    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs

    def save(self, **kwargs):

        try:
            RefreshToken(self.token).blacklist()

        except TokenError:
            self.fail('bad_token')