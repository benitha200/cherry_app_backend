from django.shortcuts import render
from rest_framework import generics,permissions
from cws.models import Cws,StationSettings,CherryGrade,CherryGradeOutput
from .serializers import *
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status


# Create your views here.
class CwsCreateView(generics.CreateAPIView):
    queryset=Cws.objects.all()
    serializer_class=CwsSerializer
    permission_classes=[permissions.IsAuthenticated]
    http_method_names=['post']


class CwsListView(generics.ListAPIView):
    queryset=Cws.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class=CwsSerializer
    http_method_names=['get']


class StationSettingsAPIView(APIView):

    def get(self, request, cws_code):
        print(f"Attempting to retrieve StationSettings for CWS code: '{cws_code}'")
        try:
            station_settings = StationSettings.objects.get(cws__cws_code=cws_code)
            serializer = StationSettingsSerializer(station_settings)
            return Response(serializer.data)
        except StationSettings.DoesNotExist:
            return Response({"error": f"StationSettings not found for CWS code {cws_code}"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, cws_code):
        print(request.data)
        grade = request.data.get('grade')

        try:
            # Try to get an existing StationSettings record with the given cws_code and grade
            station_settings = StationSettings.objects.get(cws__cws_code=cws_code, grade=grade)
            serializer = StationSettingsSerializer(station_settings, data=request.data)
        except StationSettings.DoesNotExist:
            # If the record doesn't exist, create a new one
            cws_instance = Cws.objects.get(cws_code=cws_code)
            station_settings = StationSettings(cws=cws_instance, grade=grade)
            serializer = StationSettingsSerializer(station_settings, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Price is set successfully", "success": True})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class StationSettingsAPIView(APIView):

#     def get(self, request, cws_code):
#         print(f"Attempting to retrieve StationSettings for CWS code: '{cws_code}'")
#         try:
#             station_settings = StationSettings.objects.get(cws__cws_code=cws_code)
#             serializer = StationSettingsSerializer(station_settings)
#             return Response(serializer.data)
#         except StationSettings.DoesNotExist:
#             return Response({"error": f"StationSettings not found for CWS code {cws_code}"}, status=status.HTTP_404_NOT_FOUND)

#     def put(self, request, cws_code):
#         print(request.data)
#         try:
#             station_settings = StationSettings.objects.get(cws__cws_code=cws_code, grade=request.data.get('grade'))
#             serializer = StationSettingsSerializer(station_settings, data=request.data)
#         except StationSettings.DoesNotExist:
#             cws_instance = Cws.objects.get(cws_code=cws_code)
#             grade = request.data.get('grade')
            

#             existing_instance = StationSettings.objects.filter(cws=cws_instance, grade=grade).first()

#             if existing_instance:
#                 serializer = StationSettingsSerializer(existing_instance, data=request.data)
#             else:
#                 station_settings = StationSettings(cws=cws_instance, grade=grade)
#                 serializer = StationSettingsSerializer(station_settings, data=request.data)

#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "Price is set successfully", "success": True})
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class CherryGradeAPIView(APIView):
    def get(self, request):
        cherry_grades = CherryGrade.objects.all()
        serializer = CherryGradeSerializer(cherry_grades, many=True)
        return Response(serializer.data)
    

class StationSettingsAPIViewList(APIView):
    def get(self, request, *args, **kwargs):
        station_settings = StationSettings.objects.all().order_by('cws_id')
        serializer = StationSettingsSerializer(station_settings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CherryGradeOutputRetrieveAPIView(generics.RetrieveAPIView):
    def post(self,request):
        grade_name = request.data.get('grade_name')
        print(grade_name)
        queryset = CherryGradeOutput.objects.filter(grade_name=grade_name)
        serializer=CherryGradeOutputSerializer(queryset,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CherryGradeOutputListAPIView(generics.ListAPIView):
    serializer_class = CherryGradeOutputSerializer

    def get_queryset(self):
        grade_name = self.request.data.get('grade_name')
        return CherryGradeOutput.objects.filter(grade_name=grade_name)

    def post(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class InventoryOutputAPIView(generics.ListAPIView):
    serializer_class = InventoryOutputSerializer

    def get_queryset(self):
        grade_name = self.request.data.get('grade_name')
        return InventoryOutput.objects.filter(grade_name=grade_name)

    def post(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



