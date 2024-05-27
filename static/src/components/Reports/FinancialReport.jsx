import React, { useState } from 'react';
import './reports.css';
import Transactions from '../Transactions/Transactions';

const FinancialReport = ({ date, onDateChange,token }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dailytotal,setDailytotal]=useState();
  const [totalcherrya,setTotalcherrya]=useState();
  const [totalcherryb,setTotalcherryb]=useState();
  const [totalPaid,setTotalPaid]=useState();
  const [totalUnpaid,setTotalUnpaid]=useState();

const mapApiResponseToCustomers = (data) => {
  let overallTotal = 0;
  let cherry_a=0;
  let cherry_b=0;
  let paid=0;
  let unpaid=0;
  let grade=""

  const mappedData = data.map((item) => {
    const total = (parseFloat(item.price) + parseFloat(item.transport)) * parseFloat(item.cherry_kg);
    overallTotal += total;

    if(item.is_paid){
      const totalpaid = (parseFloat(item.price) + parseFloat(item.transport)) * parseFloat(item.cherry_kg);
      paid+=totalpaid;
    }
    else{
      const totalunpaid = (parseFloat(item.price) + parseFloat(item.transport)) * parseFloat(item.cherry_kg);
      unpaid+=totalunpaid;
    }

    console.log(item.cherry_grade);

    if(item.cherry_grade){
      grade=item.cherry_grade
    }

    

    if(grade.includes("A")){
      cherry_a+=parseFloat(item.cherry_kg);
    }
    else{
      cherry_b+=parseFloat(item.cherry_kg);
    }

    return {
      id: item.id,
      cws_name: item.cws_name,
      cws_code:item.cws_code,
      farmer_name: item.farmer_name,
      farmer_code: item.farmer_code,
      purchase_date: item.purchase_date,
      cherry_kg: parseFloat(item.cherry_kg),
      has_card: 1,
      cherry_grade: item.cherry_grade,
      price: parseFloat(item.price),
      season:item.season,
      plot_name:item.plot_name,
      total: total.toLocaleString('en-US'),
      grn_no: item.grn_no,
      transport: parseFloat(item.transport),
      is_paid:item.is_paid,
      // transport:400,
      batch_no: item.batch_no,
    };
  });

  setDailytotal(overallTotal.toLocaleString('en-US')); 
  setTotalPaid(paid.toLocaleString('en-US'));
  setTotalUnpaid(unpaid.toLocaleString('en-US'));
  setTotalcherrya(cherry_a.toLocaleString('en-US'));
  setTotalcherryb(cherry_b.toLocaleString('en-US'));

  return mappedData;
};


  const generateReport = async () => {
    console.log('Generate report for date:', date);

    if (date) {
      // const formattedDate = date.toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'
      const formattedDate = date;
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "date": formattedDate
      });

      const requestOptions = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: raw,
        redirect: 'follow'
      };
      try {
        setLoading(true);
      
        const response = await fetch("http://127.0.0.1:8000/api/getfinancialreport/", requestOptions);
      
        if(response.status === 401) {
          localStorage.setItem('token','')
          window.location.href = "/";
          return;
        }
      
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
  }, [date]);

  return (
    <div className='w-full mx-auto'>
      
      <div className='text-teal-600 text-pretty font-bold text-2xl'>DAILY REPORT</div>
      <div className='flex flex-row space-x-2 md:space-x-8 justify-between'>
        <form action="" className='flex flex-row flex-wrap mt-2 w-10'>
        <div className='flex flex-row flex-wrap items-center ml-4'>
          <label className='text-dark p-2 text-sm'>Select Date</label>
          <input
            placeholder="First"
            className="input m-2"
            name="date"
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
      </form>
          <div className='card flex flex-column space-y-4'>
          <div className="flex flex-row w-full gap-4">
              <span className='text-black-600 text-xl font-bold p-2 flex flex-col w-2/6 rounded-md bg-slate-100'>
                Purchase
                <span className='text-sl text-cyan-600 font-bold p-2'>{dailytotal} RWF</span>
              </span>
              <span className='text-black-600 text-xl font-bold p-2 flex flex-col w-2/6 rounded-md bg-slate-100'>
                Cherry A
                <span className='text-sl text-cyan-600 font-bold p-2'>{totalcherrya} Kg</span>
              </span>
              <span className='text-black-600 text-xl font-bold p-2 flex flex-col w-2/6 rounded-md bg-slate-100'>
                Cherry B
                <span className='text-sl text-cyan-600 font-bold p-2'>{totalcherryb} Kg</span>
              </span>
            </div>

            <div className='flex flex-row bg-slate-100 p-4 rounded-sm justify-left gap-5'>
              
              <span className='text-black-600 text-xl font-bold'>Paid:<span className='text-sl text-teal-600 font-bold p-2'>{totalPaid} RWF</span></span>|
              <span className='text-black-600 text-xl font-bold'>UnPaid:<span className='text-sl text-red-600 font-bold p-2'>{totalUnpaid} RWF</span></span>  
            </div> 
          </div>
      </div>
      
      <Transactions customers={customers} loading={loading} dailytotal={dailytotal} />
    </div>
  );
};

export default FinancialReport;
