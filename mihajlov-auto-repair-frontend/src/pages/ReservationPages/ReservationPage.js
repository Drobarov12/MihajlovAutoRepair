import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid, Box, Typography, Autocomplete } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { addDays, setHours, setMinutes } from 'date-fns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { fetchModels, fetchTypes, createReservation } from '../../services/api';
import { useUser } from "../../contexts/UserContext";
import { ToastContext } from "../../components/App";
import { useNavigate } from "react-router-dom"; 

dayjs.extend(customParseFormat);

const ReservationPage = () => {
  const showToast = useContext(ToastContext);
  const { t } = useTranslation();
  const { userInfo } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: 0,
    name: '',
    phoneNumber: '',
    modelId: '',
    typeId: '',
    description: '',
    dateTime: dayjs(),
  });

  const [models, setModels] = useState([]); 
  const [types, setTypes] = useState([]); 
  const [filteredModels, setFilteredModels] = useState([]); 
  const [isTyping, setIsTyping] = useState(false);

  const now = dayjs();
  const minDateTime = now;  // current date
  const maxDateTime = dayjs(addDays(now.toDate(), 7));;  // 7 days from now

  const shouldDisableTime = (time) => {
    const hour = time.hour();
    return hour < 8 || hour >= 17;  // Disable times outside 8 AM to 5 PM
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const modelsData = await fetchModels();
        setModels(modelsData);
        setFilteredModels(modelsData)

        const tyoesData = await fetchTypes();
        setTypes(tyoesData)

        if(userInfo)
        {
          formData.userId = userInfo.id;
          formData.name = userInfo.userName;
          formData.phoneNumber = userInfo.phoneNumber;
          if(userInfo.modelId)
          {
            const userModel = modelsData.find(model => model.id === userInfo.modelId);
            setFilteredModels(userModel ? [userModel] : modelsData);
          }
        }
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

  const handleInputChange = (event, value) => {
    setIsTyping(!!value); // Set typing state based on input
    setFormData({ ...formData, model: value });

    // Dynamically update filteredModels while typing
    setFilteredModels(
      models.filter((option) =>
        option.modelName.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.modelId || !formData.typeId) {
      showToast(t('messages.missingModelsAndTypes'));
      return;
    }
  
    if (formData.dateTime.isValid()) {
      try {
        await createReservation(formData);
        showToast(t('messages.reservationCreated'), "success");
      } catch (error) {
        console.error("Error creating reservation:", error);
        showToast(`${t('messages.reservationCreateFail')}. ${t('messages.tryAgain')}`, "error");
      }
    } else {
      showToast(t('messages.invalidDate'), "error");
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px"
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold',  color: 'white' }}>
            {t('reservation.title')}
          </Typography>
          {sessionStorage.getItem('token') ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/userreservations")}
            sx={{ minWidth: "100px" }}
          >
            {t('reservation.reservations')}
          </Button>
        ) : null}
        </Box>
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
                options={isTyping ? models : filteredModels}
                getOptionLabel={(option) => option.modelName}
                onChange={(event, value) => {
                  setFormData({ ...formData, modelId: value ? value.id : '' });
                }}
                onInputChange={handleInputChange}
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
                  value={formData.typeId}
                  onChange={(e) => {
                    setFormData({ ...formData, typeId: e.target.value });
                  }}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    borderRadius: '8px',
                  }}
                >
                  {types.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
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
                minDateTime={minDateTime}
  maxDateTime={maxDateTime}
  shouldDisableTime={shouldDisableTime}
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
