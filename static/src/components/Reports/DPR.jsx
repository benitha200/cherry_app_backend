import React, { useState } from 'react';
import './reports.css';

const DPR = () => {
  const [startDate, setStartDate] = useState(new Date()); 
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const mapApiResponseToCustomers = (data) => {
    console.log(data)
    return data.map(item => {
        return {
            id: item.id,
            cws_name: item.cws_name,
            farmer_name: item.farmer_name,
            purchase_date: item.purchase_date,
            cherry_kg: parseFloat(item.cherry_kg),
            has_card: item.has_card === 1,
            cherry_grade: item.cherry_grade,
            price: parseFloat(item.price),
            grn_no: item.grn_no,
            transport: parseFloat(item.transport),
            batch_no: item.batch_no,
            // created_at: new Date(item.created_at),
        };
    });
};

  const generateReport = async () => {
    console.log('Generate report for date:', date);

    if (date) {
      // const formattedDate = date.toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'
      const formattedDate = date;
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

    //   const raw = JSON.stringify({
    //     "date": formattedDate
    //   });
    var raw = JSON.stringify({
        "start_date": "2024-01-01",
        "end_date": "2024-01-31"
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
  }, []);


  return (
    <div>
      <div className='text-teal-600 text-pretty font-bold text-2xl'>DIRECT PURCHASE REPORT</div>
      <form action="" className='flex flex-row flex-wrap mt-4'>
      <div className='flex flex-row flex-wrap items-center ml-4'>
        <label className='text-dark p-2 text-sm'>Start Date</label>
        <input placeholder="First" className="input" name="startDate" type="date" />
      </div>
      <div className='flex flex-row flex-wrap items-center ml-4'>
        <label className='text-dark p-2 text-sm'>End Date</label>
        <input placeholder="First name" className="input" name="endDate" type="date" />
      </div>
        <button class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded ml-4">
            Generate
        </button>
    </form>
    </div>
  );
};

export default DPR;
