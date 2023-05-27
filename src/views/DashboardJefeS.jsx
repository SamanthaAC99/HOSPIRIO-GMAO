import { useSelector } from "react-redux";
import { collection, query, doc, onSnapshot, getDoc } from "firebase/firestore";
import { pink, lightGreen, orange } from '@mui/material/colors';
import autoTable from 'jspdf-autotable'
import { jsPDF } from "jspdf";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import PrintIcon from '@mui/icons-material/Print';
import Checkbox from '@mui/material/Checkbox';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { Grid } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useEffect, useState,useRef } from "react";
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import InfoIcon from '@mui/icons-material/Info';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import TarjetaDashboard from "../components/TarjetaDashBoard";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import emailjs from '@emailjs/browser';
import '../css/DashboardJefeM.css'
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

const prioridades = [
    { label: 'Todas' },
    { label: 'Crítica' },
    { label: 'Alta' },
    { label: 'Media' },
    { label: 'Baja' },
]



export default function DashboardJefeS() {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const currentUser = useSelector(state => state.auths);
    const [prioridad, setPrioridad] = useState("Todas");
    const [departamentos, setDepartamentos] = useState([]);
    const [departamento, setDepartamento] = useState("Todos");
    const [modalPendientes, setModalPendientes] = useState(false);
    const [modalInformacion2, setModalinformacion2] = useState(false);
    const [currentForm, setCurrentForm] = useState({})
    const [ctdPendientes, setCtdPendientes] = useState(0);
    const [ctdSolventadas, setCtdSolventadas] = useState(0);
    const [ordenes, setOrdenes] = useState([]);
    const ordenesTotales = useRef([])
    const [currentReporte, setCurrentReporte] = useState({});
    const [modalReportexistente, setModalReportexistente] = useState(false);

    const vistaTablaPendientes = (data) => {
        setCurrentForm(data)
        setModalPendientes(true);
    };
    const cerrarvistainfo = () => {
        setModalPendientes(false);
    };

    const vistainformacion2 = (data) => {
        setCurrentForm(data)
        setModalinformacion2(true);
    };
    const cerrarvistainfo2 = () => {
        setModalinformacion2(false);
    };

    const updateUser = () => {

        const reference = query(collection(db, "ordenes"));
        onSnapshot(reference, (querySnapshot) => {
            var ordenes = [];
            querySnapshot.forEach((doc) => {
                ordenes.push(doc.data());
            });

            setOrdenes(
                ordenes.filter(item => item.tipotrabajo === "Sistemas" ).sort((a, b) =>{
                    return b.indice  - a.indice
                })
            );
            ordenesTotales.current = ordenes.filter(item => item.tipotrabajo === "Sistemas" ).sort((a, b) =>{
                return b.indice  - a.indice
            })
            setCtdPendientes(ordenes.filter(filterStateIniciadas).filter(item => item.tipotrabajo === "Sistemas" ).length);
            setCtdSolventadas(ordenes.filter(filterStateSolventadas).filter(item => item.tipotrabajo === "Sistemas" ).length);

        });
        onSnapshot(doc(db, "informacion", "parametros"), (doc) => {
            let departamentos_aux = doc.data().departamentos
            let temp = [{nombre:"TODOS",codigo:9999}] //esta linea de codigo es para agregar el parametro todos al inicio del arreglo
            departamentos_aux.forEach((doc)=>{
                temp.push(doc)
            })
            console.log(temp)
            setDepartamentos(temp)
          });
    }


    const filtrarDatos = () => {
        const data = JSON.parse(JSON.stringify(ordenesTotales.current));
        let ordenes_filtradas = data.filter(filterbyarea).filter(filterbyprioridad)
        setOrdenes(ordenes_filtradas);
        setCtdPendientes(ordenes_filtradas.filter(filterStateIniciadas).length);
        setCtdSolventadas(ordenes_filtradas.filter(filterStateSolventadas).length);
    }


    const filterbyarea = (orden) => {
        if (orden.departamento === departamento) {
            return orden
        } else if (departamento === 'TODOS') {
            return orden
        } else {
            return
        }
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
        doc.setFontSize(10)
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


    const actualizarValidacion = ()=>{
        let aux_ordenes = JSON.parse(JSON.stringify(ordenesTotales.current))
        let ordenes_fitlradas = aux_ordenes.filter(filterStateSolventadas).filter(item => item.verificacion === false)
     
        for(let i = 0;i< ordenes_fitlradas.length ; i++){
            try {
                let __orden = ordenes_fitlradas[i]
                emailjs.send("service_22xh03a", "template_o2wssge", {
                    n_orden: __orden.id,
                    asunto: __orden.asunto,
                    departamento:"Jefe de Sistemas",
                    to_email:__orden.correo,
                    reply_to:currentUser.email,
                }, "Z1YvVmzlMz2V1hOEO");
                console.log("exito")
            } catch (error) {
                console.log("error")
            }
        }
    }

    


    useEffect(() => {
        updateUser();
        // eslint-disable-next-line
    }, [])

    return (
        <>
            <div className="container-test">
                <Grid container spacing={{ xs: 1, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={12} sm={6} md={6}>
                        <div className="card13" >
                                <div className="header-ev">
                                    <h5 className="titulo-ev">Filtros</h5>
                                </div>
                                <div className="card-body12 small">
                                    <div className="name-outlined2">{currentUser.name} {currentUser.lastname}</div>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Autocomplete
                                                disableClearable
                                                className='seleccionadortabla-jm'
                                                id="combo-box-demo"
                                                options={departamentos}
                                                getOptionLabel={(option) => {
                                                  return option.nombre;
                                                }}
                                                onChange={(event, newvalue) => setDepartamento(newvalue.nombre)}
                                                renderInput={(params) => <TextField {...params} fullWidth label="DEPARTAMENTOS" color={prioridades !== '' ? "gris" : "oficial"} type="text" />}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Autocomplete
                                                disableClearable
                                                className='seleccionadortabla-jm'
                                                id="combo-box-demo"
                                                options={prioridades}
                                                onChange={(event, newvalue) => setPrioridad(newvalue.label)}
                                                renderInput={(params) => <TextField {...params} fullWidth label="PRIORIDAD" color={prioridades !== '' ? "gris" : "oficial"} type="text" />}
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

                    <Grid item xs={12} sm={6} md={6}>


                        <Grid container spacing={{ xs: 1, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>

                            <Grid item xs={4} sm={6} md={4} >
                            <Button variant="outlined" onClick={()=>{actualizarValidacion()}}>Actualizar Validacion</Button>
                            </Grid>
                            <Grid item xs={4} sm={6} md={4} >
                                <TarjetaDashboard
                                    icon={<PendingActionsIcon />}
                                    headerColor={"#F7A76C"}
                                    avatarColor={orange[700]}
                                    title={'Pendientes'}
                                    value={ctdPendientes}
                                />
                            </Grid>
                            <Grid item xs={4} sm={6} md={4} >
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
                        <div className="card13" style={{height:400}} >

                                <div className="header-ev">
                                    <h5 className="titulo-ev">Actividades Pendientes</h5>

                                    <Avatar sx={{ bgcolor: orange[700] }} >
                                        <WorkHistoryIcon />
                                    </Avatar>

                                </div>
                     
                                <div className="card-body12-tabla small" style={{overflowY:"scroll"}}>
                                    <div >

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
                                                {ordenes.filter(filterStateIniciadas).map((dato, index) => (
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

                                  
                                </div>

                        </div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                        <div className="card13" style={{height:400}}>
                            
                                <div className="header-ev">
                                    <h5 className="titulo-ev">Actividades Acabadas</h5>
                                    <Avatar sx={{ bgcolor: lightGreen[500] }} >
                                        <DoneAllIcon />
                                    </Avatar>
                                </div>
                            
                            
                                <div className="card-body12-tabla small"  style={{overflowY:"scroll"}}>
                                    <div >
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
                                                {ordenes.filter(filterStateSolventadas).map((dato, index) => (

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
                                  
                                </div>
                            
                        </div>
                    </Grid>

                </Grid>
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
                                                                <b>Departamento:   </b>
                                                                {currentForm.departamento}
                                                            </label>

                                                        </Grid >
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Tipo Trabajo:   </b>
                                                                "Sistemas"
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
                                                <Button
                                                    variant="contained"
                                                    className="boton-modal-d"
                                                    onClick={cerrarvistainfo}
                                                >
                                                    Cerrar
                                                </Button>

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
                                                                <b>Prioridad:  </b>
                                                                {currentForm.prioridad}
                                                            </label>

                                                        </Grid >
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Tipo de Trabajo:  </b>
                                                               "Sistemas"
                                                            </label>
                                                        </Grid >
                                                        {/* <Grid item xs={12}>
                                                            <label>
                                                            <b>Código Equipo:  </b>  
                                                            {currentForm.codigoe}
                                                            </label>
                                                        </Grid > */}
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
                                                    onClick={cerrarvistainfo2}>Cerrar </Button>
                                            </ModalFooter>
                                        </Container>
                                    </Modal>
        </>
    );
}