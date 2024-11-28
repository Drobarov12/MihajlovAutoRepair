import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const MakeReservation = () => {
    const { t } = useTranslation();
  return (
    <Box
      sx={{
        backgroundColor: 'blue.main', 
        color: '#fff',
        textAlign: 'center',
        padding: '50px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          mb: 2,
        }}
      >
       {t('makeReservation.title')}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 4,
          maxWidth: '600px', // Optional: set a max width fer readability
        }}
      >
        {t('makeReservation.description')}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{
          backgroundColor: '#fff',
          color: '#1565c0',
          fontWeight: 'bold',
          borderRadius: '50px',
          padding: '10px 30px',
          '&:hover': {
            backgroundColor: '#e3f2fd',
          },
        }}
      >
        {t('makeReservation.button')}
      </Button>
    </Box>
  );
};

export default MakeReservation;
