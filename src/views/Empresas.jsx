import React, { useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import '../css/Ordentrabajo.css';
import '../css/Presentacion.css';
import Typography from '@mui/material/Typography';

export default function Cuestionario() {
    const navigate = useNavigate();
    const [empresa, setEmpresa] = useState('');
    const [representante, setRepresentante] = useState('');
    const [correo, setCorreo] = useState('');
    const [contacto, setContacto] = useState('');
    const [evaluacion, setEvaluacion] = useState('');
    const [actividad, setActividad] = useState('');

    const regresar2 = () => {
        navigate('/home/mantenimiento/contactos')
    }

    const enviardatos2 = async (reporte) => {
        try {
            const docRef = await addDoc(collection(db, "contactos"), {
                empresa: empresa,
                representante: representante,
                correo: correo,
                contacto: contacto,
                evaluacion: evaluacion,
                actividad: actividad,

            });
            console.log("Holiss");
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }


    return (
        <>
            <br />
            <Typography component="div" variant="h4" className="princi3" >
                EMPRESAS CONTRATISTAS
            </Typography>
            <br />

            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 2, width: '100ch' },
                }}
                noValidate
                autoComplete="off">
                <TextField label="Empresa" color="secondary" focused type="text" onChange={(e) => setEmpresa(e.target.value)} />
            </Box>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 2, width: '100ch' },
                }}
                noValidate
                autoComplete="off">
                <TextField label="Representante de la Empresa" color="secondary" focused type="text" onChange={(e) => setRepresentante(e.target.value)} />
            </Box>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 2, width: '100ch' },
                }}
                noValidate
                autoComplete="off">
                <TextField label="Correo Electrónico" color="secondary" focused type="text" onChange={(e) => setCorreo(e.target.value)} />
            </Box>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 2, width: '100ch' },
                }}
                noValidate
                autoComplete="off">
                <TextField label="Números de contacto" color="secondary" focused type="text" onChange={(e) => setContacto(e.target.value)} />
            </Box>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 2, width: '100ch' },
                }}
                noValidate
                autoComplete="off">
                <TextField label="Evaluación de rendimiento" color="secondary" focused type="text" onChange={(e) => setEvaluacion(e.target.value)} />
            </Box>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 2, width: '100ch' },
                }}
                noValidate
                autoComplete="off">
                <TextField label="Actividad" color="secondary" focused type="text" onChange={(e) => setActividad(e.target.value)} />
            </Box>
            <Stack direction="row" spacing={2} alignitems="center" justifyContent="center" >

                <Button variant="outlined" startIcon={<DeleteIcon />} className="boton" onClick={regresar2}>
                    Cancelar</Button>
                <Button variant="contained" endIcon={<SendIcon />} onClick={enviardatos2}>
                    Enviar</Button>
            </Stack>
        </>
    );
}
