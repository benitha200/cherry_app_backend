import React, { useState,useEffect,useRef } from 'react';
import './Formpage.css';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { RadioButton } from 'primereact/radiobutton';
import {openDB} from 'idb';
import { Calendar } from 'primereact/calendar';


const initializeIndexedDB=async()=>{
    const db=await openDB('offlineTransactions',1,{
        upgrade(db){
            db.createObjectStore('transactions',{keyPath:'id',autoIncrement:true});
        },
    });
    return db;
}
        

const AddTransaction = ({token,setToken,role,cwsname,cwscode,cws}) => {
    const occupations = [
        {name: 'Select Occupation'},
        { name: 'Site Collector', code: 'Site Collector' },
        { name: 'Farmer', code: 'Farmer' },
    ];
    const initialGrades = [
      // { name: 'Select Grade' },
      { name: 'CA', value: 'CA' },
      { name: 'CB', value: 'CB' },
      { name: 'NA', value: 'NA' },
      { name: 'NB', value: 'NB' },
    ];


    // const defaultGrade=grades[0]
    const defaultOccupation = occupations[0];
    const [paid, setPaid] = useState('');
    const [loanPayment, setLoanPayment] = useState('');
    const [loading,setLoading]=useState(false)
    const [responsemessage,setResponsemessage]=useState()
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [isPopoverVisible, setIsPopoverVisible] = useState(true);
    const [farmers, setFarmers] = useState([]);
    const [season,setSeason]=useState(new Date().getFullYear())
    const [price,setPrice]=useState(410)
    const toast = useRef(null);
    const [selectedOccupation, setSelectedOccupation] = useState(defaultOccupation);
    // const [grade, setGrade] = useState(defaultGrade);
    const [grades, setGrades] = useState(initialGrades);
    const [isVisible, setIsVisible] = useState(true);
    // const [formData, setFormData] = useState({
    //   // ... (other form fields)
    //   farmName: '', // new field to store farm_name
    // });

    const updateGrades = (isCertified) => {
      if (isCertified) {
        setGrades([
          { name: 'Select Grade' },
          { name: 'CA', value: 'CA' },
          { name: 'CB', value: 'CB' },
        ]);
      } else {
        setGrades([
          { name: 'Select Grade' },
          { name: 'NA', value: 'NA' },
          { name: 'NB', value: 'NB' },
        ]);
      }
    };

    function handleLoanCHange(e){
      setLoanPayment(e.target.value)
    }
    
    console.log(cws)

   
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
          <div>{`${option.farmer_code} - ${option.farmer_name}`}</div>
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
        farmName:'',
      });

      const filterOption = (option, value) => {
        return (
            option.farmer_code.toLowerCase().includes(value.toLowerCase()) ||
            option.farmer_name.toLowerCase().includes(value.toLowerCase())
        );
    };

const handleFarmerChange = (e) => {
  const selectedFarmer = e.value;
  setSelectedFarmer(selectedFarmer);

  // Set the farmName in the formData based on the selected farmer
  setFormData((prevFormData) => ({
    ...prevFormData,
    farmName: selectedFarmer ? selectedFarmer.plot_name : '',
  }));

  // Update grades based on the certification status
  updateGrades(selectedFarmer.is_certified);
};
const isDateValid = (selectedDate) => {
  // Add your date validation logic here
  // For example, check if the selected date is today or yesterday
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  return selectedDate.toDateString() === today.toDateString() ||
         selectedDate.toDateString() === yesterday.toDateString();
};


const handleInputChange = (e) => {

  const {name, value} = e.target;

  // Date validation
    if (name === 'date') {
      const selected = new Date(value);
      const lastTwoDigitsOfYear = selected.getFullYear().toString().slice(-2);
      const formattedMonth = String(selected.getMonth() + 1).padStart(2, '0');
      const formattedDay = String(selected.getDate()).padStart(2, '0');

      // Check if the date is valid
      if (!isDateValid(selected)) {
          setFormData({
              ...formData,
              date: '',
          });
          alert('Please select today or yesterday');
          return;
      }

      // Update the form data
      setFormData({
          ...formData,
          [name]: value,
          lastTwoDigitsOfYear,
          formattedMonth,
          formattedDay,
      });

      // Hide the popover when a date is clicked
      setIsPopoverVisible(false);
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

        const isOnline=navigator.onLine;
        if(!isOnline){
            const db = await initializeIndexedDB();
            const tx = db.transaction('transactions', 'readwrite');
            const store = tx.objectStore('transactions');
        
            const offlineTransaction = {
              data: {
                cws_name: cwsname,
                purchase_date:formData.date,
                farmer_code:selectedFarmer?.farmer_code || "",
                farmer_name:selectedFarmer?.farmer_name || "",
                season:season,
                cherry_kg:parseFloat(formData.pricePerKg),
                has_card:formData.hasCard ? 1:0,
                cherry_grade:formData.cherryGrade,
                price:parseFloat(price),
                transport:parseFloat(formData.transportPerKg),
                cws_code:cwscode,
                is_paid:parseInt(paid)
              },
              timestamp: new Date().getTime(),
            };
            await store.add(offlineTransaction);
            toast.current.show({ severity: 'info', summary: 'Offline', detail: 'Transaction saved offline' });

            return;
        }
        var purchaseDate = new Date(formData.date);
        purchaseDate.setDate(purchaseDate.getDate() + 1); // Incrementing by one day

        var newPurchaseDate = purchaseDate.toISOString().split('T')[0];
        const rawPayload = {
          "cws_name": cwsname,
          // "purchase_date": formData.date.toISOString().split('T')[0],
          // "purchase_date":"2024-04-19",
          "purchase_date": newPurchaseDate,
          "farmer_code": selectedFarmer?.farmer_code || "",
          "farmer_name": selectedFarmer?.farmer_name || "",
          "season": season,
          "cherry_kg": parseFloat(formData.pricePerKg),
          "plot_name": formData.farmName,
          "has_card":selectedFarmer?.is_certified || "",
          "cherry_grade": formData.cherryGrade.name,
          "transport": parseFloat(formData.transportPerKg),
          "cws_code":cwscode,
          "is_paid":parseInt(paid)
        };
    
        const requestOptions = {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(rawPayload),
          redirect: 'follow',
        };
    
        try {
          setLoading(true);
    
          const response = await fetch("http://127.0.0.1:8000/api/processtransaction/", requestOptions);
          const result = await response.json();

          
    
          console.log(result);
          console.log(result.message);

          if (result && result.message) {
            setResponsemessage(result.message);
            toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });

            // print recveipt
            // const receiptWindow = window.open('', '_blank');
            // receiptWindow.document.write(`<!-- index.html -->
            // <!DOCTYPE html>
            //     <html lang="en">

            //     <head>
            //         <meta charset="UTF-8">
            //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
            //         <link rel="stylesheet" href="./receipt.css">
            //         <title>Coffee Cherry Purchase Receipt</title>
            //         <style>
            //             body {
            //                 font-family: "Inter", sans-serif;
            //                 margin: 0;
            //                 padding: 0;
            //                 display: flex;
            //                 justify-content: center;
            //                 align-items: center;
            //                 height: 100vh;
            //             }

            //             .card {
            //                 width: 300px; /* Adjusted width for Bluetooth POS */
            //                 height: 400px; /* Adjusted height for Bluetooth POS */
            //                 background-color: #fff;
            //                 padding: 10px;
            //                 border-radius: 10px;
            //                 box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            //             }

            //             .receipt_container {
            //                 text-align: left;
            //             }

            //             .logo_container {
            //                 margin-bottom: 10px;
            //             }

            //             .logo_container img {
            //                 max-width: 100%;
            //                 height: auto;
            //                 border-radius: 50%;
            //                 width: 60px;
            //                 height: 60px;
            //             }

            //             .title_container {
            //                 margin-bottom: 5px;
            //             }

            //             .title {
            //                 margin: 0;
            //                 font-size: 1rem;
            //                 font-weight: 600;
            //                 color: #0f737a;
            //             }

            //             .item_container {
            //                 margin-bottom: 5px;
            //             }

            //             .item_row {
            //                 margin-bottom: 5px;
            //                 display: flex;
            //                 justify-content: space-between;
            //             }

            //             .label {
            //                 font-size: 0.8rem;
            //                 flex-grow: 1;
            //             }

            //             .value {
            //                 font-size: 0.8rem;
            //                 font-weight: 600;
            //             }

            //             .dotted_line {
            //                 border-top: 1px dotted #212121;
            //                 margin: 10px 0;
            //             }

            //             .total_container {
            //                 margin-bottom: 5px;
            //             }

            //             .total_row {
            //                 display: flex;
            //                 justify-content: space-between;
            //             }

            //             .payment_container {
            //                 margin-bottom: 5px;
            //             }

            //             .payment_row {
            //                 display: flex;
            //                 justify-content: space-between;
            //             }

            //             .thank_you_container {
            //                 text-align: center;
            //             }

            //             .thank_you {
            //                 margin: 0;
            //                 font-size: 0.8rem;
            //                 color: #8B8E98;
            //             }
            //         </style>

            //     </head>

            //     <body>
            //         <div class="card">
            //             <div class="receipt_container">
            //                 <div class="logo_container">
            //                     <img src="./../../assets/img/RwacofLogoCoulRVB.png" alt="Logo">
            //                 </div>

            //                 <div class="title_container">
            //                     <p class="title">Coffee Cherry Purchase Receipt</p>
            //                 </div>

            //                 <div class="item_container">
            //                     <div class="item_row">
            //                         <span class="label">Cherry Grade:</span>
            //                         <span class="value">CA</span>
            //                     </div>

            //                     <div class="item_row">
            //                         <span class="label">Quantity (Kg):</span>
            //                         <span class="value">10</span>
            //                     </div>

            //                     <div class="item_row">
            //                         <span class="label">Price per Kg:</span>
            //                         <span class="value">Rwf 420</span>
            //                     </div>

            //                     <div class="item_row">
            //                         <span class="label">Transport per Kg:</span>
            //                         <span class="value">Rwf 10</span>
            //                     </div>

            //                     <div class="dotted_line"></div>

            //                     <div class="item_row total_row">
            //                         <span class="label">Total:</span>
            //                         <span class="value">Rwf 4300</span>
            //                     </div>
            //                 </div>

            //                 <div class="thank_you_container">
            //                     <p class="thank_you">Thank you for your supply!</p>
            //                 </div>
            //             </div>
            //         </div>
            //     </body>

            //     </html>
            //     `);
            //     receiptWindow.document.close();

            //     // Add an event listener for the afterprint event
            //     receiptWindow.addEventListener('afterprint', () => {
            //         // Close the print window after printing
            //         receiptWindow.close();
                // });
                
                // Open print dialog
                // receiptWindow.print();
                // receiptWindow.close();


            setFormData({
                date: '',
                farmerName: '',
                hasCard: false,
                pricePerKg: '',
                transportPerKg: '',
                cherryGrade: '',
                prebatch: '',
                batchNumber: '',
            });
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

        const synchronizeOfflineData = async () => {
            const db = await initializeIndexedDB();
            const tx = db.transaction('transactions', 'readonly');
            const store = tx.objectStore('transactions');
            const offlineTransactions = await store.getAll();
          
            // Loop through offline transactions and submit them to the backend
            for (const offlineTransaction of offlineTransactions) {
              const requestOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(offlineTransaction.data),
                redirect: 'follow',
              };
          
              try {
                const response = await fetch("http://127.0.0.1:8000/api/processtransaction/", requestOptions);
                const result = await response.json();
          
                // Handle the result as needed
                console.log(result);
          
                // Remove the synchronized transaction from IndexedDB
                const deleteTx = db.transaction('transactions', 'readwrite');
                const deleteStore = deleteTx.objectStore('transactions');
                await deleteStore.delete(offlineTransaction.id);
              } catch (error) {
                console.error('Error submitting transaction:', error);
              }
            }
          };
          
    
        // Constructing the raw payload based on formData
        
      
    
      return (
        <div className="d-flex w-1/2 mx-auto">
        
        <form className="flex flex-col items-center justify-center gap-15 p-4 md:p-10 gap-4 bg-white shadow-xl rounded-lg font-inter" onSubmit={handleSubmit}>
        <div className='text-teal-600 text-pretty font-bold text-2xl'>ADD TRANSACTION</div>
        <hr className='border-teal-600 h-2'></hr>
        <div className='divider'></div>
        <div className='flex w-full gap-10'>
          <div className="input_container w-full flex flex-col">
            <label className="input_label" htmlFor="date">
            Purchase Date
            </label>
 

            <Calendar
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className=''
                    isPopoverVisible={isPopoverVisible} 
                />
          </div>
          <div className="input_container flex flex-col">
              <label className="input_label" htmlFor="customFarmerName">
                Farmer Name
              </label>
                    <Dropdown
                        value={selectedFarmer}
                        // onChange={(e) => setSelectedFarmer(e.value)}
                        onChange={handleFarmerChange}
                        options={Array.isArray(farmers) ? farmers : []}
                        optionLabel="farmer_name"
                        placeholder="Select a Farmer"
                        itemTemplate={farmerOptionTemplate}
                        className="border-1"
                        filter
                        filterFunction={filterOption}
                        required
                    />
                </div>
        </div>
        <div className='flex w-full gap-10'>
          {formData.farmerName === 'other' && (
            
            <div className="input_container flex flex-col">
              <label className="input_label" htmlFor="customFarmerName">
                Farmer Name
              </label>
              <input
                type="text"
                name="customFarmerName"
                value={formData.customFarmerName}
                onChange={handleInputChange}
                className="input_field"
                id="customFarmerName"
                autoComplete='off'
              />
            </div>
          )}
        <div className="input_container w-full  flex flex-col">
        <label className="input_label" htmlFor="farmName">
          Plot Name
        </label>
        <input
          type="text"
          name="farmName"
          value={formData.farmName}
          onChange={handleInputChange}
          className="input_field"
          id="farmName"
          autoComplete="off"
          disabled
        />
      </div>
      
      
        <div className="input_container flex flex-col">
            <label className="input_label" htmlFor="customFarmerName">
                Occupation
            </label>
            <Dropdown value={selectedOccupation} onChange={(e) => setSelectedOccupation(e.value)} options={occupations} optionLabel="name" 
                placeholder="Select Occupation" className="border-1"/>
        </div>
        </div>
        <div className='flex w-full gap-10'>


          <div className="input_container flex flex-col">
            <label className="input_label" htmlFor="pricePerKg">
              Cherry Kg
            </label>
            <input
              type="text"
              name="pricePerKg"
              value={formData.pricePerKg}
              onChange={handleInputChange}
              className="input_field"
              id="pricePerKg"
              autoComplete='off'
            />
          </div>
            <div className="input_container flex flex-col">
              <label className="input_label" htmlFor="transportPerKg">
                Transport Per Kg
              </label>
              <input
                type="text"
                name="transportPerKg"
                value={formData.transportPerKg}
                onChange={handleInputChange}
                className="input_field"
                id="transportPerKg"
                autoComplete='off'
              />
            </div>
          </div>
          <div className='flex w-full'>
          <div className="input_container flex flex-col">
            <label className="input_label" htmlFor="customFarmerName">
                Cherry Grade
            </label>
            <Dropdown name='cherryGrade' value={formData.cherryGrade} onChange={handleInputChange} options={grades} optionLabel="name" 
                placeholder="Select Grade" className="border-1 w-9" id="cherryGrade"/>
       
            </div>
            <div className="input_container flex flex-col">
              <label className="input_label" htmlFor="customFarmerName">Paid</label>
              <div className="flex">
                  <div className="flex flex-wrap gap-3">
                      <div className="flex align-items-center">
                          <input type="radio" id="paid1" name="paid" value="1" onChange={(e) => setPaid(e.target.value)} checked={paid === '1'} />
                          <label htmlFor="paid1" className="ml-2">Yes</label>
                      </div>
                      <div className="flex align-items-center">
                          <input type="radio" id="paid0" name="paid" value="0" onChange={(e) => setPaid(e.target.value)} checked={paid === '0'} />
                          <label htmlFor="paid0" className="ml-2">No</label>
                      </div>
                  </div>
              </div>
          </div>
          </div>
            <div className="input_container flex flex-row">
              <label className="input_label" htmlFor="customFarmerName">Add Loan Payment</label>
              <div className="flex">
                  <div className="flex flex-wrap gap-3">
                      <div className="flex align-items-center">
                          <input type="radio" id="paid1" name="paid" value="1" onChange={()=>handleLoanCHange()} checked={loanPayment === '1'} />
                          <label htmlFor="paid1" className="ml-2">Yes</label>
                      </div>
                      <div className="flex align-items-center">
                          <input type="radio" id="paid0" name="paid" value="0" onChange={(e) => setLoanPayment(e.target.value)} checked={loanPayment === '0'} />
                          <label htmlFor="paid0" className="ml-2">No</label>
                      </div>
                  </div>
              </div>
          </div>
          {loanPayment === '1' && (
            <div className="additional-fields">
              {/* Additional fields go here */}
              <input type="text" placeholder="Additional Field 1" />
              <input type="text" placeholder="Additional Field 2" />
              {/* Add more additional fields as needed */}
            </div>
          )}

           
          <button className='sign-in_btn mb-12'>Submit</button>
        </form>
        <Toast ref={toast} />
        </div>
        
      );
    
}

export default AddTransaction;