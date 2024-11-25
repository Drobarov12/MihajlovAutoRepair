import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Box,
  Autocomplete,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { fetchUsers, fetchModels, updateUser, deleteUser, updateUserRole } from "../../api"
import { ToastContext } from "../App";

const UsersPage = () =>
{
    const showToast = useContext(ToastContext);
    const [users, setUsers] = useState([]);
    const [editRow, setEditRow] = useState([]);

    const [models, setModels] = useState([]); 
    const [filteredModels, setFilteredModels] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
          const usersData = await fetchUsers();
          setUsers(usersData);

          const modelsData = await fetchModels();
          setModels(modelsData);
          setFilteredModels(modelsData)
        };
    
        fetchData();
      }, []);

    const handleEdit = (user) =>{
        setEditRow(user)
    };

    const handleDelete = async (id) =>{
        try{
            await deleteUser(id);
            setUsers((prev) => prev.filter((user) => user.id !== id));
        } catch (error){
            if(error.status === 401){
                showToast("Please log in again", "error");
                return;
            }
            showToast("Error deleting data, please try again", "error")
        }
    };
    const handleSave = async () =>{
        try{
            await updateUser(editRow);
            setUsers((prev) =>
                prev.map((user) => (user.id === editRow.id ? editRow : user))
            );
            setEditRow({});
        } catch (error){
            if(error.status === 401){
                showToast("Please log in again", "error");
                return;
            }
            showToast("Error saving data, please try again", "error")
        }
    };

    const handleAdmin = async (user) => {
        try{
            if(user.userRole !== "Admin"){
                // await updateUserRole(user.id, "Admin");
                // user.userRole = "Admin";
                // setUsers((prev) => prev.map((user) => user));
            }
            else{
                
                // confirmAlert({
                //     title: 'Change the role',
                //     message: `Are you sure you want to remve Admin role from user ${user.username}`,
                //     buttons: [
                //       {
                //         label: 'Yes',
                //         onClick: async () => await updateUserRole(user.id, "User"),
                //       },
                //       {
                //         label: 'No',
                //       },
                //     ],
                //   });
            }
        } catch (error){
            if(error.status === 401){
                showToast("Please log in again", "error");
                return;
            }
            showToast("Error changing role, please try again", "error")
        }
    }

    const handleAutocompleteChange = (event, value) => {
        setIsTyping(!!value); // Set typing state based on input
        setEditRow({ ...editRow, modelName: value });
    
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

    return(
        <Box
            sx={{
            backgroundImage: 'url("../assets/mainphoto.png")', 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '95vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            }}>
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
                <Typography
                    variant="h5"
                    component="div"
                    sx={{color: 'white', fontWeight: 'bold', marginBottom:'10px'}}>
                    Users
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor:'Black', color:'white'}}>Username</TableCell>
                                <TableCell sx={{ backgroundColor:'Black', color:'white'}}>PhoneNumber</TableCell>
                                <TableCell sx={{ backgroundColor:'Black', color:'white', minWidth: '180px'}}>Model</TableCell>
                                <TableCell sx={{ backgroundColor:'Black', color:'white'}}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => 
                            editRow.id === user.id ? (
                                <TableRow key={user.id}>
                                    <TableCell sx={{ backgroundColor:'Black', color:'white'}}>{user.username}</TableCell>
                                    <TableCell sx={{ backgroundColor:'Black', color:'white'}}>
                                        <TextField
                                            value={editRow.phoneNumber || ""}
                                            sx={{ backgroundColor:'white', minWidth: '120px'}}
                                            onChange={(e) => setEditRow({ ...editRow, phoneNumber: e.target.value })}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ backgroundColor:'Black', color:'white'}}>
                                        <Autocomplete
                                            options={isTyping ? models : filteredModels}
                                            getOptionLabel={(option) => option.modelName}
                                            onChange={(event, value) => {
                                                setEditRow({ ...editRow, modelName: value ? value.modelName : '', modelId: value ? value.id : 0 });
                                                }}
                                            onInputChange={handleAutocompleteChange}
                                            renderInput={(params) => (
                                                <TextField
                                                {...params}
                                                label={editRow.modelName}
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
                                    <TableCell sx={{ backgroundColor:'Black', color:'white'}}>
                                        <IconButton onClick={() => handleSave()} sx={{ color:'green'}}>
                                            <SaveIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ):(
                                <TableRow key={user.id}>
                                    <TableCell sx={{ backgroundColor:'Black', color:'white'}}>{user.username}</TableCell>
                                    <TableCell sx={{ backgroundColor:'Black', color:'white'}}>{user.phoneNumber}</TableCell>
                                    <TableCell sx={{ backgroundColor:'Black', color:'white'}}>{user.modelName}</TableCell>
                                    <TableCell sx={{ backgroundColor:'Black'}}>
                                        <IconButton onClick={() => handleEdit(user)} sx={{ color:'orange'}}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(user.id)} sx={{ color:'Red' }}>
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleAdmin(user)} sx={{ color:'green' }}>
                                            <SupervisorAccountIcon />
                                        </IconButton>
                                        </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

        </Box>
    </Box>
    );
};

export default UsersPage;