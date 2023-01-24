import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import Grid from '@mui/material/Grid';
import Barchart from "../components/Graficabarras";
import GraficaPie from "../components/GraficaPie";
import { Input } from "reactstrap";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Cards2 from "../components/Tarjetaindicador";
import Cards3 from "../components/tarjeta3";
import Cards4 from "../components/Tarjeta4";
import Cards5 from "../components/Tarjeta5";
import '../css/Grafico.css';
import Typography from '@mui/material/Typography';
import '../css/Indicadores.css'
import TarjetaSamylu from "../components/TarjetaSamylu";
import {blue, deepPurple,green,pink} from '@mui/material/colors';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InventoryIcon from '@mui/icons-material/Inventory';
export default function Indicadores3(){

    
    const [reportext, setReportext] = useState([]);
    const [reportin, setReportin] = useState([]);
    const [codigo, setCodigo] = useState([]);
    const [equipo, setEquipo] = useState("");
    const [mttr, setMttr] = useState(0);
    const [reportes, setReportes]= useState([]);
    const [ctdequi,setCtdequi] = useState(0);
    const [ctdad,setCtdad]  = useState(0);


    const selecCodigo = (e) => {
        console.log(e.target.value)
        setEquipo(e.target.value);
        const datos = reportext.concat(reportin)
        console.log(datos)
        const filtrados = datos.filter(machine => machine.codigo === e.target.value && machine.nivelalerta === 'No Funcional')
        console.log('los filtrados son: ', filtrados);
        var reformat = filtrados.map(function (obj) {
            var someDate1 = new Date(obj.fetermino);
            someDate1 = someDate1.getTime();
            var hours1 = someDate1 / (1000 * 60 * 60);
            var someDate2 = new Date(obj.feinicio);
            someDate2 = someDate2.getTime();
            var hours2 = someDate2 / (1000 * 60 * 60);
            var resultado = hours1 - hours2
            return resultado
        });
        console.log(reformat)
        var fallos = filtrados.map(function (obj) {
            return [obj.feinicio, obj.fetermino]
        });
        console.log(fallos);
        let total = reformat.reduce((a, b) => a + b, 0);
        setReportes([reformat.length]);
        setMttr([total / reformat.length]);

       
        var Bardata = fallos.map(function(dat){
            console.log(dat)
            return fallos.concat(dat)
        })
        setCtdad(fallos.length);
        console.log(Bardata)
    };

    const getReportes = () => {
        const externos = query(collection(db, "reportes externos"));
        onSnapshot(externos, (querySnapshot) => {
            setReportext(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
        });
        const ingreso = query(collection(db, "ingreso"));
        onSnapshot(ingreso, (querySnapshot) => {
            setCodigo(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
            const data = querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            setCtdequi(
                    data.length
            );
        });
        const internos = query(collection(db, "reportesint"));
        onSnapshot(internos, (querySnapshot) => {
            setReportin(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );

        });

    }



    useEffect(() => {
        getReportes();
    }, [])

    return (
        <>
        <div className="contenedor-indicadores">
        <Typography component="div" variant="h4" className="princi3" >
          INDICADORES MTTR 
        </Typography>
        
        <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={3}>
        <div className="card-container">
        <TarjetaSamylu  icono={<InventoryIcon/>} valor={0} bgicon={deepPurple[200]}  titulo={'TOTAL'} indicador2={"Médico"} colort={"#C9BBCF"}/>
            </div>
            </Grid>
            <Grid item xs={12} sm={12} md={3}>
            <div className="card-container">
            <TarjetaSamylu  icono={<MonitorHeartIcon/>} valor={1} bgicon={blue[700]}  titulo={'EQUIPO'} indicador2={"20% Total"} colort={"#97c9de"}/>
            {/* <Cards3 equipos={1}/> */}
            </div>
            </Grid>
            <Grid item xs={12} sm={12} md={3}>
            <div className="card-container">
            <TarjetaSamylu  icono={<AssessmentIcon/>} valor={Math.round(mttr,-1)} bgicon={green[500] }  titulo={'MTTR'} indicador2={"Indicador"} colort={"#adcf9f"}/>
            {/* <Cards4 mttr={Math.round(mttr,-1)}/> */}
            </div>
            </Grid>
            <Grid item xs={12} sm={12} md={3}>
            <div className="card-container">
            <TarjetaSamylu   icono={< ReportProblemIcon/>}  valor={ctdad}  bgicon={pink[500]}  titulo={'FALLOS'} indicador2={"Anual"} colort={"#e4aec5"}/>   
            {/* <Cards5 fallos={ctdad} /> */}
            </div>
            </Grid>
            
        
            <Grid item xs={6}>
                 <div className="select-indicadores2">
                 <select onChange={selecCodigo} className="form-select" aria-label="Default select seguro">
                {codigo.map((dato, index) => (<option key={index} value={dato.codigo}>{dato.equipo}</option>))}
                    </select>
                </div>
                </Grid>
                <Grid item xs={6}>
                <div className="select-indicadores2">
                <Input
                            readOnly
                            value={equipo}
                            label="Equipo"
                        />
                </div>
               
           
                </Grid>



            <Grid item xs={8}>
            <div className="contenedor-pie">
                    <Barchart equipo={equipo.toString()} datos={mttr} /> 
            </div>
            </Grid>
            <Grid item xs={4}>
                <div className="contenedor-pie">
                <GraficaPie labels={["Ventilador","Maquina de Anestesia","Monitor Multiparametros"]} datos={[24.54,3.22,2.15]}/>
                </div>
            </Grid>
        </Grid>
        </div>
          
        </>
    );

}