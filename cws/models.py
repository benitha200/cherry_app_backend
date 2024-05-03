# models.py

from django.db import models

class Cws(models.Model):
    cws_code = models.TextField(max_length=255, default=None)
    cws_name = models.TextField(max_length=20, default=None)

    def __str__(self) -> str:
        return self.cws_name

    class Meta:
        db_table = 'cws'


class StationSettings(models.Model):
    cws = models.ForeignKey('Cws', on_delete=models.CASCADE, related_name='station_settings')
    price_per_kg = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    transport_limit = models.DecimalField(max_digits=10, decimal_places=1, default=0.0)
    grade = models.CharField(max_length=20, default=None)

    class Meta:
        db_table = 'station_settings'

    def __str__(self) -> str:
        return f"{self.cws.cws_name} - Price: {self.price_per_kg}, Transport Limit: {self.transport_limit}"

    

class CherryGrade(models.Model):
    grade_name=models.CharField(max_length=20,default=None)
    grade_desc=models.CharField(max_length=100,default=None)

    class Meta:
        db_table='cherry_grade'
    def __str__(self) -> str:
        return f"{self.grade_name} - Description: {self.grade_desc}"
    
class CherryGradeOutput(models.Model):
    grade=models.ForeignKey(CherryGrade,on_delete=models.CASCADE,related_name="grade_output")
    outputs=models.CharField(max_length=100,default=None)
    desc=models.CharField(max_length=200)
    grade_name=models.CharField(max_length=20)

    class Meta:
        db_table='cherry_grade_outputs'
    

class InventoryOutput(models.Model):
    grade=models.ForeignKey(CherryGrade,on_delete=models.CASCADE,related_name="grade_id")
    output=models.CharField(max_length=100,default=None)
    desc=models.CharField(max_length=200)
    grade_name=models.CharField(max_length=20)

    class Meta:
        db_table='inventory_outputs'
        

    