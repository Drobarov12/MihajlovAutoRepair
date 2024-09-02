import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', 
      contrastText: '#fff', 
    },
    secondary: {
      main: '#C0C0C0',
      contrastText: '#fff', 
    },
    lightBlue: {
      main: '#33A0D1', 
      contrastText: '#fff', 
    },
    blue: {
        main: '#16588E', 
        contrastText: '#fff', 
    },
    red: {
        main: '#C52B30', 
        contrastText: '#fff',
    },
    black: {
        main: '#000', 
        contrastText: '#fff', 
    },
  },
});

export default theme;