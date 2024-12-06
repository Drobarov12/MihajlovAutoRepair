import React, { useState, useContext } from 'react';
import { TextField, Button, IconButton, Grid, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import InstagramIcon from '@mui/icons-material/Instagram';
import { ToastContext } from "../components/App";
import { useNavigate } from "react-router-dom";
import { registerUser } from '../services/user';

const RegisterPage = () => {
  const showToast = useContext(ToastContext);
  const navigate = useNavigate();

  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });

  const [passwordError, setPasswordError] = useState(false);
  const [helperText, setHelperText] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordError(true);
      setHelperText(t('messages.passwordNotMatch'));
      return;
    }

    try {
      const response = await registerUser(formData);

      if (!response.ok) {
        showToast(`${t('messages.errorHappedn')}, ${t('messages.tryAgain')}.`, "error");
        return;
      }

      showToast(t('message.registerSuccessful'), "success");
      navigate('/login', { state: { username: formData.username } });
    } catch (error) {
      showToast(`${t('messages.errorHappedn')}, ${t('messages.tryAgain')}.`, "error");
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
          {t('register.title')}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('register.username')}
                name="username"
                value={formData.username}
                onChange={handleChange}
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
                label={t('register.phoneNumber')}
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
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
                label={t('register.password')}
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
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
                label={t('register.confirmPassword')}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                type="password"
                variant="filled"
                error={passwordError}
                helperText={helperText}
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
                <Typography sx={{ mx: 2, color: 'white' }}>{t('register.or')}</Typography>
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
                  {t('register.title')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default RegisterPage;
