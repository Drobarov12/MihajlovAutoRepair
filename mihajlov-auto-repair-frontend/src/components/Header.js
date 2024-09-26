import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t } = useTranslation();
  return (
    <AppBar position="static" color="black">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="div">
            {t('header.logo')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" href="/">{t('header.home')}</Button>
          <Button color="inherit" href="/reservations">{t('header.reservations')}</Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'lightBlue.main', color: 'lightBlue.contrastText' }}
          >
            {t('header.login')}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;