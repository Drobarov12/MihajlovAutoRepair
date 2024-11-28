import './App.css';
import React, { useState, createContext } from "react";
import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import HomePage from '../pages/HomePage/HomePage';
import ReservationPage from '../pages/ReservationPages/ReservationPage';
import ReservationAdminPage from '../pages/ReservationPages/ReservationAdminPage';
import LogInPage from '../pages/LogInPage';
import RegisterPage from '../pages/RegisterPage';
import Toast from './CustomComponents/Toast'
import ModelsAndTypesPage from '../pages/ReservationPages/ModelsAndTypesPage';
import UsersPage from '../pages/ReservationPages/UsersPage';
import { ConfirmationDialogProvider } from '../contexts/ConfirmationDialogContext';

export const ToastContext = createContext();

const RoleBasedRoute = ({ adminComponent: AdminComponent, userComponent: UserComponent }) => {
  const role = sessionStorage.getItem('role');
  return role === 'Admin' ? <AdminComponent /> : <UserComponent />;
};

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
    <ConfirmationDialogProvider>
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
      <Route path="/reservations" element={<RoleBasedRoute adminComponent={ReservationAdminPage} userComponent={ReservationPage} />} />
      <Route path="/modelsandtypes" element={<RoleBasedRoute adminComponent={ModelsAndTypesPage} userComponent={ReservationPage} />} />
      <Route path="/users" element={<RoleBasedRoute adminComponent={UsersPage} userComponent={ReservationPage} />} />
      <Route path="/login" element={<LogInPage />} />
      <Route path="/register" element={<RegisterPage />} />
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
    </ConfirmationDialogProvider>
    </ToastContext.Provider>
  );
}

export default App;
