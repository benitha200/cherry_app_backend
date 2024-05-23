from rest_framework import serializers
from .models import *

class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model=Loan
        fields='__all__'
class LoanInstallmentSerializer(serializers.ModelSerializer):
    class Meta:
        model=LoanInstallments
        fields=["id","loan","farmer_code","farmer_name","paid_amount","created_at"]
        read_only_fields=["created_at"]