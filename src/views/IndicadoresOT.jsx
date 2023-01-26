import React, { useState, useEffect } from "react";
import { collection, doc, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import GraficaDona from "../components/GraficoDona";
import BarChart from "../components/Graficabarras";
import Example from "../components/MenuContent/ProgressBar";
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import SummarizeIcon from '@mui/icons-material/Summarize';

import { blue } from '@mui/material/colors';
import TarjetaIndicadores from "../components/TarjetasIndicadores";

import RadialSeparators from "../components/RadialSeparator";

import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import Button from '@mui/material/Button';
import { useSelector } from "react-redux";
import Autocomplete from '@mui/material/Autocomplete';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
    CircularProgressbarWithChildren,
    buildStyles
} from "react-circular-progressbar";
import "../css/PruebasView.css"
import "react-circular-progressbar/dist/styles.css";

export default function IndicadoresOT() {
    const currentUser = useSelector(state => state.auths);
    const [externos, setExternos] = useState([]);
    const [internos, setInternos] = useState([]);
    const [user, setUser] = useState({});
    const [mttr, setMttr] = useState(0);
    // const [reportesUnidos, setReportesUnidos] = useState([]);
    // const [ctdad, setCtdad] = useState(0);
    const [time1, setTime1] = useState(new Date('Wen Nov 02 2022 24:00:00 GMT-0500'));
    const [time2, setTime2] = useState(new Date('Wen Nov 02 2022 23:59:59 GMT-0500'));
    const [ordenes, setOrdenes] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [rechazadas, setRechazadas] = useState(0);
    const [lonordenes, setLonordenes] = useState(0);
    const [acabadas, setAcabadas] = useState(0);
    const [pendientes, setPendientes] = useState(0);
    const [iniciadas,setIniciadas] = useState(0);
    // const [suspendidas, setSuspendidas] = useState(0);
    // const [repuestos, setRepuestos] = useState(0);
    const [autorizacion, setAutorizacion] = useState(0);
    // const [disposicion, setDisposicion] = useState(0);
    const [activas, setActivas] = useState(0);
    const [preventivo, setPreventivo] = useState(0);
    const [correctivo, setCorrectivo] = useState(0);
    const [calibraciones, setCalibraciones] = useState(0);
    const [promedio, setPromedio] = useState(0);
    const [tiempoMedioR, setTiempoMedioR] = useState([]);
    const [departamento, setDepartamento] = useState("Todos");


    //EMPIEZA SELEC FECHA ORDENES
    const SelectFecha1 = (newValue) => {
        setTime1(newValue);
    };
    const SelectFecha2 = (newValue) => {
        setTime2(newValue);
    };

    const handleOrdenes = () => {
        let aux_internos = JSON.parse(JSON.stringify(internos))
        let aux_externos = JSON.parse(JSON.stringify(externos))
        let ordenes_aux = JSON.parse(JSON.stringify(ordenes))

        //const reportes = aux_internos.concat(aux_externos)
        var reportes = aux_internos
        let ordenes_filtradas = ordenes_aux.filter(filteryByDateOrdenes).filter(filterbyarea)
        let rechazadas_aux = ordenes_filtradas.filter(filterTipoAnuladas)
        let pendientes_aux = ordenes_filtradas.filter(filterTipoPendientes)
        let iniciadas_aux = ordenes_filtradas.filter(filterStatePendiente2)
        console.log("ordenes totales", ordenes_filtradas)
        const fechasreportes = reportes.filter(filteryByDateOrdenes)

        const departamentosreportes = fechasreportes.filter(filterbyarea)
        setPreventivo(departamentosreportes.filter(filterPreventivo).length)
        setCorrectivo(departamentosreportes.filter(filterCorrectivo).length)
        setCalibraciones(departamentosreportes.filter(filterCalibraciones).length)
        //indicador tarjetas
        const ordenesFilter = ordenes.filter(filteryByDateOrdenes)


        const departamentoFilter = ordenesFilter.filter(filterbyarea)

        const pendientesFilter = departamentoFilter.filter(filterStatePendiente2)

        setRechazadas(rechazadas_aux.length)
        setLonordenes(ordenes_filtradas.length)
        setAcabadas(departamentoFilter.filter(filterStateSolventadas).length)
        setActivas(departamentoFilter.filter(filterstateActivas).length)
        setPendientes(pendientes_aux.length)
        setIniciadas(iniciadas_aux.length)
        // setSuspendidas(pendientesFilter.filter(filterTipoPendientesSuspendida).length)
        // setRepuestos(pendientesFilter.filter(filterTipoPendientesRepuestos).length)
        // setDisposicion(pendientesFilter.filter(filterTipoPendientesDisposicion).length)
        setAutorizacion(pendientesFilter.filter(filterTipoPendientesAutorizacion).length)
        //indicador progress
        var acab = departamentoFilter.filter(filterStateSolventadas).length
        var total = departamentoFilter.length
        setPromedio(Math.round((acab / total) * 100))
    }

    const filteryByDateOrdenes = (_orden) => {
        //console.log(ordenes)
        const aux1 = new Date(time1)
        const fechaInicio = aux1.getTime()
        const aux2 = new Date(time2)
        const fechaFinal = aux2.getTime()
        const fechaOrden = new Date(_orden.indice).getTime()

        if (fechaOrden >= fechaInicio && fechaOrden <= fechaFinal) {
            return _orden
        } else {
            return null;
        }
    }

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

    const filterCalibraciones = (state) => {
        if (state.tmantenimiento === "Calibracion") {
            return state;
        } else {
            return
        }
    }

    const filterStateSolventadas = (state) => {
        if (state.estado === "Solventado") {
            return state;
        } else {
            return
        }
    }

    const filterbyarea = (_orden) => {
        if (_orden.departamento === departamento) {
            return _orden
        } else if (departamento === 'Todos') {
            return _orden
        } else {
            return
        }
    }

    const filterstateActivas = (state) => {
        if (state.estado === "Iniciada" && state.play === true) {
            return state
        } else {
            return
        }
    }

    const filterTipoPendientes = (state) => {
        if (state.estado === "Pendiente" ) {
            return state;
        } else {
            return
        }
    }

    const filterStatePendiente2 = (state) => {
        if (state.estado === "Iniciada") {
            return state;
        } else {
            return
        }
    }

    // const filterTipoPendientes = (state) => {
    //     if (state.estado === "Pendiente") {
    //         return state;
    //     } else {
    //         return
    //     }
    // }
    const filterTipoAnuladas = (state) => {
        if (state.estado === "Rechazada") {
            return state;
        } else {
            return
        }
    }


    // const filterTipoPendientesRepuestos = (state) => {
    //     if (state.razonp === "Repuestos") {
    //         return state;
    //     } else {
    //         return
    //     }
    // }

    // const filterTipoPendientesDisposicion = (state) => {
    //     if (state.razonp === "Disposicion") {
    //         return state;
    //     } else {
    //         return
    //     }
    // }

    const filterTipoPendientesAutorizacion = (state) => {
        if (state.razonp === "Autorizacion") {
            return state;
        } else {
            return
        }
    }

    const tiempoMedioReparcion = (reportesUnidos) => {

        const enero = reportesUnidos.filter(filterbyenero).map(item => item.horas);
        const febrero = reportesUnidos.filter(filterbyfebrero).map(item => item.horas);
        const marzo = reportesUnidos.filter(filterbymarzo).map(item => item.horas);
        const abril = reportesUnidos.filter(filterbyabril).map(item => item.horas);
        const mayo = reportesUnidos.filter(filterbymayo).map(item => item.horas);
        const junio = reportesUnidos.filter(filterbyjunio).map(item => item.horas);
        const julio = reportesUnidos.filter(filterbyjulio).map(item => item.horas);
        const agosto = reportesUnidos.filter(filterbyagosto).map(item => item.horas);
        const septiembre = reportesUnidos.filter(filterbyseptiembre).map(item => item.horas);
        const octubre = reportesUnidos.filter(filterbyoctubre).map(item => item.horas);
        const noviembre = reportesUnidos.filter(filterbynoviembre).map(item => item.horas);
        const diciembre = reportesUnidos.filter(filterbydiciembre).map(item => item.horas);

        const henero = calcutloTiempoMedio(enero)
        const hfebrero = calcutloTiempoMedio(febrero)
        const hmarzo = calcutloTiempoMedio(marzo)
        const habril = calcutloTiempoMedio(abril)
        const hmayo = calcutloTiempoMedio(mayo)
        const hjunio = calcutloTiempoMedio(junio)
        const hjulio = calcutloTiempoMedio(julio)
        const hagosto = calcutloTiempoMedio(agosto)
        const hseptiembre = calcutloTiempoMedio(septiembre)
        const hoctubre = calcutloTiempoMedio(octubre)
        const hnoviembre = calcutloTiempoMedio(noviembre)
        const hdiciembre = calcutloTiempoMedio(diciembre)
        const horasFecha = [henero, hfebrero, hmarzo, habril, hmayo, hjunio, hjulio, hagosto, hseptiembre, hoctubre, hnoviembre, hdiciembre]
        console.log(horasFecha)
        setTiempoMedioR(horasFecha);

    }
    const calcutloTiempoMedio = (horas) => {
        const longitud = horas.length
        const total = horas.reduce((a, b) => a + b, 0)
        if (longitud !== 0 && total !== 0) {
            return longitud / total
        } else {
            return 0
        }
    }

    const filterbyenero = (_reporte) => {
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 1;
        if (fecha === mes) {
            return _reporte
        } else {
            return null
        }
    }
    const filterbyfebrero = (_reporte) => {
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 2;
        if (fecha === mes) {
            return _reporte
        } else {
            return null
        }
    }
    const filterbymarzo = (_reporte) => {
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 3;
        if (fecha === mes) {
            return _reporte
        } else {
            return null
        }

    }
    const filterbyabril = (_reporte) => {
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 4;
        if (fecha === mes) {
            return _reporte
        } else {
            return null
        }

    }
    const filterbymayo = (_reporte) => {
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 5;
        if (fecha === mes) {
            return _reporte
        } else {
            return null
        }

    }
    const filterbyjunio = (_reporte) => {
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 6;
        if (fecha === mes) {
            return _reporte
        } else {
            return null
        }
    }
    const filterbyjulio = (_reporte) => {
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 7;
        if (fecha === mes) {
            return _reporte
        } else {
            return null
        }
    }
    const filterbyagosto = (_reporte) => {
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 8;
        if (fecha === mes) {
            return _reporte
        } else {
            return null
        }

    }
    const filterbyseptiembre = (_reporte) => {
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 9;
        if (fecha === mes) {
            return _reporte
        } else {
            return null
        }

    }
    const filterbyoctubre = (_reporte) => {
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 10;
        if (fecha === mes) {
            return _reporte
        } else {
            return null
        }
    }
    const filterbynoviembre = (_reporte) => {
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 11;
        if (fecha === mes) {
            return _reporte
        } else {
            return null
        }

    }
    const filterbydiciembre = (_reporte) => {
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 12;
        if (fecha === mes) {
            return _reporte
        } else {
            return null
        }

    }


    const getData = () => {

        var interno = [];
        var externo = [];
        const reference = query(collection(db, "ordenes"));
        onSnapshot(reference, (querySnapshot) => {
            var orden = [];
            querySnapshot.forEach((doc) => {
                orden.push(doc.data());
            });
            setOrdenes(orden);
        });


        const ref1 = query(collection(db, "reportesext"));
        onSnapshot(ref1, (querySnapshot) => {

            querySnapshot.forEach((doc) => {
                externo.push(doc.data());
            });
            setExternos(externo);
            // setReportesUnidos(externo.concat(interno))
        });

        const ref2 = query(collection(db, "reportesint"));
        onSnapshot(ref2, (querySnapshot) => {

            querySnapshot.forEach((doc) => {
                interno.push(doc.data());
            });
            setInternos(interno);
            tiempoMedioReparcion(interno.concat(externo));
        });


        onSnapshot(doc(db, "usuarios", currentUser.uid), (doc) => {
            setUser(doc.data());
        });

        onSnapshot(doc(db, "informacion", "parametros"), (doc) => {
            setDepartamentos(doc.data().departamentos)
        });
    }

    //TERMINA SELEC FECHA ORDENES


    useEffect(() => {
        getData();
        //indicador barras

    }, [])
    return (
        <>
            <div className="contenedor-indicadores-ot">

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={3}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                label={"Desde"}
                                inputFormat="MM/dd/yyyy"
                                value={time1}
                                onChange={SelectFecha1}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                label={"Hasta"}
                                inputFormat="MM/dd/yyyy"
                                value={time2}
                                onChange={SelectFecha2}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                        <Autocomplete
                            disableClearable
                            id="combo-box-demo"
                            options={departamentos}
                            getOptionLabel={(option) => {
                                return option.nombre;
                            }}
                            onChange={(event, newvalue) => setDepartamento(newvalue.nombre)}
                            renderInput={(params) => <TextField {...params} fullWidth label="DEPARTAMENTOS" type="text" />}
                        />

                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                        <Button variant="outlined" className="boton-gestiont" endIcon={<FilterAltIcon sx={{ fontSize: 90 }} />} onClick={handleOrdenes}>Filtrar</Button>
                    </Grid>



                    <Grid item xs={12} sm={12} md={2.4}>
                        <div className="card-container">
                            <TarjetaIndicadores icono={<SummarizeIcon />} valor={lonordenes} bgicon={blue[700]} titulo={'N° Ordenes '} colort={"#598ec7"} />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2.4}>
                        <div className="card-container">
                            <TarjetaIndicadores icono={<AssignmentTurnedInIcon />} valor={acabadas} bgicon={blue[700]} titulo={'N° Ordenes Acabadas'} colort={"#598ec7"} />
                        </div>

                    </Grid>

                    <Grid item xs={12} sm={12} md={2.4}>
                        <div className="card-container">
                            <TarjetaIndicadores icono={< PendingActionsIcon />} valor={pendientes} bgicon={blue[700]} titulo={'N° Ordenes Pendientes '} colort={"#598ec7"} />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2.4}>
                        <div className="card-container">
                            <TarjetaIndicadores icono={< PendingActionsIcon />} valor={pendientes} bgicon={blue[700]} titulo={'N° Ordenes Iniciadas '} colort={"#598ec7"} />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2.4}>
                        <div className="card-container">
                            <TarjetaIndicadores icono={< DoDisturbIcon />} valor={rechazadas} bgicon={blue[700]} titulo={'N° Ordenes Anuladas '} colort={"#598ec7"} />
                        </div>
                    </Grid>


                    <Grid item xs={12} sm={12} md={2}>
                      
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <div className="card12" style={{height:"100%"}}>

                            
                                <div className="card-body12 small ">

                                    <GraficaDona labels={["Mtto. Preventivo", "Mtto. Correctivo"]} info={[preventivo, correctivo]} />

                                </div>
                            

                        </div>
                    </Grid>

                    <Grid item xs={12} sm={12} md={4}>
                        <div className="card12" >

                            
                                <div className="card-body12 small ">
                                    <Example>
                                        <p className="titulo-card-g">Porcentaje Cumplimiento de Planificación</p>
                                        <CircularProgressbarWithChildren
                                            value={promedio}
                                            text={`${promedio}%`}
                                            strokeWidth={5}
                                            styles={buildStyles({
                                                strokeLinecap: "butt"
                                            })}
                                        >
                                            <RadialSeparators
                                                count={40}
                                                style={{
                                                    background: "#fff",
                                                    width: "2px",
                                                    borderRadius: "10",
                                                    height: `${10}%`
                                                }}
                                            />
                                        </CircularProgressbarWithChildren>
                                    </Example>
                                </div>
                            

                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>
                      
                    </Grid>



                    {/* 
                    <Grid item xs={12} sm={12} md={3}>
                        <div className="card-container">
                            <TarjetaIndicadores icono={<NotificationsPausedIcon />} valor={suspendidas} bgicon={blue[700]} titulo={'Suspendidas'}   colort={"#598ec7"} />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                        <div className="card-container">
                            <TarjetaIndicadores icono={<FactCheckIcon />} valor={autorizacion} bgicon={blue[700]} titulo={'Pendientes - Autorización'} colort={"#598ec7"} />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                        <div className="card-container">
                            <TarjetaIndicadores icono={<DomainDisabledIcon />} valor={disposicion} bgicon={blue[700]}  titulo={'Pendientes - Disp. Área'}  colort={"#598ec7"} />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                        <div className="card-container">
                            <TarjetaIndicadores icono={< ShoppingCartIcon />} valor={repuestos} bgicon={blue[700]} titulo={'Pendientes - Repuestos'}  colort={"#598ec7"}/>
                        </div>
                    </Grid> */}
                </Grid>
            </div>
            <div style={{ height: "40px" }}>

            </div>
        </>
    );

}