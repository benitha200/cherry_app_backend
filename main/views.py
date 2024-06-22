# # myapp/views.py
# from django.http import HttpResponse
# from django.contrib.auth import get_user_model
# from rest_framework import status,generics,permissions
# from rest_framework.response import Response
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated,AllowAny
# # from rest_framework_simplejwt.token_blacklist.models import TokenBlacklist
# from api.serializers import LogoutSerializer
# from rest_framework_simplejwt.tokens import RefreshToken
# from rest_framework.views import APIView
# from api.models import CustomUser
# from api.serializers import CustomUserSerializer
# from django.utils.html import escape
# from django.shortcuts import render,redirect
# import requests
# from django.http import JsonResponse
# import secrets
# import hashlib
# import base64
# from django.shortcuts import redirect

# def index(request):
#     return render(request, 'index.html')


# def home(request):
#     welcome_message = """
#     <!DOCTYPE html>
#     <html lang="en">
#     <head>
#         <meta charset="UTF-8">
#         <meta name="viewport" content="width=device-width, initial-scale=1.0">
#         <title>Welcome to Coffee Washing Machine Transactions REST APIs</title>
#         <style>
#             body {
#                 display: flex;
#                 justify-content: center;
#                 align-items: center;
#                 height: 100vh;
#                 margin: 0;
#             }
#             .welcome-message {
#                 font-size: 36px;
#                 text-align: center;
#                 font-weight:bold;
                
#             }
#         </style>
#     </head>
#     <body>
#         <div class="welcome-message">
#             Welcome to Coffee Washing Station Transactions REST APIs!
#         </div>
#     </body>
#     </html>
#     """
#     return HttpResponse(welcome_message)




# # @api_view(['POST'])
# # def register_user_api(request):
# #     # Process user registration form data
# #     username = request.data.get('username')
# #     password = request.data.get('password')
# #     role = request.data.get('role')
# #     cws_code = request.data.get('cws_code', None)
# #     cws_name = request.data.get('cws_name', None)
# #     user_manager = CustomUser.objects
# #     user = user_manager.create_user(username=username, password=password, role=role, cws_code=cws_code, cws_name=cws_name)

# #     # Serialize the user data
# #     serializer = CustomUserSerializer(user)

# #     response={"message":"User Created Successfully", "success":True}

# #     return Response(response, status=status.HTTP_201_CREATED)

# @api_view(['POST'])
# def register_user_api(request):
#     serializer = CustomUserSerializer(data=request.data)
#     if serializer.is_valid():
#         user = serializer.save()
#         response_message = f"User '{user.username}' created successfully"
#         response = {
#             "message": response_message,
#             "success": True
#         }

#         return Response(response, status=status.HTTP_201_CREATED)
#     else:
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class LogoutView(APIView):
#     permission_classes = (AllowAny,)

#     def post(self, request):
#         try:
#             refresh_token = request.data["refresh_token"]
#             token = RefreshToken(refresh_token)
#             token.blacklist()
#             message={"message":"Log Out successful"}

#             return Response(message,status=status.HTTP_205_RESET_CONTENT)
#         except Exception as e:
#             message={"message":"Error Occured"}
#             return Response(message,status=status.HTTP_400_BAD_REQUEST)
        

# # def home_view(request):
# #     return render(request, 'index.html')

# def login(request):
#     authorization_url = (
#         f'https://login.microsoftonline.com/4b030d92-7ebd-4d2f-af2c-03b8af269059/oauth2/v2.0/authorize'
#         f'?client_id=927e3efe-877d-429f-9c60-6de0c86ea83b'
#         f'&response_type=code'
#         f'&redirect_uri=http://10.100.10.43:8000/callback/'
#         f'&response_mode=query'
#         f'&scope=User.Read'
#         f'&state=random_state_string'
#     )
#     return redirect(authorization_url)


# # def callback(request):
# #     code = request.GET.get('code')
# #     if not code:
# #         return HttpResponse('Error: No code provided')

# #     token_url = 'https://login.microsoftonline.com/4b030d92-7ebd-4d2f-af2c-03b8af269059/oauth2/v2.0/token'
# #     token_data = {
# #         'grant_type': 'authorization_code',
# #         'code': code,
# #         'redirect_uri': "http://10.100.10.43:8000/callback/",
# #         'client_id': "927e3efe-877d-429f-9c60-6de0c86ea83b",
# #         'client_secret': "Auj8Q~rCZIScD3RsOnJL6rhddvo26GM4xqqXxcgp",
# #         'scope': 'User.Read'
# #     }
# #     token_headers = {
# #         'Content-Type': 'application/x-www-form-urlencoded'
# #     }

# #     response = requests.post(token_url, data=token_data, headers=token_headers)
# #     token_json = response.json()

# #     if 'access_token' in token_json:
# #         access_token = token_json['access_token']
# #         return HttpResponse(f'Access Token: {access_token}')
# #     else:
# #         return HttpResponse(f'Error: {token_json.get("error_description", "No access token found")}')

# # def callback(request):
# #     code = request.GET.get('code')
# #     # code="0.ATAAkg0DS71-L02vLAO4ryaQWf4-fpJ9h59CnGBt4MhuqDswAAA.AgABBAIAAAApTwJmzXqdR4BN2miheQMYAgDs_wUA9P-fKkm0CvvMp0InTmrFynPEQNVeZ3-8mvD73pDMXtYlTjC5a6SBI-RT-7Dee-VhR9lN12l0u403r4SIUcxmijar1WXwbqZT5svTQq3PXR3Eb6lv7pPM8EWppFFuNTbY8tdfRKZZJIU02Y7w2pqt1oXx0iRbkBsk8ubRCLKPy6zPuOSbfPQOpCoY_Vm0JmLa0D1Wgw9tERwmWROzatTy0nQKNKM5xANBSKFcOA91aa-i0ghhUlqTTL3ZlsFYb6Ixoro8Uawwp4vVyOMWQDk2LYgVlvzSf9fuayV8bRjsSKreGdomMky0H0xK7wVlExzc5t2pUfMR0qjhKZG9BuwoH8wZdzoQLBrumzu4kAxyYsnDxZb73yliEL1cvatc-lzf8sA8QWJASe-yWP5pVevzIAIPJE4FC7y9s_R7fUNK5YQG4_wJx7pMpr3eRcQSIwupBm_nDxGjdXReuCtnt_OOXSjV_GCsoULfwSGovQsL7vg2nlGbnQ_pp-7sJM8y13XND4q2tA6T0dS7b27-RywdLBq0HSGe8c0rwEXJt7w_a3J9LfVMVkk-YQFmMAQAbuAGimQSJLezwuKKJViW9Oww3IPmCexmLd8jBpqS_X16Fjl_ARPuX0YucDDQVvH8LOmYhvm60uqCoUTuikt8hghsGzb8yFXjri017vd4SPQU5SSwUh9Ah-HAlRCQVwFp3VkyHkCigMVZorimITgY_PkZruB_Ghi5eL2eUvlXRkBEyupzWCA_XUk5LXrnDarc8bHspPgr0kxkcZaDrSka5yCVV-VJ_3f8Nm738z9uyC4KNTeBcnLVQ_jaKeWVvM2IIwBgtshXrwlvLtO1J_fBPiwsJUENS75v6avlWl7Z-7T0VEeZ02lBvc0u7VVLxgn9cAdEjbGrE_E6jpmrVXA&client_info=eyJ1aWQiOiIzN2E4OTE0YS01NDM1LTQ2ZTItYjE1Yi1iOWQ2ODIwOTA1MGYiLCJ1dGlkIjoiNGIwMzBkOTItN2ViZC00ZDJmLWFmMmMtMDNiOGFmMjY5MDU5In0&state=jVdMQXGpvfElDPbH&session_state=e716e837-a371-417e-9f18-a1761727ca89"
# #     if not code:
# #         return HttpResponse('Error: No code returned', status=400)

# #     token_url = f'https://login.microsoftonline.com/4b030d92-7ebd-4d2f-af2c-03b8af269059/oauth2/v2.0/token'
# #     token_data = {
# #         'client_id': "927e3efe-877d-429f-9c60-6de0c86ea83b",
# #         'scope': 'User.Read',
# #         'code': code,
# #         'redirect_uri':"http://10.100.10.43:8000/callback",
# #         'grant_type': 'authorization_code',
# #         'client_secret': "Auj8Q~rCZIScD3RsOnJL6rhddvo26GM4xqqXxcgp"
# #     }

# #     token_response = requests.post(token_url, data=token_data)
# #     token_response_data = token_response.json()
# #     access_token = token_response_data.get('access_token')

# #     if not access_token:
# #         return HttpResponse('Error: No access token received', status=400)

# #     # Retrieve user profile information
# #     graph_url = 'https://graph.microsoft.com/v1.0/me'
# #     headers = {
# #         'Authorization': f'Bearer {access_token}'
# #     }

# #     response = requests.get(graph_url, headers=headers)
# #     user_profile = response.json()

# #     response_data = {
# #         'profile': user_profile
# #     }

# #     return JsonResponse(response_data)

# def generate_code_verifier():
#     return base64.urlsafe_b64encode(secrets.token_bytes(32)).rstrip(b'=').decode('utf-8')

# def generate_code_challenge(code_verifier):
#     code_challenge = hashlib.sha256(code_verifier.encode('utf-8')).digest()
#     return base64.urlsafe_b64encode(code_challenge).rstrip(b'=').decode('utf-8')

# def start_authorization(request):
#     code_verifier = generate_code_verifier()
#     code_challenge = generate_code_challenge(code_verifier)
    
#     # Store code_verifier in session
#     request.session['code_verifier'] = code_verifier
    
#     authorization_url = (
#         "https://login.microsoftonline.com/4b030d92-7ebd-4d2f-af2c-03b8af269059/oauth2/v2.0/authorize?"
#         "response_type=code&"
#         "client_id=927e3efe-877d-429f-9c60-6de0c86ea83b&"
#         "redirect_uri=http://10.100.10.43:8000/callback/&"
#         "scope=User.Read&"
#         "code_challenge_method=S256&"
#         f"code_challenge={code_challenge}&"
#         "state=random_state_string"
#     )
    
#     return redirect(authorization_url)


# def callback(request):
#     code = request.GET.get('code')
#     if not code:
#         return HttpResponse('Error: No code returned', status=400)

#     # Retrieve code_verifier from session
#     code_verifier = request.session.get('code_verifier')
#     if not code_verifier:
#         return HttpResponse('Error: code_verifier not found in session', status=400)
    
#     token_url = 'https://login.microsoftonline.com/4b030d92-7ebd-4d2f-af2c-03b8af269059/oauth2/v2.0/token'
#     token_data = {
#         'client_id': '927e3efe-877d-429f-9c60-6de0c86ea83b',
#         'scope': 'User.Read',
#         'code': code,
#         'redirect_uri': 'http://10.100.10.43:8000/callback/',
#         'grant_type': 'authorization_code',
#         'client_secret': 'Auj8Q~rCZIScD3RsOnJL6rhddvo26GM4xqqXxcgp',
#         'code_verifier': code_verifier
#     }
    
#     token_response = requests.post(token_url, data=token_data)
    
#     try:
#         token_response_data = token_response.json()
#     except ValueError:
#         return HttpResponse('Error: Unable to parse token response', status=400)
    
#     if 'error' in token_response_data:
#         error_description = token_response_data.get('error_description', 'No description provided')
#         return HttpResponse(f"Error: {token_response_data['error']} - {error_description}", status=400)
    
#     access_token = token_response_data.get('access_token')
    
#     if not access_token:
#         return HttpResponse('Error: No access token received', status=400)
    
#     # Retrieve user profile information
#     graph_url = 'https://graph.microsoft.com/v1.0/me'
#     headers = {
#         'Authorization': f'Bearer {access_token}'
#     }
    
#     response = requests.get(graph_url, headers=headers)
    
#     try:
#         user_profile = response.json()
#     except ValueError:
#         return HttpResponse('Error: Unable to parse user profile response', status=400)
    
#     response_data = {
#         'profile': user_profile
#     }
    
#     return JsonResponse(response_data)


# # def callback(request):
# #     code = request.GET.get('code')
# #     if not code:
# #         return HttpResponse('Error: No code returned', status=400)
    
# #     token_url = 'https://login.microsoftonline.com/4b030d92-7ebd-4d2f-af2c-03b8af269059/oauth2/v2.0/token'
# #     token_data = {
# #         'client_id': '927e3efe-877d-429f-9c60-6de0c86ea83b',
# #         'scope': 'User.Read',
# #         'code': code,
# #         'redirect_uri': 'http://10.100.10.43:8000/callback/',
# #         'grant_type': 'authorization_code',
# #         'client_secret': 'Auj8Q~rCZIScD3RsOnJL6rhddvo26GM4xqqXxcgp',
# #         # If PKCE is used, include the code_verifier:
# #         'code_verifier': code_verifier
# #     }
    
# #     token_response = requests.post(token_url, data=token_data)
    
# #     try:
# #         token_response_data = token_response.json()
# #     except ValueError:
# #         return HttpResponse('Error: Unable to parse token response', status=400)
    
# #     if 'error' in token_response_data:
# #         error_description = token_response_data.get('error_description', 'No description provided')
# #         return HttpResponse(f"Error: {token_response_data['error']} - {error_description}", status=400)
    
# #     access_token = token_response_data.get('access_token')
    
# #     if not access_token:
# #         return HttpResponse('Error: No access token received', status=400)
    
# #     # Retrieve user profile information
# #     graph_url = 'https://graph.microsoft.com/v1.0/me'
# #     headers = {
# #         'Authorization': f'Bearer {access_token}'
# #     }
    
# #     response = requests.get(graph_url, headers=headers)
    
# #     try:
# #         user_profile = response.json()
# #     except ValueError:
# #         return HttpResponse('Error: Unable to parse user profile response', status=400)
    
# #     response_data = {
# #         'profile': user_profile
# #     }
    
# #     return JsonResponse(response_data)

# myapp/views.py
from django.http import HttpResponse, JsonResponse,HttpResponseBadRequest
from django.contrib.auth import get_user_model
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from api.serializers import LogoutSerializer, CustomUserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from api.models import CustomUser
from django.utils.html import escape
from django.shortcuts import render, redirect
import requests
import secrets
import hashlib
import base64
from msal import ConfidentialClientApplication
import json
import urllib.parse

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
            message = {"message": "Log Out successful"}

            return Response(message, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            message = {"message": "Error Occurred"}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

# def login(request):
#     code_verifier = generate_code_verifier()

#     print("code verifer")
#     print(code_verifier)
#     code_challenge = generate_code_challenge(code_verifier)

#     print("code challenge")
#     print(code_challenge)
    
#     # Store code_verifier in session
#     request.session['code_verifier'] = code_verifier
    
#     authorization_url = (
#         "https://login.microsoftonline.com/4b030d92-7ebd-4d2f-af2c-03b8af269059/oauth2/v2.0/authorize?"
#         "response_type=code&"
#         "client_id=927e3efe-877d-429f-9c60-6de0c86ea83b"
#         "redirect_uri=http://localhost:8000/callback/&"
#         "scope=User.Read&"
#         "code_challenge_method=S256&"
#         f"code_challenge={code_challenge}&"
#         "state=random_state_string"
#     )
    authorization_url = (
        "https://login.microsoftonline.com/4b030d92-7ebd-4d2f-af2c-03b8af269059/oauth2/v2.0/authorize?"
        "response_type=code&"
        "client_id=927e3efe-877d-429f-9c60-6de0c86ea83b"
        "redirect_uri=https://cherryapp.sucafina.com:8000/callback/&"
        "scope=User.Read&"
        "code_challenge_method=S256&"
        f"code_challenge={code_challenge}&"
        "state=random_state_string"
    )
    
#     return redirect(authorization_url)

def start_authorization_flow(request):
    code_verifier = generate_code_verifier()
    code_challenge = generate_code_challenge(code_verifier)

    print("code verifer")
    print(code_verifier)
    print("code challenge")
    print(code_challenge)
    
    # Store the code_verifier in the session
    request.session['code_verifier'] = code_verifier

    print("Stored code_verifier in session:", request.session['code_verifier'])
    
    msal_app = ConfidentialClientApplication(
        client_id='927e3efe-877d-429f-9c60-6de0c86ea83b',
        client_credential='Auj8Q~rCZIScD3RsOnJL6rhddvo26GM4xqqXxcgp',
        authority='https://login.microsoftonline.com/4b030d92-7ebd-4d2f-af2c-03b8af269059'
    )

    auth_url = msal_app.get_authorization_request_url(
        scopes=['User.Read'],
        redirect_uri='https://cherryapp.sucafina.com:8000/callback/',
        code_challenge=code_challenge,
        code_challenge_method='S256',
        state='random_state_string',
        nonce='random_nonce_string'
    )

    return redirect(auth_url)

def callback(request):
    code = request.GET.get('code')
    if not code:
        return HttpResponse('Error: No code returned', status=400)

    # Retrieve code_verifier from session
    code_verifier = request.session.get('code_verifier')
    if not code_verifier:
        return HttpResponse('Error: code_verifier not found in session', status=400)
    
    token_url = 'https://login.microsoftonline.com/4b030d92-7ebd-4d2f-af2c-03b8af269059/oauth2/v2.0/token'
    token_data = {
        'client_id': '927e3efe-877d-429f-9c60-6de0c86ea83b',
        'scope': 'User.Read',
        'code': code,
        'redirect_uri': 'http://localhost:8000/callback/',
        'grant_type': 'authorization_code',
        'client_secret': 'Auj8Q~rCZIScD3RsOnJL6rhddvo26GM4xqqXxcgp',
        # 'code_verifier': code_verifier
    }
    
    token_response = requests.post(token_url, data=token_data)
    
    try:
        token_response_data = token_response.json()
    except ValueError:
        return HttpResponse('Error: Unable to parse token response', status=400)
    
    if 'error' in token_response_data:
        error_description = token_response_data.get('error_description', 'No description provided')
        return HttpResponse(f"Error: {token_response_data['error']} - {error_description}", status=400)
    
    access_token = token_response_data.get('access_token')
    
    if not access_token:
        return HttpResponse('Error: No access token received', status=400)
    
    # Retrieve user profile information
    graph_url = 'https://graph.microsoft.com/v1.0/me'
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    
    response = requests.get(graph_url, headers=headers)
    
    try:
        user_profile = response.json()
    except ValueError:
        return HttpResponse('Error: Unable to parse user profile response', status=400)
    profile_json = json.dumps(user_profile)
    
    # Set up JSON response to be returned to frontend
    response_data = {
        'profile': profile_json
    }
    filtered_profile = {
        'givenName': user_profile['givenName'],
        'mail': user_profile['mail'],
        'displayName':user_profile['displayName'],
        'jobTitle':user_profile['jobTitle'],
        'officeLocation':user_profile['officeLocation'],
        'surname':user_profile['surname'],
        'userPrincipalName':user_profile['userPrincipalName'],
    }
    profile_json2 = json.dumps(filtered_profile)
    encoded_profile_json = urllib.parse.quote(profile_json2)

    # Redirecting to frontend with JSON profile data as query parameters
    response = redirect(f"http://localhost:5173/?profile={encoded_profile_json}")

    # Configure CORS headers
    response['Access-Control-Allow-Origin'] = 'http://localhost:5173'
    response['Access-Control-Allow-Credentials'] = 'true'

    return response
    


def generate_code_verifier():
    return base64.urlsafe_b64encode(secrets.token_bytes(32)).rstrip(b'=').decode('utf-8')

def generate_code_challenge(code_verifier):
    code_challenge = hashlib.sha256(code_verifier.encode('utf-8')).digest()
    return base64.urlsafe_b64encode(code_challenge).rstrip(b'=').decode('utf-8')

# def generate_code_verifier():
#     return base64.urlsafe_b64encode(secrets.token_bytes(32)).rstrip(b'=').decode('utf-8')

# def generate_code_challenge(code_verifier):
#     code_challenge = hashlib.sha256(code_verifier.encode('utf-8')).digest()
#     return base64.urlsafe_b64encode(code_challenge).rstrip(b'=').decode('utf-8')