import { useSelector } from "react-redux";
import { collection, query, doc, updateDoc, onSnapshot, getDoc } from "firebase/firestore";
import { pink, orange } from '@mui/material/colors';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import Stack from '@mui/material/Stack';
import { Grid } from "@mui/material";
import * as React from 'react';
import { useEffect, useState, useRef } from "react";
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import TarjetaDashboard from "../components/TarjetaDashBoard";
import Container from '@mui/material/Container';
import DescriptionIcon from '@mui/icons-material/Description';
import FormLabel from '@mui/material/FormLabel';
import { generarPdf } from "../scripts/pdfReporte";
import Button from '@mui/material/Button';
import { db } from "../firebase/firebase-config";
import {
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    ModalFooter,
} from "reactstrap";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import '../css/EncargadoView.css';
import Paper from '@mui/material/Paper';
export default function PruebasView() {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const currentUser = useSelector(state => state.auths);
    const [ordenesTecnico, setOrdenesTecnico] = useState([]);
    const [departamento, setDepartamento] = useState("Todos");
    const [reset, setReset] = useState(false);
    const ordenesAux = useRef([])
    const [modalPendientes, setModalPendientes] = useState(false);
    const [currentForm, setCurrentForm] = useState({})
    const [ctdPendientes, setCtdPendientes] = useState(0);
    const [ctdSolventadas, setCtdSolventadas] = useState(0);
    const [currentReporte, setCurrentReporte] = useState({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalReportexistente, setModalReportexistente] = useState(false);
    const [estado,setEstado] = useState("");
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const vistaTablaPendientes = (data) => {
        setCurrentForm(data)
        setModalPendientes(true);
    };
    const cerrarvistainfo = () => {
        setModalPendientes(false);
    };

   
    const visualizarReporte = async (orden) => {
        if (orden.reporte === false) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Acceso Denegado',
            })
        } else {
            const docRef = doc(db, "reportesint", `${orden.reporteId}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCurrentReporte(docSnap.data());
                setModalReportexistente(true);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }
    }
    const updateUser = () => {

        const reference = query(collection(db, "ordenes"));
        onSnapshot(reference, (querySnapshot) => {
            var ordenes = [];
            querySnapshot.forEach((doc) => {
                ordenes.push(doc.data());
            });
            let fecha = ordenes.sort((a, b) => {
                return b.indice - a.indice
            })
            let ci = fecha.filter(filterbycedula)
            ordenesAux.current = ci
            setOrdenesTecnico(ci);
            let p = ci.filter(item => item.estado === "Pendiente").length
            let s = ci.filter(item => item.estado === "Solventado").length
            setCtdPendientes(p);
            setCtdSolventadas(s);
        });
    }


    const filterbycedula = (orden) => {
        if (orden.cedula === currentUser.indentification) {
            return orden
        } else {
            return null
        }
    }
    const downloadPdf = () => {
        var props_pdf = {
            nombre: currentReporte.equipo,
            area_responsable: currentReporte.departamento,
            tipo: currentReporte.tipo_equipo,
            nro_orden: currentReporte.orden_id,
            marca: currentReporte.marca,
            serie: currentReporte.serie,
            modelo: currentReporte.modelo,
            propietario: currentReporte.propietario,
            fecha: currentReporte.fecha,
            tipo_mantenimiento: currentReporte.mantenimiento,
            estado: currentReporte.estado,
            problema: currentReporte.falla,
            actividades: currentReporte.actividades,
            conclusiones: currentReporte.observaciones,
            causas: currentReporte.causas,
            responsable: currentReporte.tecnico,
        }
        generarPdf(props_pdf)

    }

    const filterbyarea = (orden) => {
        if (departamento !== "") {
            if (orden.departamento === departamento) {
                return orden
            } else {
                return null
            }
        } else {
            return orden
        }

    }


    const verificacionr = (data) => {
        if (data.verificacion === false) {

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
            })

            swalWithBootstrapButtons.fire({
                title: '¿Recibe conforme esta actividad?',
                text: "Gracias por su colaboración",
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Sí, verificada!',
                cancelButtonText: 'No, cancelada!',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    const reference = doc(db, "ordenes", `${data.id}`);
                    updateDoc(reference, {
                        verificacion: true,
                    });

                    swalWithBootstrapButtons.fire(
                        '¡Gracias!',
                        'Actividad Verificada',
                        'success'
                    )
                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    const reference = doc(db, "ordenes", `${data.id}`);
                    updateDoc(reference, {
                        verificacion: false,
                    });
                    swalWithBootstrapButtons.fire(
                        '¡Actividad Rechazada!',
                        '',
                        'error'
                    )
                }
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Verificada',
                text: '¡La actividad ya fue verificada !',
            })
        }

    };

    const filtrarDatos = () => {
        let aux_ordenes = JSON.parse(JSON.stringify(ordenesAux.current))
        const filtro1 = aux_ordenes.filter(filterStateSolventadas).filter(filterbyarea);
        setOrdenesTecnico(filtro1);
        setReset(!reset);
        setDepartamento("");
        setEstado("");

    }


    const filterStateSolventadas = (state) => {
        if(estado !== ""){
            if (state.estado === estado) {
                return state;
            } else {
                return null
            }
        }else{
            return state
        }
        
    }

    useEffect(() => {
        updateUser();
        // eslint-disable-next-line
    }, [])

    return (
        <>
            <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
                <Grid container spacing={{ xs: 1, md: 4 }} >
                    <Grid item xs={12} md={8}>
                        <div className="card13" >
                            <div className="header-ev">
                                <h5 className="titulo-ev">Información del Usuario</h5>
                            </div>
                            <div className="card-body12 small">
                              
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <div className="name-outlined">{currentUser.name} {currentUser.lastname}</div>
                                    </Grid>
                                    <Grid item xs={12}   md={4}>
                                        <Autocomplete
                                            key={reset}
                                            disableClearable
                                            className='seleccionadortabla-jm'
                                            id="combo-box-demo"
                                            options={currentUser.area}
                                            onChange={(event, newvalue) => setDepartamento(newvalue)}
                                            renderInput={(params) => <TextField {...params} fullWidth label="DEPARTAMENTOS" type="text" />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Autocomplete
                                            key={reset}
                                            disableClearable
                                            className='seleccionadortabla-jm'
                                            id="combo-box-demo"
                                            options={['Solventado','Pendiente']}
                                            onChange={(event, newvalue) => setEstado(newvalue)}
                                            renderInput={(params) => <TextField {...params} fullWidth label="ESTADO" type="text" />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Button variant="outlined" className="boton-gestionm" onClick={filtrarDatos} startIcon={<FilterAltIcon />}>
                                            Filtrar
                                        </Button>
                                    </Grid>
                                    
                                </Grid>
                        
                            </div>
                        </div>
                    </Grid>

                    <Grid item xs={12}  md={4}>
                        <Grid container spacing={{ xs: 1, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                            <Grid item xs={4} sm={6} md={6} >
                                <TarjetaDashboard
                                    icon={<PendingActionsIcon />}
                                    headerColor={"#F7A76C"}
                                    avatarColor={orange[700]}
                                    title={'Pendientes'}
                                    value={ctdPendientes}
                                />
                            </Grid>
                            <Grid item xs={4} sm={6} md={6} >
                                <TarjetaDashboard
                                    icon={<AssignmentTurnedInIcon />}
                                    headerColor={"#E4AEC5"}
                                    avatarColor={pink[700]}
                                    title={'Acabadas'}
                                    value={ctdSolventadas}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 360 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            align={"left"}
                                            style={{ minWidth: 190 }}
                                        >
                                            Fecha
                                        </TableCell>
                                        <TableCell
                                            align={"left"}
                                            style={{ minWidth: 200 }}
                                        >
                                            Asunto
                                        </TableCell>
                                        <TableCell
                                            align={"left"}
                                            style={{ minWidth: 100 }}
                                        >
                                            Departamento
                                        </TableCell>
                                        <TableCell
                                            align={"left"}
                                            style={{ minWidth: 100 }}
                                        >
                                            Estado
                                        </TableCell>
                                        <TableCell
                                            align={"center"}
                                            style={{ minWidth: 70 }}
                                        >
                                            Verificacion
                                        </TableCell>
                                        <TableCell
                                            align={"center"}
                                            style={{ minWidth: 100 }}
                                        >
                                            Acciones
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {ordenesTecnico.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                    <TableCell align="left">{row.fecha}</TableCell>
                                                    <TableCell align="left">{row.asunto}</TableCell>
                                                    <TableCell align="left">{row.departamento}</TableCell>
                                                    <TableCell align="left">{row.estado}</TableCell>
                                                    <TableCell align="center">
                                                        <Checkbox
                                                            {...label}
                                                            icon={<CheckBoxOutlinedIcon />}
                                                            disabled={row.estado === 'Solventado' ? false : true}
                                                            checked={row.verificacion}
                                                            onChange={() => { verificacionr(row) }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Stack direction="row" spacing={0.5} alignitems="center" justifyContent="center" >
                                                            <IconButton aria-label="informacion" onClick={() => { vistaTablaPendientes(row) }} color="gris"><InfoIcon /></IconButton>
                                                            <IconButton
                                                                aria-label="informacion"
                                                                onClick={() => { visualizarReporte(row) }}
                                                                disabled={row.estado === 'Solventado' ? false : true}
                                                                color="primary"
                                                            >
                                                                <DescriptionIcon />
                                                            </IconButton>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={ordenesTecnico.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                </Paper>
                    </Grid>

                </Grid>

               
            </Container>
          

            <Modal isOpen={modalPendientes}>
                <ModalHeader>
                    <div><h1> Orden de Trabajo</h1></div>
                </ModalHeader>
                <ModalBody style={{ height: 500, overflowY: "scroll" }}>
                    <FormGroup>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <div className="name-outlined">{currentForm.id}</div>
                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Asunto: </b>
                                    {currentForm.asunto}
                                </label>

                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Fecha:  </b>
                                    {currentForm.fecha}
                                </label>

                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Departamento:   </b>
                                    {currentForm.departamento}
                                </label>

                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Prioridad:  </b>
                                    {currentForm.prioridad}
                                </label>

                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Tipo de Trabajo:  </b>
                                    {currentForm.tipotrabajo}
                                </label>
                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Descripción Equipo:  </b>
                                </label>
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={1}
                                    placeholder="Descripción"
                                    className="text-area-encargado"
                                    name="descripcion"
                                    readOnly
                                    value={currentForm.descripcion} />
                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Problemática:  </b>
                                </label>
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={1}
                                    placeholder="Problematica"
                                    className="text-area-encargado"
                                    name="problematica"
                                    readOnly
                                    value={currentForm.problematica} />
                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Observaciones:  </b>
                                </label>
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={1}
                                    placeholder="Observaciones"
                                    className="text-area-encargado"
                                    name="observaciones"
                                    readOnly
                                    value={currentForm.observaciones} />
                            </Grid >
                        </Grid>
                    </FormGroup>
                </ModalBody>
                <ModalFooter className="modal-footer">
                    <Button variant="contained"
                        className="boton-modal-d"
                        onClick={cerrarvistainfo}>Cerrar </Button>
                </ModalFooter>

            </Modal>

            <Modal isOpen={modalReportexistente}>
                <ModalHeader>
                    <div><h4>Visualizar Reporte</h4></div>
                </ModalHeader>
                <ModalBody style={{ height: 500, overflowY: "scroll" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <div className="name-outlined">{currentReporte.id}</div>
                        </Grid >
                        <Grid item xs={6}>
                            <label>
                                <b>Estado:  </b>
                                {currentReporte.estado}
                            </label>
                        </Grid >
                        <Grid item xs={6}>
                            <label>
                                <b>Id Orden:  </b>
                                {currentReporte.orden_id}
                            </label>
                        </Grid >
                        <Grid item xs={6}>
                            <label>
                                <b>Técnico: </b>
                                {currentReporte.tecnico}
                            </label>
                        </Grid >
                        <Grid item xs={6}>
                            <label>
                                <b>Equipo:  </b>
                                {currentReporte.equipo}
                            </label>
                        </Grid >
                        <Grid item xs={6}>
                            <label>
                                <b>Código:</b>
                                {currentReporte.codigo_equipo}
                            </label>
                        </Grid >
                        <Grid item xs={6}>
                            <label>
                                <b>Mantenimiento:  </b>
                                {currentReporte.mantenimiento}
                            </label>

                        </Grid >
                        <Grid item xs={6}>
                            <label>
                                <b>Tiempo:  </b>
                                {currentReporte.tiempo}
                            </label>

                        </Grid >
                        <Grid item xs={6}>
                            <label>
                                <b>Costo:  </b>
                                {currentReporte.costo}
                            </label>

                        </Grid >
                        <Grid item xs={12}>
                            <FormLabel id="demo-radio-buttons-group-label">Falla:</FormLabel>
                            <TextareaAutosize
                                style={{ textTransform: "uppercase" }}
                                aria-label="minimum height"
                                minRows={1}
                                placeholder="Falla"
                                className="text-area-encargado"
                                name="falla"
                                readOnly
                                value={currentReporte.falla} />

                        </Grid >
                        <Grid item xs={12}>
                            <FormLabel id="demo-radio-buttons-group-label">Causas:</FormLabel>
                            <TextareaAutosize
                                style={{ textTransform: "uppercase" }}
                                aria-label="minimum height"
                                minRows={1}
                                placeholder="Causa"
                                className="text-area-encargado"
                                name="causa"
                                readOnly
                                value={currentReporte.causas} />
                        </Grid >
                        <Grid item xs={12}>
                            <FormLabel id="demo-radio-buttons-group-label">Actividades:</FormLabel>
                            <TextareaAutosize
                                style={{ textTransform: "uppercase" }}
                                aria-label="minimum height"
                                minRows={1}
                                placeholder="Actividades"
                                className="text-area-encargado"
                                name="actividadesR"
                                readOnly
                                value={currentReporte.actividades} />
                        </Grid >
                        <Grid item xs={12}>
                            <FormLabel id="demo-radio-buttons-group-label">Repuestos:</FormLabel>
                            <TextareaAutosize
                                style={{ textTransform: "uppercase" }}
                                aria-label="minimum height"
                                minRows={1}
                                placeholder="Repuestos"
                                className="text-area-encargado"
                                name="repuestos"
                                readOnly
                                value={currentReporte.repuestos} />
                        </Grid >

                        <Grid item xs={12}>
                            <FormLabel id="demo-radio-buttons-group-label">Observaciones:</FormLabel>
                            <TextareaAutosize
                                style={{ textTransform: "uppercase" }}
                                aria-label="minimum height"
                                minRows={1}
                                placeholder="Observaciones"
                                className="text-area-encargado"
                                name="observaciones"
                                readOnly
                                value={currentReporte.observaciones} />
                        </Grid >
                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="contained"
                        className="boton-modal-pdf"
                        startIcon={<LocalPrintshopIcon />}
                        onClick={downloadPdf} >
                        Imprimir
                    </Button>
                    <Button
                        variant="outlined"
                        className="boton-modal-d"
                        onClick={() => { setModalReportexistente(false) }}
                    >
                        Cerrar
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}