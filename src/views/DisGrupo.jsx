import React, { useState, useEffect } from "react";
import { collection, doc, query, onSnapshot,getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import GraficaDona from "../components/GraficoDona";
import BarChart from "../components/Graficabarras";
import Example from "../components/MenuContent/ProgressBar";
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Avatar from '@mui/material/Avatar';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { blue, deepPurple, green, pink, orange } from '@mui/material/colors';
import TarjetaIndicadores from "../components/TarjetasIndicadores";
import TarjetasGraficos from "../components/TarjetasGraficos";
import DomainDisabledIcon from '@mui/icons-material/DomainDisabled';
import RadialSeparators from "../components/RadialSeparator";
import NotificationsPausedIcon from '@mui/icons-material/NotificationsPaused';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import Button from '@mui/material/Button';
import { useSelector } from "react-redux";

import Autocomplete from '@mui/material/Autocomplete';
import {
    CircularProgressbarWithChildren,
    buildStyles
} from "react-circular-progressbar";
import "../css/PruebasView.css"
import "../css/Grupo.css"
import "react-circular-progressbar/dist/styles.css";
import GraficaDisponibilidadTotal from "../components/GraficaDisponibilidadT";

export default function DisGrupo() {
    const currentUser = useSelector(state => state.auths);
    const currentInventario = useSelector(state => state.inventarios);
    const [user, setUser] = useState({});
    const [mttr, setMttr] = useState(0);
    const [reportes, setReportes] = useState([]);
    const [ctdad, setCtdad] = useState(0);
    const [time1, setTime1] = useState(new Date('Wen Nov 02 2022 24:00:00 GMT-0500'));
    const [time2, setTime2] = useState(new Date('Wen Nov 04 2022 23:59:59 GMT-0500'));
    const [ordenes, setOrdenes] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [departamento, setDepartamento] = useState("ALL");
    const [data, setData] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [selecEquipo, setSelecEquipo] = useState([]);
    const [codigose, setCodigose] = useState([]);
    const [reportesTotales, setReportesTotales] = useState([]);
    const [externos, setExternos] = useState([]);
    const [internos, setInternos] = useState([]);
    const [ingreso, setIngreso] = useState([]);
    const [disponibilidadTotal,setDisponibilidadTotal]= useState(0);
    const [numeroEquipos,setNumeroEquipos]= useState(0);
    const [calibracionesn,setCalibracionesn]= useState(0);
    const [preventivasn,setPreventivasn]= useState(0);
    const [correctivasn,setCorrectivasn]= useState(0);
    const [fiabilidadn,setFiabilidadn]= useState(0);
    const [reportesn,setReportesn]= useState([]);
    const [grafica,setGrafica] = useState([]);
    //EMPIEZA SELEC FECHA ORDENES
    const SelectFecha1 = (newValue) => {
        setTime1(newValue);
    };
    const SelectFecha2 = (newValue) => {
        setTime2(newValue);
    };

    const handleReportes = () => {
        // const reportes = internos.concat(externos)
        let aux_internos=JSON.parse(JSON.stringify(internos))
        let aux_externos=JSON.parse(JSON.stringify(externos))
        const reportes=aux_internos.concat(aux_externos)
        const reportesnum=reportes.length
        console.log("reportesnum",reportesnum)
        console.log("r",reportes)
        const filterFechas=reportes.filter(filteryByDate)
        console.log("fechas",filterFechas)
        const filtroImportancia =filterFechas.filter(filterByImportancia)
        const num=data.filter(filterByImportancia).length
        // const filteralerta =filtroImportancia.filter(filterbyAlerta)
        const sumatoriamantenimientos =filterFechas.map(state => state.horas).reduce((a, b) => a + b, 0)
        
        const feInicio = new Date(time1).getTime() / 1000
        const feFinal = new Date(time2).getTime() / 1000
        const fechas = [feInicio, feFinal]
        const horas = calcularHoras(fechas)
  
        
        const numeroequipos =filtroImportancia.length

        const disTotal=(Math.round(((horas*numeroequipos)-sumatoriamantenimientos)/(horas*numeroequipos))*100)
        console.log(disTotal)


        //TARJETAS
        const correctivos =filterFechas.filter(filterCorrectivo)
        const numerocorrectivos =correctivos.length
        const preventivos =filterFechas.filter(filterPreventivo)
        const numeropreventivos =preventivos.length
        const calibraciones =filterFechas.filter(filterCalibraciones)
        const numerocalibraciones =calibraciones.length

        //FIABILIDAD
        const horasmantenimientocorrectivos = correctivos.map(state => state.horas).reduce((a, b) => a + b, 0)
        const fiabilidad = (Math.round(((horas*numeroequipos)-horasmantenimientocorrectivos)/(horas*numeroequipos))*100)

        setDisponibilidadTotal(disTotal)
        setNumeroEquipos(num)
        setCorrectivasn(numerocorrectivos)
        setPreventivasn(numeropreventivos)
        setCalibracionesn(numerocalibraciones)
        setFiabilidadn(fiabilidad)
        setReportesn(filterFechas)
        const enero = filterFechas.filter(filterbyenero).map(item => item.horas).reduce((a, b) => a + b, 0);
        console.log("E",enero)
        const febrero = filterFechas.filter(filterbyfebrero).map(item => item.horas).reduce((a, b) => a + b, 0);
        const marzo = filterFechas.filter(filterbymarzo).map(item => item.horas).reduce((a, b) => a + b, 0);
        const abril = filterFechas.filter(filterbyabril).map(item => item.horas).reduce((a, b) => a + b, 0);
        const mayo = filterFechas.filter(filterbymayo).map(item => item.horas).reduce((a, b) => a + b, 0);
        const junio = filterFechas.filter(filterbyjunio).map(item => item.horas).reduce((a, b) => a + b, 0);
        const julio = filterFechas.filter(filterbyjulio).map(item => item.horas).reduce((a, b) => a + b, 0);
        console.log("J",julio)
        const agosto = filterFechas.filter(filterbyagosto).map(item => item.horas).reduce((a, b) => a + b, 0);
        const septiembre = filterFechas.filter(filterbyseptiembre).map(item => item.horas).reduce((a, b) => a + b, 0);
        const octubre = filterFechas.filter(filterbyoctubre).map(item => item.horas).reduce((a, b) => a + b, 0);
        const noviembre = filterFechas.filter(filterbynoviembre).map(item => item.horas).reduce((a, b) => a + b, 0);
        const diciembre = filterFechas.filter(filterbydiciembre).map(item => item.horas).reduce((a, b) => a + b, 0);

        const horasFecha = [enero,febrero,marzo,abril,mayo,junio,julio,agosto,septiembre,octubre,noviembre,diciembre]
        setGrafica(horasFecha)
        console.log("horas",horasFecha)

    }


    const filtro =()=>{
        const enero = reportesn.filter(filterbyenero).map(item => item.horas).reduce((a, b) => a + b, 0);
        const febrero = reportesn.filter(filterbyfebrero).map(item => item.horas).reduce((a, b) => a + b, 0);
        const marzo = reportesn.filter(filterbymarzo).map(item => item.horas).reduce((a, b) => a + b, 0);
        const abril = reportesn.filter(filterbyabril).map(item => item.horas).reduce((a, b) => a + b, 0);
        const mayo = reportesn.filter(filterbymayo).map(item => item.horas).reduce((a, b) => a + b, 0);
        const junio = reportesn.filter(filterbyjunio).map(item => item.horas).reduce((a, b) => a + b, 0);
        const julio = reportesn.filter(filterbyjulio).map(item => item.horas).reduce((a, b) => a + b, 0);
        const agosto = reportesn.filter(filterbyagosto).map(item => item.horas).reduce((a, b) => a + b, 0);
        const septiembre = reportesn.filter(filterbyseptiembre).map(item => item.horas).reduce((a, b) => a + b, 0);
        const octubre = reportesn.filter(filterbyoctubre).map(item => item.horas).reduce((a, b) => a + b, 0);
        const noviembre = reportesn.filter(filterbynoviembre).map(item => item.horas).reduce((a, b) => a + b, 0);
        const diciembre = reportesn.filter(filterbydiciembre).map(item => item.horas).reduce((a, b) => a + b, 0);

        const horasFecha = [enero,febrero,marzo,abril,mayo,junio,julio,agosto,septiembre,octubre,noviembre,diciembre]
        setGrafica(horasFecha)
        console.log("horas",horasFecha)
    }
    
    const filterbyenero = (_reporte) =>{
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 1 ;
        if( fecha === mes ){
            return _reporte
        }else{
            return null
        }
    }
    const filterbyfebrero = (_reporte) =>{
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 2 ;
        if( fecha === mes ){
            return _reporte
        }else{
            return null
        }
    }
    const filterbymarzo = (_reporte) =>{
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 3 ;
        if( fecha === mes ){
            return _reporte
        }else{
            return null
        }
        
    }
    const filterbyabril = (_reporte) =>{
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 4 ;
        if( fecha === mes ){
            return _reporte
        }else{
            return null
        }
        
    }
    const filterbymayo = (_reporte) =>{
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 5 ;
        if( fecha === mes ){
            return _reporte
        }else{
            return null
        }
        
    }
    const filterbyjunio = (_reporte) =>{
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 6 ;
        if( fecha === mes ){
            return _reporte
        }else{
            return null
        }
    }
    const filterbyjulio = (_reporte) =>{
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 7 ;
        if( fecha === mes ){
            return _reporte
        }else{
            return null
        }
    }
    const filterbyagosto = (_reporte) =>{
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 8 ;
        if( fecha === mes ){
            return _reporte
        }else{
            return null
        }
        
    }
    const filterbyseptiembre = (_reporte) =>{
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 9 ;
        if( fecha === mes ){
            return _reporte
        }else{
            return null
        }
        
    }
    const filterbyoctubre = (_reporte) =>{
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 10 ;
        if( fecha === mes ){
            return _reporte
        }else{
            return null
        }
    }
    const filterbynoviembre = (_reporte) =>{
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 11;
        if( fecha === mes ){
            return _reporte
        }else{
            return null
        }
        
    }
    const filterbydiciembre = (_reporte) =>{
        const fecha = new Date(_reporte.fecha).getMonth() + 1;
        const mes = 12;
        if( fecha === mes ){
            return _reporte
        }else{
            return null
        }

    }

    const filterCorrectivo = (tipo) => {
        if (tipo.tmantenimiento ==="CORRECTIVO") {
            return tipo;
        } else {
            return
        }
    }

    const filterPreventivo = (state) => {
        if (state.tmantenimiento ==="PREVENTIVO") {
            return state;
        } else {
            return
        }
    }

    const filterCalibraciones = (state) => {
        if (state.tmantenimiento ==="Calibracion") {
            return state;
        } else {
            return
        }
    }
    const calcularHoras = (data) => {

        const arreglo = data
        var inicio = []
        var final = []
        var longitud = arreglo.length;
        for (var i = 0; i < longitud; i++) {
            if ((i % 2) === 0 || i === 0) {
                inicio.push(arreglo[i])
            } else {
                final.push(arreglo[i])
            }
        }
        const temp1 = 0;
        const hinicio = inicio.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            temp1
        );
        const temp2 = 0;
        const hfinal = final.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            temp2
        );
        const horas = ((hfinal - hinicio) / 3600) + 24
        return horas

    }


    const filteryByDate = (_reporte) => {
        const fechaInicio = new Date(time1).getTime()
        console.log("fi",fechaInicio)
        const fechaFinal = new Date(time2).getTime()
        console.log("ff",fechaFinal)
        const fechaReporte = new Date(_reporte.indice).getTime()
        console.log("fr",fechaReporte)
        if (fechaReporte >= fechaInicio && fechaReporte <= fechaFinal) {
            return _reporte
        } else {
            return null;
        }
    }

    const filterByImportancia = (nimportancia) => {
        if (nimportancia.importancia ==="Prioritario") {
            return nimportancia;
        } else {
            return null;
        }
    }

    const filterbyAlerta = (alerta) => {
        if (alerta.nivelDeAlerta ==="No Funcional") {
            return alerta;
        } else {
            return
        }
    }


    const EquipoSeleccionado = (holis) => {
        setSelecEquipo(holis)
        var codigoe = data.filter(item => item.equipo === holis)
        setCodigose(codigoe.map((item) => item.codigo))
        console.log(codigoe)
    }


    const getData =async () => {
        var interno = [];
        var externo = [];
        const reference = query(collection(db, "ingreso"));
        onSnapshot(reference, (querySnapshot) => {
            setData(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
        });

        onSnapshot(doc(db, "usuarios", currentUser.uid), (doc) => {
            setUser(doc.data());
        });

        // onSnapshot(doc(db, "informacion", "ksCkGtZm1u2I0y5YoC4g"), (doc) => {
        //     setEquipos(doc.data().equipos)
        // });
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
        });

        const ref3 = query(collection(db, "ingreso"));
        onSnapshot(ref3, (querySnapshot) => {
            setIngreso(  
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
        });

        const docRef = doc(db, "informacion", "parametros");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setEquipos(docSnap.data().equipos);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }

    }

    useEffect(() => {
        getData();
    }, [])
    return (
        <>
            <div className="contenedor-indicadores-dispi">
                <Grid container spacing={{ xs: 4 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={6} sm={6} md={2.50}>

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
                    <Grid item xs={6} sm={6} md={2.50}>
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

                    <Grid item xs={6} sm={6} md={0.5}>


                        <Button variant="outlined" startIcon={<DeleteIcon />} className="filtrar"  onClick={handleReportes} >
                            Filtrar</Button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}></Grid>

                    <Grid item xs={12} sm={12} md={6}>
                        <div className="card12" >

                            {
                                <div className="card-body12 small ">
                                    {/* <LineChart labels={['Ene', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov','Dec']} datos={[1,2,3,4,5,6,7,8,9,10,11,12]}/> */}
                                    <GraficaDisponibilidadTotal labels={['Ene', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec',]} info={grafica} />
                                </div>
                            }

                        </div>
                    </Grid>
              

                    <Grid item xs={12} sm={12} md={3}>
                        <div className="card12" >

                            {
                                <div className="card-body12 small ">
                                    <Example>
                                        <p className="titulo-card-g">Disponibilidad</p>
                                        <CircularProgressbarWithChildren
                                            value={disponibilidadTotal}
                                            text={`${disponibilidadTotal}%`}
                                            strokeWidth={10}
                                            styles={buildStyles({
                                                strokeLinecap: "butt"
                                            })}
                                        >

                                        </CircularProgressbarWithChildren>
                                    </Example>

                                </div>
                            }

                        </div>
                    </Grid>

                    <Grid item xs={12} sm={12} md={3}>
                        <div className="card12" >

                            {
                                <div className="card-body12 small ">
                                    <Example>
                                        <p className="titulo-card-g">Fiabilidad</p>
                                        <CircularProgressbarWithChildren
                                            value={fiabilidadn}
                                            text={`${fiabilidadn}%`}
                                            strokeWidth={10}
                                            styles={buildStyles({
                                                strokeLinecap: "butt"
                                            })}
                                        >

                                        </CircularProgressbarWithChildren>
                                    </Example>

                                </div>
                            }

                        </div>
                    </Grid>


               

                    <Grid item xs={6} sm={6} md={12}>
                        <Grid container spacing={{ xs: 4 }}>

                            <Grid item xs={6} sm={6} md={4}>
                                <div className="card-container">
                                    <TarjetaIndicadores icono={<StackedBarChartIcon />} valor={numeroEquipos} bgicon={blue[700]} titulo={'N° Equipos Significativos'} colort={"#598ec7"} />
                                </div>
                            </Grid>
                            <Grid item xs={6} sm={6} md={4}>
                                <div className="card-container">
                                    <TarjetaIndicadores icono={< StackedBarChartIcon />} valor={preventivasn} bgicon={blue[700]} titulo={'MTTO Preventivos'} colort={"#598ec7"} />
                                </div>
                            </Grid>
                            <Grid item xs={6} sm={6} md={4}>
                                <div className="card-container">
                                    <TarjetaIndicadores icono={<StackedBarChartIcon />} valor={correctivasn} bgicon={blue[700]} titulo={'MTTO Correctivos'} colort={"#598ec7"} />
                                </div>
                            </Grid>
                            {/* <Grid item xs={6} sm={6} md={3}>
                                <div className="card-container">
                                    <TarjetaIndicadores icono={< StackedBarChartIcon />} valor={calibracionesn} bgicon={blue[700]} titulo={'Calibraciones'} colort={"#598ec7"} />
                                </div>
                            </Grid> */}

                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </>
    );

}