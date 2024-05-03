from rest_framework import serializers
from .models import *

class CwsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Cws
        fields='__all__'


class StationSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StationSettings
        fields = ['id', 'cws', 'price_per_kg', 'transport_limit','grade']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        # Retrieve Cws instance using the ID stored in the 'cws' field
        cws_id = representation['cws']
        cws_instance = Cws.objects.get(id=cws_id)
        
        return {
            'cws_name': cws_instance.cws_name,
            'price_per_kg': representation['price_per_kg'],
            'transport_limit': representation['transport_limit'],
            'grade': representation['grade']
        }

    # def to_representation(self, instance):
    #     representation = super().to_representation(instance)
    #     representation['cws'] = representation['cws']['cws_name']
    #     return representation

class CherryGradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CherryGrade
        fields = '__all__'

class InventoryOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryOutput
        fields = '__all__'


class CherryGradeOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model=CherryGradeOutput
        fields='__all__'