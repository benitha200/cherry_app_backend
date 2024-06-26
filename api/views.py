from django.shortcuts import render
from rest_framework import generics,permissions, mixins
from farmers.models import Farmer,FarmerAndFarmDetails
from .serializers import FarmerSerializer,CustomUserSerializer,FarmerAndFarmSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .serializers import UserSerializer,CustomTokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from api.models import CustomUser
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny

# Create your views here.

class FarmerCreateView(generics.CreateAPIView):
    queryset=Farmer.objects.all()
    serializer_class=FarmerSerializer
    # permission_classes=[permissions.IsAuthenticated]
    permission_classes=[AllowAny]
    http_method_names=['post']


class FarmerListView(generics.ListAPIView):
    serializer_class = FarmerSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ['get']

    def get_queryset(self):
        # Get the user's cwscode from the request user
        user_cwscode = self.request.user.cws_code

        # Filter the queryset based on the user's cwscode
        queryset = Farmer.objects.filter(farmer_code__contains=user_cwscode)
        
        return queryset
    

    
class FarmerAndFarmListView(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = FarmerAndFarmSerializer
    permission_classes = [AllowAny]
    http_method_names = ['post']

    def post(self, request, *args, **kwargs):
        user_cwsname = request.data.get('cws_name')
        
        if user_cwsname is not None:
            queryset = FarmerAndFarmDetails.objects.filter(cws_name__contains=user_cwsname)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        else:
            return Response({"error": "cws_name not provided"}, status=400)
    
class AllFarmerListView(generics.ListAPIView):
    serializer_class = FarmerSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ['get']

    def get_queryset(self):
        # Get the user's cwscode from the request user
        # user_cwscode = self.request.user.cws_code

        # Filter the queryset based on the user's cwscode
        queryset = Farmer.objects.all()
        
        return queryset

# @csrf_exempt
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CustomUserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
