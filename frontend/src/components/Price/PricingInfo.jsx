import React, { useState } from 'react';
// import './reports.css';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';
import { Edit, Edit2 } from 'lucide-react';


const PricingInfo = ({token,cwsname,cwscode,cws}) => {


    const getFirstDayOfMonth = () => {
        const now = new Date();
        const startdateofmonth= new Date(now.getFullYear(), now.getMonth(), 1);
        return startdateofmonth.toISOString().split('T')[0];
        // return new Date(now.getFullYear(), now.getMonth(), 1);
      };
    
      // Function to get the last day of the current month
      const getLastDayOfMonth = () => {
        const now = new Date();
        const enddateofmonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return enddateofmonth.toISOString().split('T')[0];
      };


  const [startdate,setStartdate]=useState(getFirstDayOfMonth());
  const [enddate,setEnddate]=useState(getLastDayOfMonth());
  const [customers, setCustomers] = useState([]);
  const [batch,setBatch]=useState([]);
  const [settings,setSettings]=useState([]);
  const [loading, setLoading] = useState(false); 
  const [filters, setFilters] = useState(null);
  const [exportData, setExportData] = useState(null);
  const [dailytotal,setDailytotal]=useState();
  const [totalcherrya,setTotalcherrya]=useState();
  const [totalcherryb,setTotalcherryb]=useState();

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
        <div className="flex justify-content-around">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
            <span className="p-input-icon-left">
                {/* <i className="pi pi-search" /> */}
                <InputText style={{width:'5rem'}} value={globalFilterValue} onChange={onGlobalFilterChange} className='w-5' placeholder="Search" />
            </span>
        </div>
    );
};

  const header = renderHeader();

  const mapApiResponseToCustomers = (data) => {
    console.log(data);
    const mappedData = data.map((item) => {
        console.log(item.cws_name);
        // ,'cherry_grade','purchase_date'

        return {
            cws_name: item.cws_name,
            price_per_kg: item.price_per_kg,
            total_kgs: item.total_kgs,
            transport_limit:item.transport_limit,
            grade:item.grade,

        };
    });

    return mappedData;
};


  const generateReport = async () => {
    console.log('Generate report for date:', startdate);

    if (startdate && enddate) {
      const formattedDate = startdate;
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`
          },
        redirect: 'follow'
      };

      try {
        setLoading(true);

        const response =await fetch("http://127.0.0.1:8000/api/station-settings/", requestOptions)
        const data = await response.json();

        console.log(data);

        const mappedData = mapApiResponseToCustomers(data);
        setSettings(mappedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching batch:', error);
        setLoading(false);
      }
    }
  };

  React.useEffect(() => {
    generateReport();
  },[]);

  function handleReceive(batch_no,p_date,grade){
        console.log(batch_no);
        console.log(p_date);
        console.log(grade)
  }
  const renderReceiveButton = (rowData) => {
    return <div>
      {/* <Link to={{
        pathname: "/receive-harvest-form",
        // state: { batch_no:rowData.batch_no, purchase_date:rowData.purchase_date, cherry_grade: rowData.cherry_grade,cws,cwsname,cwscode,token}
        state: {cws,cwsname,cwscode,token}
      }}> */}
      <button className='bg-teal-500 text-white p-2 rounded-md' 
    //   onClick={() => handleReceive(rowData.batch_no,rowData.purchase_date,rowData.cherry_grade)}
      >
        {/* <Edit/> */}
        <Edit2/>
      </button>
    {/* </Link> */}
    </div>
    
    
    
  };

  return (
    <div>
      <div className='text-teal-600 text-pretty font-bold text-2xl'>PRICING INFORMATION</div>
      
      <div className="card">
      <div className="flex justify-content-end m-3">
                
            </div>
            <DataTable
                value={settings}
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
                    field="cws_name"
                    sortable
                    header="CWS Name"
                    filter
                    filterPlaceholder="Search by CWS Name"
                    style={{ minWidth: '12rem' }}
                />
                <Column
                    field="price_per_kg"
                    sortable
                    header="Price Per Kg"
                    filter
                    filterPlaceholder="Search by Transport Limit"
                    style={{ minWidth: '12rem' }}
                />
                <Column
                    field="transport_limit"
                    sortable
                    header="Transport Limit"
                    filter
                    filterPlaceholder="Search by Transport Limit"
                    style={{ minWidth: '12rem' }}
                />
                <Column
                    field="grade"
                    sortable
                    header="Grade"
                    style={{ minWidth: '10rem' }}
                />
                {/* <Column
                    header="Actions"
                    style={{minWidth:'10rem'}}
                    body={renderReceiveButton}
                
                /> */}
                </DataTable>
        </div>
    </div>

  );
};

export default PricingInfo;
