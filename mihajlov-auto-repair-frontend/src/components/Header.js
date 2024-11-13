import React, { useState } from 'react';
import { Box, Typography, AppBar, Toolbar, Button, ToggleButton, ToggleButtonGroup} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

const Header = () => {
  const { t , i18n} = useTranslation();
  const { userInfo, setUserInfo } = useUser();
  const navigate = useNavigate();

  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const handleLanguageChange = (event, newLanguage) => {
    if (newLanguage) {
      setSelectedLanguage(newLanguage);
      i18n.changeLanguage(newLanguage);
    }
  };

  const handleLogout = () => {
    setUserInfo(null); 
    navigate('/login');
  };

  return (
    <AppBar position="sticky" color="black">
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap', // Ensures items don't overflow on small screens
        }}
      >
         {/* Welcome Message */}
         <Box sx={{ display: 'flex', alignItems: 'center' }}>
        
          <ToggleButtonGroup
            value={selectedLanguage}
            exclusive
            onChange={handleLanguageChange}
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', margin:'5px' }}
          >
           <ToggleButton
    value="en"
    sx={{
      color: '#fff',
      padding: '4px 8px', // Smaller padding
      fontSize: '0.75rem', // Smaller font size
      minWidth: '50px', // Smaller button width
      '&.Mui-selected': {
        backgroundColor: '#1976D2',
        color: '#fff',
      },
    }}
  >
    {t('footer.languageEn', { defaultValue: 'English' })}
  </ToggleButton>
  <ToggleButton
    value="mk"
    sx={{
      color: '#fff',
      padding: '4px 8px', // Smaller padding
      fontSize: '0.75rem', // Smaller font size
      minWidth: '50px', // Smaller button width
      '&.Mui-selected': {
        backgroundColor: '#1976D2',
        color: '#fff',
      },
    }}
  >
    {t('footer.languageMk', { defaultValue: 'Macedonian' })}
  </ToggleButton>
  </ToggleButtonGroup>

          {userInfo && (
            <Typography variant="body1" sx={{ color: 'white', marginRight: '20px' }}>
              {`${t('header.welcome')} ${userInfo.userName}`}
            </Typography>
          )}
        </Box>
        
        {/* Centered Logo */}
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              textAlign: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            {t('header.logo')}
          </Typography>
        </Box>


        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" component={Link} to="/">{t('header.home')}</Button>
          <Button color="inherit" component={Link} to="/reservations">{t('header.reservations')}</Button>
          {userInfo ? (
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{ backgroundColor: 'lightBlue.main', color: 'lightBlue.contrastText' }}
            >
              {t('header.logout')}
            </Button>
          ) : (
            <Button
              variant="contained"
              component={Link}
              to="/login"
              sx={{ backgroundColor: 'lightBlue.main', color: 'lightBlue.contrastText' }}
            >
              {t('header.login')}
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
