import React, { useState } from 'react';
// import './reports.css';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';


const ReceivedHarvest = ({token,cwsname,cwscode,cws}) => {


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
            batch_no: item.batch_no,
            cherry_grade:item.cherry_grade,
            harvest_cherry_kg:item.harvest_cherry_kg,
            received_cherry_kg:item.received_cherry_kg,
            location_to:item.location_to,
            status:item.status,
            batch_creation_date:item.batch_creation_date,

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

        const response =await fetch("http://127.0.0.1:8000/api/receivedharvest/", requestOptions)
        const data = await response.json();

        console.log(data);

        const mappedData = mapApiResponseToCustomers(data);
        setBatch(mappedData);
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

    if(rowData.status){
        return (
            <div>
              {/* <Link
                to={{
                  pathname: "/start-processing-form",
                  search: `?cwsname=${cwsname}&token=${token}&batch_no=${rowData.batch_no}
                              &purchase_date=${rowData.purchase_date}&cherry_grade=${rowData.cherry_grade}
                              &cwsname=${cwsname}&cwscode=${cwscode}&harvest_kgs=${rowData.total_kgs}`,
                  state: {
                    batch_no: rowData.batch_no,
                    purchase_date: rowData.purchase_date,
                    cherry_grade: rowData.cherry_grade,
                    harvest_kgs: rowData.total_kgs,
                    cws,
                    cwsname,
                    cwscode,
                    token,
                  },
                }}
              >
                <button className='bg-green-500 text-white p-2 rounded-md w-8'>
                  Bag Off
                </button>
              </Link> */}
               <button className='bg-green-500 text-white p-2 rounded-md w-8' title='go ahead and bag off if it is done'>
                  Started
                </button>
        
            </div>
          );
    }
    else{
       return (
      <div>
        <Link
          to={{
            pathname: "/start-processing-form",
            search: `?cwsname=${cwsname}&token=${token}&batch_no=${rowData.batch_no}
                        &purchase_date=${rowData.purchase_date}&cherry_grade=${rowData.cherry_grade}
                        &cwsname=${cwsname}&cwscode=${cwscode}&harvest_kgs=${rowData.total_kgs}`,
            state: {
              batch_no: rowData.batch_no,
              purchase_date: rowData.purchase_date,
              cherry_grade: rowData.cherry_grade,
              harvest_kgs: rowData.total_kgs,
              cws,
              cwsname,
              cwscode,
              token,
            },
          }}
        >
          <button className='bg-cyan-500 text-white p-2 rounded-md w-8'>
            Start
          </button>
        </Link>
  
        {/* <button
          className='bg-teal-500 text-white p-2 rounded-md ml-2'
          // onClick={() => handleReceive(rowData.batch_no,rowData.purchase_date,rowData.cherry_grade)}
        >
          Start
        </button> */}
      </div>
    ); 
    }
  
    
  };
  


  return (
    <div>
      <div className='text-teal-600 text-pretty font-bold text-2xl'>START PROCESSING</div>
      
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
                >   
                <Column
                    field="batch_no"
                    sortable
                    header="Batch No"
                    filter
                    filterPlaceholder="Search by CWS Name"
                    style={{ minWidth: '12rem' }}
                />
                <Column
                    field="location_to"
                    sortable
                    header="Station Name"
                    filter
                    filterPlaceholder="Search by Farmer Name"
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
                    field="harvest_cherry_kg"
                    sortable
                    header="Harvest KGS"
                    filter
                    filterPlaceholder='search by harvested KGS'
                    style={{ minWidth: '10rem' }}
                />
                <Column
                    field="received_cherry_kg"
                    sortable
                    header="Received KGS"
                    filter
                    filterPlaceholder='Search by received kgs'
                    style={{ minWidth: '10rem' }}
                />
                <Column
                    field="location_to"
                    sortable
                    header="Location"
                    style={{ minWidth: '10rem' }}
                />
                {/*<Column
                field="status"
                header="Status"
                sortable
                style={{minWidth:'10rem'}}
                />*/}
                <Column
                    header="Start Processing"
                    style={{minWidth:'10rem'}}
                    body={renderReceiveButton}
                    // sortable
                />
                </DataTable>
        </div>
    </div>

  );
};

export default ReceivedHarvest;
