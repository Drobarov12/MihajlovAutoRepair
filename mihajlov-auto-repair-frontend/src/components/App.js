import './App.css';
import { Box } from '@mui/material';
import Header from './Header';
import MainContent from './Main'; 
import AboutUs from './AboutUs'; 
import OurServices from './OurServices';
import WhyChooseUs from './WhyChoseUs';
import MakeReservation from './MakeReservation';
import MainFooter from './MainFooter';



function App() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '60px', 
      }}
    >
      <Header />
      <MainContent />
      <AboutUs />
      <OurServices />
      <WhyChooseUs />
      <MakeReservation />
      <MainFooter />
    </Box>
  );
}

export default App;
