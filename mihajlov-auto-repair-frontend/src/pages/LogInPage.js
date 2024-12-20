import React, { useState, useContext } from 'react';
import {  TextField, Button, IconButton, Grid, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import InstagramIcon from '@mui/icons-material/Instagram';
import { ToastContext } from "../components/App";
import { useUser } from "../contexts/UserContext";
import { useNavigate, useLocation } from "react-router-dom"; 
import { loginUser } from '../services/user';



const LogInPage = () => {
  const showToast = useContext(ToastContext);
  const location = useLocation();
  const { setUserInfo } = useUser();
  const navigate = useNavigate()

  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");

  const { t } = useTranslation();

  const initialUsername = location.state?.username || ""; // Default to empty if no state
  const [formData, setFormData] = useState({
    username: initialUsername,
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailChange = (e) => {
    const input = e.target.value;

    if (isValidEmail(input)) {
      setError(false);
      setHelperText("");
    } else {
      setError(true);
      setHelperText("Invalid email format");
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(formData.username)) {
      showToast(t('messages.invalidEmail'), "error");
      return
    } 
    
    if(formData.password === "")
    {
      showToast(t('messages.enterPassword'), "error");
      return
    }
    
    try {
      const response = await loginUser(formData);

      console.log('Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          showToast(t('messages.invalidCred'), "error");
          formData.password = '';
        } else {
          showToast(`${t('messages.errorHappedn')}, ${t('messages.tryAgain')}.`, "error");
          formData.password = '';
        }
        return;
      }

      const data = await response.json();
      const userInfo = data.user; // Example
      setUserInfo(userInfo);
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("role", data.role);
      showToast(t('messages.loginSuccessful'), "success");
      navigate("/reservations");
      // Redirect or perform other actions after successful login
      } catch (error) {
        showToast(`${t('messages.errorHappedn')}, ${t('messages.tryAgain')}.`, "error");
        console.error('Login error:', error);
        formData.password = '';
    }

  };

  return (
    <Box
      sx={{
        backgroundImage: 'url("../assets/mainphoto.png")', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)', 
          padding: '30px',
          borderRadius: '12px',
          maxWidth: '600px',
          width: '100%',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, color: 'white' }}>
        {t('login.title')}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('login.username')}
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleEmailChange}
                error={error} // Highlight red if error
                helperText={helperText}
                variant="filled"
                InputProps={{
                  sx: {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    borderRadius: '8px',
                  },
                }}
                InputLabelProps={{
                  style: { color: 'white' },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('login.password')}
                name="password"
                value={formData.password}
                onChange={handleChange}
                variant="filled"
                type='password'
                InputProps={{
                  sx: {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    borderRadius: '8px',
                  },
                }}
                InputLabelProps={{
                  style: { color: 'white' },
                }}
              />
            </Grid>
            {/* <Grid item xs={12}> TODO: Use the code when we implement logIn with google facebook ..
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
                <Box sx={{ flex: 1, height: '1px', backgroundColor: 'white' }} />
                <Typography sx={{ mx: 2, color: 'white' }}>{t('login.or')}</Typography>
                <Box sx={{ flex: 1, height: '1px', backgroundColor: 'white' }} />
              </Box>
            </Grid>
            <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <IconButton
                aria-label="Google"
                sx={{ color: '#fff', paddingLeft: '10px', paddingRight: '10px' }} 
              >
                <GoogleIcon fontSize="large" />
              </IconButton>
              <IconButton
                aria-label="Instagram"
                sx={{ color: '#fff', paddingLeft: '10px', paddingRight: '10px' }}
              >
                <InstagramIcon fontSize="large" />
              </IconButton>
              <IconButton
                aria-label="Facebook"
                sx={{ color: '#fff', paddingLeft: '10px', paddingRight: '10px' }} 
              >
                <FacebookIcon fontSize="large" />
              </IconButton>
            </Box>
            </Grid> */}
            <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'white',
                padding: '10px',
                borderRadius: '8px',
              }}
              onClick={() => navigate('/register')}
            >
              {t('register.title')}
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#1976D2',
                color: 'white',
                padding: '10px',
                borderRadius: '8px',
              }}
              type="submit"
            >
              {t('login.title')}
            </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default LogInPage;
