import './App.css';
import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import HomePage from './HomePage/HomePage';
import ReservationPage from './ReservationPage';
import LogInPage from './LogInPage';


function App() {
  return (
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
    </Router>
  );
}

export default App;
