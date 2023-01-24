import React, { useEffect, useState } from "react";
import '../css/Presentacion.css';
import '../css/Ordentrabajo.css';
import '../css/Usuarios.css';
import '../css/Hojavida.css';
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import Grid from "@mui/material/Grid";
import GraficaDona from "../components/GraficoDona";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import GraficaPie from "./GraficaPie";
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import TarjetaDashboard from "../components/TarjetaDashBoard";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { pink, cyan, lightBlue, orange,teal } from '@mui/material/colors';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { useSelector } from "react-redux";
import {
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    ModalFooter,
} from "reactstrap";

export default function Hoja_vida() {
    const [externos, setExternos] = useState([]);
    const [internos, setInternos] = useState([]);
    const [reportes, setReportes] = useState([]);
    const [currentreport, setCurrentreport] = useState({});
    const [modalInformacion, setModalinformacion] = useState(false);
    const [preventivo,setPreventivo]= useState(0);
    const [correctivo,setCorrectivo]= useState(0);
    const [calibraciones,setCalibraciones]= useState(0);

    const currentInventario = useSelector(state => state.inventarios);
    var interno = [];
    var externo = [];
    const getReportes = () => {
        const ref1 = query(collection(db, "reportes externos"));
        onSnapshot(ref1, (querySnapshot) => {
           
            querySnapshot.forEach((doc) => {
                externo.push(doc.data());
            });
            setExternos(externo);
        });
        const ref2 = query(collection(db, "reportesint"));
        onSnapshot(ref2, (querySnapshot) => {
  
            querySnapshot.forEach((doc) => {
                interno.push(doc.data());
            });
            setInternos(interno);
        });

    }

    const Dona =()=>{
    const reportes= internos.concat(externos)
    const codigoequipos = reportes.filter(filterCodigo)
    setPreventivo(codigoequipos.filter(filterPreventivo).length)
    setCorrectivo(codigoequipos.filter(filterCorrectivo).length)
    setCalibraciones(codigoequipos.filter(filterCalibraciones).length)
    }

    const filterCodigo= (rex) => {
    if (rex.codigo === currentInventario.codigo){
        return state;
    } else {
        return
    }
}
   
    const filterPreventivo = (state) => {
        if (state.tmantenimiento === "Preventivo") {
            return state;
        } else {
            return
        }
    }

    const filterCorrectivo = (state) => {
        if (state.tmantenimiento === "Correctivo") {
            return state;
        } else {
            return
        }
    }

    const filterCalibraciones = (state) => {
        if (state.tmantenimiento === "Calibracion") {
            return state;
        } else {
            return
        }
    }
    const mostrarModalInformacion = (report) => {
        setCurrentreport(report);
        setModalinformacion(true);
    };

    const cerrarModalInformacion = () => {
        setModalinformacion(false);
    };

    useEffect(() => {
        getReportes();
    }, [])


  

  return (
    <>
    
    <div className="container-test-2">
                <Grid container spacing={{ xs: 1, md: 9 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Grid container spacing={{ xs: 1, md: 4 }}>
                         
                            <Grid item xs={12} sm={6} md={12}>
                                <div className="card12" >
                                    {
                                        <div className="card-header14">
                                            <div className="alinear1">
                                                <h5 className="titui2">Información Equipo</h5>
                                                <Avatar sx={{ bgcolor: lightBlue [100] }} >
                                                    <WorkHistoryIcon />
                                                </Avatar>
                                            </div>

                                        </div>
                                    }
                                    {
                                        <div className="card-body12 small">
                                            <h1 className="informacion">{currentInventario.codigo}</h1>
                                            <h1 className="informacion"><b>Departamento:</b> {currentInventario.area}</h1>
                                            <h1 className="informacion"><b>Equipo:</b>{currentInventario.equipo}</h1>
                                            <h1 className="informacion"><b>Marca:</b>{currentInventario.marca}</h1>
                                            <h1 className="informacion"><b>Modelo:</b>{currentInventario.modelo}</h1>
                                            <h1 className="informacion"><b>Serie:</b>{currentInventario.serie}</h1>
                                        </div>
                                    }

                                </div>

                            </Grid>

                            <Grid item xs={12} sm={6} md={12}>
                            <div className="card12" >
                             
                                    {
                                    <div className="card-body12 small ">
                                    <div className="card12" >

{
    <div className="card-body12 small ">

        <GraficaDona labels={["Mtto. Preventivo", "Mtto. Correctivo", "Calibraciones"]} info={[preventivo,correctivo,calibraciones]} />

    </div>
}

</div>
                                    </div>
                                    }

                                </div>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* empieza container tablas  */}
                    <Grid item xs={12} sm={6} md={9}>
                    <div className="card13" >
                            {
                                <div className="header-ev">
                                    <h5 className="titulo-ev">MANTENIMIENTOS</h5>

                                    <Avatar sx={{ bgcolor: orange[700] }} >
                                        <WorkHistoryIcon />
                                    </Avatar>

                                </div>
                            }
                            {
                                <div className="card-body12 small">
                                    <div className="ScrollStyle">

                                        <Table className='table table-light table-hover'>
                                            <Thead>
                                                <Tr>
                                                    <Th>#</Th>
                                                    <Th className="t-encargados">Mtto.</Th>
                                                    <Th className="t-encargados">Tipo</Th>
                                                    <Th className="t-encargados">Responsable</Th>
                                                    <Th className="t-encargados">Nivel Alerta</Th>
                                                    <Th className="t-encargados">Horas Utilizadas</Th>
                                                    <Th className="t-encargados">Información</Th>
                                                   

                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                            {externos.concat(internos).filter(rex => rex.codigo === currentInventario.codigo).map((reporte, index) => (
                                                    <Tr key={index} >
                                                        <Td>
                                                        {index + 1}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                        {reporte.tipomant}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                        interno
                                                        </Td>
                                                        <Td className="t-encargados">
                                                        {reporte.nombre}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                        {reporte.nivelalerta}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                        {reporte.horasT}
                                                        </Td>
                                                        <Td>
                                                        <IconButton aria-label="delete" sx={{ color: teal[200] }}  onClick={() => mostrarModalInformacion(reporte)} ><InfoIcon /></IconButton>
                                                        </Td>
                                                    </Tr>
                                                       ))}
                                            </Tbody>
                                        </Table>

                                        <Modal isOpen={modalInformacion}>
                <ModalHeader>
                    <div><h2>Información</h2></div>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <label>
                                Código Reporte:
                                </label>

                                <input
                                    className="form-control"
                                    readOnly
                                    type="text"
                                    value={currentreport.id}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                    Falla:
                                </label>

                                <TextareaAutosize
                                    className="form-control"
                                    readOnly
                                    type="text"
                                    value={currentreport.falla}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                    Causas:
                                </label>

                                <TextareaAutosize
                                    className="form-control"
                                    readOnly
                                    type="text"
                                    value={currentreport.causas}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                    Actividades:
                                </label>

                                <TextareaAutosize
                                    className="form-control"
                                    readOnly
                                    type="text"
                                    value={currentreport.actividades}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <label>
                                    Repuestos:
                                </label>

                                <TextareaAutosize
                                    className="form-control"
                                    readOnly
                                    type="text"
                                    value={currentreport.repuestos}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                    Costo:
                                </label>

                                <input
                                    className="form-control"
                                    readOnly
                                    type="text"
                                    value={currentreport.costo}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                    Observaciones:
                                </label>

                                <TextareaAutosize
                                    className="form-control"
                                    readOnly
                                    type="text"
                                    value={currentreport.observaciones1}
                                />
                            </Grid>
                        

                        </Grid>
                    </FormGroup>

                </ModalBody>
                <ModalFooter>
                    <Button
                        className="editar"
                        onClick={() => cerrarModalInformacion()}
                    >
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>
                                    </div>

                                  
                                </div>
                            }

                        </div>
                    </Grid>
                </Grid>
            </div>
    </>
  );
}


