import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  return (
    <BackgroundImageBox>
      <ContentBox>
        <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
        {t('mainContent.title')}
        </Typography>
        <Typography variant="body1" sx={{ marginY: 3, maxWidth: '600px' }}>
        {t('mainContent.description')}
        </Typography>
        <Button 
          variant="contained" 
          sx={{ backgroundColor: 'lightBlue.main', color: 'lightBlue.contrastText', padding: '10px 20px' }}
        >
          {t('mainContent.button')}
        </Button>
      </ContentBox>
    </BackgroundImageBox>
  );
}

export default MainContent;
