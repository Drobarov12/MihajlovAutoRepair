import React, { useState, useContext } from 'react';
import {  TextField, Button, IconButton, Grid, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import InstagramIcon from '@mui/icons-material/Instagram';
import { ToastContext } from "./App";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom"; 


const LogInPage = () => {
  const showToast = useContext(ToastContext);
  const { setUserInfo } = useUser();
  const navigate = useNavigate()

  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");

  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: '',
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
    setEmail(input);

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
      showToast("Invalid email!", "error");
      return
    } 
    
    if(formData.password == "")
    {
      showToast("Enter password!", "error");
      return
    }
    
    try {
      const response = await fetch('http://127.0.0.1:5105/api/Account/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: formData.username,
          Password: formData.password,
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          showToast('Invalid username or password', "error");
          formData.password = '';
        } else {
          showToast('An error occurred. Please try again.', "error");
          formData.password = '';
        }
        return;
      }

      const data = await response.json();
      const userInfo = data.user; // Example
      setUserInfo(userInfo);
      showToast("You are logged in!", "success");
      navigate("/reservations");
      // Redirect or perform other actions after successful login
      } catch (error) {
      showToast('An error occurred. Please try again.', "error");
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
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
