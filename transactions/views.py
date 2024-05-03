# In your views.py file
from django.http import Http404
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import *
from datetime import datetime,date
from .serializer import *
from rest_framework.views import APIView
from cws.models import StationSettings
from rest_framework import generics,permissions
from django.db.models import Max
from django.db.models import F, Sum,Max
from django.db.models import OuterRef, Subquery
 


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def process_transaction_data(request):
    print("this is a request: ", request.data)
    mutable_data = request.data.copy()

    print(mutable_data)

    data = dict(mutable_data)

    try:
        cws_code = data['cws_code']
        cherry_grade = data['cherry_grade'][1] if len(data['cherry_grade']) > 1 else None

        if cherry_grade is None:
            raise ValueError("Cherry grade should be at least 2 characters long.")

        # Fetch StationSettings based on cws and grade
        station_settings = StationSettings.objects.get(cws__cws_code=cws_code, grade=cherry_grade)
        print(station_settings)
        price = station_settings.price_per_kg
        acceptable_transport = station_settings.transport_limit

        data['price'] = price

        # Check if the provided transport is acceptable
        if 'transport' in data and data['transport'] > acceptable_transport:
            return Response({"error": f"Your transport is not acceptable. The acceptable transport limit is {acceptable_transport}"}, status=status.HTTP_400_BAD_REQUEST)

    except StationSettings.DoesNotExist:
        return Response({"error": f"StationSettings not found for cws code {cws_code} and grade {cherry_grade}"}, status=status.HTTP_404_NOT_FOUND)
    except ValueError as ve:
        return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": f"Error fetching price from StationSettings: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    try:
        purchase_date_str = data['purchase_date']
        purchase_date_obj = datetime.strptime(purchase_date_str, '%Y-%m-%d')

        last_two_digits_of_year = purchase_date_obj.strftime('%y')
        formatted_month = purchase_date_obj.strftime('%m')
        formatted_day = purchase_date_obj.strftime('%d')

        batch_no = f"{last_two_digits_of_year}{data['cws_code']}{formatted_month}{formatted_day}{data['cherry_grade']}"
        season = datetime.now().year
        

        # latest_grn_no = Transactions.objects.aggregate(Max('grn_no'))['grn_no__max']
        # print (int(latest_grn_no))
        # incremented_numeric_part = latest_grn_no + 1

        latest_grn_no = Transactions.objects.aggregate(Max('grn_no'))['grn_no__max']

        if latest_grn_no is not None:
            incremented_numeric_part = latest_grn_no + 1
        else:
            incremented_numeric_part = 1

        print(incremented_numeric_part)
        data['created_at'] = datetime.now().date()
        data['batch_no'] = batch_no
        data['season'] = season
        data['grn_no'] = incremented_numeric_part

        transaction = Transactions.objects.create(**data)
        return Response({"message": "Transaction data successfully processed.", "batch_no": batch_no, "season": season, "success": True}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": f"Error processing transaction data: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TransactionsEditAPIView(APIView):
   
    def get_object(self, pk):
        try:
            return Transactions.objects.get(pk=pk)
        except Transactions.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        transaction = self.get_object(pk)
        serializer = TransactionsSerializer(transaction)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        print(request.data)
        transaction = self.get_object(pk)
        serializer = TransactionsSerializer(transaction, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TransactionsListView(APIView):
    def get(self, request):
        transactions = Transactions.objects.all()
        serializer = TransactionsSerializer(transactions, many=True)
        return Response(serializer.data)
    
@api_view(['POST'])
def get_financial_report(request):
    print(request.data)
    chosen_date_str = request.data.get('date', '')
    chosen_date = datetime.strptime(chosen_date_str, '%Y-%m-%d').date()
    permission_classes = [permissions.IsAuthenticated]
    user = request.user

    if user.role == "cws_manager":
        # cws_code = request.data.get('cws_code', '')
        cws_code=user.cws_code

        if not cws_code:
            return Response({'error': 'cws_code is required for cws_manager.'}, status=status.HTTP_400_BAD_REQUEST)

        # Get the Transactions for the specified cws_code and chosen_date
        chosen_date_str = request.data.get('date', '')
        chosen_date = datetime.strptime(chosen_date_str, '%Y-%m-%d').date()

        transactions = Transactions.objects.filter(cws_code=cws_code, purchase_date=chosen_date).order_by('-id')
        serializer = TransactionsSerializer(transactions, many=True)

        return Response(serializer.data)
    
    # transactions = Transactions.objects.all().order_by('-purchase_date')
    transactions = Transactions.objects.filter(purchase_date=chosen_date).order_by('-id')
    serializer = TransactionsSerializer(transactions, many=True)

    return Response(serializer.data)

# Get Direct Purchase Report

@api_view(['POST'])
def get_dpr(request):
    start_date_str = request.data.get('start_date', '')
    end_date_str = request.data.get('end_date', '')

    try:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
    except ValueError:
        return Response({'error': 'Invalid date format. Please provide valid dates in the format YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)

    transactions = Transactions.objects.filter(purchase_date__range=[start_date, end_date]).order_by('-purchase_date')
    serializer = TransactionsSerializer(transactions, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def get_all_batch(request):
    permission_classes = [permissions.IsAuthenticated]
    user = request.user
    if(user):
        print("user found")
        
        if(user.cws_name):
            print(user.cws_name)
            cwsname=user.cws_name
            data = Transactions.get_total_kgs_by_batch_per_station(cwsname)
            # data = Transactions.get_total_kgs_by_batch()
    
    else:
        data = Transactions.get_total_kgs_by_batch()
    
    serializer = BatchTransactionsSerializer(data, many=True)

    return Response(serializer.data)



class ReceiveHarvestListCreateView(generics.ListCreateAPIView):
    # queryset = ReceiveHarvest.objects.all()
    serializer_class = RevceiveHarvestSerializer

    def get_queryset(self):
        # Filter only objects where status=0
        return ReceiveHarvest.objects.filter(status=0)

    def perform_create(self, serializer):
        serializer.is_valid(raise_exception=True)  # Validate the serializer
        serializer.validated_data['location_to'] = self.request.user.cws_name
        instance = serializer.save()
        Transactions.objects.filter(batch_no=instance.batch_no).update(is_received=1,status=1)
        

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # Validate the serializer
        self.perform_create(serializer)
        return Response({"success": True, "message": "Batch Received Successfully"},status=status.HTTP_201_CREATED)

class CreateInventory(generics.CreateAPIView):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError as validation_error:
            return Response(
                {"message": "Validation error", "errors": validation_error.detail, "success": False},
                status=status.HTTP_400_BAD_REQUEST
            )

        req_batch_no = request.data.get('process_name')
        Transactions.objects.filter(batch_no=req_batch_no).update(status=2)

        # Check if inventory with process_name already exists
        if Inventory.objects.filter(process_name=req_batch_no).exists():
            return Response(
                {"message": "Inventory with this process name already exists.", "success": False},
                status=status.HTTP_400_BAD_REQUEST
            )

        if self.request.user:
            if self.request.user.cws_name:
                serializer.validated_data['location_to'] = self.request.user.cws_name
                self.perform_create(serializer)
            else:
                return Response(
                    {"message": "Oops you are not logged in", "success": False},
                    status=status.HTTP_401_UNAUTHORIZED
                )

        ReceiveHarvest.objects.filter(batch_no=req_batch_no).update(status=1)

        return Response(
            {"message": "You have started the process successfully", "success": True},
            status=status.HTTP_201_CREATED
        )
    
class RetrieveProcessingData(APIView):
    def get(self, request, *args, **kwargs):
        try:
            receive_harvest_instances = ReceiveHarvest.objects.all()
            print(request.user)

            combined_data = []
            for receive_harvest_instance in receive_harvest_instances:
                try:
                    inventory_instance = Inventory.objects.get(process_name=receive_harvest_instance.batch_no, status=0,location_to=request.user)
                    serialized_data = CombinedDataSerializer(receive_harvest_instance).data
                    serialized_data['process_type'] = inventory_instance.process_type.outputs
                    serialized_data['schedule_date'] = inventory_instance.schedule_date
                    combined_data.append(serialized_data)
                except Inventory.DoesNotExist:
                    pass  # Handle the case where no matching Inventory record is found

            return Response(combined_data, status=status.HTTP_200_OK)

        except ReceiveHarvest.DoesNotExist:
            return Response({'detail': 'No Harvest in records found'}, status=status.HTTP_404_NOT_FOUND)
        
class RetrieveBaggedOffData(APIView):
    def get(self, request, *args, **kwargs):
        try:
            # Retrieve all records from ReceiveHarvest
            receive_harvest_instances = ReceiveHarvest.objects.all()

            # Join on batch_no with Inventory and filter by status=0
            print(request)
            combined_data = []
            for receive_harvest_instance in receive_harvest_instances:
                try:
                    inventory_instance = Inventory.objects.get(process_name=receive_harvest_instance.batch_no, status=1)
                    serialized_data = CombinedDataSerializer(receive_harvest_instance).data
                    serialized_data['process_type'] = inventory_instance.process_type.outputs
                    serialized_data['schedule_date'] = inventory_instance.schedule_date
                    combined_data.append(serialized_data)
                except Inventory.DoesNotExist:
                    pass  # Handle the case where no matching Inventory record is found

            return Response(combined_data, status=status.HTTP_200_OK)

        except ReceiveHarvest.DoesNotExist:
            return Response({'detail': 'No ReceiveHarvest records found'}, status=status.HTTP_404_NOT_FOUND)

class StockInventoryOutputsEditAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = StockInventoryOutputs.objects.all()
    serializer_class = StockInventoryOutputsSerializer
    lookup_field = 'pk'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)

        self.perform_update(serializer)

        return Response({"message": "Item updated", "success": True}, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Item deleted", "success": True}, status=status.HTTP_204_NO_CONTENT)


class StockInventoryOutputsCreateAPIView(generics.CreateAPIView):
    queryset = StockInventoryOutputs.objects.all()
    serializer_class = StockInventoryOutputsSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Perform additional logic if needed

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response({"message": "Item added", "success": True}, status=status.HTTP_201_CREATED, headers=headers)

    
class StockInventoryOutputsItemsListView(generics.ListAPIView):
    serializer_class = InventoryOutputItemsSerializer

    def get_queryset(self):
        process_name = self.kwargs['process_name']
        return StockInventoryOutputs.objects.filter(process_name=process_name)
    
class StockInventoryUpdateAPIView(APIView):
    def post(self, request, process_name,completed_date, format=None):
        try:
            inventory = Inventory.objects.filter(process_name=process_name)
            
            if not inventory.exists():
                return Response({"error": "Stock Inventory Output not found"}, status=status.HTTP_404_NOT_FOUND)
            
            # Update status for all instances
            inventory.update(status=1,completed_date=completed_date)

            return Response({"message": "Stock Inventory Outputs updated successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




# class BatchReportAPIView(generics.ListAPIView):
#     serializer_class = BatchReportSerializer

#     def get_queryset(self):
#         transactions = Transactions.objects.values(
#             'season', 'cws_name', 'batch_no', 'cherry_grade'
#         )

#         receive_harvest = ReceiveHarvest.objects.values(
#             'batch_no', 'received_cherry_kg', 'status'
#         )

#         inventory = Inventory.objects.values(
#             'process_name', 'process_type__grade_name', 'schedule_date', 'completed_date'
#         )

#         stock_inventory_outputs = StockInventoryOutputs.objects.values(
#             'process_name','process_type','out_turn'
#         ).annotate(
#             total_output_quantity=Sum('output_quantity'),
#             outturn=Max('out_turn')
#         )

#         queryset = transactions.annotate(
#             received_cherry_kg=Subquery(
#                 receive_harvest.filter(
#                     batch_no=OuterRef('batch_no')
#                 ).values('received_cherry_kg')[:1]
#             ),
#             status=Subquery(
#                 receive_harvest.filter(
#                     batch_no=OuterRef('batch_no')
#                 ).values('status')[:1]
#             ),
#             process_type=Subquery(
#                 inventory.filter(
#                     process_name=OuterRef('batch_no')
#                 ).values('process_type__grade_name')[:1]
#             ),
#             schedule_date=Subquery(
#                 inventory.filter(
#                     process_name=OuterRef('batch_no'),
#                     schedule_date__isnull=False 
#                 ).values('schedule_date')[:1]
#             ),
#             completed_date=Subquery(
#                 inventory.filter(
#                     process_name=OuterRef('batch_no')
#                 ).values('completed_date')[:1]
#             ),
#             total_output_quantity=Subquery(
#                 stock_inventory_outputs.filter(
#                     process_name=OuterRef('batch_no')
#                 ).values('total_output_quantity')[:1]
#             ),
#             out_turn=Subquery(
#                 stock_inventory_outputs.filter(
#                     process_name=OuterRef('batch_no')
#                 ).values('outturn')[:1]
#             )
#         ).exclude(schedule_date__isnull=True)

#         return queryset

class BatchReportAPIView(generics.ListAPIView):
    serializer_class = BatchReportSerializer
    # print(request)

    def get_queryset(self):
        transactions = Transactions.objects.values(
            'season', 'cws_name', 'batch_no', 'cherry_grade'
        )

        receive_harvest = ReceiveHarvest.objects.values(
            'batch_no', 'received_cherry_kg', 'status'
        )

        inventory = Inventory.objects.values(
            'process_name', 'process_type__grade_name', 'schedule_date', 'completed_date'
        )

        stock_inventory_outputs = StockInventoryOutputs.objects.values(
            'process_name','process_type','out_turn'
        ).annotate(
            total_output_quantity=Sum('output_quantity'),
            outturn=Max('out_turn')
        )

        queryset = transactions.annotate(
            received_cherry_kg=Subquery(
                receive_harvest.filter(
                    batch_no=OuterRef('batch_no')
                ).values('received_cherry_kg')[:1]
            ),
            status=Subquery(
                receive_harvest.filter(
                    batch_no=OuterRef('batch_no')
                ).values('status')[:1]
            ),
            process_type=Subquery(
                inventory.filter(
                    process_name=OuterRef('batch_no')
                ).values('process_type__grade_name')[:1]
            ),
            schedule_date=Subquery(
                inventory.filter(
                    process_name=OuterRef('batch_no'),
                    schedule_date__isnull=False 
                ).values('schedule_date')[:1]
            ),
            completed_date=Subquery(
                inventory.filter(
                    process_name=OuterRef('batch_no')
                ).values('completed_date')[:1]
            ),
            total_output_quantity=Subquery(
                stock_inventory_outputs.filter(
                    process_name=OuterRef('batch_no')
                ).values('total_output_quantity')[:1]
            ),
            out_turn=Subquery(
                stock_inventory_outputs.filter(
                    process_name=OuterRef('batch_no')
                ).values('outturn')[:1]
            )
        ).exclude(schedule_date__isnull=True).order_by(F('completed_date').desc())

        return queryset



class AllBatchReportAPIView(generics.ListAPIView):
    serializer_class = BatchReportSerializer

    def get_queryset(self):
        transactions = Transactions.objects.values(
            'season', 'cws_name', 'batch_no', 'cherry_grade'
        )

        receive_harvest = ReceiveHarvest.objects.values(
            'batch_no', 'received_cherry_kg', 'status'
        )

        inventory = Inventory.objects.values(
            'process_name', 'process_type__grade_name', 'schedule_date', 'completed_date'
        )

        stock_inventory_outputs = StockInventoryOutputs.objects.values(
            'process_name','process_type','out_turn'
        ).annotate(
            total_output_quantity=Sum('output_quantity'),
            outturn=Max('out_turn')
        )

        queryset = transactions.annotate(
            received_cherry_kg=Subquery(
                receive_harvest.filter(
                    batch_no=OuterRef('batch_no')
                ).values('received_cherry_kg')[:1]
            ),
            status=Subquery(
                receive_harvest.filter(
                    batch_no=OuterRef('batch_no')
                ).values('status')[:1]
            ),
            process_type=Subquery(
                inventory.filter(
                    process_name=OuterRef('batch_no')
                ).values('process_type__grade_name')[:1]
            ),
            schedule_date=Subquery(
                inventory.filter(
                    process_name=OuterRef('batch_no'),
                    schedule_date__isnull=False 
                ).values('schedule_date')[:1]
            ),
            completed_date=Subquery(
                inventory.filter(
                    process_name=OuterRef('batch_no')
                ).values('completed_date')[:1]
            ),
            total_output_quantity=Subquery(
                stock_inventory_outputs.filter(
                    process_name=OuterRef('batch_no')
                ).values('total_output_quantity')[:1]
            ),
            out_turn=Subquery(
                stock_inventory_outputs.filter(
                    process_name=OuterRef('batch_no')
                ).values('outturn')[:1]
            )
        ).exclude(schedule_date__isnull=True).order_by(F('completed_date').desc())

        return queryset
