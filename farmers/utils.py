import pandas as pd
from django.db import IntegrityError
from .models import Farmer,FarmerAndFarmDetails

def process_and_store_file(file):
    # Check if the file has a valid extension
    allowed_extensions = {'csv', 'xlsx'}
    file_extension = file.name.rsplit('.', 1)[1].lower()

    if file_extension not in allowed_extensions:
        raise ValueError("Invalid file extension. Please provide a CSV or Excel (xlsx) file.")

    # Read the file based on its extension
    if file_extension == 'csv':
        df = pd.read_csv(file)
    elif file_extension == 'xlsx':
        df = pd.read_excel(file, engine='openpyxl')

    # Validate columns in the file
    required_columns = ['cws', 'farmer_code', 'farmer_name', 'gender', 'age', 'phone_number', 'address', 'national_id', 'village', 'location']
    if not set(required_columns).issubset(df.columns):
        raise ValueError("Missing required columns in the file. Please ensure all required columns are present.")

    # Iterate through rows and save data to the Farmer model
    for index, row in df.iterrows():
        # Check for NaN values in any column
        if row.isnull().any():
            continue  # Skip insertion for rows with NaN values

        farmer_data = {
            'cws': row['cws'],
            'farmer_code': row['farmer_code'],
            'farmer_name': row['farmer_name'],
            'gender': row['gender'],
            'age': row['age'],
            'phone_number': row['phone_number'],
            'address': row['address'],
            'national_id': row['national_id'],
            'village': row['village'],
            'location': row['location'],
        }

        Farmer.objects.create(**farmer_data)

    return "Data successfully imported into the Farmer table."

# def process_and_store_farmers_file(file):
#     # Check if the file has a valid extension
#     allowed_extensions = {'csv', 'xlsx'}
#     file_extension = file.name.rsplit('.', 1)[1].lower()

#     if file_extension not in allowed_extensions:
#         raise ValueError("Invalid file extension. Please provide a CSV or Excel (xlsx) file.")

#     # Read the file based on its extension
#     if file_extension == 'csv':
#         df = pd.read_csv(file)
#     elif file_extension == 'xlsx':
#         df = pd.read_excel(file, engine='openpyxl')

#     # Validate columns in the file
#     required_columns = ['cws_name','cws_code', 'farmer_code', 'farmer_name', 'gender', 'dob', 'phone_number','national_id','location','is_certified','polygon','plot_name']
#     if not set(required_columns).issubset(df.columns):
#         raise ValueError("Missing required columns in the file. Please ensure all required columns are present.")

#     # Iterate through rows and save data to the Farmer model
#     for index, row in df.iterrows():
#         # Check for NaN values in any column
#         if row.isnull().any():
#             continue  # Skip insertion for rows with NaN values

#         farmer_data = {
#             'cws_name': row['cws_name'],
#             'cws_code': row['cws_code'],
#             'farmer_code': row['farmer_code'],
#             'farmer_name': row['farmer_name'],
#             'gender': row['gender'],
#             'dob': row['dob'],
#             'phone_number': row['phone_number'],
#             'national_id': row['national_id'],
#             'location': row['location'],
#             'is_certified': row['is_certified'],
#             'location': row['location'],
#             'polygon':row['plot_name'],
#             'plot_name':row['plot_name'],
#         }

#         FarmerAndFarmDetails.objects.create(**farmer_data)

#     return {"message":"Data successfully imported into the Farmer table."}

def process_and_store_farmers_file(file):
    # Check if the file has a valid extension
    allowed_extensions = {'csv', 'xlsx'}
    file_extension = file.name.rsplit('.', 1)[1].lower()

    if file_extension not in allowed_extensions:
        raise ValueError("Invalid file extension. Please provide a CSV or Excel (xlsx) file.")

    # Read the file based on its extension
    if file_extension == 'csv':
        df = pd.read_csv(file)
    elif file_extension == 'xlsx':
        df = pd.read_excel(file, engine='openpyxl')

    # Validate columns in the file
    required_columns = ['cws_name', 'cws_code', 'farmer_code', 'farmer_name', 'gender', 'dob', 'phone_number', 'national_id', 'location', 'is_certified', 'polygon', 'plot_name']
    if not set(required_columns).issubset(df.columns):
        raise ValueError("Missing required columns in the file. Please ensure all required columns are present.")

    # Initialize a counter for skipped duplicates
    skipped_duplicates = 0

    # Iterate through rows and save data to the Farmer model
    for index, row in df.iterrows():
        # Check for NaN values in any column
        if row.isnull().any():
            continue  # Skip insertion for rows with NaN values

        farmer_data = {
            'cws_name': row['cws_name'],
            'cws_code': row['cws_code'],
            'farmer_code': row['farmer_code'],
            'farmer_name': row['farmer_name'],
            'gender': row['gender'],
            'dob': row['dob'],
            'phone_number': row['phone_number'],
            'national_id': row['national_id'],
            'location': row['location'],
            'is_certified': row['is_certified'],
            'polygon': row['plot_name'],
            'plot_name': row['plot_name'],
        }

        try:
            # Try to create a new record or update an existing one
            FarmerAndFarmDetails.objects.update_or_create(farmer_code=row['farmer_code'], defaults=farmer_data)
        except IntegrityError:
            # Handle IntegrityError, indicating a duplicate entry
            skipped_duplicates += 1
            continue

    return {"message": f"Data successfully imported into the Farmer table. Skipped {skipped_duplicates} duplicates."}