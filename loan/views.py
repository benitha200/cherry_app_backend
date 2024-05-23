from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework.views import APIView

# Create your views here.


class RequestLoan(generics.CreateAPIView):
    queryset=Loan.objects.all()
    serializer_class=LoanSerializer


class GetLoanRequests(APIView):
    # queryset=Loan.objects.all()
    # serializer_class=LoanSerializer
    def post(self,request,status,format=None):
        if status=="approved":
            loan_requests=Loan.objects.filter(is_approved=1)
        elif status=="pending":
            loan_requests=Loan.objects.filter(is_approved=0)
        else:
            loan_requests=Loan.objects.all()
        serializer=LoanSerializer(loan_requests,many=True)
        return Response(serializer.data)


class ApproveLoanView(APIView):
    def post(self,request,pk,format=None):
        loan=get_object_or_404(Loan,pk=pk)
        loan.is_approved=1
        loan.save()
        serializer=LoanSerializer(loan)
        return Response(serializer.data,status.HTTP_200_OK)

class LoanInstallmentCreateView(generics.CreateAPIView):
    queryset = LoanInstallments.objects.all()
    serializer_class = LoanInstallmentSerializer

class LoanInstallmentRetrieveView(generics.RetrieveAPIView):
    queryset = LoanInstallments.objects.all()
    serializer_class = LoanInstallmentSerializer


class GetLoan(APIView):
    def post(self,request,pk,format=None):
        loan=get_object_or_404(Loan,pk=pk)
        if loan.is_approved and not loan.is_paid:
            serializer=LoanSerializer(loan)
            return Response(serializer.data,status.HTTP_200_OK)


