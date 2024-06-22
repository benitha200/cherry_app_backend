from django.db import models
from datetime import datetime
from django.utils.timezone import now
from cws.models import *
from django.db.models import Sum


class Transactions(models.Model):
    cws_name = models.TextField(max_length=255)
    cws_code=models.TextField(max_length=255, default="MAC")
    purchase_date = models.DateField()
    farmer_code = models.TextField(max_length=255)
    farmer_name = models.TextField(max_length=255)
    season = models.IntegerField()
    cherry_kg = models.IntegerField()
    has_card = models.IntegerField()
    cherry_grade = models.CharField(max_length=2)
    price = models.DecimalField(max_digits=10, decimal_places=2)  
    grn_no = models.IntegerField(unique=False)
    transport = models.DecimalField(max_digits=10, decimal_places=2) 
    batch_no = models.TextField(max_length=50)
    occupation=models.TextField(max_length=255, default="Farmer")
    synced=models.IntegerField(default=1,null=True)
    id_no=models.IntegerField(default=0,null=True)
    is_received=models.IntegerField(default=0)
    is_approved=models.IntegerField(default=0)
    is_paid=models.IntegerField(default=0)
    status=models.IntegerField(default=0)
    plot_name=models.CharField(max_length=255,null=True)
    created_at = models.DateField(auto_now_add=True)

    class Meta:
        db_table = 'transactions'

    def __str__(self) -> str:
        return f"{self.cws_name}-{self.purchase_date}--{self.farmer_name}--{self.batch_no}"
    
    @classmethod
    def get_total_kgs_by_batch(cls):
        queryset = cls.objects.values('batch_no', 'cws_name', 'cherry_grade', 'purchase_date').annotate(total_kgs=Sum('cherry_kg')).order_by('batch_no')
        return queryset
    
    @classmethod
    def get_total_kgs_by_batch_per_station(cls,cws_name):
        queryset = cls.objects.filter(cws_name=cws_name, is_received=0,is_approved=1).values('batch_no', 'cws_name', 'cherry_grade', 'purchase_date').annotate(total_kgs=Sum('cherry_kg')).order_by('batch_no')
        return queryset


class ReceiveHarvest(models.Model):
    batch_no = models.CharField(max_length=50)
    cherry_grade = models.TextField(max_length=50)
    batch_creation_date = models.DateField()
    harvest_cherry_kg = models.DecimalField(max_digits=10, decimal_places=2)
    received_cherry_kg = models.DecimalField(max_digits=10, decimal_places=2)
    location_to = models.TextField(max_length=255)
    status=models.IntegerField(default=0)
    created_at = models.DateField(auto_now_add=True)

    class Meta:
        db_table = "received_harvest"

class Inventory(models.Model):
    process_name=models.CharField(max_length=50,unique=True)
    process_type=models.ForeignKey(CherryGradeOutput,on_delete=models.CASCADE)
    schedule_date=models.DateField()
    created_at = models.DateField(auto_now_add=True)
    location_to = models.TextField(max_length=255)
    completed_date=models.DateField(null=True)
    status=models.IntegerField(default=0) 

    class Meta:
        db_table="inventory"

class StockInventoryOutputs(models.Model):
    process_name = models.CharField(max_length=50)
    process_type = models.ForeignKey(InventoryOutput, on_delete=models.CASCADE)
    output_quantity=models.IntegerField()
    out_turn=models.CharField(max_length=200)
    
    created_at = models.DateField(auto_now_add=True)

    class Meta:
        db_table = "stock_inventory_outputs"
        unique_together = ['process_name', 'process_type']

    def __str__(self):
        return f"{self.process_name} - {self.process_type}"


    
class DailyPurchaseValidation(models.Model):
    date = models.DateField()
    cherry_grade = models.CharField(max_length=2)
    cherry_kg = models.FloatField()
    amount = models.FloatField()

    class Meta:
        db_table = 'daily_purchase_validation'