import { Box } from '@mui/material';
import MainContent from './Main'; 
import AboutUs from './AboutUs'; 
import OurServices from './OurServices';
import WhyChooseUs from './WhyChoseUs';
import MakeReservation from './MakeReservation';

function HomePage() {
    return(
        <Box>
            <MainContent />
            <AboutUs />
            <OurServices />
            <WhyChooseUs />
            <MakeReservation />
        </Box>   
    );
}

export default HomePage;