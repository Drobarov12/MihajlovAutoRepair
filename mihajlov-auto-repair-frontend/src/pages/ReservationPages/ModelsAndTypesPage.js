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
  Grid,
  Box,
  Typography
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from '@mui/icons-material/Clear';
import { fetchModels, fetchTypes, deleteModel, deleteType, editModel, editType, addModel, addType } from "../../services/api";
import { ToastContext } from "../../components/App";
import { useTranslation } from 'react-i18next';
import { useConfirmationDialog } from '../../contexts/ConfirmationDialogContext';


const ModelsAndTypesPage = () => {
  const { showConfirmationDialog } = useConfirmationDialog();
  const showToast = useContext(ToastContext);
  const { t } = useTranslation();

  const [models, setModels] = useState([]);
  const [types, setTypes] = useState([]);

  const [editTypeRow, setEditTypeRow] = useState(0);
  const [editTypeObj,  setEditTypeObj] = useState(null);
  const [editModelRow, setEditModelRow] = useState(0);
  const [editModelObj,  setEditModelObj] = useState(null);
  const [newRowType, setNewRowType] = useState({});
  const [newRowModel, setNewRowModel] = useState({});

  // Fetch models and types from API
  useEffect(() => {
    const fetchData = async () => {
      const modelsData = await fetchModels();
      setModels(modelsData);

      const typesData = await fetchTypes();
      setTypes(typesData);
    };

    fetchData();
  }, []);

  // Handle Add
  const handleAdd = async (data, type) => {
    if(JSON.stringify(data) === "{}") return;
    const addFn = type === "model" ? addModel : addType;
    try {
      const newData = await addFn(data);
      if (type === "model") {
        setModels((prev) => [...prev, newData]);
      } else {
        setTypes((prev) => [...prev, newData]);
      }
      setNewRowModel({});
      setNewRowType({});
      showToast(t('messages.addingSuccessful'), "success")
    } catch (error) {
        if(error.status === 401){
          showToast(t('messages.loginAgain'), "error");
            return;
        }
        showToast(`${t('message.errorAddingData')}, ${t('messages.tryAgain')}`, "error")
      console.error("Error adding data:", error);
    }
  };

  // Handle Edit
  const handleEditType = (type) => {
    setEditTypeRow(type.id);
    setEditTypeObj(type);
  };

  const handleEditModel = (row) => {
    setEditModelRow(row.id);
    setEditModelObj(row);
  };

  const handleSave = async (type) => {
    try {
      if (type === "model") {
        await editModel(editModelObj);
        setModels((prev) =>
          prev.map((model) => (model.id === editModelRow ? editModelObj : model))
        );
      } else {
        await editType(editTypeObj);
        setTypes((prev) =>
          prev.map((type) => (type.id === editTypeRow ? editTypeObj : type))
        );
      }
      setEditTypeRow(0);
      setEditModelRow(0);
      showToast(t('messages.updatingSuccessful'), "success")
    } catch (error) {
        if(error.status === 401){
            showToast(t('messages.loginAgain'), "error");
            return;
        }
        showToast(`${t('message.errorSavingData')}, ${t('messages.tryAgain')}`, "error")
      console.error("Error saving data:", error);
    }
  };

  const handleClear = (type) =>{
    if(type === "type"){
      setEditTypeRow(0);
      setEditModelObj({});
    } else {
      setEditModelRow(0);
      setEditModelObj({});
    }
  }

  // Handle Delete
  const handleDelete = async (id, type) => {
    const deleteFn = type === "model" ? deleteModel : deleteType;
    showConfirmationDialog(t('dialog.deleteTitle'),'', 
    async () =>{
      try {
        await deleteFn(id);
        if (type === "model") {
          setModels((prev) => prev.filter((model) => model.id !== id));
        } else {
          setTypes((prev) => prev.filter((type) => type.id !== id));
        }
      } catch (error) {
        if(error.status === 401){
          showToast(t('messages.loginAgain'), "error");
          return;
        }
        showToast(`${t('message.errorDeletingData')}, ${t('messages.tryAgain')}`, "error")
        console.error("Error deleting data:", error);
      }
    });
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
    <Grid container spacing={2}>
      {/* Types Table */}
      <Grid xs={11} sm={5.5} md={5.5} sx={{margin: '10px'}}>
      <Typography
            variant="h5"
            component="div"
            sx={{color: 'white', fontWeight: 'bold', marginBottom:'10px'}}>
                {t('mAndT.types')}
            </Typography>
        <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor:'Black', color:'white'}}>{t('mAndT.name')}</TableCell>
                <TableCell sx={{ backgroundColor:'Black', color:'white'}}>{t('mAndT.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ backgroundColor:'Black'}}>
                  <TextField
                    placeholder={t('mAndT.name')}
                    value={newRowType.typeName || ""}
                    sx={{ backgroundColor:'white' }}
                    onChange={(e) =>
                      setNewRowType({ ...newRowType, typeName: e.target.value })
                    }
                  />
                </TableCell>
                <TableCell sx={{ backgroundColor:'Black', color:'white'}}>
                  <IconButton onClick={() => handleAdd(newRowType, "type")} sx={{ color:'green'}}>
                    <AddIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
              {types.map((type) =>
                editTypeRow === type.id ? (
                  <TableRow key={type.id}>
                    <TableCell sx={{ backgroundColor:'Black', color:'white'}}>
                      <TextField
                        value={editTypeObj.typeName || ""}
                        sx={{ backgroundColor:'white'}}
                        onChange={(e) =>
                            setEditTypeObj({id: type.id, typeName: e.target.value})
                          }
                      />
                    </TableCell>
                    <TableCell sx={{ backgroundColor:'Black', color:'white'}}>
                      <IconButton onClick={() => handleSave("type")} sx={{ color:'green'}}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton onClick={() => handleClear("type")} sx={{ color:'Red'}}>
                        <ClearIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={type.id}>
                    <TableCell sx={{ backgroundColor:'Black', color:'white'}}>{type.typeName}</TableCell>
                    <TableCell sx={{ backgroundColor:'Black'}}>
                      <IconButton onClick={() => handleEditType(type)} sx={{ color:'orange'}}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(type.id, "type")} sx={{ color:'Red' }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* Models Table */}
      <Grid xs={11} sm={5.5} md={5.5} sx={{margin: '10px'}}>
      <Typography
            variant="h5"
            component="div"
            sx={{color: 'white', fontWeight: 'bold', marginBottom:'10px'}}>
                {t('mAndT.models')}
            </Typography>
        <TableContainer component={Paper} sx={{ maxHeight: '65vh' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor:'Black', color:'white'}}>{t('mAndT.name')}</TableCell>
                <TableCell sx={{ backgroundColor:'Black', color:'white'}}>{t('mAndT.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ backgroundColor:'Black', color:'white'}}>
                  <TextField
                    placeholder={t('mAndT.name')}
                    value={newRowModel.modelName || ""}
                    sx={{ backgroundColor:'white' }}
                    onChange={(e) =>
                      setNewRowModel({ ...newRowModel, modelName: e.target.value })
                    }
                  />
                </TableCell>
                <TableCell sx={{ backgroundColor:'Black' }}>
                  <IconButton onClick={() => handleAdd(newRowModel, "model")} sx={{ color:'green'}}>
                    <AddIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
              {models.map((model) =>
                editModelRow === model.id ? (
                  <TableRow key={model.id}>
                    <TableCell sx={{ backgroundColor:'Black', color:'white'}}>
                      <TextField
                        value={editModelObj.modelName || ""}
                        sx={{ backgroundColor:'white'}}
                        onChange={(e) =>
                          setEditModelObj({ id: model.id, modelName: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ backgroundColor:'Black', color:'white'}}>
                      <IconButton onClick={() => handleSave("model")} sx={{ color:'green'}}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton onClick={() => handleClear("model")} sx={{ color:'Red'}}>
                        <ClearIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={model.id}>
                    <TableCell sx={{ backgroundColor:'Black', color:'white'}}>{model.modelName}</TableCell>
                    <TableCell sx={{ backgroundColor:'Black', color:'white'}}>
                      <IconButton onClick={() => handleEditModel(model)} sx={{ color:'orange'}}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(model.id, "model")} sx={{ color:'Red'}}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
    </Box>
    </Box>
  );
};

export default ModelsAndTypesPage;
