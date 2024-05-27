import React, { useState,useEffect,useRef } from 'react';
import { Toast } from 'primereact/toast';
import {openDB} from 'idb';
import { useSearchParams } from 'react-router-dom';


const initializeIndexedDB=async()=>{
    const db=await openDB('offlineTransactions',1,{
        upgrade(db){
            db.createObjectStore('transactions',{keyPath:'id',autoIncrement:true});
        },
    });
    return db;
}
const ReceiveHarvestForm = () => {        
    const [searchParams] = useSearchParams();
  
    // Access query parameters using get method
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
    const defaultGrade=grades[0]
    const defaultOccupation = occupations[0];
    const [loading,setLoading]=useState(false)
    const [responsemessage,setResponsemessage]=useState()
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [farmers, setFarmers] = useState([]);
    const [season,setSeason]=useState(new Date().getFullYear())
    const [price,setPrice]=useState(410)
    const toast = useRef(null);
    const [receivedqty, setReceivedqty] = useState();
    // const [grade, setGrade] = useState(defaultGrade);
    const [grade, setGrade] = useState([
      { name: 'CA', value: 'CA' },
      { name: 'CB', value: 'CB' },
      { name: 'NA', value: 'NA' },
      { name: 'NB', value: 'NB' },
    ]);
    const [selectedGradePrice,setSelectedGradePrice ]=useState()
    const [selectedGradeLimit,setSelectedGradeLimit]=useState()
    
    const handleHasCardChange = (value) => {
      // Update the grades array based on the selected value of "Has Card"
      if (value === 'Yes') {
        setGrades([
          { name: 'CA', value: 'CA' },
          { name: 'CB', value: 'CB' },
        ]);
      } else {
        setGrades([
          { name: 'NA', value: 'NA' },
          { name: 'NB', value: 'NB' },
        ]);
      }
    };
    
    console.log(cwsname)    
   
    function get_farmers(){
        var requestOptions = {
        method: 'GET',
        headers: {
            "Authorization":`Bearer ${token}`
        },
        redirect: 'follow',
        };

        fetch("http://127.0.0.1:8000/api/farmers/", requestOptions)
        .then(response => response.json())
        .then(result => setFarmers(result))
        .catch(error => console.log('error', error));
    }
    const farmerOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.farmer_code} - {option.farmer_name}</div>
            </div>
        );
    };
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
const handleInputChange = (e) => {

  const {name, value} = e.target;

  // Date validation
  if(name === 'date') {
    const selected = new Date(value);
    const lastTwoDigitsOfYear = selected.getFullYear().toString().slice(-2);
    const formattedMonth = String(selected.getMonth() + 1).padStart(2, '0');
    const formattedDay = String(selected.getDate()).padStart(2, '0');
    setFormData({
        ...formData,
        [name]: value,
        lastTwoDigitsOfYear,
        formattedMonth,
        formattedDay,
     });
    if(!isDateValid(selected)) {
      setFormData({
        ...formData,
        date: ''
      });
      alert('Please select today or yesterday');
      return;
    }
  }

  // Handle cherryGrade
  if(name === 'cherryGrade') {
    setGrade(value)
    const price = getPriceForGrade(value); 
    setPrice(price);
  }

  // Update form data 
  setFormData({
    ...formData,
    [name]: value 
  });

}    
   
    useEffect(() => {
        get_farmers();
      
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
        console.log("button Clicked")
        const requestOptions = {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              "batch_no": batch_no,
              "cherry_grade": cherry_grade,
              "batch_creation_date": purchase_date,
              "harvest_cherry_kg": harvest_kgs,
              "received_cherry_kg": receivedqty,
              "location_to": cwsname,
            }),
            redirect: 'follow',
          };
          
          try {
            setLoading(true);
          
            const response = await fetch("http://127.0.0.1:8000/api/receiveharvest/create", requestOptions);
            const result = await response.json();
            console.log(result);
            console.log(result.message);
          
            if (result && result.message) {
              setResponsemessage(result.message);
              toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
          
              setReceivedqty("")
              window.location.href = "/receive-harvest";
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
        <div className="flex justify-center w-100">
        

        <form className="form_container w-100" onSubmit={handleSubmit}>
          <div className='text-teal-600 text-pretty font-bold text-2xl gap-2 mb-3'>RECEIVE HARVEST</div>
          <hr className='border-teal-600 h-2 mb-3'></hr>
          <div className='divider'></div>

          <div className="input_container mt-2">
            <label className="input_label" htmlFor="pricePerKg">
              Batch No
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
          <div className="input_container mt-2">
            <label className="input_label" htmlFor="pricePerKg">
              Grade
            </label>
            <input
              type="text"
              name="pricePerKg"
              value={cherry_grade}
              className="input_field"
              id="pricePerKg"
              autoComplete='off'
              readOnly
            />
          </div>
          <div className="input_container mt-2">
            <label className="input_label" htmlFor="pricePerKg">
              Batch Creation Date
            </label>
            <input
              type="text"
              name="pricePerKg"
              value={purchase_date}
              className="input_field"
              id="pricePerKg"
              autoComplete='off'
              readOnly
            />
          </div>
          <div className="input_container mt-2">
            <label className="input_label" htmlFor="pricePerKg">
              Harvest Quantity
            </label>
            <input
              type="text"
              name="pricePerKg"
              value={harvest_kgs}
              className="input_field"
              id="pricePerKg"
              autoComplete='off'
              readOnly
            />
          </div>
          <div className="input_container mt-2">
            <label className="input_label" htmlFor="transportPerKg">
              Received Quantity
            </label>
            <input
                type="text"
                name="transportPerKg"
                value={receivedqty}
                onChange={(e) => setReceivedqty(e.target.value)}
                className="input_field"
                id="transportPerKg"
                autoComplete='off'
                required
                />
                        </div>
          <div className="input_container mt-2">
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

export default ReceiveHarvestForm;