import React, { useState,useEffect,useRef } from 'react';
import { Toast } from 'primereact/toast';
import {openDB} from 'idb';
import { useSearchParams } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';


const initializeIndexedDB=async()=>{
    const db=await openDB('offlineTransactions',1,{
        upgrade(db){
            db.createObjectStore('transactions',{keyPath:'id',autoIncrement:true});
        },
    });
    return db;
}
const StartProcessingForm = () => {        
    const [searchParams] = useSearchParams();
    const [options,setOptions]=useState();
    const [processtype,setProcesstype]=useState();
    const[responsemessage,setResponsemessage ]=useState();
  
    const cwsname = searchParams.get('cwsname');
    const token = searchParams.get('token');
    const batch_no = searchParams.get('batch_no');
    const purchase_date=searchParams.get('purchase_date')
    const cherry_grade=searchParams.get('cherry_grade')
    const harvest_kgs=searchParams.get('harvest_kgs')
    
  
    // Log the retrieved values
    console.log("cwsname:", cwsname);
    console.log("token:", token);
    console.log("batch_no:", batch_no);
    console.log("purchase_date:", purchase_date);
    console.log("cherry_grade:", cherry_grade);
    console.log("harvest_kgs:", harvest_kgs);

    const occupations = [
        {name: 'Select Occupation'},
        { name: 'Site Collector', code: 'Site Collector' },
        { name: 'Farmer', code: 'Farmer' },
    ];
    const grades = [
        {name: 'Select Grade'},
        { name: 'CA', value: 'CA' },
        { name: 'CB', value: 'CB' },
        { name: 'NA', value: 'NA' },
        { name: 'NB', value: 'NB' },
    ];
    // const defaultGrade=grades[0]
    // const defaultOccupation = occupations[0];
    const [loading,setLoading]=useState(false)
    const [scheduledate,setScheduledate]=useState();
    const toast = useRef(null);
    
  
    console.log(cwsname)    
   


    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        // date:'',
        lastTwoDigitsOfYear: '',
        formattedMonth: '',
        formattedDay: '',
        farmerName: '',
        hasCard: false,
        pricePerKg: '',
        transportPerKg: '',
        cherryGrade: '',
        prebatch: '',
        batchNumber: '',
      });

    
const getPriceForGrade = (grade) => {
  return grade.includes('A') ? 410 : 100;
}
// const handleInputChange = (e) => {

//   const {name, value} = e.target;

//   // Date validation
//   if(name === 'date') {
//     const selected = new Date(value);
//     const lastTwoDigitsOfYear = selected.getFullYear().toString().slice(-2);
//     const formattedMonth = String(selected.getMonth() + 1).padStart(2, '0');
//     const formattedDay = String(selected.getDate()).padStart(2, '0');
//     setFormData({
//         ...formData,
//         [name]: value,
//         lastTwoDigitsOfYear,
//         formattedMonth,
//         formattedDay,
//      });
//     if(!isDateValid(selected)) {
//       setFormData({
//         ...formData,
//         date: ''
//       });
//       alert('Please select today or yesterday');
//       return;
//     }
//   }

//   // Handle cherryGrade
//   if(name === 'cherryGrade') {
//     setGrade(value)
//     const price = getPriceForGrade(value); 
//     setPrice(price);
//   }

//   // Update form data 
//   setFormData({
//     ...formData,
//     [name]: value 
//   });

// }    
function get_cherry_grade_outputs(cherry_grade){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "grade_name": cherry_grade
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("http://127.0.0.1:8000/api/cherrygradeoutput/", requestOptions)
    .then(response => response.json())
    .then(result =>{
         console.log(result)
         setOptions(result)
    })
    .catch(error => console.log('error', error));
}
// useEffect(() => {
//   get_cherry_grade_outputs(cherry_grade);
//   if (options && options.length > 0) {
//     setProcesstype(options[0].id);
//   }

//   const handleOnlineStatusChange = () => {
//     if (navigator.onLine) {
//       synchronizeOfflineData();
//     }
//   };

//   window.addEventListener('online', handleOnlineStatusChange);

//   return () => {
//     window.removeEventListener('online', handleOnlineStatusChange);
//   };
// }, [cherry_grade, options]);

useEffect(() => {
  get_cherry_grade_outputs(cherry_grade);

  if (options && options.length > 0) {
    setProcesstype(options[0].id);
  }

  const handleOnlineStatusChange = () => {
    if (navigator.onLine) {
      synchronizeOfflineData();
    }
  };

  window.addEventListener('online', handleOnlineStatusChange);

  return () => {
    window.removeEventListener('online', handleOnlineStatusChange);
  };
}, []); 
      
    
    const handleSubmit = async (e) => {
        // print()
        e.preventDefault();

        console.log(processtype,batch_no,scheduledate)

        var raw = JSON.stringify({
        "process_name": batch_no,
        "schedule_date": scheduledate.toISOString().split('T')[0],
        "process_type": parseInt(processtype, 10)
        });

        var requestOptionss = {
        method: 'POST',
        headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                },
        body: raw,
        redirect: 'follow'
        };
        console.log("process:",processtype)


        try {
            setLoading(true);
          
            const response = await fetch("http://127.0.0.1:8000/api/createinventory/", requestOptionss);
            const result = await response.json();
            console.log(result);
            console.log(result.message);
          
            if (result && result.message) {
              setResponsemessage(result.message);
              toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
          
              setScheduledate("")
              // window.location.href = "/processing";
            } else {
              toast.current.show({ severity: 'error', summary: 'Error', detail: result.error });
            }
          } catch (error) {
            console.error('Error submitting transaction:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error submitting transaction' });
          } finally {
            setLoading(false);
          }
          
        }

       
      return (
        <div className="d-flex">
        
        <form className="form_container" onSubmit={handleSubmit}>

        <div className='text-teal-600 text-pretty font-bold text-2xl'>START PROCESSING</div>
        <hr className='border-teal-600 h-2'></hr>
        <div className='divider'></div>

          <div className="input_container">
            <label className="input_label" htmlFor="pricePerKg">
              Process Name
            </label>
            <input
              type="text"
              name="pricePerKg"
              value={batch_no}
              className="input_field"
              id="pricePerKg"
              autoComplete='off'
              readOnly
            />
          </div>
          <div className="input_container">
            <label className="input_label" htmlFor="processType">
              Process Type
            </label>
            
            <select
              value={processtype || (options && options.length > 0 ? options[0].id : '')}
              onChange={(e) => setProcesstype(e.target.value)}
              id="processType"
            >
              <option>Select process type</option>
              {options && options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.outputs}
                </option>
              ))}
            </select>
          </div>
        {/* <input type="text" value={processtype} onChange={(e)=>setProcesstype(e.target.value)}/> */}
          <div className="input_container">
            <label className="input_label" htmlFor="pricePerKg">
              Schedule Date
            </label>
            <Calendar className='w-75' value={scheduledate} onChange={(e) => setScheduledate(e.target.value)} dateFormat="dd/mm/yy" required />
          </div>
          <div className="input_container">
            <label className="input_label" htmlFor="transportPerKg">
              Location To
            </label>
            <input
              type="text"
              name="transportPerKg"
              value={cwsname}
              className="input_field"
              id="transportPerKg"
              autoComplete='off'
              readOnly
            />
          </div>

          <button className='sign-in_btn mb-12'>Submit</button>
        </form>
        <Toast ref={toast} />
        </div>
        
      );
    
}

export default StartProcessingForm;