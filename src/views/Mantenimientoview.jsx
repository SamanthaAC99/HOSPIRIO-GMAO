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
    { label: 'Baja' },
    { label: 'Media' },
    { label: 'Alta' },
    { label: 'Crítica' },
]
const tipos = [
    { label: 'Equipo Médico' },
    { label: 'Infraestructura' },
    { label: 'Sistemas' },
    { label: 'Sistema Eléctrico' },
    { label: 'Civil/Plomería' },
    { label: 'Carpintería/Mobiliario' },
]
const estados = [
    { label: 'Solventado' },
    { label: 'Iniciada' },
    { label: 'Pendiente' },
    { label: 'Rechazada' },
]

export default function Mantenimientoview() {
    const [time1, setTime1] = useState(new Date());
    const [prioridad, setPrioridad] = useState("");
    const [estado, setEstado] = useState("");
    const [tipo, setTipo] = useState("");
    const [departamento, setDepartamento] = useState("");
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



    const filterbypriority = (_orden) => {
       
            if (_orden.prioridad === prioridad) {
                return _orden
            } else if (prioridad === "") {
                return _orden
            } else {
                return null;
            }
       
    }
    const filterbystate = (_orden) => {
        
            if (_orden.estado === estado) {
                return _orden
            } else if (estado === "") {
                return _orden
            } else {
                return null;
            }
        
    }
    const filterbytipo = (_orden) => {

            if (_orden.tipotrabajo === tipo) {
                return _orden
            } else if (tipo ===  "") {
                return _orden
            } else {
                return null;
            }
    
    }
    const filterbydepartamento = (_orden) => {

            if (_orden.departamento === departamento) {
                return _orden
            } else if (departamento === "") {
                return _orden
            } else {
                return null;
            }
      
    }
    const filterbydate = (_orden) => {
        let fechaFormat = new Date(_orden.indice).toLocaleDateString("en-US")

            if (fechaFormat === time1) {
                return _orden
            } else if (time1 === "") {
                return _orden
            } else {
                return null;
            }
     
    }
    // nuevo sistema de filtro mas sencillo
    const filterOrdenes =()=>{
        let aux_ordenes = JSON.parse(JSON.stringify(ordenes_db.current))
        let ordenes_filtradas = aux_ordenes.filter(filterbystate).filter(filterbytipo).filter(filterbypriority).filter(filterbydepartamento).filter(filterbydate)
        setOrdenes(ordenes_filtradas);
        setReset(!reset);
        setDepartamento("");
        setTipo("");
        setPrioridad("");
        setEstado("");
        setTime1("")
        setPage(0);
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
                                    onChange={SelectFecha1}
                                    renderInput={(params) => <TextField fullWidth {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>



                        <Grid item xs={12} md={12}>
                            <Button variant="contained"   onClick={filterOrdenes} endIcon={<FilterAltIcon />}>
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
