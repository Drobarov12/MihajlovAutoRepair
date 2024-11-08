import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid, Box, Typography, Autocomplete } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { fetchModels, fetchTypes } from '../api';

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

  const [models, setModels] = useState([]); // Holds all models
  const [types, setTypes] = useState([]); // Holds all models
  const [filteredModels, setFilteredModels] = useState([]); // Holds filtered models
  const [searchQuery, setSearchQuery] = useState(''); // Holds search query

  useEffect(() => {
    const getData = async () => {
      try {
        const modelsData = await fetchModels();
        setModels(modelsData);
        setFilteredModels(modelsData); // Initially, show all models

        const tyoesData = await fetchTypes();
        setTypes(tyoesData)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, []);

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
              <Autocomplete
                options={filteredModels}
                getOptionLabel={(option) => option.modelName}
                filterOptions={(options, { inputValue }) =>
                  options.filter((option) =>
                    option.modelName.toLowerCase().includes(inputValue.toLowerCase())
                  )
                }
                onInputChange={(event, value) => {
                  setFormData({ ...formData, model: value });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('reservation.model')}
                    variant="filled"
                    name="model"
                    InputProps={{
                      ...params.InputProps,
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
              {/* <FormControl fullWidth variant="filled">
                <InputLabel style={{ color: 'white' }}>{t('reservation.model')}</InputLabel>
                <Select
                  name="model"
                  value={formData.model}
                  onChange={handleSearch}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200, // Limit dropdown height to 200px
                        overflowY: 'auto', // Add scroll for overflow
                      },
                    },
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                  }}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    borderRadius: '8px',
                  }}
                >
                  {filteredModels.map((model) => (
                      <MenuItem key={model.id} value={model.modelName}>
                        {model.modelName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl> */}
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
                  {types.map((type) => (
                      <MenuItem key={type.id} value={type.typeName}>
                        {type.typeName}
                      </MenuItem>
                    ))}
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
                value={formData.dateTime}
                onChange={handleDateChange}
                sx={{
                  width: '100%',
                  '& .MuiInputBase-root': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    borderRadius: '8px',
                  },
                  '& .MuiInputLabel-root': { 
                    color: 'white',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'white', 
                  },
                }}
                
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
