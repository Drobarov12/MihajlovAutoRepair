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
import ClearIcon from '@mui/icons-material/Clear';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { fetchUsers, fetchModels, updateUser, deleteUser, updateUserRole } from "../../api"
import { ToastContext } from "../App";
import { useConfirmationDialog } from '../../contexts/ConfirmationDialogContext';
import { useTranslation } from 'react-i18next';

const UsersPage = () =>
{
    const { showConfirmationDialog } = useConfirmationDialog();
    const showToast = useContext(ToastContext);
    const { t } = useTranslation();

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

    const handleDelete = async (user) =>{
        showConfirmationDialog(
            t('dialog.deleteTitle'),
            `${t('dialog.deleteUserDescription')} ${user.username}`,
            async () => {
                try{
                    await deleteUser(user.id);
                    setUsers((prev) => prev.filter((u) => u.id !== user.id));
                } catch (error){
                    if(error.status === 401){
                        showToast(t('messages.loginAgain'), "error");
                        return;
                    }
                    showToast(`${t('message.errorDeletingData')}, ${t('messages.tryAgain')}`, "error")
                }
            }
        );
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
                showToast(t('messages.loginAgain'), "error");
                return;
            }
            showToast(`${t('message.errorSavingData')}, ${t('messages.tryAgain')}`, "error")
        }
    };

    const handleClear = () => {
        setEditRow({});
    }

    const handleAdmin = async (user) => {
        const isAdmin = user.userRole === "Admin"
        const dialogDesc = isAdmin ? t('dialog.roleRemoveAdminDescription') : t('dialog.roleAddAdminDescription');
        const roleStirng = isAdmin ? "User" : "Admin";
        showConfirmationDialog(
            t('dialog.roleTitle'),
            `${dialogDesc} ${user.username}`,
            async () => {
                try{
                    await updateUserRole(user.id, roleStirng)
                    user.userRole = roleStirng;
                    setUsers((prev) => prev.map((user) => user));
                } catch (error){
                    if(error.status === 401){
                        showToast(t('messages.loginAgain'), "error");
                        return;
                    }
                    showToast(`${t('message.errorChangingRole')}, ${t('messages.tryAgain')}`, "error");
                }
            }
        );
    }

    const handleAutocompleteChange = (event, value) => {
        setIsTyping(!!value); 
        setEditRow({ ...editRow, modelName: value });
    
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
                    {t('users.title')}
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor:'Black', color:'white'}}>{t('users.name')}</TableCell>
                                <TableCell sx={{ backgroundColor:'Black', color:'white'}}>{t('users.phoneNumber')}</TableCell>
                                <TableCell sx={{ backgroundColor:'Black', color:'white', minWidth: '180px'}}>{t('users.model')}</TableCell>
                                <TableCell sx={{ backgroundColor:'Black', color:'white'}}>{t('users.actions')}</TableCell>
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
                                        <IconButton onClick={() => handleClear()} sx={{ color:'Red'}}>
                                            <ClearIcon />
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
                                        <IconButton onClick={() => handleDelete(user)} sx={{ color:'Red' }}>
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleAdmin(user)} sx={{ 
                                            color: user.userRole === 'Admin' ? 'green' : 'yellow' }}>
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