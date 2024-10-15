import React, { useState } from 'react';
import { Container, TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid, Box, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const ReservationPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    model: '',
    type: '',
    description: '',
    dateTime: dayjs(),
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dateTime: dayjs(date),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.dateTime.isValid()) {
      console.log(formData);
    } else {
      console.log('Invalid Date');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
        {t('reservation.title')}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('reservation.name')}
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="filled" // Use the filled variant for a more compact style
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
                label={t('reservation.phoneNumber')}
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
              <FormControl fullWidth variant="filled">
                <InputLabel style={{ color: 'white' }}>{t('reservation.model')}</InputLabel>
                <Select
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    borderRadius: '8px',
                  }}
                >
                  <MenuItem value="Model A">Model A</MenuItem>
                  <MenuItem value="Model B">Model B</MenuItem>
                  <MenuItem value="Model C">Model C</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="filled">
                <InputLabel style={{ color: 'white' }}>{t('reservation.type')}</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    borderRadius: '8px',
                  }}
                >
                  <MenuItem value="Repair">Repair</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('reservation.description')}
                name="description"
                value={formData.description}
                onChange={handleChange}
                variant="filled"
                multiline
                rows={2}
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
              <DateTimePicker
                  label={t('reservation.dateTime')}
                  variant="filled"
                  value={formData.dateTime}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField 
                      {...params}
                      fullWidth
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
                  )}
                />
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
                {t('reservation.reserve')}
              </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
    </LocalizationProvider>
  );
};

export default ReservationPage;
