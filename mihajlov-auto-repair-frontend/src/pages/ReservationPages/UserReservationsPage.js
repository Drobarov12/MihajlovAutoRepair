import React, { useState, useEffect, useContext } from 'react';
import { fetchUserReservations } from '../../services/api';
import { useUser } from "../../contexts/UserContext";
import { ToastContext } from "../../components/App";
import { useTranslation } from 'react-i18next';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography
  } from "@mui/material";



const UserReservationPage = () => {
    const { userInfo } = useUser();
    const [reservations, setReservations] = useState([]); 
    const showToast = useContext(ToastContext);
    const { t } = useTranslation();


    useEffect( () => {
        const getData = async () => {
            try {
                if(userInfo){
                    const reservations = await fetchUserReservations(userInfo.id);
                    reservations.sort((a, b) =>  new Date(b.dateTime) -  new Date(a.dateTime));
                    setReservations(reservations);
                }
                else {
                    showToast(t('messages.loginAgain'), "error");
                }
            } catch (error) {
                if(error.status === 401){
                    showToast(t('messages.loginAgain'), "error");
                    return;
                }
                showToast(`${t('message.errorGettingData')}, ${t('messages.tryAgain')}`, "error")
            }
        }
        getData();
    }, []);
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
                        marginBottom: "10px"
                    }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold',  color: 'white' }}>
                        {t('reservation.reservations')}
                    </Typography>
                </Box>
    <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
      <Table sx={{ minWidth: 650}} stickyHeader >
        <TableHead>
          <TableRow >
            <TableCell sx={{ backgroundColor:'Black', color:'white', minWidth: '170px'}}>{t('reservation.model')}</TableCell>
            <TableCell sx={{ backgroundColor:'Black', color:'white', minWidth: '170px'}}>{t('reservation.description')}</TableCell>
            <TableCell sx={{ backgroundColor:'Black', color:'white', minWidth: '110px'}}>{t('reservation.type')}</TableCell>
            <TableCell sx={{ backgroundColor:'Black', color:'white'}}>{t('reservation.dateTime')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {reservations.map((reservation) => (
            <TableRow key={reservation.id} sx={{ backgroundColor: "Black"}}>
                <TableCell sx={{color: 'white'}}>{reservation.modelName}</TableCell>
                <TableCell sx={{color: 'white'}}>{reservation.description}</TableCell>
                <TableCell sx={{color: 'white'}}>{reservation.typeName}</TableCell>
                <TableCell sx={{color: 'white'}}>{new Date(reservation.dateTime).toLocaleString()}</TableCell>
            </TableRow>
        ))}
                  
        </TableBody>
      </Table>
    </TableContainer>
            </Box>
      </Box>
    );
};

export default UserReservationPage;