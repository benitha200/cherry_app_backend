import React, { useEffect, useState } from 'react';
// import './reports.css';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';

const LoanRequests = ({token,cwsname,cwscode,cws}) => {

  const [customers, setCustomers] = useState([]);
  const [batch,setBatch]=useState([]);
  const [loading, setLoading] = useState(false); 
  const [filters, setFilters] = useState(null);
  const [exportData, setExportData] = useState(null);
  const [status, setStatus] = useState("all");

  const [selectedOption,setSelectedOption]=useState("all")
  const options=[
    {name:"All",code:"all"},
    {name:"Pending",code:"pending"},
    {name:"Approved",code:"approved"}
    
  ]
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
        return {
            id:item.id,
            farmer_code: item.farmer_code,
            farmer_name: item.farmer_name,
            loan_limit:item.loan_limit,
            loan_amount:item.loan_amount,
            is_approved:item.is_approved

        };
    });

    return mappedData;
};

function generateReport(status){
    const requestOptions = {
        method: "POST",
        redirect: "follow"
      };
      
      fetch(`http://127.0.0.1:8000/api/getloanrequests/${status}/`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
                    const mappedData=mapApiResponseToCustomers(result)
                    setBatch(mappedData)
                    setLoading(false)
                    console.log(result)})
        .catch((error) => console.error(error));
}

    useEffect(() => {
    generateReport();
  },[]);

  function handleOptionChange(e){
    setSelectedOption(e.target.value.code)
    console.log(e.target.value.code)
    generateReport(e.target.value.code)
  }

  function handleApprove(id){
    const requestOptions = {
      method: "POST",
      redirect: "follow"
    };
    
    fetch(`http://127.0.0.1:8000/api/approveloan/${id}/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        
        console.log(result)
        if(result.id){
          generateReport();
        }
      })
      .catch((error) => console.error(error));
  }


  const renderReceiveButton = (rowData) => {
    console.log(rowData.id)
    

    return (
      <div>
      
          <button className='bg-cyan-500 text-white p-2 rounded-md' onClick={()=>handleApprove(rowData.id)}>
            Approve
          </button>
        
      </div>
    );
  };
  


  return (
    <div>
      <div className='text-teal-600 text-pretty font-bold text-2xl'>LOAN INFO</div>
      <div className=' flex justify-left mt-4 mb-4'>
        <Dropdown value={selectedOption} onChange={handleOptionChange} options={options} optionLabel='name'
        placeholder='All' className='w-full md:w-14rem justify-center'/>
      </div>
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
                    field="loan_limit"
                    sortable
                    header="Loan Limit"
                    style={{ minWidth: '10rem' }}
                />
                <Column
                    field="loan_amount"
                    sortable
                    header="Loan Amount"
                    style={{ minWidth: '10rem' }}
                />
                
                <Column
                    header="Payment status"
                    body={(rowData) => rowData.loan_limit <100000 ? 
                    <p className='bg-green-400 p-2 text-slate-50'>Paid</p> 
                    : 
                    <p className='bg-slate-100 p-2 text-slate-900'>Pending</p> 
                    
                }
                    />
                    <Column
                    header="Approval status"
                    body={(rowData) => rowData.is_approved? 
                    <p className='bg-green-200 p-2 text-slate-900'>Approved</p> 
                    : 
                    <p className='bg-slate-100 p-2 text-slate-900'>Pending</p> 
                    
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

export default LoanRequests;
