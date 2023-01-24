import React, { useEffect, useRef, useState } from "react";
import '../css/Presentacion.css';
import '../css/Ordentrabajo.css';
import '../css/Usuarios.css';
import '../css/Hojavida.css';
import { collection, query, onSnapshot } from "firebase/firestore";
import autoTable from 'jspdf-autotable'
import { db } from "../firebase/firebase-config";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
// import GraficaPie from "../components/GraficaPie";
import GraficaDona from "../components/GraficoDona";
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import HandymanIcon from '@mui/icons-material/Handyman';
import { lightBlue, teal, blue, cyan } from '@mui/material/colors';
// import TextareaAutosize from '@mui/material/TextareaAutosize';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { useSelector } from "react-redux";
// import amber from "@mui/material/colors";
import { jsPDF } from "jspdf";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "reactstrap";
import TarjetaGestionar from "../components/TarjetaGestionar";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";

export default function HojaVidaInactivos() {

    const currentInventario = useSelector(state => state.inventarios);
    // console.log(currentInventario)
    // console.log(currentInventario.codigoe)
    const navigate = useNavigate();
    let params = useParams();
    // const [datosExternos, setDatosExternos] = useState([]);
    // const [datosInternos, setDatosInternos] = useState([]);
    // const [reportes, setReportes] = useState([]);
    const [currentreport, setCurrentreport] = useState({});
    // const [externos, setExternos] = useState([]);
    // const [internos, setInternos] = useState([]);
    const [preventivo, setPreventivo] = useState(0);
    const [correctivo, setCorrectivo] = useState(0);
    // const [calibraciones, setCalibraciones] = useState(0);
    const [porcentajePreventivo, setPorcentajePreventivo] = useState(0);
    const [porcentajeCorrectivo, setPorcentajeCorrectivo] = useState(0);
    // const [internos,setInternos] = useState([]);
    // const [externos,setExternos] = useState([]);
    const internos = useRef([])
    const externos = useRef([])
    // const [porcentajeCalibraciones, setPorcentajeCalibraciones] = useState(0);
    const [modalInformacion, setModalinformacion] = useState(false);
    // const [ctdMantenimientos, setCtdMantenimientos] = useState({
    //     correctivo: 4,
    //     preventivo: 1,
    //     calibraciones: 2,
    // });
    const [reportesTotales, setReportesTotales] = useState([]);

    const getReportes = () => {

        const ref1 = query(collection(db, "reportesext"));
        onSnapshot(ref1, (querySnapshot) => {
            // querySnapshot.forEach((doc) => {
            //     externo.push(doc.data());
            // });

            // setExternos(
            //     querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            // );
            internos.current = querySnapshot.docs.map((doc) => ({ ...doc.data() }))
        });
        const ref2 = query(collection(db, "reportesint"));
        onSnapshot(ref2, (querySnapshot) => {
            // querySnapshot.forEach((doc) => {
            //     interno.push(doc.data());
            // });
            // setInternos(
            //     querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            // );
            externos.current = querySnapshot.docs.map((doc) => (doc.data()))
            calcularParamIniciales();
        });

    }
    const calcularParamIniciales = ()=>{
        const aux_internos = JSON.parse(JSON.stringify(internos.current));
        const aux_externos  = JSON.parse(JSON.stringify(externos.current));
        const ordenesUnidas = aux_internos.concat(aux_externos);
        console.log("ordenes unidas", ordenesUnidas);
        setReportesTotales(ordenesUnidas);

        const reportesFiltrados = ordenesUnidas.filter(reporte => reporte.codigoe === currentInventario.codigo) //filtro por id
        const filtradosTotal = reportesFiltrados.length
        const filtradosPreventivo = reportesFiltrados.filter(filterPreventivo).length
        const filtradosCorrectivo = reportesFiltrados.filter(filterCorrectivo).length
        // const filtradosCalibraciones = reportesFiltrados.filter(filterCalibraciones).length

        const porcentajePreventivo = ((filtradosPreventivo * 100) / filtradosTotal)
        const porcentajeCorrectivo = ((filtradosCorrectivo * 100) / filtradosTotal)
        // const porcentajeCalibraciones = ((filtradosCalibraciones * 100) / filtradosTotal)


        setPorcentajePreventivo(Math.round(porcentajePreventivo))
        setPorcentajeCorrectivo(Math.round(porcentajeCorrectivo))
        // setPorcentajeCalibraciones(Math.round(porcentajeCalibraciones))

        setPreventivo(reportesFiltrados.filter(filterPreventivo).length)
        setCorrectivo(reportesFiltrados.filter(filterCorrectivo).length)
        // setCalibraciones(reportesFiltrados.filter(filterCalibraciones).length)
    }

    const navegarView = (ruta) => {
        navigate(`/${params.uid}/${ruta}`);
    }
    const salir = () => {
        navegarView('inventario/equipos_inactivos');
    };



    // const Dona = () => {
    //     const reportesFiltrados = reportesTotales.filter(reporte => reporte.codigoe === currentInventario.codigo) //filtro por id

    //     setPreventivo(reportesFiltrados.filter(filterPreventivo).length)
    //     setCorrectivo(reportesFiltrados.filter(filterCorrectivo).length)
    //     setCalibraciones(reportesFiltrados.filter(filterCalibraciones).length)
    // }

    // const filterCodigo = (rex) => {
    //     if (rex.codigoe === currentInventario.codigo) {
    //         return rex;
    //     } else {
    //         return
    //     }
    // }

    const filterPreventivo = (state) => {
        if (state.tmantenimiento === "PREVENTIVO") {
            return state;
        } else {
            return
        }
    }

    const filterCorrectivo = (state) => {
        if (state.tmantenimiento === "CORRECTIVO") {
            return state;
        } else {
            return
        }
    }

    // const filterCalibraciones = (state) => {
    //     if (state.tmantenimiento === "Calibracion") {
    //         return state;
    //     } else {
    //         return
    //     }
    // }

    const generarPdf = () => {
        var doc = new jsPDF({
            orientation: "portrait",
        })
        doc.text("Hospital del Río ", 90, 10); //fontsize 15
        doc.setFontSize(12)// de aqui para abajo todo estara con fontsize 9
        doc.text("Hoja de Vida", 95, 20)
        doc.setFontSize(9)
        let datos_filtados = reportesTotales.filter(reporte => reporte.codigoe === currentInventario.codigo)
        doc.text("Código:", 20, 30)
        doc.text(currentInventario.codigo, 70, 30)
        doc.text("Departamento:", 20, 35)
        doc.text(currentInventario.area, 70, 35)
        doc.text("Equipo:", 20, 40)
        doc.text(currentInventario.equipo, 70, 40)
        doc.text("Marca:", 20, 45)
        doc.text(currentInventario.marca, 70, 45)
        doc.text("Modelo:", 20, 50)
        doc.text(currentInventario.modelo, 70, 50)
        doc.text("Serie:", 20, 55)
        doc.text(currentInventario.serie, 70, 55)
        let aux = 55
        let datos_tabla = datos_filtados.map((item, index) => (
            [
                index, item.tmantenimiento, item.tipo, item.nombreT, item.estadof, item.tiempo
            ]
        ))


        autoTable(doc, {
            startY: aux + 10,
            head: [['Mtto. Preventivo', 'Mtto. Correctivo']],
            body: [[porcentajePreventivo, porcentajeCorrectivo]]
        })

        autoTable(doc, {
            startY: aux + 30,
            head: [['#', 'MTTO.', 'Tipo', "Responsable", "Estado", "Horas Utilizadas"]],
            body: datos_tabla,
        })

        doc.save(`reporte_${currentInventario.codigo}.pdf`);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <>

            <div className="container-test-2">
                <Grid container spacing={{ xs: 1, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }}>

                    <Grid item xs={12} sm={6} md={3.5}>


                        <Grid container spacing={{ xs: 3, md: 3 }}>
                            <Grid item xs={12} sm={6} md={12}>
                                <div className="card12" style={{height:"100%"}} >
                                
                                        <div className="header-tarjeta-8">
                                            <h5 className="titui-ges">Información Equipo</h5>
                                            <Avatar sx={{ bgcolor: lightBlue[100] }} >
                                                <WorkHistoryIcon />
                                            </Avatar>
                                        </div>
                                        <div className="card-body-info small">
                                            <div className="borde-codigo">{currentInventario.codigo}</div>
                                            <h1 className="informacion"><b>Departamento:</b> {currentInventario.departamento}</h1>
                                            <h1 className="informacion"><b>Equipo:</b>{currentInventario.equipo}</h1>
                                            <h1 className="informacion"><b>Marca:</b>{currentInventario.marca}</h1>
                                            <h1 className="informacion"><b>Modelo:</b>{currentInventario.modelo}</h1>
                                            <h1 className="informacion"><b>Serie:</b>{currentInventario.serie}</h1>
                                        </div>
                                    
                                    <div>
                                        <Button variant="contained" sx={{ height: "100%", width: "100%" }} onClick={generarPdf} >Generar Pdf</Button>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6} md={12}>
                                <div className="card12" >
                                    <div className="card-body12 small ">
                                        {/* <GraficaPie labels={["Mtto. Preventivo", "Mtto. Correctivo", "Calibraciones"]} datos={[ctdMantenimientos.correctivo, ctdMantenimientos.preventivo, ctdMantenimientos.calibraciones]} /> */}
                                        <GraficaDona labels={["Mtto. Preventivo", "Mtto. Correctivo"]} info={[preventivo, correctivo]} />
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* empieza container tablas  */}
                    <Grid item xs={12} sm={6} md={8.5}>
                        <Grid container spacing={{ xs: 3 }} >
                            <Grid item xs={6} sm={6} md={5}>
                                <TarjetaGestionar
                                    icon={<WorkHistoryIcon />}
                                    headerColor={"#ffff"}
                                    avatarColor={cyan[700]}
                                    title={'Mtto. Preventivo'}
                                    value={`${porcentajePreventivo}%`}
                                />
                            </Grid>


                            <Grid item xs={6} sm={6} md={5}>
                                <TarjetaGestionar
                                    icon={<WorkHistoryIcon />}
                                    headerColor={"#ffff"}
                                    avatarColor={cyan[700]}
                                    title={'Mtto. Correctivo'}
                                    value={`${porcentajeCorrectivo}%`}
                                />
                            </Grid>


                            {/* <Grid item xs={6} sm={6} md={3.3}>
                                <TarjetaGestionar
                                    icon={<WorkHistoryIcon />}
                                    headerColor={"#ffff"}
                                    avatarColor={cyan[700]}
                                    title={'Calibraciones'}
                                    value={`${porcentajeCalibraciones}%`}
                                />
                            </Grid> */}

                            <Grid item xs={12} sm={2} md={2}>
                                <Button variant="outlined"
                                    className="boton-salir"
                                    fullWidth
                                    endIcon={<ReplyAllIcon sx={{ fontSize: 90 }} />}
                                    onClick={() => { salir() }}
                                >Salir</Button>
                            </Grid>
                        </Grid>



                        <div className="card-tabla-hv"  >
                        
                                <div className="header-ev">
                                    <h5 className="titulo-ev">Hoja de Vida</h5>

                                    <Avatar sx={{ bgcolor: blue[700] }} >
                                        <HandymanIcon />
                                    </Avatar>

                                </div>
                    
                                <div className="card-tabla-hojav" style={{overflow:"scroll", height:"535px",}}>
                                    <div >

                                        <Table className='table table-light table-hover'>
                                            <Thead>
                                                <Tr>
                                                    <Th>#</Th>
                                                    <Th className="t-encargados">MTTO.</Th>
                                                    <Th className="t-encargados">Tipo</Th>
                                                    <Th className="t-encargados">Responsable</Th>
                                                    <Th className="t-encargados">Estado</Th>
                                                    <Th className="t-encargados">Horas Utilizadas</Th>
                                                    <Th className="t-encargados">Información</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {reportesTotales.filter(item => item.codigoe === currentInventario.codigo).map((reporte, index) => (
                                                    <Tr key={index} >
                                                        <Td>
                                                            {index + 1}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                            {reporte.tmantenimiento}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                            {reporte.tipo}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                            {reporte.nombreT}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                            {reporte.estadof}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                            {reporte.tiempo}
                                                        </Td>
                                                        <Td>
                                                            <IconButton aria-label="delete" sx={{ color: teal[200] }} onClick={() => mostrarModalInformacion(reporte)} ><InfoIcon /></IconButton>
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

                                                <Grid container spacing={0}>
                                                    <Grid item xs={12} md={12}>

                                                        <p style={{ margin: 0 }}><strong style={{ marginRight: 4 }}>Id:</strong>{currentreport.id}</p>

                                                    </Grid>
                                                    <Grid item xs={12} md={12}>

                                                        <p style={{ margin: 0 }}><strong style={{ marginRight: 4 }}>Falla:</strong>{currentreport.falla}</p>

                                                    </Grid>
                                                    <Grid item xs={12} md={12}>

                                                        <p style={{ margin: 0 }}><strong style={{ marginRight: 4 }}>Repuestos:</strong>{currentreport.repuestos}</p>

                                                    </Grid>
                                                    <Grid item xs={12} md={12}>

                                                        <p style={{ margin: 0 }}><strong style={{ marginRight: 4 }}>Costo:</strong>{currentreport.costo}</p>

                                                    </Grid>
                                                    <Grid item xs={12} md={12}>

                                                        <p style={{ margin: 0 }}><strong style={{ marginRight: 4 }}>Causas:</strong>{currentreport.causas}</p>

                                                    </Grid>
                                                    <Grid item xs={12} md={12}>

                                                        <p style={{ margin: 0 }}><strong style={{ marginRight: 4 }}>Actividades:</strong>{currentreport.actividadesR}</p>

                                                    </Grid>
                                                    <Grid item xs={12} md={12}>

                                                        <p style={{ margin: 0 }}><strong style={{ marginRight: 4 }}>Observaciones:</strong>{currentreport.observaciones}</p>

                                                    </Grid>
                                                </Grid>
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => cerrarModalInformacion()}
                                                >
                                                    Cancelar
                                                </Button>
                                            </ModalFooter>
                                        </Modal>
                                    </div>


                                </div>

                        </div>
                    </Grid>
                </Grid>
            </div>
            <div style={{height:40}}>

            </div>
        </>
    );
}


// const datos_prueba = [
//     { tmantenimiento: "10", tipo: "preventivo", nombreT: "prueba", estadof: "arreglado", tiempo: "89 horas" },
//     { tmantenimiento: "10", tipo: "preventivo", nombreT: "prueba2", estadof: "dasd", tiempo: "123 horas" },
//     { tmantenimiento: "4", tipo: "preventivo", nombreT: "prueba3", estadof: "ghjhg", tiempo: "49 horas" },
//     { tmantenimiento: "50", tipo: "preventivo", nombreT: "prueba4", estadof: "l", tiempo: "8 horas" },
//     { tmantenimiento: "80", tipo: "preventivo", nombreT: "prueba5", estadof: "no sirve", tiempo: "6 horas" },

// ]