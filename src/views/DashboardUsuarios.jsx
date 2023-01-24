import { useSelector } from "react-redux";
import { collection, query, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { pink, cyan, lightGreen, orange } from '@mui/material/colors';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Swal from 'sweetalert2';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { Grid } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import * as React from 'react';
import { useEffect, useState, useRef } from "react";
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import Box from '@mui/material/Box';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import TarjetaDashboard from "../components/TarjetaDashBoard";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import Button from '@mui/material/Button';
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
import '../css/EncargadoView.css'

export default function DashboardUsuarios() {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const [verificacion, setVerificacion] = useState(false);
    const currentUser = useSelector(state => state.auths);
    const currentOrden = useSelector(state => state.ordens);
    const [user, setUser] = useState({});
    const [ordenesTecnico, setOrdenesTecnico] = useState([]);
    const [departamento, setDepartamento] = useState("Todos");
    const [reset,setReset]=useState(false);
    const ordenesAux= useRef([])
    const [area, setArea] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [modalPendientes, setModalPendientes] = useState(false);
    const [modalInformacion2, setModalinformacion2] = useState(false);
    const [currentForm, setCurrentForm] = useState({})
    const [ctdPendientes, setCtdPendientes] = useState(0);
    const [ctdSolventadas, setCtdSolventadas] = useState(0);

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

        onSnapshot(doc(db, "usuarios", currentUser.uid), (doc) => {
            setUser(doc.data());
            setDepartamentos(doc.data().area)
        });
        const reference = query(collection(db, "ordenes"));
        onSnapshot(reference, (querySnapshot) => {
            var ordenes = [];
            querySnapshot.forEach((doc) => {
                ordenes.push(doc.data());
            });
            let fecha=ordenes.sort((a, b) => {
                return b.indice - a.indice
            })
            let ci=fecha.filter(filterbycedula) 
            ordenesAux.current=ci
            setOrdenesTecnico(ci);
            const p = ci.filter(filterStateIniciadas).length
            const s = ci.filter(filterStateSolventadas).length
            console.log(p)
            console.log(s)
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

    const filterbyarea = (orden) => {
        if (departamento!==""){
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
                    /* Read more about handling dismissals below */
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






    // const filterbyarea = (orden) => {
    //     if (orden.departamento === area) {
    //         return orden
    //     } else if (area === 'ALL') {
    //         return orden
    //     } else {
    //         return
    //     }
    // }


    const filtrarDatos = () => {
        const filtro1 = ordenesAux.current.filter(filterbyarea)
        setOrdenesTecnico(filtro1);
        setReset(!reset)
        setDepartamento("")
        const p = filtro1.filter(filterStateIniciadas).length
        const s = filtro1.filter(filterStateSolventadas).length
        setCtdPendientes(p);
        setCtdSolventadas(s);
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
                                    <h5 className="titulo-ev">Información del Usuario</h5>
                                </div>
                            }
                            {
                                <div className="card-body12 small">
                                    <div className="name-outlined">{currentUser.name} {currentUser.lastname}</div>
                                    <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                                {/* <Box sx={{ minWidth: 200 }}>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="demo-simple-select-label">Departamentos</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            label="Departamentos"
                                                            name="cargo"
                                                            value={area}
                                                            onChange={handleSelectFilter}
                                                            sx={{ textAlign: 'left' }}
                                                        >
                                                            {departamentos.map((item, index) => (<MenuItem key={index} value={item}>{item}</MenuItem>))}
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                            </Grid> */}
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
                                            <Grid item xs={4}>
                                                <Button variant="outlined" className="boton-gestionm" onClick={filtrarDatos} startIcon={<FilterAltIcon />}>
                                                    Filtrar
                                                </Button>
                                                </Grid>
                                            </Grid>

                                </div>
                            }
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>


                        <Grid container spacing={{ xs: 1, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>

                            {/* <Grid item xs={4} sm={6} md={4} >
                                <TarjetaDashboard
                                    icon={<PlayArrowIcon />}
                                    headerColor={"#ADCF9F"}
                                    avatarColor={lightGreen[700]}
                                    title={'Enviadas'}
                                    value={0}
                                />
                            </Grid> */}
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
                                                    <Th className="t-encargados">Código</Th>
                                                    <Th className="t-encargados">Fecha</Th>
                                                    <Th className="t-encargados">Asunto</Th>
                                                    <Th className="t-encargados">Información</Th>

                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {ordenesTecnico.filter(filterStateIniciadas).map((dato, index) => (
                                                    <Tr key={index} >
                                                        <Td>
                                                            {index + 1}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                            {dato.id}
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

                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {ordenesTecnico.filter(filterStateSolventadas).map((dato, index) => (

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
                                                                onChange={() => { verificacionr(dato) }}
                                                            />
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
                                                    className="boton-modal-d" onClick={cerrarvistainfo2}>Cerrar </Button>
                                            </ModalFooter>
                                        </Container>
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