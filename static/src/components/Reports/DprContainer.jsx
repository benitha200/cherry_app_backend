import React, { useState } from 'react';
import './reports.css';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';


const DprContainer = () => {


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
        const total = (parseFloat(item.price) + parseFloat(item.transport)) * parseFloat(item.cherry_kg);
        overallTotal += total;

        console.log(item.cherry_grade);

        if (item.cherry_grade) {
            grade = item.cherry_grade;
        }

        if (grade.includes("A")) {
            cherryA += parseFloat(item.cherry_kg);
        } else {
            cherryB += parseFloat(item.cherry_kg);
        }

        return {
            id: item.id,
            cws_name: item.cws_name,
            farmer_name: item.farmer_name,
            farmer_code: item.farmer_code,
            purchase_date: item.purchase_date,
            cherry_kg: parseFloat(item.cherry_kg),
            has_card: item.has_card === 1,
            cherry_grade: item.cherry_grade,
            price: parseFloat(item.price),
            total: total.toLocaleString('en-US'),
            grn_no: item.grn_no,
            transport: parseFloat(item.transport),
            batch_no: item.batch_no,
            // created_at: new Date(item.created_at),
        };
    });

    setDailytotal(overallTotal.toLocaleString('en-US')); // Assuming you want to store a formatted string
    setTotalcherrya(cherryA.toLocaleString('en-US'));
    setTotalcherryb(cherryB.toLocaleString('en-US'));

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
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      try {
        setLoading(true);

        const response = await fetch("http://127.0.0.1:8000/api/getdpr/", requestOptions);
        const data = await response.json();

        console.log(data);

        const mappedData = mapApiResponseToCustomers(data);
        setCustomers(mappedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching financial report:', error);
        setLoading(false);
      }
    }
  };

  // Call generateReport when the component mounts or when the date changes
  React.useEffect(() => {
    generateReport();
  }, [startdate,enddate]);

  return (
    <div>
      <div className='text-teal-600 text-pretty font-bold text-2xl'>DIRECT PURCHASE REPORT</div>
      <div className='d-flex flex-1 flex-row'>
          <form action="" className='flex flex-row flex-wrap mt-4 mb-4'>
              <div className='flex flex-row flex-wrap items-center ml-4'>
                <label className='text-dark p-2 text-sm'>Start Date</label>
                <input placeholder="First" className="input" name="startDate" type="date" value={startdate} onChange={(e)=>setStartdate(e.target.value)}/>
              </div>
              <div className='flex flex-row flex-wrap items-center ml-4'>
                <label className='text-dark p-2 text-sm'>End Date</label>
                <input placeholder="First name" className="input" name="endDate" type="date" value={enddate} onChange={(e)=>setEnddate(e.target.value)}/>
              </div>
                {/* <button class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded ml-4">
                    Generate
                </button> */}
          </form>
          <div className="flex flex-row space-x-4 mt-4">
              <span className='text-black-600 text-xl font-bold'>Total Purchase:<span className='text-sl text-teal-600 font-bold p-2'>{dailytotal} RWF</span></span>
              <span className='text-black-600 text-xl font-bold'>Total Cherry A :<span className='text-sl text-teal-600 font-bold p-2'>{totalcherrya} Kg</span></span>
              <span className='text-black-600 text-xl font-bold'>Total Cherry B :<span className='text-sl text-teal-600 font-bold p-2'>{totalcherryb} Kg</span></span>
          </div> 

      </div>
      
      <div className="card">
      <div className="flex justify-content-end m-3">
                {customers && (
                <CSVLink data={customers} headers={csvHeaders} filename="transactions.csv">
                    <Button type="button" icon="pi pi-file-excel" label="Download Excel" className="bg-teal-400 text-gray-100 p-3" onClick={exportCSV} />
                </CSVLink>
                )}
            </div>
            <DataTable value={customers} paginator showGridlines rows={10} dataKey="id"
                filters={filters} globalFilterFields={['cws_name', 'farmer_name', 'cherry_grade', 'price', 'grn_no', 'transport', 'batch_no']} header={header}
                emptyMessage="No Transactions found .">
                <Column field="cws_name" sortable header="CWS Name" filter filterPlaceholder="Search by CWS Name" style={{ minWidth: '12rem' }} />
                <Column field="farmer_name" sortable header="Farmer Name" filter filterPlaceholder="Search by Farmer Name" style={{ minWidth: '12rem' }} />
                <Column field="purchase_date" sortable header="Purchase Date" style={{ minWidth: '10rem' }} />
                <Column field="cherry_kg" sortable header="Cherry Kg" style={{ minWidth: '10rem' }} />
                <Column field="has_card" header="Has Card" style={{ minWidth: '8rem' }} />
                <Column field="cherry_grade" sortable header="Cherry Grade" style={{ minWidth: '8rem' }} />
                <Column field="price" header="Price" style={{ minWidth: '5rem' }} />
                <Column field="total" header="Total" style={{ minWidth: '10rem' }} />
                <Column field="grn_no" header="Paper GRN No" style={{ minWidth: '12rem' }} />
                <Column field="transport" header="Transport" style={{ minWidth: '10rem' }} />
                <Column field="batch_no" header="Batch Number" style={{ minWidth: '12rem' }} />
                {/* <Column field="created_at" header="Created At" style={{ minWidth: '10rem' }} /> */}
            </DataTable>
        </div>
    </div>

  );
};

export default DprContainer;
