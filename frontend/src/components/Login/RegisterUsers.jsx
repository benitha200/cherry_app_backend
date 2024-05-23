import React, { useState, useEffect,useRef } from 'react';
import './RegisterPage.css';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { InputMask } from "primereact/inputmask";

const RegisterUsers = ({ token }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [selectedcws, setSelectedcws] = useState('');
  const [cws, setCws] = useState('');
  const [cwsName, setCwsName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
        // toast.current.show({ severity: 'success', summary: 'Success', detail: 'Transaction submitted successfully' });
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

    var formdata = new FormData();
    formdata.append("username", username);
    formdata.append("password", password);
    formdata.append("cws_code", selectedcws?.cws_code || "");
    formdata.append("cws_name", selectedcws?.cws_name) || "";
    formdata.append("role", role);

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/registeruser/", requestOptions);
      const result = await response.json();
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'User Added successfully' });

      console.log(result);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <form className="form_container3 medium_card" onSubmit={handleRegister}>
      <div className="title_container">
        <p className="text-teal-600 text-pretty font-bold text-2xl">Register an Account</p>
      </div>
      <br />
      <div className="input_container3">
        <label className="input_label" htmlFor="role_field">
          Role
        </label>
        <select
          className="input_field3"
          id="role_field"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">Select Role</option>
          <option value="cws_manager">CWS Manager</option>
          <option value="super_user">Coordinator</option>
          <option value="administrator">Administrator</option>
        </select>
      </div>

      {role === 'cws_manager' ? null : (
        <>
          <div className="input_container3">
            <label className="input_label" htmlFor="first_name_field">
              First Name
            </label>
            <input
              placeholder="Name"
              type="text"
              className="input_field3"
              id="first_name_field"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoComplete='off'
            />
          </div>

          <div className="input_container3">
            <label className="input_label" htmlFor="last_name_field">
              Last Name
            </label>
            <input
              placeholder="Name"
              type="text"
              className="input_field3"
              id="last_name_field"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              autoComplete='off'
            />
          </div>
        </>
      )}

      <div className="input_container3">
        <label className="input_label" htmlFor="username_field">
          Username
        </label>
        <input
          placeholder="Name"
          type="text"
          className="input_field3"
          id="username_field"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete='off'
        />
      </div>

      <div className="input_container3">
        <label className="input_label" htmlFor="email_field">
          Email
        </label>
        <input
          placeholder="name@mail.com"
          type="text"
          className="input_field3"
          id="email_field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete='off'
        />
      </div>

      <div className="input_container3">
        <label className="input_label" htmlFor="phone_field">
          Phone
        </label>
        <input
          placeholder="123-456-7890"
          type="text"
          className="input_field3"
          id="phone_field"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          autoComplete='off'
        />
      </div>

      {role !== 'cws_manager' ? null : (
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
      )}

      <div className="input_container3">
        <label className="input_label" htmlFor="password_field">
          Password
        </label>
        <input
          placeholder="Password"
          type="password"
          className="input_field3"
          id="password_field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="input_container3">
        <label className="input_label" htmlFor="confirm_password_field">
          Confirm Password
        </label>
        <input
          placeholder="Confirm Password"
          type="password"
          className="input_field3"
          id="confirm_password_field"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <Toast ref={toast} />
      <button className='bg-teal-600 p-3 rounded text-gray-200 w-5' type="submit">Register</button>
    </form>
  );
};

export default RegisterUsers;


// import React, { useState,useEffect } from 'react';
// import './RegisterPage.css';
// import { Dropdown } from 'primereact/dropdown';
// import { Toast } from 'primereact/toast';
// import { InputMask } from "primereact/inputmask";

// const RegisterUsers = ({token}) => {
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [username,setUsername]=useState('');
//   const [email, setEmail] = useState('');
// //   const [username,setUsername]
//   const [phone, setPhone] = useState('');
//   const [role, setRole] = useState('');
//   const [selectedcws,setSelectedcws]=useState('');
//   const [cws,setCws]=useState('');
//   const [cwsName, setCwsName] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   function get_cws(){
//     var requestOptions = {
//     method: 'GET',
//     headers: {
//         "Authorization":`Bearer ${token}`
//     },
//     redirect: 'follow',
//     };

//     fetch("http://127.0.0.1:8000/api/cws/", requestOptions)
//     .then(response => response.json())
//     .then(result =>{
//         setCws(result);
//         toast.current.show({ severity: 'success', summary: 'Success', detail: 'Transaction submitted successfully' });
//     } )
//     .catch(error => console.log('error', error));
// }
// const cwsOptionTemplate = (option) => {
//     return (
//         <div className="flex align-items-center">
//             <div>{option.cws_code} - {option.cws_name}</div>
//         </div>
//     );
// };

//    useEffect(() => {
//         get_cws();
//     }, []);
//   const handleRegister = async (e) => {
//     e.preventDefault();

//     var formdata = new FormData();
//     formdata.append("username", firstName);
//     formdata.append("password", password);
//     formdata.append("cws_code",selectedcws?.cws_code || "");
//     formdata.append("cws_name",selectedcws?.cws_name) || "";
//     formdata.append("role", role);
//     // formdata.append("cws_name", cwsName);

//     // "farmer_code": selectedFarmer?.farmer_code || "",
//     // "farmer_name": selectedFarmer?.farmer_name || "",

//     var requestOptions = {
//       method: 'POST',
//       body: formdata,
//       redirect: 'follow'
//     };

//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/registeruser/", requestOptions);
//       const result = await response.json();
//       console.log(result);
//     } catch (error) {
//       console.log('error', error);
//     }
//   };

//   return (
//     <form className="form_container3 medium_card" onSubmit={handleRegister}>
//       <div className="title_container">
//         <p className="text-teal-600 text-pretty font-bold text-2xl">Register an Account</p>
//       </div>
//       <br />
//       <div className="input_container3">
//         <label className="input_label" htmlFor="role_field">
//           Role
//         </label>
//         <select
//           className="input_field3"
//           id="role_field"
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//         >
//           <option value="">Select Role</option>
//           <option value="cws_manager">CWS Manager</option>
//           <option value="super_user">Super User</option>
//           <option value="administrator">Administrator</option>
//         </select>
//       </div>
//       <div className="input_container3">
//         <label className="input_label" htmlFor="first_name_field">
//           First Name
//         </label>
//         <input
//           placeholder="John"
//           type="text"
//           className="input_field3"
//           id="first_name_field"
//           value={firstName}
//           onChange={(e) => setFirstName(e.target.value)}
//         />
//       </div>

//       <div className="input_container3">
//         <label className="input_label" htmlFor="last_name_field">
//           Last Name
//         </label>
//         <input
//           placeholder="Doe"
//           type="text"
//           className="input_field3"
//           id="last_name_field"
//           value={lastName}
//           onChange={(e) => setLastName(e.target.value)}
//         />
//       </div>
//       <div className="input_container3">
//         <label className="input_label" htmlFor="first_name_field">
//           Username
//         </label>
//         <input
//           placeholder="John"
//           type="text"
//           className="input_field3"
//           id="first_name_field"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//       </div>

//       <div className="input_container3">
//         <label className="input_label" htmlFor="email_field">
//           Email
//         </label>
//         <input
//           placeholder="name@mail.com"
//           type="text"
//           className="input_field3"
//           id="email_field"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//       </div>

//       <div className="input_container3">
//         <label className="input_label" htmlFor="phone_field">
//           Phone
//         </label>
//         <input
//           placeholder="123-456-7890"
//           type="text"
//           className="input_field3"
//           id="phone_field"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//         />
//       </div>

      


//       <div className="input_container3">
//               <label className="input_label" htmlFor="cws_name_field">
//                 Cws Name
//               </label>
//                     <Dropdown
//                         value={selectedcws}
//                         onChange={(e) => setSelectedcws(e.value)}
//                         options={Array.isArray(cws) ? cws : []}
//                         optionLabel="cws_name"
//                         placeholder="Select a CWS"
//                         itemTemplate={cwsOptionTemplate}
//                         className="border-1 w-9"
//                         filter
//                     />
//         </div>

//       <div className="input_container3">
//         <label className="input_label" htmlFor="password_field">
//           Password
//         </label>
//         <input
//           placeholder="Password"
//           type="password"
//           className="input_field3"
//           id="password_field"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//       </div>

//       <div className="input_container3">
//         <label className="input_label" htmlFor="confirm_password_field">
//           Confirm Password
//         </label>
//         <input
//           placeholder="Confirm Password"
//           type="password"
//           className="input_field3"
//           id="confirm_password_field"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//         />
//       </div>
//       <button className='bg-teal-600 p-3 rounded text-gray-200 w-5' type="submit">Register</button>
//     </form>
//   );
// };

// export default RegisterUsers;