import './App.css';
import LoginView from './views/Login';
import { Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MultiView from './views/MultiView';
import ErrorPage from './views/ErrorPage.jsx'
import React from "react";




function App() {

 
  const theme = createTheme({
    palette: {
      success: {
        main: '#A9CCE3',
        darker: '#053e85',
      },

      secondary: {
        main: "#A9CCE3"
      },

      oficial: {
        main: "#70AAAA"
      },


      oficial2: {
        main: "#2e5d8f"
      },

      crema: {
        main: "#dec5ad"
      },

      enviar: {
        main: "#d5b079",
        contrastText: '#fff',
      },
      enviarcp: {
        main:"#2e5d8f",
        contrastText: '#fff',
      },

      cancelar: {
        main: "#2e5d8f"
      },

      cancelarcp: {
           main: "#2e5d8f"
        },
   
      gis: {
        main: '#ECF0F1',
        contrastText: '#fff',
      },

      rosado: {
        main: '#dcb8bb',
        contrastText: '#fff',
      },

      gris: {
        main: "#BDB18E"
      },
      verde: {
        main: '#58D68D',
        contrastText: '#fff',
      },
      salmon: {
        main: '#F1948A',
        contrastText: '#fff',
      },
      play: {
        main: '#27AE60',
        contrastText: '#fff',
      },
      anular: {
        main: '#b25977',
        contrastText: '#fff',
      },
      morado: {
        main: '#BB8FCE ',
        contrastText: '#fff',
      },
      verdee: {
        main: '#2ECC71',
      },
      warning:{
        main: '#F4D03F',
        contrastText: '#fff',
      },
      rojo:{
        main: '#F1948A',
        contrastText: '#fff',
      },
       dark:{
        main: '#212F3D',
        contrastText: '#fff',
      },
      verde2:{
        main: '#58D68D',
        contrastText: '#fff',
      },
      azul1:{
        main: '#598ec7',
        contrastText: '#fff',
      }

    },
  });
  
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginView/>} />
          <Route path="/:uid/*" element={<MultiView/>} />
          <Route path="/error" element={<ErrorPage/>} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
