import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  Box,
  Autocomplete,
  Select,
  MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from '@mui/icons-material/Clear';
import { fetchReservations, deleteReservation, editReservation, fetchModels, fetchTypes } from '../../api';
import { ToastContext } from "../App";
import { useNavigate } from "react-router-dom"; 
import { useTranslation } from 'react-i18next';
import { useConfirmationDialog } from '../../contexts/ConfirmationDialogContext';


const ReservationsAdminPage = () => {
  const { showConfirmationDialog } = useConfirmationDialog();
  const { t } = useTranslation();
  const showToast = useContext(ToastContext);
  const navigate = useNavigate();
  const [editingRow, setEditingRow] = useState(null); 
  const [editData, setEditData] = useState({}); 
  const [reservations, setReservations] = useState([]); 
  const [filteredReservations, setFilteredReservations] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [models, setModels] = useState([]); 
  const [filteredModels, setFilteredModels] = useState([]);
  const [types, setTypes] = useState([]); 
  const [isTyping, setIsTyping] = useState(false);


  const getData = async () => {
    try {
      const reservations = await fetchReservations();
      reservations.sort((a, b) =>  new Date(b.dateTime) -  new Date(a.dateTime));
      setReservations(reservations);
      setFilteredReservations(reservations);

      const modelsData = await fetchModels();
      setModels(modelsData);
      setFilteredModels(modelsData);

      const tyoesData = await fetchTypes();
      setTypes(tyoesData);
    }
    catch (error) {
      if(error.status === 401){
          showToast(t('messages.loginAgain'), "error");
          return;
      }
      showToast(`${t('message.errorGettingData')}, ${t('messages.tryAgain')}`, "error")
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
    }, []);

  const handleEdit = (reservation) => {
    setEditingRow(reservation.id);
    setEditData(reservation);
  };

  const handleDelete = async (id) => {
    showConfirmationDialog(
      t('dialog.deleteTitle'),
      t('dialog.deleteReservationDescription'),
      async () => {
          try{
            await deleteReservation(id);
            setReservations((prev) => prev.filter((rez) => rez.id !== id));
            setFilteredReservations((prev) => prev.filter((rez) => rez.id !== id));
            showToast(t('messages.deletingSuccessful'), "success")
          } catch (error){
            if(error.status === 401){
              showToast(t('messages.loginAgain'), "error");
              return;
            }
            showToast(`${t('message.errorDeletingData')}, ${t('messages.tryAgain')}`, "error")
            console.error("Error deleting data:", error);
          }
      }
    );
  };

  const handleSave = async() => {
    try{
        await editReservation(editData);
        setReservations((prev) => prev.map((rez) => (rez.id === editingRow ? editData : rez)));
        setFilteredReservations((prev) => prev.map((rez) => (rez.id === editingRow ? editData : rez)));
        showToast(t('messages.updatingSuccessful'), "success")
    } catch (error){
        if(error.status === 401){
          showToast(t('messages.loginAgain'), "error");
            return;
        }
        showToast(`${t('message.errorUpdatingData')}, ${t('messages.tryAgain')}`, "error")
        console.error("Error edit data:", error);
    }
    setEditData({});
    setEditingRow(null); 
  };

  const handelClear = () => {
    setEditData({});
    setEditingRow(null);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) =>{
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = reservations.filter((reservation) =>
      Object.values(reservation).some((value) =>
        value?.toString().toLowerCase().includes(query)
      )
    );

    setFilteredReservations(filtered);
  };


  const handleAutocompleteChange = (event, value) => {
    setIsTyping(!!value); 
    setEditData({ ...editData, modelName: value });

    
    if(value){
        setFilteredModels(
            models.filter((option) =>
              option.modelName.toLowerCase().includes(value.toLowerCase())
            )
          );
    } else {
        setFilteredModels(models);
    }
  };

  return (
    <Box
    sx={{
      backgroundImage: 'url("../assets/mainphoto.png")', 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '95vh',
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
        maxWidth: '80%',
        maxHeight: '90%',
        width: '100%',
      }}
    >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px"
          }}
        >
          {/* Search Field */}
          <TextField
            label={t('reservation.search')}
            variant="outlined"
            value={searchQuery}
            onChange={handleFilterChange}
            sx={{
                "& .MuiInputLabel-root": {
                    color: "white",
                  },
                  // Label color when focused
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "white",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                    borderColor: "white",
                  },
              }}
            inputProps={{
              style: { backgroundColor: "black",color: "white", borderRadius: '12px' }, // Optional: Add a white background
            }}
          />
          
          {/* Model & Types Button */}
          <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/users")}
            sx={{ minWidth: "150px", margin:'10px' }}>
            {t('users.title')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>  navigate("/modelsandtypes")}
            sx={{ minWidth: "150px", margin:'10px' }}>
            {t('reservation.modelsAndTypes')}
          </Button>
          </Box>
        </Box>
    <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
      <Table sx={{ minWidth: 650}} stickyHeader >
        <TableHead>
          <TableRow >
            <TableCell sx={{ backgroundColor:'Black', color:'white'}}>{t('reservation.name')}</TableCell>
            <TableCell sx={{ backgroundColor:'Black', color:'white', minWidth: '120px', position: 'center'}}>{t('reservation.phoneNumber')}</TableCell>
            <TableCell sx={{ backgroundColor:'Black', color:'white', minWidth: '170px'}}>{t('reservation.model')}</TableCell>
            <TableCell sx={{ backgroundColor:'Black', color:'white', minWidth: '170px'}}>{t('reservation.description')}</TableCell>
            <TableCell sx={{ backgroundColor:'Black', color:'white', minWidth: '110px'}}>{t('reservation.type')}</TableCell>
            <TableCell sx={{ backgroundColor:'Black', color:'white'}}>{t('reservation.dateTime')}</TableCell>
            <TableCell sx={{ backgroundColor:'Black', color:'white'}}>{t('reservation.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredReservations.map((reservation) => (
            <TableRow key={reservation.id} sx={{ backgroundColor: 'Black' , '&:last-child td, &:last-child th': { border: 0 } }}>
              {editingRow === reservation.id ? (
                <>
                <TableCell sx={{color: 'white'}}>{editData.userName}</TableCell>
                <TableCell>
                    <TextField
                      name="userPhoneNumber"
                      value={editData.userPhoneNumber}
                      onChange={handleChange}
                      size="small"
                      sx={{backgroundColor: 'white'}}
                    />
                </TableCell>
                <TableCell>
                <Autocomplete
                  options={isTyping ? models : filteredModels}
                  getOptionLabel={(option) => option.modelName}
                  onChange={(event, value) => {
                      setEditData({ ...editData, modelName: value ? value.modelName : '' });
                    }}
                  onInputChange={handleAutocompleteChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={editData.modelName}
                      variant="filled"
                      name="model"
                      InputProps={{
                        ...params.InputProps,
                      }}
                      InputLabelProps={{
                        style: { color: 'white' },
                      }}
                    />
                  )}
                />
                </TableCell>
                  <TableCell>
                    <TextField
                      name="description"
                      value={editData.description}
                      onChange={handleChange}
                      size="small"
                      sx={{backgroundColor: 'white'}}
                    />
                </TableCell>
                <TableCell>
                <Select
                  name="type"
                  value={editData.typeName}
                  onChange={(e) => {
                    setEditData({ ...editData, typeName: e.target.value });
                  }}
                  sx={{
                    backgroundColor: 'White',
                    color: 'Black',
                    borderRadius: '8px',
                  }}
                >
                  {types.map((type) => (
                      <MenuItem key={type.id} value={type.typeName}>
                        {type.typeName}
                      </MenuItem>
                    ))}
                </Select>
                </TableCell>
                <TableCell>
                    <TextField
                      name="dateTime"
                      value={editData.dateTime}
                      onChange={handleChange}
                      size="small"
                      sx={{backgroundColor: 'white'}}
                    />
                </TableCell>
                  <TableCell>
                    <IconButton onClick={handleSave} sx={{ color: 'green' }}>
                      <SaveIcon />
                    </IconButton>
                    <IconButton onClick={handelClear} sx={{ color: 'Red' }}>
                      <ClearIcon />
                    </IconButton>
                  </TableCell>
                </>
              ) : (
                 <>
                  <TableCell sx={{color: 'white'}}>{reservation.userName}</TableCell>
                  <TableCell sx={{color: 'white'}}>{reservation.userPhoneNumber}</TableCell>
                  <TableCell sx={{color: 'white'}}>{reservation.modelName}</TableCell>
                  <TableCell sx={{color: 'white'}}>{reservation.description}</TableCell>
                  <TableCell sx={{color: 'white'}}>{reservation.typeName}</TableCell>
                  <TableCell sx={{color: 'white'}}>{new Date(reservation.dateTime).toLocaleString()}</TableCell>
                  
                 
                  <TableCell>
                    <IconButton onClick={() => handleEdit(reservation)} sx={{ color: 'orange' }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(reservation.id)} sx={{ color: 'Red' }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
    </Box>
  );
};

export default ReservationsAdminPage;
