# myapp/views.py
from django.http import HttpResponse
from django.contrib.auth import get_user_model
from rest_framework import status,generics,permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
# from rest_framework_simplejwt.token_blacklist.models import TokenBlacklist
from api.serializers import LogoutSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from api.models import CustomUser
from api.serializers import CustomUserSerializer
from django.utils.html import escape
from django.shortcuts import render


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
    permission_classes = (IsAuthenticated,)

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