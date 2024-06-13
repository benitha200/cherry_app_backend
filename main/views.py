# myapp/views.py
from django.http import HttpResponse
from django.contrib.auth import get_user_model
from rest_framework import status,generics,permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
# from rest_framework_simplejwt.token_blacklist.models import TokenBlacklist
from api.serializers import LogoutSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from api.models import CustomUser
from api.serializers import CustomUserSerializer
from django.utils.html import escape
from django.shortcuts import render,redirect
import requests
from django.http import JsonResponse


def index(request):
    return render(request, 'index.html')


def home(request):
    welcome_message = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Coffee Washing Machine Transactions REST APIs</title>
        <style>
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            .welcome-message {
                font-size: 36px;
                text-align: center;
                font-weight:bold;
                
            }
        </style>
    </head>
    <body>
        <div class="welcome-message">
            Welcome to Coffee Washing Station Transactions REST APIs!
        </div>
    </body>
    </html>
    """
    return HttpResponse(welcome_message)




# @api_view(['POST'])
# def register_user_api(request):
#     # Process user registration form data
#     username = request.data.get('username')
#     password = request.data.get('password')
#     role = request.data.get('role')
#     cws_code = request.data.get('cws_code', None)
#     cws_name = request.data.get('cws_name', None)
#     user_manager = CustomUser.objects
#     user = user_manager.create_user(username=username, password=password, role=role, cws_code=cws_code, cws_name=cws_name)

#     # Serialize the user data
#     serializer = CustomUserSerializer(user)

#     response={"message":"User Created Successfully", "success":True}

#     return Response(response, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def register_user_api(request):
    serializer = CustomUserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        response_message = f"User '{user.username}' created successfully"
        response = {
            "message": response_message,
            "success": True
        }

        return Response(response, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            message={"message":"Log Out successful"}

            return Response(message,status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            message={"message":"Error Occured"}
            return Response(message,status=status.HTTP_400_BAD_REQUEST)
        

# def home_view(request):
#     return render(request, 'index.html')

def login(request):
    authorization_url = (
        f'https://login.microsoftonline.com/4b030d92-7ebd-4d2f-af2c-03b8af269059/oauth2/v2.0/authorize'
        f'?client_id=927e3efe-877d-429f-9c60-6de0c86ea83b'
        f'&response_type=code'
        f'&redirect_uri=http://localhost:8000/callback'
        f'&response_mode=query'
        f'&scope=User.Read'
        f'&state=random_state_string'
    )
    return redirect(authorization_url)


def callback(request):
    code = request.GET.get('code')
    if not code:
        return HttpResponse('Error: No code provided')

    token_url = 'https://login.microsoftonline.com/4b030d92-7ebd-4d2f-af2c-03b8af269059/oauth2/v2.0/token'
    token_data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': "http://localhost:8000/callback",
        'client_id': "927e3efe-877d-429f-9c60-6de0c86ea83b",
        'client_secret': "Auj8Q~rCZIScD3RsOnJL6rhddvo26GM4xqqXxcgp",
        'scope': 'User.Read'
    }
    token_headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.post(token_url, data=token_data, headers=token_headers)
    token_json = response.json()

    if 'access_token' in token_json:
        access_token = token_json['access_token']
        return HttpResponse(f'Access Token: {access_token}')
    else:
        return HttpResponse(f'Error: {token_json.get("error_description", "No access token found")}')

# def callback(request):
#     code = request.GET.get('code')
#     if not code:
#         return HttpResponse('Error: No code returned', status=400)

#     token_url = f'https://login.microsoftonline.com/4b030d92-7ebd-4d2f-af2c-03b8af269059/oauth2/v2.0/token'
#     token_data = {
#         'client_id': "927e3efe-877d-429f-9c60-6de0c86ea83b",
#         'scope': 'User.Read',
#         'code': code,
#         'redirect_uri':"http://localhost:8000/callback",
#         'grant_type': 'authorization_code',
#         'client_secret': "Auj8Q~rCZIScD3RsOnJL6rhddvo26GM4xqqXxcgp"
#     }

#     token_response = requests.post(token_url, data=token_data)
#     token_response_data = token_response.json()
#     access_token = token_response_data.get('access_token')

#     if not access_token:
#         return HttpResponse('Error: No access token received', status=400)

#     # Retrieve user profile information
#     graph_url = 'https://graph.microsoft.com/v1.0/me'
#     headers = {
#         'Authorization': f'Bearer {access_token}'
#     }

#     response = requests.get(graph_url, headers=headers)
#     user_profile = response.json()

#     response_data = {
#         'profile': user_profile
#     }

#     return JsonResponse(response_data)
