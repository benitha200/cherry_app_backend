import React, { useState,useEffect,useRef } from 'react';
import { Toast } from 'primereact/toast';
import {openDB} from 'idb';
import { useSearchParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from "primereact/inputtext";
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';


const initializeIndexedDB=async()=>{
    const db=await openDB('offlineTransactions',1,{
        upgrade(db){
            db.createObjectStore('transactions',{keyPath:'id',autoIncrement:true});
        },
    });
    return db;
}
const BagOffForm = () => {        
    const [searchParams] = useSearchParams();
    const [options,setOptions]=useState();
    const [processtype,setProcesstype]=useState(1);
    const [quantity,setQuantity]=useState(1);
    const [responsemessage,setResponseMessage ]=useState()
    const [batch,setBatch]=useState()
    const [outTurn,setOutTurn]=useState()
  
    const cwsname = searchParams.get('cwsname');
    const token = searchParams.get('token');
    const batch_no = searchParams.get('batch_no');
    const purchase_date=searchParams.get('purchase_date')
    const cherry_grade=searchParams.get('cherry_grade')
    const harvest_kgs=searchParams.get('harvest_kgs')
    const process_type=searchParams.get('process_type')
    const schedule_date=searchParams.get('schedule_date')
    const received_cherry_kg=searchParams.get('received_cherry_kg')

    const ref = useRef(null);
    
  
    // Log the retrieved values
    console.log("cwsname:", cwsname);
    console.log("token:", token);
    console.log("batch_no:", batch_no);
    console.log("purchase_date:", purchase_date);
    console.log("cherry_grade:", cherry_grade);
    console.log("harvest_kgs:", harvest_kgs);
    console.log("process_type:", process_type);

    const [loading,setLoading]=useState(false)
    const [completeddate,setCompleteddate]=useState();
    const toast = useRef(null);
    


    const mapApiResponseToCustomers = (data) => {
      console.log(data);
      const mappedData = data.map((item) => {
          console.log(item.process_name);
          // ,'cherry_grade','purchase_date'
  
          return {
              id:item.id,
              process_name: item.process_name,
              process_type_output: item.process_type_output,
              output_quantity: item.output_quantity,
  
          };
      });
  
      return mappedData;
  };
    
  
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

      // const [selectedsku, setSelectedsku] = useState(null);
      // const sku = [
      //     { name: 'Bag-60kg', code: 'Bag-60kg' },
      //     { name: 'Bag-1kg', code: 'Bag-1kg' }
      // ];  

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

    fetch("http://127.0.0.1:8000/api/inventoryoutput/", requestOptions)
    .then(response => response.json())
    .then(result =>{
         console.log(result)
         setOptions(result)
    })
    .catch(error => console.log('error', error));
}

function get_output_items(batch_no){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch(`http://127.0.0.1:8000/api/inventoryitems/${batch_no}/`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const mappedData = mapApiResponseToCustomers(result);
      console.log(mappedData)
        setBatch(mappedData);
        // setLoading(false);
    })
    .catch((error) => console.error(error));
}
   
    useEffect(() => {
        get_cherry_grade_outputs(cherry_grade);
        get_output_items(batch_no);
      
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
        e.preventDefault();
      
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
      
        try {
          setLoading(true);
      
          let totalKgs = 0;
      
          for (const option of options) {
            const quantityValue = quantity[option.id] || 0;
      
            if (quantityValue > 0) {
              totalKgs += parseFloat(quantityValue);
            }
          }

          let out_turn_=(totalKgs/received_cherry_kg)*100
          // let out_turn_ = Math.round((totalKgs / received_cherry_kg) * 100 );
    

          setOutTurn(out_turn_)
      
          // Check if the total exceeds the threshold
          // const threshold = (received_cherry_kg * 20) / 100;
      
          // if (totalKgs > threshold) {
          //   toast.current.show({
          //     severity: 'error',
          //     summary: 'Error',
          //     detail: 'Total quantity exceeds the threshold. Data not saved.'
          //   });
          //   return; 
          // }
      
          // Proceed with saving data
          const successMessages = [];
      
          for (const option of options) {
            const quantityValue = quantity[option.id] || 0;
      
            if (quantityValue > 0) {
              const raw = JSON.stringify({
                "process_name": batch_no,
                "process_type": option.id,
                "output_quantity": parseInt(quantityValue),
                "out_turn":out_turn_
              });
      
              const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
              };
      
              const response = await fetch("http://127.0.0.1:8000/api/stockinventoryoutput/", requestOptions);
              const result = await response.json();
              console.log(result);
      
              if (result && result.message) {
                successMessages.push(result.message);
                setQuantity({});
              } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: result.error });
                // Optionally handle errors or break the loop on error
                break; // Break the loop on the first error (optional)
              }
            }
          }
      
          // Display success message if at least one success
          if (successMessages.length > 0) {
            const successMessage = successMessages.join('\n');
            toast.current.show({ severity: 'success', summary: 'Success', detail: "Items added successfully" });
            get_output_items(batch_no);
          }
      
        } catch (error) {
          console.error('Error submitting transaction:', error);
          toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error submitting transaction' });
        } finally {
          setLoading(false);
        }
      };
      
      
      function handleCompleteClick(){
        const requestOptions = {
          method: "POST",
          redirect: "follow"
        };
        const comp_date=completeddate.toISOString().split('T')[0]
        
        fetch(`http://127.0.0.1:8000/api/stockinventoryupdate/${batch_no}/${comp_date}/`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result)
            if(result.message){
              toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
            }
            window.location.href = "/bag-off";
          })
          .catch((error) => console.error(error));
      }

      const [editedRows, setEditedRows] = useState({});

  const onEditorValueChange = (props, value) => {
    const clonedRows = [...batch];
    const editedRow = clonedRows[props.rowIndex];
    editedRow[props.field] = value;
    setEditedRows({ ...editedRows, [props.rowIndex]: editedRow });
  };
  
  const typeTextEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };
  const quantityTextEditor = (options) => {
    return (
      <InputText
        type="number"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const onSubmit = (id) => {
    // const editedRow = editedRows.find((row) => row._id === id);
    const editedRow=editedRows
    console.log(id)
  
    if (!editedRow) {
      console.error('Edited row not found for id:', id);
      return;
    }
  
    // Assuming you have an API endpoint to submit the edited data.
    // Replace 'your-api-endpoint' with your actual endpoint.
    fetch(`your-api-endpoint/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedRow),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Data submitted successfully:', data);
        // Additional logic after successful submission
        setEditedRows([]); // Clear the edited rows after successful submission
      })
      .catch((error) => {
        console.error('Error submitting data:', error);
        // Handle error
      });
  };
  


  // const editorInputText = (props, field) => {
  //   return (
  //     <InputText
  //       type="text"
  //       value={editedRows[props.rowIndex] ? editedRows[props.rowIndex][field] : props.rowData[field]}
  //       onChange={(e) => onEditorValueChange(props, e.target.value)}
  //     />
  //   );
  // };
      
       
      return (
        <div className="d-flex flex-row">
          <form onSubmit={handleCompleteClick} className='flex'>
            <div className="input_container">
              <label className="input_label" htmlFor="pricePerKg">
                Completed Date
              </label>
              <Calendar className='w-75' value={completeddate} onChange={(e) => setCompleteddate(e.target.value)} dateFormat="dd/mm/yy" required />
            </div>
            <Button className='bg-teal-700 text-gray-50 p-3 mb-2 w-2 text-center'>Complete</Button>
          </form>
          
        <Card title="Process Information" className=' d-flex flex-row'>
            <p className="m-0 d-flex">
                <span>Batch No</span>
               <p className='font-bold'>
                {batch_no}
               </p>
                
            </p>
            <p className="m-0 d-flex">
                <span>Process Type</span>
               <p className='font-bold'>
                {process_type}
               </p>
                
            </p>
            <p className="m-0 d-flex">
                <span>Scheduled Date</span>
               <p className='font-bold'>
                {schedule_date}
               </p>
                
            </p>
            
            <p className="m-0 d-flex">
                <span>Total Kgs</span>
               <p className='font-bold'>
                {received_cherry_kg}
               </p>
                
            </p>
            <p className="m-0 d-flex">
                <span>Out Turn</span>
               <p className='font-bold'>
                {outTurn?Math.round(outTurn):"_"}%
               </p>
                
            </p>
            
        </Card>

        {/* <Button label="Collapse" className="m-2" onClick={() => ref.current.collapse()} /> */}
        <Panel ref={ref} header="Add Outputs Item" className='text-teal-600 mb-2' toggleable>
            <p className="m-0">
          <form className="form_container_2 d-flex justify-left" onSubmit={handleSubmit}>
            <div className='text-teal-600 text-pretty font-bold text-2xl'>Add Output Items</div>
            <hr className='border-teal-600 h-2'></hr>
            <div className='divider'></div>
            <br></br>
            <div className="card flex flex-wrap gap-4">
              {options && options.map(option => (
                <div key={option.id} className="w-4 d-flex-row justify-between">
                  <label>{option.output}</label>
                  <span className="w-4">
                    <InputText
                      id={`output-${option.id}`}
                      className='w-12'
                      type='number'
                      value={quantity[option.id] || ''}
                      onChange={(e) => setQuantity({ ...quantity, [option.id]: e.target.value })}
                      placeholder='Output KGS'
                    />
                  </span>
                </div>
              ))}
            </div>
            <button className='sign-in_btn mb-12 w-4 justify-center'>Submit</button>
          </form>

            </p>
        </Panel>
        <div className="card">
          {/* <DataTable
            value={batch}
            tableStyle={{ minWidth: '50rem' }}
            editMode="row"
            onRowEditSave={(e) => {
              const id = e.data._id;
              onSubmit(id);
            }}
          >
          <Column field="process_name" header="Process Name" ></Column>
          <Column field="process_type_output" header="Process Type" editor={(props) => typeTextEditor(props, 'process_type_output')}></Column>
          <Column field="output_quantity" header="Quantity" editor={(props) => quantityTextEditor(props, 'process_type_output')}></Column>
          <Column rowEditor headerStyle={{ width: '10%', minWidth: '5rem', maxWidth: '7rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
        </DataTable> */}
        <DataTable
          value={batch}
          tableStyle={{ minWidth: '50rem' }}
          editMode="row"
          onRowEditSave={(e) => {
            const updatedData = e.data;
            const id = updatedData.id;

            console.log(updatedData);
            console.log(id);

            // Make an API call to send the updated data to the endpoint
            fetch(`http://127.0.0.1:8000/api/stockinventoryoutputedit/${id}/`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatedData),
            })
              .then((response) => {
                if (response.ok) {
                  console.log('Data updated successfully');
                  // You can perform any additional actions here, like updating the local state or showing a success message
                } else {
                  console.error('Failed to update data');
                  // Handle the error case
                }
              })
              .catch((error) => {
                console.error('Error:', error);
                // Handle the error case
              });
          }}
        >
          <Column field="process_name" header="Process Name"></Column>
          <Column
            field="process_type_output"
            header="Process Type"
            editor={(props) => typeTextEditor(props, 'process_type_output')}
          ></Column>
          <Column
            field="output_quantity"
            header="Quantity"
            editor={(props) => quantityTextEditor(props, 'process_type_output')}
          ></Column>
          <Column
            rowEditor
            headerStyle={{ width: '10%', minWidth: '5rem', maxWidth: '7rem' }}
            bodyStyle={{ textAlign: 'center' }}
          ></Column>
        </DataTable>
                </div>


                
        
        <Toast ref={toast} />
        </div>
        
      );
    
}

export default BagOffForm;