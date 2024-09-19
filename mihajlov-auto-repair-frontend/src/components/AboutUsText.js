import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

const AboutUs = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ padding: '40px', backgroundColor: '#fff' }}>
      {/* Title Section */}
      <Typography variant="h2" sx={{ fontWeight: 'bold', mt: 2, mb: 8, textAlign: 'left', textTransform: 'uppercase' }}>
      {t('aboutUs.title')}
      </Typography>

      {/* Content Section */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="body1" sx={{ mb: 3, textAlign: 'left' }}>
          {t('aboutUs.firstParagraph')}
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, textAlign: 'left' }}>
          {t('aboutUs.secondParagraph')}
          </Typography>

          <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: 'left' }}>
          {t('aboutUs.thirdParagraph')}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutUs;
