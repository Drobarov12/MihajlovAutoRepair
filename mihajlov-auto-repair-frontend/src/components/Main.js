import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';

const BackgroundImageBox = styled(Box)(({ theme }) => ({
  backgroundImage: 'url(/assets/mainphoto.png)', // Replace this with your actual image path or URL
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh', // Full viewport height
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  color: theme.palette.common.white,
}));

const MainContent = () => {
  return (
    <BackgroundImageBox>
      <ContentBox>
        <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
          MIHAJLOV REPAIR AUTOMOBILE
        </Typography>
        <Typography variant="body1" sx={{ marginY: 3, maxWidth: '600px' }}>
          Lorem ipsum dolor sit amet consectetur. Tellus morbi pretium aenean pharetra. 
          Phasellus tristique eu malesuada non pharetra phasellus egestas gravida magna.
        </Typography>
        <Button 
          variant="contained" 
          sx={{ backgroundColor: 'lightBlue.main', color: 'lightBlue.contrastText', padding: '10px 20px' }}
        >
          Learn more
        </Button>
      </ContentBox>
    </BackgroundImageBox>
  );
}

export default MainContent;
