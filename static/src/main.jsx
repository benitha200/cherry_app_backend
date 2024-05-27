import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from "@material-tailwind/react";
import { PrimeReactProvider } from 'primereact/api';
import 'primeicons/primeicons.css';
// import { PrimeReactProvider } from 'primereact/api';
import 'primeflex/primeflex.css';  
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import './index.css';
import './flags.css';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrimeReactProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
    </PrimeReactProvider>
  </React.StrictMode>,
)
// serviceWorkerRegistration.register();