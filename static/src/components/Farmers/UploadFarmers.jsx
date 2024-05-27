// import React, { useRef } from 'react';
// import './style.css';
// import * as XLSX from 'xlsx';
// import * as FileSaver from 'file-saver';
// import { ProgressSpinner } from 'primereact/progressspinner';

// const UploadFarmers = () => {
//   const fileInputRef = useRef(null);
//   const [loading, setLoading] = useState(false);

//   const handleFileUpload = () => {
//     const fileInput = fileInputRef.current;

//     if (fileInput.files.length > 0) {
//       var formdata = new FormData();
//       formdata.append("file", fileInput.files[0], fileInput.files[0].name);

//       var requestOptions = {
//         method: 'POST',
//         body: formdata,
//         redirect: 'follow'
//       };

//       fetch("http://127.0.0.1:8000/api/uploadfarmers/", requestOptions)
//         .then(response => response.json())
//         .then(result => console.log(result))
//         .catch(error => console.log('error', error));
//     } else {
//       console.log("No file selected.");
//     }
//   };

//   const downloadTemplate = () => {
//     const requiredColumns = [
//       'cws_name',
//       'cws_code',
//       'farmer_code',
//       'farmer_name',
//       'gender',
//       'dob',
//       'phone_number',
//       'national_id',
//       'location',
//       'is_certified',
//       'polygon',
//       'plot_name',
//     ];

//     const templateData = [requiredColumns]; // First row contains column headers

//     const ws = XLSX.utils.aoa_to_sheet(templateData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Template');

//     const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//     const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

//     FileSaver.saveAs(blob, 'template.xlsx');
//   };

//   return (
//     <div className='container'>
//       <button className='bg-teal-700 text-cyan-50 p-2 rounded' onClick={downloadTemplate}>
//       Download Template
//     </button>
//       <div className="flex items-center justify-center w-full">
//         <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-100">
//           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//             <svg className="w-8 h-8 mb-4 text-gray-600 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
//               <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
//             </svg>
//             <p className="mb-2 text-sm text-gray-600 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
//             <p className="text-xs text-gray-600 dark:text-gray-400">CSV or XLSX files The file must have this columns [cws,farmer_code,farmer_name,gender,age,phone_number,address,national_id,village,location]</p>
//           </div>
//           <input
//             ref={fileInputRef}
//             id="dropzone-file"
//             type="file"
//             accept=".csv, .xlsx"
//             className="hidden"
//             onChange={handleFileUpload}
//           />
//         </label>
//       </div>
//     </div>
//   );
// };

// export default UploadFarmers;
import React, { useRef, useState } from 'react';
import './style.css';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ProgressSpinner } from 'primereact/progressspinner';

const UploadFarmers = () => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = () => {
    const fileInput = fileInputRef.current;

    if (fileInput.files.length > 0) {
      setLoading(true);

      var formdata = new FormData();
      formdata.append("file", fileInput.files[0], fileInput.files[0].name);

      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };

      fetch("http://127.0.0.1:8000/api/uploadfarmers/", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          setLoading(false); // Set loading to false when the upload is complete
        })
        .catch(error => {
          console.log('error', error);
          setLoading(false); // Set loading to false on error as well
        });
    } else {
      console.log("No file selected.");
    }
  };

  const downloadTemplate = () => {
    const requiredColumns = [
      'cws_name',
      'cws_code',
      'farmer_code',
      'farmer_name',
      'gender',
      'dob',
      'phone_number',
      'national_id',
      'location',
      'is_certified',
      'polygon',
      'plot_name',
    ];

    const templateData = [requiredColumns]; // First row contains column headers

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    FileSaver.saveAs(blob, 'template.xlsx');
  };

  return (
    <div>
      <div className='text-teal-600 text-pretty font-bold text-2xl mb-5'>UPLOAD FARMERS WITH FARM DATA</div>
      <button className='bg-teal-700 text-cyan-50 p-2 rounded mb-2' onClick={downloadTemplate}>
        Download Template
      </button><br/>
    <div className='container d-flex-column'>
      
      <div className="flex items-center justify-center w-full">
        {loading ? (
          <div className="card">
            <span>Please Wait</span>
            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
          </div>
        ) : (
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-600 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
              <p className="text-xs text-gray-600 dark:text-gray-400">CSV or XLSX files The file must have these columns [cws,farmer_code,farmer_name,gender,age,phone_number,address,national_id,village,location]</p>
            </div>
            <input
              ref={fileInputRef}
              id="dropzone-file"
              type="file"
              accept=".csv, .xlsx"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        )}
      </div>
    </div>
    </div>
  );
};

export default UploadFarmers;

