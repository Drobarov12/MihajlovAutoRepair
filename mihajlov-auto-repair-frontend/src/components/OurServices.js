import React from 'react';
import { Grid, Card, Typography, Box } from '@mui/material';
import bookmarkIcon from '../assets/services.png';
import { useTranslation } from 'react-i18next';

// TODO add translation 


const OurServices = () => {
  const { t } = useTranslation();

  const services = [
    {
      title: t('ourServices.firstCardTitle'),
      description: t('ourServices.firstCardDescription'),
    },
    {
      title: t('ourServices.secondCardTitle'),
      description: t('ourServices.secondCardDescription'),
    },
    {
      title: t('ourServices.thidCardTitle'),
      description: t('ourServices.thidCardDescription'),
    },
    {
      title: t('ourServices.fourthCardTitle'),
      description: t('ourServices.fourthCardDescription'),
    },
  ];

  return (
    <Box
      sx={{
        padding: '40px 80px', // Increased padding from the sides
        backgroundColor: '#fff',
        textAlign: 'center',
        height: '80vh', // Slightly taller height to accommodate larger cards
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4, textTransform: 'uppercase' }}>
      {t('ourServices.title')}
      </Typography>

      <Grid container spacing={4}>
        {services.map((service, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              sx={{
                padding: '30px', // Increased padding inside the card
                height: '200px', // Ensures more square-like shape
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                borderRadius: '16px',
                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
              }}
            >
            <Box
                component="img"
                src={bookmarkIcon} 
                alt="Mechanic working on car"
                sx={{ fontSize: '60px', color: '#90caf9', mb: 2 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, textTransform: 'uppercase' }}>
                {service.title}
            </Typography>
            <Typography variant="body1" color="textSecondary">
                {service.description}
            </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OurServices;
