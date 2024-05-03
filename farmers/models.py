from django.db import models


class Farmer(models.Model):
    cws = models.TextField(max_length=255,default=None)
    farmer_code = models.TextField(max_length=255, unique=True)
    farmer_name = models.TextField(max_length=255)
    gender = models.TextField(max_length=20)
    age = models.IntegerField()
    address = models.TextField(max_length=255)
    phone_number = models.TextField(max_length=20)
    national_id = models.TextField(max_length=20,unique=True,default=0)
    village = models.TextField(max_length=255)
    location = models.TextField(max_length=255)
    is_certified=models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    created_by = models.IntegerField(default=0, null=True)

    def __str__(self):
        return f"{self.farmer_name} - {self.farmer_code}"

    class Meta:
        db_table='farmer_details'

class FarmerAndFarmDetails(models.Model):
    cws_name = models.TextField(max_length=255, default=None)
    cws_code = models.TextField(max_length=255, default=None)
    farmer_code = models.CharField(max_length=100, unique=True)
    farmer_name = models.TextField(max_length=255)
    gender = models.TextField(max_length=20)
    dob = models.DateField()
    phone_number = models.TextField(max_length=20)
    national_id = models.TextField(max_length=20, unique=True, default=0)
    location = models.TextField(max_length=255)
    is_certified = models.BooleanField(default=True)
    polygon = models.TextField()
    plot_name = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    created_by = models.IntegerField(default=0, null=True)

    def __str__(self):
        return f"{self.farmer_name} - {self.farmer_code}"

    class Meta:
        db_table = 'farmer_and_farm_details'
