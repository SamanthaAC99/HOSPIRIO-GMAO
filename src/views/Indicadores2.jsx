import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import Grid from '@mui/material/Grid';
import Barchart from "../components/Graficabarras";
import GraficaPie from "../components/GraficaPie";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Cards2 from "../components/Tarjetaindicador";
import Cards3 from "../components/tarjeta3";
import Cards4 from "../components/Tarjeta4";
import Cards5 from "../components/Tarjeta5";
import '../css/Grafico.css';
import Typography from '@mui/material/Typography';
import '../css/Indicadores.css'


export default function Indicadores2(){

    const [reportext, setReportext] = useState([]);
    const [reportin, setReportin] = useState([]);
    const [informacion,setInformacion] = useState([]);
    const [codigos, setCodigos] = useState([]);
    const [equipo, setEquipo] = useState("");
    const [mttr, setMttr] = useState([]);
    const [reportes, setReportes]= useState([]);
    const [equipos,setEquipos] = useState([]);


    const selecCodigo = (e) => {
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
        var fallos = filtrados.map(function (obj) {
            return [obj.feinicio, obj.fetermino]
        });
        let total = reformat.reduce((a, b) => a + b, 0);
        setReportes([reformat.length]);
        setMttr([total / reformat.length]);

       
        var Bardata = fallos.map(function(dat){
            return fallos.concat(dat)
        })
        console.log(Bardata)
    };
    const obtenerCodigos = (equipo)=>{
        setEquipo(equipo)
        var codigosEquipos = []
        codigosEquipos = informacion.filter(filtrarPorEquipo).map((item) => (item))
        console.log(codigosEquipos)
        setCodigos(codigosEquipos)
    }
    const filtrarPorEquipo =(val) =>{
        if( val.equipo === equipo  ){
            return val;
        }else{
            return null;
        }
    }
    const getReportes = () => {
        const externos = query(collection(db, "reportes externos"));
        onSnapshot(externos, (querySnapshot) => {
            setReportext(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
        });
        const ingreso = query(collection(db, "ingreso"));
        onSnapshot(ingreso, (querySnapshot) => {
            let datos = [];
            querySnapshot.forEach((doc) => {
                datos.push(doc.data());
            });
            const dataArr = new Set(datos.map((item)=>(item.equipo)));
            let result = [...dataArr];
            setEquipos(
               result
            );
            setInformacion(datos);
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
            <Cards2 />
            </div>
            </Grid>
            <Grid item xs={12} sm={12} md={3}>
            <div className="card-container">
            <Cards3 />
            </div>
            </Grid>
            <Grid item xs={12} sm={12} md={3}>
            <div className="card-container">
            <Cards4 />
            </div>
            </Grid>
            <Grid item xs={12} sm={12} md={3}>
            <div className="card-container">
            <Cards5 />
            </div>
            </Grid>
            
        
            <Grid item xs={6}>
                 <div className="select-indicadores2">
                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    options={equipos}
                                    onChange={(event,newvalue) => obtenerCodigos(newvalue)}
                                    renderInput={(params) => <TextField {...params} fullWidth label="Equipo" color={equipo !== '' ? "gris" : "oficial"} type="text" focused />}
                                />
                </div>
                </Grid>
                <Grid item xs={6}>
                <div className="select-indicadores2">
                <select onChange={selecCodigo} className="form-select" aria-label="Default select seguro">
                {codigos.map((dato, index) => (<option key={index} value={dato.codigo}>{dato.equipo}</option>))}
                    </select>
                </div>
               
           
                </Grid>



            <Grid item xs={8}>
            <div className="contenedor-pie">
                    <Barchart equipo={equipo.toString()} datos={mttr} /> 
            </div>
            </Grid>
            <Grid item xs={4}>
                <div className="contenedor-pie">
                <GraficaPie/>
                </div>
            </Grid>
        </Grid>
        </div>
          
        </>
    );

}