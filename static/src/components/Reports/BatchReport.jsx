import React, { useState } from 'react';
import './reports.css';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';
import { v4 as uuidv4 } from 'uuid';


const BatchReport = () => {


    const getFirstDayOfMonth = () => {
        const now = new Date();
        const startdateofmonth= new Date(now.getFullYear(), now.getMonth(), 1);
        return startdateofmonth.toISOString().split('T')[0];
      };
    
      // Function to get the last day of the current month
      const getLastDayOfMonth = () => {
        const now = new Date();
        const enddateofmonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return enddateofmonth.toISOString().split('T')[0];
      };
      const generateRandomId = () => uuidv4();





  const [startdate,setStartdate]=useState(getFirstDayOfMonth());
  const [enddate,setEnddate]=useState(getLastDayOfMonth());
  const [customers, setCustomers] = useState([]);
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
    { label: 'Crop Year', key: 'season' },
    { label: 'CWS Name', key: 'cws_name' },
    { label: 'Cherry Grade', key: 'cherry_grade' },
    { label: 'Start Date', key: 'schedule_date' },
    { label: 'Completed Date', key: 'completed_date' },
    { label: 'Total Cherry KG', key: 'received_cherry_kg' },
    { label: 'Output Cherry KG', key: 'received_cherry_kg' },
    { label: 'Status', key: 'status' },
    { label: 'Process Type', key: 'process_type' },
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

  const renderOutTurn = (rowData) => {
    return rowData.out_turn ? `${rowData.out_turn}%` : '_%';
  };


  const renderHeader = () => {
    return (
        <div className="flex justify-content-between">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
            <span className="p-input-icon-left">
                {/* <i className="pi pi-search" /> */}
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
            </span>
        </div>
    );
};

  const header = renderHeader();

  const mapApiResponseToCustomers = (data) => {
    console.log(data);
    let overallTotal = 0;
    let cherryA = 0;
    let cherryB = 0;
    let grade = "";

    const mappedData = data.map((item) => {

        return {
            batch_no: item.batch_no,
            season: item.season,
            cws_name: item.cws_name,
            cherry_grade: item.cherry_grade,
            schedule_date: item.schedule_date,
            total_output_quantity:item.total_output_quantity,
            completed_date: item.completed_date,
            out_turn:item.out_turn,
            received_cherry_kg: parseInt(item.received_cherry_kg),
            status: item.status,
            process_type: item.process_type,
        };
    });

    return mappedData;
};


  const generateReport = async () => {
    console.log('Generate report for date:', startdate);

    if (startdate && enddate) {
      // const formattedDate = date.toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'
      const formattedDate = startdate;
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

    //   const raw = JSON.stringify({
    //     "date": formattedDate
    //   });
    var raw = JSON.stringify({
        "start_date": startdate,
        "end_date": enddate
      });
      

      const requestOptions = {
        // method: 'POST',
        method:'GET',
        headers: myHeaders,
        // body: raw,
        redirect: 'follow'
      };

      try {
        setLoading(true);

        const response = await fetch("http://127.0.0.1:8000/api/batchreport/", requestOptions);
        const data = await response.json();

        console.log(data);

        const mappedData = mapApiResponseToCustomers(data);
        setCustomers(mappedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching batch report:', error);
        setLoading(false);
      }
    }
  };
  const modifyData = (data) => {
    let modifiedData = [];
    let uniqueCombos = new Set(); // To keep track of unique combinations of batch_no and season
  
    for (const row of data) {
      const comboKey = `${row.batch_no}-${row.season}`;
  
      if (!uniqueCombos.has(comboKey)) {
        // If the combination is not in the set, add the row to modifiedData
        modifiedData.push(row);
        uniqueCombos.add(comboKey);
      }
    }
  
    return modifiedData;
  };
  const modifiedCustomers = modifyData(customers);

  // Call generateReport when the component mounts or when the date changes
  React.useEffect(() => {
    generateReport();
  }, [startdate,enddate]);

  const modifiedCustomersWithId = modifiedCustomers.map(customer => ({
    ...customer,
    id: generateRandomId(),
  }));

  return (
    <div>
      <div className='text-teal-600 text-pretty font-bold text-2xl'>BATCH REPORT</div>

      <div className="card">
      <div className="flex justify-content-end m-3">
                {customers && (
                <CSVLink data={customers} headers={csvHeaders} filename="transactions.csv">
                    <Button type="button" icon="pi pi-file-excel" label="Download Excel" className="bg-teal-400 text-gray-100 p-3" onClick={exportCSV} />
                </CSVLink>
                )}
            </div>


            <DataTable
                  value={modifiedCustomersWithId}
                  paginator
                  showGridlines
                  rows={10}
                  dataKey="id"
                  filters={filters}
                  globalFilterFields={['season', 'batch_no', 'cws_name', 'cherry_grade', 'schedule_date', 'total_output_quantity', 'completed_date', 'received_cherry_kg', 'status']}
                  header={header}
                  emptyMessage="No Transactions found."
                  rowClassName={(data) => ({
                    'bg-red-50 text-red-950':data.out_turn ? parseFloat(data.out_turn.replace('%', '')) < 20:'',
                    'bg-green-50 text-green-950':data.out_turn ? parseFloat(data.out_turn.replace('%', '')) >= 20:'',
                  })}
                >
              <Column key="batch_no" field="batch_no" sortable header="Batch No" filter filterPlaceholder="Search by Batch No" style={{ minWidth: '12rem' }} />
              <Column key="season" field="season" sortable header="Crop Year" filter filterPlaceholder="Search by CWS Name" style={{ minWidth: '12rem' }} />
              <Column key="cws_name" field="cws_name" sortable header="CWS Name" filter filterPlaceholder="Search by Farmer Name" style={{ minWidth: '12rem' }} />
              <Column key="cherry_grade" field="cherry_grade" sortable header="Cherry Grade" style={{ minWidth: '10rem' }} />
              <Column key="schedule_date" field="schedule_date" sortable header="Schedule Date" style={{ minWidth: '10rem' }} />
              <Column key="completed_date" field="completed_date" header="Completed Date" style={{ minWidth: '8rem' }} />
              <Column key="received_cherry_kg" field="received_cherry_kg" sortable header="Received Cherry KG" style={{ minWidth: '8rem' }} />
              <Column key="total_output_quantity" field="total_output_quantity" sortable header="Total Output Quantity" style={{ minWidth: '8rem' }} />
              {/* <Column key="out_turn" field="out_turn" sortable header="Out Turn %" style={{ minWidth: '8rem' }} body={(rowData) => `${rowData.out_turn}%`} /> */}
              <Column
                    key="out_turn"
                    field="out_turn"
                    sortable
                    header="Out Turn %"
                    style={{ minWidth: '8rem' }}
                    body={renderOutTurn}
                />

              <Column key="process_type" field="process_type" header="Process Type" style={{ minWidth: '10rem' }} />
              <Column
                key="status"
                field="status"
                header="Status"
                sortable
                filter
                filterMatchMode="equals"
                body={(rowData) => (rowData.completed_date ? 'Completed' : 'Pending')}
                style={(rowData) => ({
                  minWidth: '5rem',
                  fontWeight: 'bold',
                })}
              />

            </DataTable>

        </div>
    </div>

  );
};

export default BatchReport;
