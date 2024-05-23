from django.db import models

# Create your models here.

class Loan(models.Model):
    farmer_code=models.CharField(max_length=255)
    farmer_name=models.CharField(max_length=255)
    loan_limit=models.IntegerField()
    loan_amount=models.IntegerField()
    is_approved=models.IntegerField(default=0)
    total_paid=models.DecimalField(decimal_places=0,max_digits=10)
    is_paid=models.IntegerField()


class LoanInstallments(models.Model):
    loan=models.ForeignKey(Loan,on_delete=models.CASCADE)
    farmer_code=models.CharField(max_length=255)
    farmer_name=models.CharField(max_length=255)
    paid_amount=models.IntegerField()
    created_at = models.DateField(auto_now_add=True)