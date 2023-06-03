import React, { useEffect, useRef, useState } from "react";
import '../css/Mantenimiento.css';
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";

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
import { Container } from "reactstrap";
// importamos lo necesario para gestionar las tablas 
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
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
    { label: 'Iniciada' },
    { label: 'Pendiente' },
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
    const [ffecha, setFfecha] = useState(false);
    const [departamento, setDepartamento] = useState("Todos");
    const [ordenes, setOrdenes] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [reset, setReset] = useState(false)


    const navigate = useNavigate();
    //dispatch = me permite acceder a los metodos de los reducers
    const dispatch = useDispatch();
    // variables de la tabla
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const ordenes_db = useRef([{}])



    const SelectFecha1 = (newValue) => {
        const fechaformateada = new Date(newValue).getTime()
        const datoFormat2 = new Date(fechaformateada).toLocaleDateString("en-US")
        setTime1(datoFormat2);
    };
    const getData = async () => {
        const ref_ordenes = await getDocs(collection(db, "ordenes"));
        let aux_ordenes = ref_ordenes.docs.map((doc) => ({ ...doc.data() }))
        aux_ordenes.sort((a, b) => (b.indice - a.indice))
        setElementosfb(aux_ordenes);
        setOrdenes(aux_ordenes);
        ordenes_db.current = aux_ordenes;
        const ref_empresas = await getDoc(doc(db, "informacion", "parametros"));
        let aux_empresas = ref_empresas.data().departamentos.map((doc) => ({ ...doc }))
        setDepartamentos(aux_empresas)


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
        const filtro4 = filtro3.filter(filterbydepartamento)
        const filtro5 = filtro4.filter(filtrobydate);
        setOrdenes(filtro5);
        setReset(!reset);
    }

    const filterbypriority = (_orden) => {
        if (fprioridad === true) {
            if (_orden.prioridad === prioridad) {
                return _orden
            } else if (prioridad === 'Todas') {
                return _orden
            } else {
                return null;
            }
        } else {
            return _orden
        }
    }
    const filterbystate = (_orden) => {
        if (festado === true) {
            if (_orden.estado === estado) {
                return _orden
            } else if (estado === 'Todos') {
                return _orden
            } else {
                return null;
            }
        } else {
            return _orden
        }
    }
    const filterbytipo = (_orden) => {
        if (ftrabajo === true) {
            if (_orden.tipotrabajo === tipo) {
                return _orden
            } else if (tipo === 'Todos') {
                return _orden
            } else {
                return null;
            }
        } else {
            return _orden
        }
    }
    const filterbydepartamento = (_orden) => {
        if (fdepartamento === true) {
            if (_orden.departamento === departamento) {
                return _orden
            } else if (departamento === 'Todos') {
                return _orden
            } else {
                return null;
            }
        } else {
            return _orden
        }
    }
    const filtrobydate = (_orden) => {
        let fechaFormat = new Date(_orden.indice).toLocaleDateString("en-US")

        if (ffecha === true) {
            if (fechaFormat === time1) {
                return _orden
            } else {
                return null;
            }
        } else {
            return _orden
        }

    }
    // funciones de la tabla
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
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
                        <Grid item xs={12} sm={6} md={2.4}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                    label={"Filtrar Fecha"}
                                    inputFormat="MM/dd/yyyy"
                                    value={time1}
                                    onChange={SelectFecha1}
                                    renderInput={(params) => <TextField fullWidth {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>


                        <Grid item xs={12} sm={12} md={10}>
                            <div>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={12} md={2}>
                                        <FormControlLabel control={<Switch onChange={(event, newValue) => { setFestado(newValue) }} value={festado} inputProps={{ 'aria-label': 'controlled' }} />} label="Estado" />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={2}>
                                        <FormControlLabel control={<Switch onChange={(event, newValue) => { setFtrabajo(newValue) }} inputProps={{ 'aria-label': 'controlled' }} />} label="Tipo Trabajo" />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={2}>
                                        <FormControlLabel control={<Switch onChange={(event, newValue) => { setFprioridad(newValue) }} inputProps={{ 'aria-label': 'controlled' }} />} label="Prioridad" />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={2}>
                                        <FormControlLabel control={<Switch onChange={(event, newValue) => { setFdepartamento(newValue) }} inputProps={{ 'aria-label': 'controlled' }} />} label="Departamento" />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={2}>
                                        <FormControlLabel control={<Switch onChange={(event, newValue) => { setFfecha(newValue) }} inputProps={{ 'aria-label': 'controlled' }} />} label="Fecha" />
                                    </Grid>
                                </Grid>
                            </div>

                        </Grid>


                        <Grid item xs={12} md={2}>
                            <Button variant="contained" className="boton-gestion" fullWidth onClick={filtrarDatos} endIcon={<FilterAltIcon />}>
                                Filtrar
                            </Button>
                        </Grid>
                    </Grid>
                </div>
                <TableContainer sx={{ maxHeight: 370 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column, index) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                                <TableCell key={"acciones"} align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ordenes
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell key={index + 10} align="center"><Button variant="outlined" onClick={() => { almacenarOdenStore(row) }} >Gestionar</Button></TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={ordenes.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Container>


        </>

    );
}

const columns = [
    { id: 'fecha', label: 'Fecha', minWidth: 170 },
    { id: 'departamento', label: 'Departamento', minWidth: 100 },
    { id: 'prioridad', label: 'Prioridad', minWidth: 100 },
    { id: 'tipotrabajo', label: 'Tipo de Trabajo', minWidth: 100 },
    { id: 'estado', label: 'Estado', minWidth: 100 },
];
