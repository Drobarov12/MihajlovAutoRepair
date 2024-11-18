import React from 'react';
import { Box } from '@mui/material';
import aboutUsImage from '../../assets/aboutUsPhoto.png';
import AboutUsText from './AboutUsText';

const AboutUs = () => {
    return (
        <Box
            sx={{
                height: { xs: 'auto', md: '70vh' }, // Adjust height for small screens
                position: 'relative',
                my: 4,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' }, // Stack vertically on small screens
                alignItems: 'center',
            }}
        >
            {/* Text Box */}
            <Box
                sx={{
                    width: { xs: '90%', md: '50%' },
                    height: { xs: 'auto', md: '80%' },
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    zIndex: 2,
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                    mb: { xs: 4, md: 0 }, // Add spacing below text on small screens
                }}
            >
                <AboutUsText />
            </Box>

            {/* Image Box */}
            <Box
                component="img"
                src={aboutUsImage}
                alt="Mechanic working on car"
                sx={{
                    width: { xs: '90%', md: '646px' },
                    height: { xs: 'auto', md: '681px' },
                    objectFit: 'cover',
                    zIndex: 1,
                }}
            />
        </Box>
    );
};

export default AboutUs;
