import React from 'react';
import { Box, Typography, IconButton, Divider } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
  return (
    <Box
      sx={{
        backgroundColor: 'black.main', // Dark background color
        color: 'black.contrastText',
        textAlign: 'center',
        padding: '5px', 
        position: 'fixed', 
        bottom: 0, 
        width: '100%', 
        zIndex: 1000, 
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2px 5px', 
        }}
      >
        {/* Brand Name */}
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          {t('mainContent.title')}
        </Typography>

        <Box>
          <IconButton
            aria-label="Twitter"
            sx={{ color: '#fff', padding: '2px' }} 
          >
            <TwitterIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            aria-label="LinkedIn"
            sx={{ color: '#fff', padding: '2px' }}
          >
            <LinkedInIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            aria-label="Facebook"
            sx={{ color: '#fff', padding: '2px' }} 
          >
            <FacebookIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ backgroundColor: '#fff', my: 0.5 }} />

      <Typography variant="caption">
        All rights reserved © 2024 by Mihajlov Auto Repairs
      </Typography>
    </Box>
  );
};

export default Footer;
