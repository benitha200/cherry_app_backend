import React, { useState } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';


const DailyPurchaseValidationReport = ({token,cwsname,cwscode,cws}) => {


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
  const [batch,setBatch]=useState([]);
  const [loading, setLoading] = useState(false); 
  const [filters, setFilters] = useState(null);


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

const getSeverity = (status) => {
    switch (status) {
        case 0:
            return 'Not In Progress';

        case 1:
            return 'In Progress';
        default:
            return null;
    }
};

const statusBodyTemplate = (status) => {
    return <Tag value={status} severity={getSeverity(status)}></Tag>;
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
        console.log(item.total_kgs);
        // ,'cherry_grade','purchase_date'

        return {
            purchase_date: item.purchase_date, 
            cherry_grade:item.cherry_grade,
            total_kgs:item.total_kgs,
            total_amount:item.total_amount,
            dpv_cherry_kgs:item.dpv_cherry_kgs,
            dpv_amount:item.dpv_amount,

        };
    });

    return mappedData;
};


function get_data(){
    const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch("http://127.0.0.1:8000/api/gettotalpurchasebydateandgrade/", requestOptions)
        .then((response) => response.json())
        .then((result) =>{ 
            console.log(result)
            const mappedData = mapApiResponseToCustomers(result);
            setBatch(mappedData);
        })
        .catch((error) => console.error(error));
}

  React.useEffect(() => {
    get_data();
  },[]);


  return (
    <div>
      <div className='text-teal-600 text-pretty font-bold text-2xl'>Daily Purchase Validation</div>
      
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
                    globalFilterFields={['batch_no', 'cws_name', 'total_kgs','status']}
                    header={header}
                    emptyMessage="No Transactions found ."
                    rowClassName={(data) => ({
                        'bg-red-50 text-red-950': data.total_kgs < data.dpv_cherry_kgs || data.total_kgs > data.dpv_cherry_kgs,
                        'bg-green-50 text-green-950': data.total_kgs === data.dpv_cherry_kgs,
                    })}
                >

                <Column
                    field="purchase_date"
                    sortable
                    header="Process Name"
                    filter
                    filterPlaceholder="Search by CWS Name"
                    style={{ minWidth: '12rem' }}
                />
                <Column
                    field="cherry_grade"
                    sortable
                    header="Cherry Grade"
                    filter
                    filterPlaceholder="search by cherry Grade"
                    style={{ minWidth: '10rem' }}
                />
                <Column
                    field="total_kgs"
                    sortable
                    header="Total KGS"
                    filter
                    filterPlaceholder='Search by received kgs'
                    style={{ minWidth: '10rem' }}
                />
                <Column
                    field="dpv_cherry_kgs"
                    sortable
                    header="dpv_cherry_kgs"
                    filter
                    filterPlaceholder="search by cherry Grade"
                    style={{ minWidth: '10rem' }}
                />
                <Column
                    field="dpv_amount"
                    sortable
                    header="dpv_amount"
                    filter
                    filterPlaceholder='Search by received kgs'
                    style={{ minWidth: '10rem' }}
                />
                <Column
                    field="total_amount"
                    sortable
                    header="total_amount"
                    style={{ minWidth: '10rem' }}
                />
                </DataTable>
        </div>
    </div>

  );
};

export default DailyPurchaseValidationReport;
