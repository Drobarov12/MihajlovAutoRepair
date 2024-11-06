import './App.css';
import React, { useState, createContext } from "react";
import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import HomePage from './HomePage/HomePage';
import ReservationPage from './ReservationPage';
import LogInPage from './LogInPage';
import Toast from './CustomComponents/Toast'

export const ToastContext = createContext();

function App() {

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Function to trigger the toast
  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  // Function to close the toast
  const closeToast = () => {
    setToast({ ...toast, open: false });
  };

  return (
    <ToastContext.Provider value={showToast}>
    <Router>
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '60px', 
      }}
    >
      <Header />
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/reservations" element={<ReservationPage />} />
      <Route path="/login" element={<LogInPage />} />
      </Routes>
      <Footer />
    </Box>
    <Toast
          open={toast.open}
          onClose={closeToast}
          message={toast.message}
          severity={toast.severity}
        />
    </Router>
    </ToastContext.Provider>
  );
}

export default App;
