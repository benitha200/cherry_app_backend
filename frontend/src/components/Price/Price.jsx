import React, { useState, useEffect,useRef } from 'react';
// import './RegisterPage.css';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { InputMask } from "primereact/inputmask";

const Price = ({ token }) => {
    const [grade, setGrade] = useState(null);
    const [price,setPrice]=useState(null)
    const [transport,setTransport]=useState(null)
    const [selectedcws, setSelectedcws] = useState('');
    const [cws, setCws] = useState('');
    const toast = useRef(null);

  function get_cws() {
    var requestOptions = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`
      },
      redirect: 'follow',
    };

    fetch("http://127.0.0.1:8000/api/cws/", requestOptions)
      .then(response => response.json())
      .then(result => {
        setCws(result);
        
      })
      .catch(error => console.log('error', error));
  }

  const cwsOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <div>{option.cws_code} - {option.cws_name}</div>
      </div>
    );
  };

  useEffect(() => {
    get_cws();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
  
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    var raw = JSON.stringify({
      "cws": selectedcws?.id || "",
      "grade": grade,
      "price_per_kg": price,
      "transport_limit": transport
    });
  
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/station-settings/${selectedcws?.cws_code || ''}/`, requestOptions);
      const result = await response.json();
      console.log(result);
  
      // Clear the form fields after a successful submission
      setGrade("");  // Reset to the initial value for grade
      setPrice("");  // Reset to the initial value for price
      setTransport("");  // Reset to the initial value for transport
  
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Price is set successfully' });
    } catch (error) {
      console.log('error', error);
    }
  };
  

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     var myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     var raw = JSON.stringify({
//     "cws": selectedcws?.id || "",
//     "grade": grade,
//     "price_per_kg": price,
//     "transport_limit": transport
//     });

//     var requestOptions = {
//     method: 'PUT',
//     headers: myHeaders,
//     body: raw,
//     redirect: 'follow'
//     };

//     fetch(`http://127.0.0.1:8000/api/station-settings/${selectedcws?.cws_code || ''}/`, requestOptions)
//     .then(response => response.json())
//     .then(result =>{
//         console.log(result);
//         toast.current.show({ severity: 'success', summary: 'Success', detail: 'Price is set successfully' });
//     })
//     .catch(error => console.log('error', error));
//     };
    const gradeOptions = [
        { label: 'Cherry A', value: 'A' },
        { label: 'Cherry B', value: 'B' },
  ];

  return (
    <form className="form_container3" onSubmit={handleRegister}>
      <div className="title_container">
        <p className="text-teal-600 text-pretty font-bold text-2xl">Set Price</p>
      </div>
      <br />
        <div className="input_container3">
          <label className="input_label" htmlFor="cws_name_field">
            Cws Name
          </label>
          <Dropdown
            value={selectedcws}
            onChange={(e) => setSelectedcws(e.value)}
            options={Array.isArray(cws) ? cws : []}
            optionLabel="cws_name"
            placeholder="Select a CWS"
            itemTemplate={cwsOptionTemplate}
            className="border-1 w-9"
            filter
            required
          />
        </div>
        <div className="input_container3">
      <label className="input_label" htmlFor="cws_name_field">
        Grade
      </label>
      <Dropdown
        value={grade}
        onChange={(e) => setGrade(e.value)}
        options={gradeOptions}
        optionLabel="label"
        placeholder="Select a Cherry Grade"
        className="border-1 w-9"
        required
      />
    </div>
      <div className="input_container3">
        <label className="input_label" htmlFor="username_field">
          Price Per Kg
        </label>
        <input
          placeholder="480"
          type="number"
          className="input_field3"
          id="price_per_kg_field"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div className="input_container3">
        <label className="input_label" htmlFor="email_field">
          Maximum Transport
        </label>
        <input
          placeholder="50"
          type="number"
          className="input_field3"
          id="maximum_transport_field"
          value={transport}
          onChange={(e) => setTransport(e.target.value)}
          required
        />
      </div>


      <Toast ref={toast} />
      <button className='bg-teal-600 p-3 rounded text-gray-200 w-5' type="submit">Save</button>
    </form>
  );
};

export default Price;
