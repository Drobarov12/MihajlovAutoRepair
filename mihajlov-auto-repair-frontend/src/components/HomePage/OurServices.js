import React from 'react';
import { Grid, Card, Typography, Box } from '@mui/material';
import bookmarkIcon from '../../assets/services.png';
import { useTranslation } from 'react-i18next';

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
      title: t('ourServices.thirdCardTitle'),
      description: t('ourServices.thirdCardDescription'),
    },
    {
      title: t('ourServices.fourthCardTitle'),
      description: t('ourServices.fourthCardDescription'),
    },
  ];

  return (
    <Box
      sx={{
        padding: { xs: '20px 10px', sm: '40px 20px', md: '40px 80px' }, // Responsive padding
        backgroundColor: '#fff',
        textAlign: 'center',
        minHeight: { xs: 'auto', md: '80vh' }, // Adjust height for mobile
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          mb: 4,
          textTransform: 'uppercase',
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, // Responsive font size
        }}
      >
        {t('ourServices.title')}
      </Typography>

      <Grid container spacing={4}>
        {services.map((service, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'center', // Center cards on smaller screens
            }}
          >
            <Card
              sx={{
                padding: { xs: '20px', sm: '30px' }, // Responsive card padding
                width: { xs: '100%', sm: '90%', md: '80%' }, // Adjust width for mobile
                height: { xs: 'auto', sm: '200px' }, // Adjust height for mobile
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
                alt="Service icon"
                sx={{
                  width: '60px',
                  height: '60px',
                  color: '#90caf9',
                  mb: 2,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  mb: 1,
                  textTransform: 'uppercase',
                  fontSize: { xs: '1rem', sm: '1.2rem' }, // Responsive font size
                }}
              >
                {service.title}
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{
                  fontSize: { xs: '0.9rem', sm: '1rem' }, // Adjust font size
                }}
              >
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
