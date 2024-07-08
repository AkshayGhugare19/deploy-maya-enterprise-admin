import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import './styles/theme.css';
import './styles/app.css';
import './styles/theme-override.css';
import './styles/index.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <React.StrictMode>
      <ToastContainer
        position={toast.POSITION.TOP_RIGHT}
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
      />
      <App />
    </React.StrictMode>
  </BrowserRouter>
);
