import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { userInfo, setUserInfo } = useUser();
  const navigate = useNavigate();

  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const handleLanguageChange = (event, newLanguage) => {
    if (newLanguage) {
      setSelectedLanguage(newLanguage);
      i18n.changeLanguage(newLanguage);
    }
  };

  const handleLogout = () => {
    setUserInfo(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate('/login');
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <AppBar position="sticky" color="black">
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Burger Menu Icon */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
          sx={{ display: { xs: 'block', md: 'none' } }} // Show only on small screens
        >
          <MenuIcon />
        </IconButton>

        {/* Drawer for Mobile Menu */}
        <Drawer
          anchor="left"
          open={isDrawerOpen}
          onClose={toggleDrawer(false)}
        >
          <Box
            sx={{
              width: 250,
              height: '100%',
              backgroundColor: '#000', 
              color: '#fff', 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            role="presentation"
            onClick={toggleDrawer(false)} 
            onKeyDown={toggleDrawer(false)}
          >
            
            <List sx={{margin: '50px 10px'}}>
            {userInfo && (
            <Typography variant="body1" sx={{ color: 'white', marginBottom: '20px' }}>
              {`${t('header.welcome')} ${userInfo.userName}`}
            </Typography>
          )}
              <ListItem button component={Link} to="/" 
                sx={{
                  color: '#fff', 
                  '&:hover': { backgroundColor: '#333' }, 
               }}>
                <ListItemText primary={t('header.home')} />
              </ListItem>
              <ListItem button component={Link} to="/reservations"
                sx={{
                  color: '#fff', // White text
                  '&:hover': { backgroundColor: '#333' }, 
                }}
              >
                <ListItemText primary={t('header.reservations')} />
              </ListItem>
              {userInfo ? (
                <ListItem button onClick={handleLogout}
                  sx={{
                    backgroundColor: '#1976D2',
                    color: '#fff', 
                    '&:hover': { backgroundColor: '#005bb5' }, 
                  }}
                >
                  <ListItemText primary={t('header.logout')} />
                </ListItem>
              ) : (
                <ListItem button component={Link} to="/login"
                  sx={{
                      width: '100%', 
                      color: '#fff',
                      backgroundColor: '#1976D2', 
                      textAlign: 'center',
                      '&:hover': { backgroundColor: '#005bb5' }, 
                    }}
                >
                  <ListItemText primary={t('header.login')} />
                </ListItem>
              )}
             
            </List>

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
            {/* Language Toggle at the Bottom */}
    <Box
      sx={{
        padding: 2,
        borderTop: '1px solid rgba(255, 255, 255, 0.2)', // Subtle divider
      }}
    >
      
      <ToggleButtonGroup
        value={selectedLanguage}
        exclusive
        onChange={handleLanguageChange}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: '4px 8px', // Smaller padding
          fontSize: '0.75rem', // Smaller font size
          minWidth: '50px',
          '& .MuiToggleButton-root': {
            color: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            '&.Mui-selected': {
              backgroundColor: '#1976D2',
              color: '#fff',
            },
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
          },
        }}
      >
        <ToggleButton value="en" sx={{padding: '4px', // Smaller padding
          fontSize: '0.75rem', // Smaller font size
          minWidth: '50px',}}>
          {t('footer.languageEn', { defaultValue: 'English' })}
        </ToggleButton>
        <ToggleButton value="mk" sx={{padding: '4px', // Smaller padding
          fontSize: '0.75rem', // Smaller font size
          minWidth: '50px',}}>
          {t('footer.languageMk', { defaultValue: 'Macedonian' })}
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
          </Box>
        </Drawer>

        <Box sx={{ alignItems: 'center', display:{ xs: 'none', md: 'flex' }, }}>
        <ToggleButtonGroup
        value={selectedLanguage}
        exclusive
        onChange={handleLanguageChange}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          
          '& .MuiToggleButton-root': {
            color: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            '&.Mui-selected': {
              backgroundColor: '#1976D2',
              color: '#fff',
            },
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
          },
        }}
      >
        <ToggleButton value="en" sx={{padding: '4px', // Smaller padding
          fontSize: '0.75rem', // Smaller font size
          minWidth: '50px',}}>
          {t('footer.languageEn', { defaultValue: 'English' })}
        </ToggleButton>
        <ToggleButton value="mk" sx={{padding: '4px', // Smaller padding
          fontSize: '0.75rem', // Smaller font size
          minWidth: '50px',}}>
          {t('footer.languageMk', { defaultValue: 'Macedonian' })}
        </ToggleButton>
      </ToggleButtonGroup>
      {userInfo && (
            <Typography variant="body1" sx={{ color: 'white', marginLeft: '20px' }}>
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

        {/* Desktop Menu */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' }, // Hide on small screens
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Button color="inherit" component={Link} to="/">
            {t('header.home')}
          </Button>
          <Button color="inherit" component={Link} to="/reservations">
            {t('header.reservations')}
          </Button>
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
};

export default Header;
