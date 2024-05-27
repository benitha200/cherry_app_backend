import React, { useState } from 'react';
// import './reports.css';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';


const Loans = ({token,cwsname,cwscode,cws}) => {


  const [customers, setCustomers] = useState([]);
  const [batch,setBatch]=useState([]);
  const [loading, setLoading] = useState(false); 
  const [filters, setFilters] = useState(null);
  const [exportData, setExportData] = useState(null);



  const exportCSV = () => {
      setExportData(customers);
  };

  const csvHeaders = [
    { label: 'CWS Name', key: 'cws_name' },
    { label: 'Farmer Name', key: 'farmer_name' },
    { label: 'Farmer Code', key: 'farmer_code' },
    { label: 'Purchase Date', key: 'purchase_date' },
    { label: 'Has Card', key: 'has_card' },
    { label: 'Cherry Grade', key: 'cherry_grade' },
    { label: 'Cherry Kg', key: 'cherry_kg' },
    { label: 'Price', key: 'price' },
    { label: 'Transport', key: 'transport' },
    { label: 'GRN No', key: 'grn_no' },
    { label: 'Batch No', key: 'batch_no' },
    
    
  ];


  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
};

  
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const initFilters = () => {
    setFilters({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    setGlobalFilterValue('');
};
  const clearFilter = () => {
    initFilters();
};

  const renderHeader = () => {
    return (
        <div className="flex justify-content-between">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
            <span className="p-input-icon-left">
                {/* <i className="pi pi-search" /> */}
                <InputText style={{width:'5rem'}} value={globalFilterValue} onChange={onGlobalFilterChange} className='w-full' placeholder="Search" />
            </span>
        </div>
    );
};

  const header = renderHeader();

  const mapApiResponseToCustomers = (data) => {
    console.log(data);
    const mappedData = data.map((item) => {
        // console.log(item.total_kgs);
        // ,'cherry_grade','purchase_date'

        return {
            farmer_code: item.farmer_code,
            farmer_name: item.farmer_name,
            total_cherry_kg: item.total_cherry_kg,
            total_amount:item.total_amount,
            loan_limit:item.loan_limit,

        };
    });

    return mappedData;
};

function generateReport(){
    const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch("http://127.0.0.1:8000/api/getloandata/", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            const mappedData=mapApiResponseToCustomers(result)
            setBatch(mappedData)
            setLoading(false)
            console.log(result)})
        .catch((error) => console.error(error));
}

  React.useEffect(() => {
    generateReport();
  },[]);


  const renderReceiveButton = (rowData) => {
    // Log the state values before passing them to the Link
    console.log("State values before Link:", {
      batch_no: rowData.batch_no,
      purchase_date: rowData.purchase_date,
      cherry_grade: rowData.cherry_grade,
      cws,
      cwsname,
      cwscode,
      token,
    });
  
    return (
      <div>
        {(rowData.loan_limit >100000)?(
        <Link
            to={{
                pathname: "/request-loan-form",
                search: `?farmer_code=${encodeURIComponent(rowData.farmer_code)}&token=${encodeURIComponent(token)}&farmer_name=${encodeURIComponent(rowData.farmer_name)}
                                    &loan_limit=${encodeURIComponent(rowData.loan_limit)}`,
               
            }}
            >
          <button className='bg-cyan-500 text-white p-2 rounded-md'>
            Request Loan
          </button>
        </Link>):
        (
            <p className='bg-slate-200 p-2 text-slate-600'>Not Allowed</p> 
        )}
  
        {/* <button
          className='bg-gray-500 text-white p-2 rounded-md ml-2'
          // onClick={() => handleReceive(rowData.batch_no,rowData.purchase_date,rowData.cherry_grade)}
        >
          Contributors
        </button> */}
      </div>
    );
  };
  


  return (
    <div>
      <div className='text-teal-600 text-pretty font-bold text-2xl'>LOAN INFO</div>

      
      <div className="card">
      <div className="flex justify-content-end m-3">
                
            </div>
            <DataTable
                value={batch}
                paginator
                showGridlines
                rows={10}
                dataKey="batch_no"
                filters={filters}
                globalFilterFields={['batch_no', 'cws_name', 'total_kgs']}
                header={header}
                emptyMessage="No Transactions found ."
                >
                <Column
                    field="farmer_code"
                    sortable
                    header="Farmer Code"
                    filter
                    filterPlaceholder="Search by Farmer Code"
                    style={{ minWidth: '12rem' }}
                />
                <Column
                    field="farmer_name"
                    sortable
                    header="Farmer Name"
                    filter
                    filterPlaceholder="Search by Farmer Name"
                    style={{ minWidth: '12rem' }}
                />
                <Column
                    field="total_cherry_kg"
                    sortable
                    header="Total Cherry KGS"
                    style={{ minWidth: '10rem' }}
                />
                <Column
                    field="total_amount"
                    sortable
                    header="Total Amount"
                    style={{ minWidth: '10rem' }}
                />
                <Column
                    field="loan_limit"
                    sortable
                    header="Loan Limit"
                    style={{ minWidth: '10rem' }}
                />
                
                <Column
                    header="Eligibility status"
                    body={(rowData) => rowData.loan_limit >100000 ? 
                    <p className='bg-green-400 p-2 text-slate-50'>Eligible</p> 
                    : 
                    <p className='bg-slate-100 p-2 text-slate-900'>Not Eligible</p> 
                    
                }
                    />
                <Column
                    header="Action"
                    style={{minWidth:'10rem'}}
                    body={renderReceiveButton}
                
                />
                </DataTable>
        </div>
    </div>

  );
};

export default Loans;
