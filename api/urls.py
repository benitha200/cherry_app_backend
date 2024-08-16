from django.urls import path,include
from . import views
from cws.views import *
from farmers.views import FileUploadAPIView,FileUploadFarmersAndFarmAPIView
from transactions.views import *
from .views import CustomTokenObtainPairView,CustomUserListView
from main.views import register_user_api,LogoutView
from loan.views import *

# urlpatterns = [
#     path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
# ]



urlpatterns=[
    # path('farmers/',views.FarmerListView.as_view(),name="get_farmers"),
    path('total-cherry-purchased/', TotalCherryPurchasedView.as_view(), name='total-cherry-purchased'),
    path('farmers/',views.FarmerAndFarmListView.as_view(),name="get_farmers"),
    path('allfarmers/',views.AllFarmerListView.as_view(),name="get_farm_and_farmers"),
    path('farmers/create/',views.FarmerCreateView.as_view(),name="create_farmer"),
    path('cws/',CwsListView.as_view(),name="get-cws"),
    path('cws/create/',CwsCreateView.as_view(),name="create-cws"),
    path('station-settings/<str:cws_code>/', StationSettingsAPIView.as_view(), name='station-settings-api'),
    path('station-settings/',StationSettingsAPIViewList.as_view(),name="station-settings"),
    path('cherry-grades/',CherryGradeAPIView.as_view(),name="get-cws"),
    # path('uploadfarmers/', FileUploadAPIView.as_view(), name='file-upload-api'),
    path('uploadfarmers/', FileUploadFarmersAndFarmAPIView.as_view(), name='file-upload-api'),
    path('processtransaction/', process_transaction_data, name='process-transaction'),
    path('edittransaction/<str:pk>/',TransactionsEditAPIView.as_view(),name="edit transaction"),
    path('gettransactions/', TransactionsListView.as_view(), name='transactions-list'),
    path('getalltransactions/', get_all_transactions, name='all-transactions-list'),
    path('getrejectedtransactions/', get_rejected_transactions, name='get-rejeccted-transactions'),
    path('getpendingtransactions/', get_pending_transactions, name='get-rejected-transactions'),

    path('getfinancialreport/', get_financial_report, name='get-financialreport'),
    path('approvetransactions/',approve_transactions,name="approve-transactions"),
    path('gettotalpurchasebydateandgrade/', total_purchase_by_date_and_grade, name='get-financialreport'),
    path('getdpr/',get_dpr,name="get-dpr"),
    path('batchreport/',BatchReportAPIView.as_view(),name="get-batchreport"),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('registeruser/', register_user_api, name='register_user'),
    path('getusers/',CustomUserListView.as_view(),name="get-users"),
    path('getallbatch/',get_all_batch,name='get-batch'),
    path('getallbatchallstations/',get_all_batch_all_stations,name='get-batch'),
    path('receiveharvest/create',ReceiveHarvestListCreateView.as_view(),name="receive-harvest"),
    path('receivedharvest/',ReceiveHarvestListCreateView.as_view(),name="received-harvest"),
    path('cherrygradeoutput/', CherryGradeOutputRetrieveAPIView.as_view()),
    path('inventoryoutput/', InventoryOutputAPIView.as_view()),
    path('createinventory/',CreateInventory.as_view(),name="create-inventory"),
    path('retrieveprocessing/',RetrieveProcessingData.as_view()),
    path('retrieveprocessingallstations/',RetrieveProcessingDataAllStations.as_view()),
    path('retrievebaggedoffdata/',RetrieveBaggedOffData.as_view()),
    path('stockinventoryoutput/',StockInventoryOutputsCreateAPIView.as_view()),
    path('stockinventoryoutputedit/<int:pk>/',StockInventoryOutputsEditAPIView.as_view(),name='StockInventoryOutputsEditAPIView'),
    path('inventoryitems/<str:process_name>/',StockInventoryOutputsItemsListView.as_view()),
    path('stockinventoryupdate/<str:process_name>/<str:completed_date>/<str:updated_by>/',StockInventoryUpdateAPIView.as_view()),
    path('updatepaidstatus/<int:pk>/', UpdatePaidStatusView.as_view(), name='update-paid-status'),

    
    path('getloandata/', get_loan_data, name='get-loandata'),
    path('requetloan/', RequestLoan.as_view(), name='request-loan'),
    path('getloanrequests/<str:status>/', GetLoanRequests.as_view(), name='get-request-loan'),
    path('getloan/<int:pk>/', GetLoan.as_view(), name='get-request-loan'),
    path('approveloan/<int:pk>/', ApproveLoanView.as_view(), name='approve-loan'),
    
    path('loan-installments/', LoanInstallmentCreateView.as_view(), name='loan-installment-create'),
    path('loan-installments/<int:pk>/', LoanInstallmentRetrieveView.as_view(), name='loan-installment-retrieve'),
    

]