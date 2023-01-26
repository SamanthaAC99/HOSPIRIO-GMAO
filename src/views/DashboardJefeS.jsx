import { useSelector } from "react-redux";
import { collection, query, doc, updateDoc, onSnapshot, getDoc } from "firebase/firestore";
import { pink, cyan, lightGreen, orange } from '@mui/material/colors';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { jsPDF } from "jspdf";
import Checkbox from '@mui/material/Checkbox';
import autoTable from 'jspdf-autotable'
import Button from '@mui/material/Button';
import { Grid } from "@mui/material";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import PrintIcon from '@mui/icons-material/Print';
import * as React from 'react';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import InfoIcon from '@mui/icons-material/Info';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import TarjetaDashboard from "../components/TarjetaDashBoard";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import '../css/DashboardJefeS.css'
import { db } from "../firebase/firebase-config"
import {
    Container,
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    ModalFooter,
} from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const prioridades = [
    { label: 'Todas' },
    { label: 'Baja' },
    { label: 'Media' },
    { label: 'Alta' },
    { label: 'Crítica' },
]

export default function DashboardJefeS() {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const currentUser = useSelector(state => state.auths);
    const [user, setUser] = useState({});
    const [prioridad, setPrioridad] = useState("Todas");
    const [departamentos, setDepartamentos] = useState([]);
    const [departamento, setDepartamento] = useState("Todos");
    const [ordenesTecnico, setOrdenesTecnico] = useState([]);
    const [modalPendientes, setModalPendientes] = useState(false);
    const [modalInformacion2, setModalinformacion2] = useState(false);
    const [currentForm, setCurrentForm] = useState({})
    const [ctdPendientes, setCtdPendientes] = useState(0);
    const [ctdSolventadas, setCtdSolventadas] = useState(0);
    const [elementosfb, setElementosfb] = useState([]);
    const [ordenes, setOrdenes] = useState([]);
    const [currentReporte, setCurrentReporte] = useState({});
    const [modalReportexistente, setModalReportexistente] = useState(false);

    const vistaTablaPendientes = (data) => {
        setCurrentForm(data);
        setModalPendientes(true);
    };
    const cerrarvistainfo = () => {
        setModalPendientes(false);
    };

    const vistainformacion2 = (data) => {
        setCurrentForm(data);
        setModalinformacion2(true);
    };
    const cerrarvistainfo2 = () => {
        setModalinformacion2(false);
    };

    // const handleSelectPrioridad =(e)=>{
    //     console.log(e.target.value);
    //     setPrioridad(e.target.value);
    //     updateOrdenes(e.target.value);
    // }

    const updateUser = () => {
        onSnapshot(doc(db, "usuarios", currentUser.uid), (doc) => {
            setUser(doc.data());
        });
        const reference = query(collection(db, "ordenes"));
        onSnapshot(reference, (querySnapshot) => {
            var ordenes = [];
            querySnapshot.forEach((doc) => {
                ordenes.push(doc.data());
            });
            setOrdenesTecnico(
                ordenes
            );
            setElementosfb(
                ordenes
            );
            setOrdenes(
                ordenes.sort((a, b) =>{
                    return b.indice  - a.indice
                })
            );
            var pendiente = ordenes.filter(filterbytipot).filter(filterStateIniciadas).length
            var solventadas = ordenes.filter(filterbytipot).filter(filterStateSolventadas).length
            setCtdPendientes(pendiente);
            setCtdSolventadas(solventadas);
        });

        onSnapshot(doc(db, "informacion", "parametros"), (doc) => {
            setDepartamentos(doc.data().departamentos)
          });
    }

    // const updateOrdenes = (data) => {
    //     const p = ordenesTecnico.filter((item) => item.tipotrabajo === "Sistemas").filter((item) => item.prioridad === data).filter(filterStatePendientes).length
    //     const s = ordenesTecnico.filter((item) => item.tipotrabajo === "Sistemas").filter((item) => item.prioridad === data).filter(filterStateSolventadas).length
    //     console.log(p)
    //     console.log(s)
    //     setCtdPendientes(p);
    //     setCtdSolventadas(s);
    // }

    // const handleSelectFilter =(e)=>{
    //     console.log(e.target.value);
    //     setDepartamento(e.target.value);
    // }


    const filtrarDatos = () => {
        const data = elementosfb;
        const filtro1 = data.filter(filterbyarea)
        const filtro2 = filtro1.filter(filterbyprioridad)
        setOrdenes(filtro2);
    }

    const filterbyprioridad = (orden) => {
        if (orden.prioridad === prioridad) {
            return orden
        } else if (prioridad === 'Todas') {
            return orden
        } else {
            return null;
        }
    }

    const filterbyarea = (orden) => {
        if (orden.departamento === departamento) {
            return orden
        } else if (departamento === 'Todos') {
            return orden
        } else {
            return
        }
    }

    const filterbytipot = (orden) => {
        if (orden.tipotrabajo === "Sistemas") {
            return orden
        } else {
            return null;
        }
    }
    const filterStateSolventadas = (state) => {
        if (state.estado === "Solventado") {
            return state;
        } else {
            return
        }
    }

    const filterStateIniciadas = (state) => {
        if (state.estado === "Iniciada") {
            return state;
        } else {
            return
        }
    }
    const visualizarReporte = async (orden) => {
        const docRef = doc(db, "reportesint", `${orden.reporteId.slice(-1)}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setCurrentReporte(docSnap.data());
            setModalReportexistente(true);
        } else {
            console.log("No such document!");
        }
    }

    const generarPdf = () => {
        var doc = new jsPDF({
            orientation: "portrait",
        })
        doc.text("Hospital del Río ", 90, 10); //fontsize 15
        doc.setFontSize(12)// de aqui para abajo todo estara con fontsize 9
        doc.text("Reporte de Mantenimiento", 85, 20)
        let aux = 15
        let datos_tabla =
         [
            ["Id Reporte",currentReporte.id],
            ["Id O/T",currentReporte.OrdenId],
            ["Código Equipo",currentReporte.codigoe],
            ["Equipo",currentReporte.equipo],
            ["Técnico",currentReporte.nombreT],
            ["Estado",currentReporte.estadof],
            ["Tipo de Mantenimiento",currentReporte.tmantenimiento],
            ["Tiempo",currentReporte.tiempo],
            ["Costo",currentReporte.costo],
            ["Falla",currentReporte.falla],
            ["Causas",currentReporte.causas],
            ["Observaciones",currentReporte.observaciones]
         ]

        autoTable(doc, {
            startY:  aux+10,
            head: [['Item', 'Descripción']],
            body: datos_tabla,
          })
        
          doc.save(`reporte_${currentReporte.id}.pdf`);

    }

    useEffect(() => {
        updateUser();

    }, [])



    return (
        <>
            <div className="container-test">
                <Grid container spacing={{ xs: 1, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={12} sm={6} md={6}>
                        <div className="card13" >
                            {
                                <div className="header-ev">
                                    <h5 className="titulo-ev">Filtros</h5>
                                </div>
                            }
                            {
                                <div className="card-body12 small">
                                    <div className="name-outlined">{currentUser.name} {currentUser.lastname}</div>

                                    <div className="contenedor-dashboardjs">
                                        <Grid container spacing={2}>
                                            <Grid item xs={5}>
                                                <Autocomplete
                                                    disableClearable
                                                    id="combo-box-demo"
                                                    options={prioridades}
                                                    onChange={(event, newvalue) => setPrioridad(newvalue.label)}
                                                    renderInput={(params) => <TextField {...params} fullWidth label="PRIORIDAD" color={prioridades !== '' ? "gris" : "oficial"} type="text" />}
                                                />
                                            </Grid>
                                            <Grid item xs={5}>
                                                <Autocomplete
                                                    disableClearable
                                                    id="combo-box-demo"
                                                    options={departamentos}
                                                    getOptionLabel={(option) => {
                                                      return option.nombre;
                                                    }}
                                                    onChange={(event, newvalue) => setDepartamento(newvalue.nombre)}
                                                    renderInput={(params) => <TextField {...params} fullWidth label="DEPARTAMENTOS" color={departamentos !== '' ? "gris" : "oficial"} type="text" />}
                                                />
                                            </Grid>
                                            <Grid item xs={2}>
                                                <Button variant="outlined" className="boton-gestiont" onClick={filtrarDatos} startIcon={<FilterAltIcon />}>
                                                    Filtrar
                                                </Button>
                                            </Grid>
                                        </Grid>

                                    </div>










                                </div>
                            }
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>


                        <Grid container spacing={{ xs: 1, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                            <Grid item xs={6} sm={6} md={6} >
                                <TarjetaDashboard
                                    icon={<PendingActionsIcon />}
                                    headerColor={"#F7A76C"}
                                    avatarColor={orange[700]}
                                    title={'Pendientes'}
                                    value={ctdPendientes}
                                />
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} >
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


                    <Grid item xs={12} sm={6} md={6}>
                        <div className="card13" >
                            {
                                <div className="header-ev">
                                    <h5 className="titulo-ev">Actividades Pendientes</h5>

                                    <Avatar sx={{ bgcolor: orange[700] }} >
                                        <WorkHistoryIcon />
                                    </Avatar>

                                </div>
                            }
                            {
                                <div className="card-body12-tabla small">
                                    <div className="ScrollStyle">

                                        <Table className='table table-light table-hover'>
                                            <Thead>
                                                <Tr>
                                                    <Th>#</Th>
                                                    <Th className="t-encargados">Fecha</Th>
                                                    <Th className="t-encargados">Asunto</Th>
                                                    <Th className="t-encargados">Información</Th>

                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {ordenes.filter(filterbytipot).filter(filterStateIniciadas).map((dato, index) => (
                                                    <Tr key={index} >
                                                        <Td>
                                                            {index + 1}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                            {dato.fecha}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                            {dato.asunto}
                                                        </Td>

                                                        <Td>
                                                            <IconButton aria-label="delete" color="gris" onClick={() => { vistaTablaPendientes(dato) }}  ><InfoIcon /></IconButton>
                                                        </Td>
                                                    </Tr>
                                                ))}


                                            </Tbody>
                                        </Table>
                                    </div>

                                    <Modal isOpen={modalPendientes}>
                                        <Container>
                                            <ModalHeader>
                                                <div><h1> Orden de Trabajo</h1></div>
                                            </ModalHeader>
                                            <ModalBody>
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
                                                                <b>Prioridad:   </b>
                                                                {currentForm.prioridad}
                                                            </label>

                                                        </Grid >
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Tipo Trabajo:   </b>
                                                                {currentForm.tipotrabajo}
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
                                                                <b>Cédula Solicitante:   </b>
                                                                {currentForm.cedula}
                                                            </label>

                                                        </Grid >
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Descripción Equipo:   </b>
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
                                                                <b>Problemática:   </b>
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
                                                                <b>Observaciones:   </b>
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
                                                <Button variant="contained" className="boton-modal-d" onClick={cerrarvistainfo}>Cerrar </Button>
                                            </ModalFooter>
                                        </Container>
                                    </Modal>
                                </div>
                            }

                        </div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                        <div className="card13" >
                            {
                                <div className="header-ev">

                                    <h5 className="titulo-ev">Actividades Acabadas</h5>
                                    <Avatar sx={{ bgcolor: lightGreen[500] }} >
                                        <DoneAllIcon />
                                    </Avatar>

                                </div>
                            }
                            {
                                <div className="card-body12-tabla small">
                                    <div className="ScrollStyle">

                                        <Table className='table table-light table-hover'>
                                            <Thead>
                                                <Tr>
                                                    <Th>#</Th>
                                                    <Th className="t-encargados">Fecha</Th>
                                                    <Th className="t-encargados">Asunto</Th>
                                                    <Th className="t-encargados">Información</Th>
                                                    <Th className="t-encargados">Verificación</Th>
                                                    <Th className="t-encargados">Reporte</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {ordenes.filter(filterbytipot).filter(filterStateSolventadas).map((dato, index) => (

                                                    <Tr key={index} >
                                                        <Td>
                                                            {index + 1}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                            {dato.fecha}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                            {dato.asunto}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                            <IconButton aria-label="informacion" color="gris" onClick={() => { vistainformacion2(dato) }}><InfoIcon /></IconButton>
                                                        </Td>
                                                        <Td className="t-encargados">
                                                            <Checkbox
                                                                {...label}
                                                                icon={<CheckBoxOutlinedIcon />}
                                                                checked={dato.verificacion}
                                                            />
                                                        </Td>
                                                        <Td>
                                                            <IconButton aria-label="delete" onClick={() => { visualizarReporte(dato) }} color="rosado">
                                                                <RemoveRedEyeIcon />
                                                            </IconButton>
                                                        </Td>

                                                    </Tr>
                                                ))}
                                            </Tbody>

                                        </Table>
                                    </div>
                                    <Modal isOpen={modalInformacion2}>
                                        <Container>
                                            <ModalHeader>
                                                <div><h1> Orden de Trabajo</h1></div>
                                            </ModalHeader>
                                            <ModalBody>
                                                <FormGroup>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12}>
                                                            <div className="name-outlined">{currentForm.id}</div>
                                                        </Grid >
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Asunto:  </b>
                                                                {currentForm.asunto}
                                                            </label>

                                                        </Grid >
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Fecha: </b>
                                                                {currentForm.fecha}
                                                            </label>

                                                        </Grid >
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Departamento:  </b>
                                                                {currentForm.departamento}
                                                            </label>

                                                        </Grid >
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Cédula Solicitante:  </b>
                                                                {currentForm.cedula}
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
                                                                <b>Código Equipo:  </b>
                                                                {currentForm.codigoe}
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
                                                <Button variant="contained" className="boton-modal-d" onClick={cerrarvistainfo2}>Cerrar </Button>
                                            </ModalFooter>
                                        </Container>
                                    </Modal>
                                    <Modal isOpen={modalReportexistente}>
                                        <ModalHeader>
                                            <div><h1>Ver Reporte Interno</h1></div>
                                        </ModalHeader>
                                        <ModalBody>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <div className="name-outlined">{currentReporte.id}</div>
                                                </Grid >
                                                <Grid item xs={12}>
                                                    <label>
                                                        <b>Estado:  </b>
                                                        {currentReporte.estadof}
                                                    </label>
                                                </Grid >
                                                <Grid item xs={12}>
                                                    <label>
                                                        <b>Orden Trabajo:  </b>
                                                        {currentReporte.OrdenId}
                                                    </label>
                                                </Grid >
                                                <Grid item xs={12}>
                                                    <label>
                                                        <b>Técnico: </b>
                                                        {currentReporte.nombreT}
                                                    </label>
                                                </Grid >
                                                <Grid item xs={12}>
                                                    <label>
                                                        <b>Equipo:  </b>
                                                        {currentReporte.equipo}
                                                    </label>
                                                </Grid >
                                                <Grid item xs={12}>
                                                    <label>
                                                        <b>Código Equipo:  </b>
                                                        {currentReporte.codigoe}
                                                    </label>
                                                </Grid >
                                                <Grid item xs={12}>
                                                    <label>
                                                        <b>Tipo de mantenimiento:  </b>
                                                        {currentReporte.tmantenimiento}
                                                    </label>

                                                </Grid >
                                                <Grid item xs={12}>
                                                    <label>
                                                        <b>Tiempo:  </b>
                                                        {currentReporte.tiempo}
                                                    </label>

                                                </Grid >
                                                <Grid item xs={12}>
                                                    <label>
                                                        <b>Costo:  </b>
                                                        {currentReporte.costo}
                                                    </label>

                                                </Grid >
                                                <Grid item xs={12}>
                                                    <label>
                                                        <b>Falla:  </b>
                                                    </label>
                                                    <TextareaAutosize
                                                        aria-label="minimum height"
                                                        minRows={1}
                                                        placeholder="Falla"
                                                        className="text-area-encargado"
                                                        name="falla"
                                                        readOnly
                                                        value={currentReporte.falla} />

                                                </Grid >
                                                <Grid item xs={12}>
                                                    <label>
                                                        <b>Causas:  </b>
                                                    </label>
                                                    <TextareaAutosize
                                                        aria-label="minimum height"
                                                        minRows={1}
                                                        placeholder="Causa"
                                                        className="text-area-encargado"
                                                        name="causa"
                                                        readOnly
                                                        value={currentReporte.causas} />

                                                </Grid >
                                                <Grid item xs={12}>
                                                    <label>
                                                        <b>Actividades:  </b>
                                                    </label>
                                                    <TextareaAutosize
                                                        aria-label="minimum height"
                                                        minRows={1}
                                                        placeholder="Actividades"
                                                        className="text-area-encargado"
                                                        name="actividadesR"
                                                        readOnly
                                                        value={currentReporte.actividadesR} />
                                                </Grid >
                                                <Grid item xs={12}>
                                                    <label>
                                                        <b>Repuestos:  </b>
                                                    </label>
                                                    <TextareaAutosize
                                                        aria-label="minimum height"
                                                        minRows={1}
                                                        placeholder="Repuestos"
                                                        className="text-area-encargado"
                                                        name="repuestos"
                                                        readOnly
                                                        value={currentReporte.repuestos} />
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
                                                        value={currentReporte.observaciones} />

                                                </Grid >
                                            </Grid>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button
                                                variant="contained"
                                                className="boton-modal-pdf"
                                                startIcon={<PrintIcon />}
                                                onClick={generarPdf} >
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
                                </div>
                            }

                        </div>
                    </Grid>

                </Grid>
            </div>
        </>
    );
}