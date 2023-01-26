import React, { useEffect, useState } from "react";
import '../css/Mantenimiento.css';
import { query, collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from "@mui/material/Grid";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import '../css/Tabla.css';
import '../css/Compras.css';
import '../css/Presentacion.css';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setOrdenState } from '../features/ordenes/ordenSlice';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import "../css/MantenimientoView.css"
import {Container} from "reactstrap";

const prioridades = [
    { label: 'Todas' },
    { label: 'Baja' },
    { label: 'Media' },
    { label: 'Alta' },
    { label: 'Crítica' },
]
const tipos = [
    { label: 'Todos' },
    { label: 'Equipo Médico' },
    { label: 'Infraestructura' },
    { label: 'Sistemas' },
    { label: 'Sistema Eléctrico' },
    { label: 'Civil/Plomería' },
    { label: 'Carpintería/Mobiliario' },
]
const estados = [
    { label: 'Todos' },
    { label: 'Solventado' },
    { label: 'Iniciada'},
    { label: 'Pendiente' },
    // { label: 'Compras' },
    // { label: 'ICH Proceso' },
    // { label: 'Disp. Área' },
    // { label: 'Externo' },
    // { label: 'Constructivo' },
    { label: 'Rechazada' },
]


export default function Mantenimientoview() {
    const [time1, setTime1] = useState(new Date());
    const [prioridad, setPrioridad] = useState("Todas");
    const [estado, setEstado] = useState("Todos");
    const [tipo, setTipo] = useState("Todos");
    const [elementosfb, setElementosfb] = useState([]);
    const [festado, setFestado] = useState(false);
    const [fprioridad, setFprioridad] = useState(false);
    const [ftrabajo, setFtrabajo] = useState(false);
    const [fdepartamento, setFdepartamento] = useState(false);
    const [ffecha,setFfecha] = useState(false);
    const [departamento,setDepartamento] = useState("Todos");
    const [ordenes, setOrdenes] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [reset,setReset] =useState(false)
   
    const navigate = useNavigate();
    //dispatch = me permite acceder a los metodos de los reducers
    const dispatch = useDispatch();

    const SelectFecha1 = (newValue) => {
        const fechaformateada = new Date(newValue).getTime()
        const datoFormat2 = new Date(fechaformateada).toLocaleDateString("en-US")
        setTime1(datoFormat2);
    };
    const getData = async () => {
        const reference = query(collection(db, "ordenes"));
        onSnapshot(reference, (querySnapshot) => {

            var ordenes = []
            var ordenesFecha = []
            querySnapshot.forEach((doc) => {
                ordenes.push(doc.data());
            });
            ordenesFecha = ordenes.sort((a, b) => (b.indice - a.indice))
            setElementosfb(
                ordenesFecha
            );
            setOrdenes(
                ordenesFecha
            );
        });
        onSnapshot(doc(db, "informacion", "parametros"), (doc) => {
            setDepartamentos(doc.data().departamentos)
          });
      
    }

    const almacenarOdenStore = (data) => {
        dispatch(setOrdenState(data));
        navigate('gestionorden');
    }

    const filtrarDatos = () => {
        console.log(departamento)
        console.log(fdepartamento)
        var data = elementosfb;
        const filtro1 = data.filter(filterbypriority)
        const filtro2 = filtro1.filter(filterbystate)
        const filtro3 = filtro2.filter(filterbytipo)
        const filtro4 =  filtro3.filter(filterbydepartamento)
        const filtro5 = filtro4.filter(filtrobydate);
        setOrdenes(filtro5);
        setReset(!reset);
    }

    const filterbypriority = (_orden) => {
        if(fprioridad === true){
            if (_orden.prioridad === prioridad) {
                return _orden
            } else if (prioridad === 'Todas') {
                return _orden
            } else {
                return null;
            }
        }else{
            return _orden
        }
    }
    const filterbystate = (_orden) => {
        if(festado === true){
            if (_orden.estado === estado) {
                return _orden
            } else if (estado === 'Todos') {
                return _orden
            } else {
                return null;
            }
        }else{
            return _orden
        }
    }
    const filterbytipo = (_orden) => {
        if(ftrabajo === true){
        if (_orden.tipotrabajo === tipo) {
            return _orden
        } else if (tipo === 'Todos') {
            return _orden
        } else {
            return null;
        }
        }else{
            return _orden
        }
    }
    const filterbydepartamento = (_orden) =>{
        if(fdepartamento === true){
            if (_orden.departamento === departamento) {
                return _orden
            }else if (departamento === 'Todos') {
                return _orden
            } else {
                return null;
            }
            }else{
                return _orden
            }
    }
    const filtrobydate =(_orden)=>{
        let fechaFormat =  new Date(_orden.indice).toLocaleDateString("en-US")

        if(ffecha === true){
            if (fechaFormat === time1) {
                return _orden
            }else {
                return null;
            }
            }else{
                return _orden
            }

    }
    useEffect(() => {
        getData();
    }, [])

    return (
        <>
            <Container>
                <br />
                <Typography component="div" variant="h4" className="princi7" >
                    ORDENES DE TRABAJO
                </Typography>
                <div className="mantenimiento-container">

                <Grid container spacing={2}>
                <Grid item xs={6} sm={6} md={2.4}>
                        <Autocomplete
                            disableClearable
                            key={reset}
                            id="combo-box-demo"
                            options={estados}
                            onChange={(event, newvalue) => setEstado(newvalue.label)}
                            renderInput={(params) => <TextField {...params} fullWidth label="ESTADO" color={estados !== '' ? "gris" : "oficial"} type="text" />}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} md={2.4}>
                        <Autocomplete
                            disableClearable
                            key={reset}
                            id="combo-box-demo"
                            options={tipos}
                            onChange={(event, newvalue) => setTipo(newvalue.label)}
                            renderInput={(params) => <TextField {...params} fullWidth label="TIPO DE TRABAJO" color={tipos !== '' ? "gris" : "oficial"} type="text" />}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} md={2.4}>
                        <Autocomplete
                            disableClearable
                            key={reset}
                            id="combo-box-demo"
                            options={prioridades}
                            onChange={(event, newvalue) => setPrioridad(newvalue.label)}
                            renderInput={(params) => <TextField {...params} fullWidth label="PRIORIDAD" color={tipos !== '' ? "gris" : "oficial"} type="text" />}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} md={2.4}>
                        <Autocomplete
                            disableClearable
                            key={reset}
                            id="combo-box-demo"
                            options={departamentos}
                  getOptionLabel={(option) => {
                    return option.nombre;
                  }}
                            onChange={(event, newvalue) => setDepartamento(newvalue.nombre)}
                            renderInput={(params) => <TextField {...params} fullWidth label="DEPARTAMENTO" color={tipos !== '' ? "gris" : "oficial"} type="text" />}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} md={2.4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                label={"Filtrar Fecha"}
                                inputFormat="MM/dd/yyyy"
                                value={time1}
                                onChange={SelectFecha1}
                                renderInput={(params) => <TextField  fullWidth {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid>
        
                 
                    <Grid item xs={12} sm={12} md={9.6}>
                    <div className="panel-ace">
                    <FormControlLabel control={<Switch onChange={(event,newValue)=>{setFestado(newValue)}} value={festado}   inputProps={{ 'aria-label': 'controlled' }} />} label="Estado" />
                    <FormControlLabel control={<Switch onChange={(event,newValue)=>{setFtrabajo(newValue)}} inputProps={{ 'aria-label': 'controlled' }} />} label="Tipo Trabajo" />
                    <FormControlLabel control={<Switch onChange={(event,newValue)=>{setFprioridad(newValue)}} inputProps={{ 'aria-label': 'controlled' }} />} label="Prioridad" />
                    <FormControlLabel control={<Switch onChange={(event,newValue)=>{setFdepartamento(newValue)}} inputProps={{ 'aria-label': 'controlled' }} />} label="Departamento" />
                    <FormControlLabel control={<Switch onChange={(event,newValue)=>{setFfecha(newValue)}} inputProps={{ 'aria-label': 'controlled' }} />} label="Fecha" />
                    </div>
                   
                    </Grid>
                    
                    <Grid item xs={12} sm={12} md={2.4}>
                    <Button  variant="contained" className="boton-gestion" onClick={filtrarDatos}  endIcon={<FilterAltIcon />}>
                        Filtrar
                    </Button>
                    </Grid>
                </Grid>
                </div>
                <Table className='table table-ligh table-hover'>
                    <Thead>
                        <Tr>
                            <Th>#</Th>
                            <Th>Fecha</Th>
                            <Th>Departamento</Th>
                            <Th>Prioridad</Th>
                            <Th>Tipo de Trabajo</Th>
                            <Th>Estado</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        {ordenes.map((orden, index) => (
                            <Tr key={orden.indice}>
                                <Td>{index + 1}</Td>
                                <Td>{orden.fecha}</Td>
                                <Td>{orden.departamento}</Td>
                                <Td>{orden.prioridad}</Td>
                                <Td>{orden.tipotrabajo}</Td>
                                <Td>{orden.estado}</Td>
                                <Td>
                                    <Stack direction="row" spacing={0.5} alignitems="center" justifyContent="center" >
                                        <button className="btn btn-outline-success" onClick={() => { almacenarOdenStore(orden) }}>Gestionar</button>
                                    </Stack>
                                </Td>

                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Container>

      
        </>

    );
}


