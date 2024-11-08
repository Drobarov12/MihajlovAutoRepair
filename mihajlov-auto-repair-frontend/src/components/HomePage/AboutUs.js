import React from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
import aboutUsImage from '../../assets/aboutUsPhoto.png';
import AboutUsText from './AboutUsText'

const AboutUs = () => {
    return (
      <Box
        sx={{
          height: '70vh', // 70% of the screen height
          position: 'relative',
          my: 4,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            right: '10%',
            width: '50%',
            height: '80%',
            backgroundColor: '#fff',
            borderRadius: '16px',
            zIndex: 2,
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
          }}
        >
        <AboutUsText />
        </Box>
        <Box
          component="img"
          src={aboutUsImage} 
          alt="Mechanic working on car"
          sx={{
            position: 'absolute',
            top: '3%',
            right: '8%',
            bottom: '3%',
            width: '646', 
            objectFit: 'cover',
            height: '681',
            zIndex: 1,
          }}
        />
      </Box> 
    );
  };
  
export default AboutUs;
