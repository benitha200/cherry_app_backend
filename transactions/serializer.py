# In your serializers.py file
from rest_framework import serializers
from .models import *

class TransactionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transactions
        fields = '__all__'

class RevceiveHarvestSerializer(serializers.ModelSerializer):
    class Meta:
        model=ReceiveHarvest
        fields='__all__'

class BatchTransactionsSerializer(serializers.ModelSerializer):
    total_kgs = serializers.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model = Transactions
        fields = ['batch_no', 'total_kgs', 'cws_name','cherry_grade','purchase_date']


class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model=Inventory
        fields=['process_name','schedule_date','process_type']
        

class CombinedDataSerializer(serializers.ModelSerializer):
    inventory = InventorySerializer(read_only=True)

    class Meta:
        model = ReceiveHarvest
        fields = ['batch_no', 'cherry_grade', 'batch_creation_date', 'received_cherry_kg', 'location_to', 'status', 'created_at', 'inventory']

class StockInventoryOutputsSerializer(serializers.ModelSerializer):
    class Meta:
        model=StockInventoryOutputs
        fields=['id','process_name','process_type','output_quantity','out_turn','created_at']

class InventoryOutputItemsSerializer(serializers.ModelSerializer):
    process_type_output = serializers.ReadOnlyField(source='process_type.output')

    class Meta:
        model = StockInventoryOutputs
        fields = ['id','process_name', 'process_type_output', 'output_quantity', 'created_at']

class BatchReportSerializer(serializers.Serializer):
    season = serializers.IntegerField()
    cws_name = serializers.CharField()
    batch_no = serializers.CharField()
    cherry_grade = serializers.CharField()
    schedule_date = serializers.DateField()
    completed_date=serializers.DateField()
    received_cherry_kg = serializers.DecimalField(max_digits=10, decimal_places=2)
    # output_kg = serializers.DecimalField(max_digits=10, decimal_places=2)
    status = serializers.IntegerField()
    process_type = serializers.CharField()
    out_turn = serializers.DecimalField(10,2)
    total_output_quantity=serializers.IntegerField()


class DailyPurchaseValidationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyPurchaseValidation
        fields = '__all__'

