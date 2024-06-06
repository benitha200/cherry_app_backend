from rest_framework import serializers
from django.core.serializers import serialize
from farmers.models import Farmer,FarmerAndFarmDetails
from .models import  CustomUser
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken,TokenError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from cws.models import Cws,StationSettings
from django.utils import timezone
from django.core.mail import EmailMessage
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.exceptions import ObjectDoesNotExist
import msal
import requests
from msal import ConfidentialClientApplication
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
#     otp = serializers.CharField(write_only=True, required=False)

#     def validate(self, attrs):
#         try:
#             user = CustomUser.objects.get(username=attrs['username'])
#             print(f"User found: {user}")
#         except ObjectDoesNotExist:
#             raise serializers.ValidationError("User does not exist")

#         # First Step: Validate username and password, then send OTP
#         if 'otp' not in attrs:
#             if self._validate_password(attrs['password'], user):
#                 try:
#                     otp = user.generate_otp()
#                     print(f"Generated OTP: {otp}")

#                     email = EmailMessage(
#                         'Your OTP Code',
#                         f'Your OTP code is {otp}',
#                         'from@example.com',  # Sender's email address
#                         ['test@gmail.com'],  # Recipient's email address
#                     )
#                     email.send()
#                     print(f"Email sent to {user.email}")

#                     return {'detail': "OTP sent to your email. Please enter the OTP to log in"}
                    
#                 except Exception as e:
#                     print(f"Error sending email: {e}")
#                     raise serializers.ValidationError(f"Error sending email: {str(e)}")
#             else:
#                 raise serializers.ValidationError("Invalid password.")
#         else:
#             # Second Step: Validate OTP
#             if user.otp == attrs['otp'] and user.otp_expiration > timezone.now():
#                 # OTP is correct and not expired
#                 data = super().validate(attrs)
#                 refresh = self.get_token(self.user)
#                 data['refresh'] = str(refresh)
#                 data['access'] = str(refresh.access_token)
#                 data['email'] = user.email
#                 data['role'] = user.role
#                 data['cws_code'] = user.cws_code
#                 data['cws_name'] = user.cws_name

#                 if user.cws_code and user.cws_name:
#                     cws = Cws.objects.filter(cws_code=user.cws_code).first()
#                     if cws:
#                         cws_info = StationSettings.objects.filter(cws_id=cws.id)[:2]
#                         serialized_data = serialize('json', cws_info)
#                         data['cws'] = serialized_data
#                         user.refresh_token = str(refresh)
#                         user.save()
#                     else:
#                         print("CWS not found for the given code.")
#                 else:
#                     user.refresh_token = str(refresh)
#                     user.save()

#                 return data
#             else:
#                 raise serializers.ValidationError("Invalid or expired OTP.")

#     def _validate_password(self, raw_password, user):
#         """
#         Validate if the provided raw_password matches the user's password.
#         """
#         return user.check_password(raw_password)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    otp = serializers.CharField(write_only=True, required=False)

    def validate(self, attrs):
        try:
            user = CustomUser.objects.get(username=attrs['username'])
            print(f"User found: {user}")
        except ObjectDoesNotExist:
            raise serializers.ValidationError("User does not exist")

        # First Step: Validate username and password, then send OTP
        if 'otp' not in attrs:
            if self._validate_password(attrs['password'], user):
                try:
                    otp = user.generate_otp()
                    print(f"Generated OTP: {otp}")

                    # Send OTP via Entra ID (Azure AD)
                    if not self._send_otp_via_azure(user.email, otp):
                        if not self._send_otp_via_azure(user.phone_number, otp):
                            raise serializers.ValidationError("Error sending OTP via both email and SMS")

                    return {'detail': "OTP sent to your registered contact. Please enter the OTP to log in"}

                except Exception as e:
                    print(f"Error: {e}")
                    raise serializers.ValidationError(f"Error: {str(e)}")
            else:
                raise serializers.ValidationError("Invalid password.")
        else:
            # Second Step: Validate OTP
            if user.otp == attrs['otp'] and user.otp_expiration > timezone.now():
                # OTP is correct and not expired
                data = super().validate(attrs)
                refresh = self.get_token(self.user)
                data['refresh'] = str(refresh)
                data['access'] = str(refresh.access_token)
                data['email'] = user.email
                data['role'] = user.role
                data['cws_code'] = user.cws_code
                data['cws_name'] = user.cws_name

                if user.cws_code and user.cws_name:
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
            else:
                raise serializers.ValidationError("Invalid or expired OTP.")

    def _validate_password(self, raw_password, user):
        """
        Validate if the provided raw_password matches the user's password.
        """
        return user.check_password(raw_password)

    def _send_otp_via_azure(self, contact, otp):
        """
        Send OTP via Azure AD (Entra ID).
        """
        try:
            authority = "https://login.microsoftonline.com/4b030d92-7ebd-4d2f-af2c-03b8af269059"
            client_id = "eedef855-b7e4-47b0-a212-4f8b6344834b"
            client_secret = "9zl8Q~WbxGOjnXUOA4~EPgwFXgIH1QLSLVQEyasq"  # Replace with your Azure client secret
            token_endpoint = f"{authority}/oauth2/v2.0/token"
            scope = ["https://graph.microsoft.com/.default"]
            endpoint = "https://graph.microsoft.com/v1.0/me/sendMail"

            app = ConfidentialClientApplication(
                client_id, authority=authority, client_credential=client_secret
            )

            # Acquire a token
            result = app.acquire_token_for_client(scopes=scope)

            if "access_token" in result:
                access_token = result["access_token"]
                headers = {
                    "Authorization": f"Bearer {access_token}",
                    "Content-Type": "application/json"
                }

                # Prepare email payload
                if "@" in contact:
                    payload = {
                        "message": {
                            "subject": "Your OTP Code",
                            "body": {
                                "contentType": "Text",
                                "content": f"Your OTP code is {otp}"
                            },
                            "toRecipients": [
                                {
                                    "emailAddress": {
                                        "address": contact
                                    }
                                }
                            ]
                        }
                    }
                else:
                    # Prepare SMS payload (assuming you have a mechanism to send SMS via Azure)
                    payload = {
                        "message": {
                            "content": f"Your OTP code is {otp}",
                            "destination": contact
                        }
                    }

                response = requests.post(endpoint, json=payload, headers=headers)
                if response.status_code == 202:  # 202 Accepted
                    return True
                else:
                    print(f"Error sending message via Azure: {response.status_code}, {response.text}")
                    return False

            else:
                print(f"Error acquiring token: {result.get('error_description')}")
                return False

        except Exception as e:
            print(f"Exception in _send_otp_via_azure: {e}")
            return False
# class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
#     otp = serializers.CharField(write_only=True, required=False)

#     def validate(self, attrs):
#         try:
#             user = CustomUser.objects.get(username=attrs['username'])
#             print(f"User found: {user}")
#         except ObjectDoesNotExist:
#             raise serializers.ValidationError("User does not exist")

#         # First Step: Validate username and password, then send OTP
#         if 'otp' not in attrs:
#             if self._validate_password(attrs['password'], user):
#                 try:
#                     otp = user.generate_otp()
#                     print(f"Generated OTP: {otp}")

#                     # Send OTP via Entra ID (Azure AD)
#                     if not self._send_otp_via_azure(user.email, otp):
#                         if not self._send_otp_via_azure(user.phone_number, otp):
#                             raise serializers.ValidationError("Error sending OTP via both email and SMS")

#                     return {'detail': "OTP sent to your registered contact. Please enter the OTP to log in"}

#                 except Exception as e:
#                     print(f"Error: {e}")
#                     raise serializers.ValidationError(f"Error: {str(e)}")
#             else:
#                 raise serializers.ValidationError("Invalid password.")
#         else:
#             # Second Step: Validate OTP
#             if user.otp == attrs['otp'] and user.otp_expiration > timezone.now():
#                 # OTP is correct and not expired
#                 data = super().validate(attrs)
#                 refresh = self.get_token(self.user)
#                 data['refresh'] = str(refresh)
#                 data['access'] = str(refresh.access_token)
#                 data['email'] = user.email
#                 data['role'] = user.role
#                 data['cws_code'] = user.cws_code
#                 data['cws_name'] = user.cws_name

#                 if user.cws_code and user.cws_name:
#                     cws = Cws.objects.filter(cws_code=user.cws_code).first()
#                     if cws:
#                         cws_info = StationSettings.objects.filter(cws_id=cws.id)[:2]
#                         serialized_data = serialize('json', cws_info)
#                         data['cws'] = serialized_data
#                         user.refresh_token = str(refresh)
#                         user.save()
#                     else:
#                         print("CWS not found for the given code.")
#                 else:
#                     user.refresh_token = str(refresh)
#                     user.save()

#                 return data
#             else:
#                 raise serializers.ValidationError("Invalid or expired OTP.")

#     def _validate_password(self, raw_password, user):
#         """
#         Validate if the provided raw_password matches the user's password.
#         """
#         return user.check_password(raw_password)

#     def _send_otp_via_azure(self, contact, otp):
#         """
#         Send OTP via Azure AD (Entra ID).
#         """
#         try:
#             authority = "https://login.microsoftonline.com/4b030d92-7ebd-4d2f-af2c-03b8af269059"
#             client_id = "eedef855-b7e4-47b0-a212-4f8b6344834b"
#             client_secret = "9zl8Q~WbxGOjnXUOA4~EPgwFXgIH1QLSLVQEyasq"  # Replace with your Azure client secret
#             scope = ["https://graph.microsoft.com/.default"]
#             endpoint = "https://graph.microsoft.com/v1.0/me/sendMail"

#             # Create a ConfidentialClientApplication
#             app = msal.ConfidentialClientApplication(
#                 client_id, authority=authority, client_credential=client_secret
#             )

#             # Acquire a token
#             result = app.acquire_token_for_client(scopes=scope)

#             if "access_token" in result:
#                 access_token = result["access_token"]
#                 headers = {
#                     "Authorization": f"Bearer {access_token}",
#                     "Content-Type": "application/json"
#                 }

#                 # Prepare email payload
#                 if "@" in contact:
#                     payload = {
#                         "message": {
#                             "subject": "Your OTP Code",
#                             "body": {
#                                 "contentType": "Text",
#                                 "content": f"Your OTP code is {otp}"
#                             },
#                             "toRecipients": [
#                                 {
#                                     "emailAddress": {
#                                         "address": contact
#                                     }
#                                 }
#                             ]
#                         }
#                     }
#                 else:
#                     # Prepare SMS payload (assuming you have a mechanism to send SMS via Azure)
#                     payload = {
#                         "message": {
#                             "content": f"Your OTP code is {otp}",
#                             "destination": contact
#                         }
#                     }

#                 response = requests.post(endpoint, json=payload, headers=headers)
#                 if response.status_code == 202:  # 202 Accepted
#                     return True
#                 else:
#                     print(f"Error sending message via Azure: {response.status_code}, {response.text}")
#                     return False

#             else:
#                 print(f"Error acquiring token: {result.get('error_description')}")
#                 return False

#         except Exception as e:
#             print(f"Exception in _send_otp_via_azure: {e}")
#             return False            

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