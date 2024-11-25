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
import { fetchReservations, deleteReservation, editReservation, fetchModels, fetchTypes } from '../../api';
import { ToastContext } from "../App";
import { useNavigate } from "react-router-dom"; 

const ReservationsAdminPage = () => {
  const showToast = useContext(ToastContext);
  const navigate = useNavigate();
  const [editingRow, setEditingRow] = useState(null); // Track the row being edited
  const [editData, setEditData] = useState({}); // Store the current data being edited
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
            showToast("Please log in again", "error");
            return;
        }
        showToast("Error getting data, please try again", "error")
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
    try{
        await deleteReservation(id);
        await getData();
        showToast("Delete was successful", "success")
    } catch (error){
        if(error.status === 401){
            showToast("Please log in again", "error");
            return;
        }
        showToast("Error deleting data, please try again", "error")
        console.error("Error deleting data:", error);
    }
  };

  const handleSave = async() => {
    try{
        await editReservation(editData);
        await getData();
        showToast("Update was successful", "success")
    } catch (error){
        if(error.status === 401){
            showToast("Please log in again", "error");
            return;
        }
        showToast("Error updating data, please try again", "error")
        console.error("Error edit data:", error);
    }
    setEditingRow(null); // Exit edit mode
  };

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
    setIsTyping(!!value); // Set typing state based on input
    setEditData({ ...editData, modelName: value });

    // Dynamically update filteredModels while typing
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
            label="Search"
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
            Users
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>  navigate("/modelsandtypes")}
            sx={{ minWidth: "150px", margin:'10px' }}>
            Models & Types
          </Button>
          </Box>
        </Box>
    <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
      <Table sx={{ minWidth: 650}} stickyHeader >
        <TableHead>
          <TableRow >
            <TableCell sx={{ backgroundColor:'Black', color:'white'}}>User</TableCell>
            <TableCell sx={{ backgroundColor:'Black', color:'white', minWidth: '120px', position: 'center'}}>Phone</TableCell>
            <TableCell sx={{ backgroundColor:'Black', color:'white', minWidth: '170px'}}>Model</TableCell>
            <TableCell sx={{ backgroundColor:'Black', color:'white', minWidth: '170px'}}>Description</TableCell>
            <TableCell sx={{ backgroundColor:'Black', color:'white', minWidth: '110px'}}>Type</TableCell>
            <TableCell sx={{ backgroundColor:'Black', color:'white'}}>Date & Time</TableCell>
            <TableCell sx={{ backgroundColor:'Black', color:'white'}}>Actions</TableCell>
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
