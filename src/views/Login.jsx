import React,{useState}  from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase-config";
import { useDispatch } from "react-redux";
import { setUserState } from '../features/auth/authSlice';
import '../css/Inicio.css';
import styled from 'styled-components';
import Swal from 'sweetalert2'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
const theme = createTheme();

export default function LoginView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deshabilitar,setDeshabilitar] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(auth);
    setDeshabilitar(true)

    await signInWithEmailAndPassword(auth, data.get('email'), data.get('password'))
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        //actualizamos el valor de auth en el usuario para saber si esta conectado o no
        updateUserState(user.uid)
        //Obtenemos toda la informacion del usuario
        getCurrentUserFirebase(user.uid);

      })
      .catch((error) => {
        const errorMessage = error.message;
        setDeshabilitar(false)
        console.log(errorMessage);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Credenciales incorrectas',
        })
      });

  };

  // funcion actualizar redux
  const getCurrentUserFirebase = async (uid) => {
    const docRef = doc(db, "usuarios", `${uid}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {

      const usuarioConectado = docSnap.data()
      dispatch(setUserState(usuarioConectado))
      if (usuarioConectado.situacion){
        navigate(`/${uid}/home`);
        setDeshabilitar(false)
      } else{
        navigate("/error");
      }
      

    } else {
      console.log("No such document!");
    }

  }
  //funcion actualizar conexion
  const updateUserState = async (uid) => {
    const userRef = doc(db, "usuarios", `${uid}`);
    await updateDoc(userRef, {
      auth: true
    });

  }


  return (
    <ThemeProvider theme={theme}>
      <div className='login-container'>
        <CssBaseline />
        <div className='transparent-container'>
          <br />
          <IniciarSesion>
            Ingreso</IniciarSesion>
          <br />
          <form onSubmit={handleSubmit} className="login-form">
            <div className='InputContainer'  >
              <StyledInput required type="text" placeholder="Correo Institucional" name="email" />
               <StyledInput reqrequired placeholder="Contraseña" name="password" type="password"   />
            </div>

            <div className='ButtonContainer' >
              <StyledButton type="submit">Ingresar</StyledButton>;
            </div>
          </form>
        </div>
      </div>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deshabilitar}>
                <CircularProgress color="inherit" />
            </Backdrop>
    </ThemeProvider>
  );
}


const IniciarSesion = styled.h2`
  margin: 3rem 0 2rem 0;
  color:black;
`;

const StyledButton = styled.button`
  background: linear-gradient(to right, #14163c 0%, #03217b 79%);
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  margin-top:20px;
  width: 65%;
  height: 3rem;
  border: none;
  color: white;
  border-radius: 2rem;
  cursor: pointer;
`;

const StyledInput = styled.input`
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border-radius: 2rem;
  margin-bottom:20px;
  width: 80%;
  height: 3rem;
  padding: 1rem;
  border: none;
  outline: none;
  color: #0e0d0d;
  font-size: 1rem;
  font-weight: bold;
  &:focus {
    display: inline-block;
    box-shadow: 0 0 0 0.2rem #b9abe0;
    backdrop-filter: blur(12rem);
    border-radius: 2rem;
  }
  &::placeholder {
    color: #0e0d0d;
    font-weight: 100;
    font-size: 1rem;
  }
`;