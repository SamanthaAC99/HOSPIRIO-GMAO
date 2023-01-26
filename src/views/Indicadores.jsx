import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Barchart from "../components/Graficabarras";
import { Input } from "reactstrap";
import '../css/Grafico.css';
import Typography from '@mui/material/Typography';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#000',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
export default function Indicadores() {


    const [reportext, setReportext] = useState([]);
    const [reportin, setReportin] = useState([]);
    const [codigo, setCodigo] = useState([]);
    const [equipo, setEquipo] = useState("");
    const [mttr, setMttr] = useState([]);
    const [reportes, setReportes]= useState([]);


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
        console.log(Bardata)
    };

    const getReportes = () => {
        const externos = query(collection(db, "reportesext"));
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
<div className="container">
<br />
        <Typography component="div" variant="h4" className="princi3" >
          INDICADORES MTTR
        </Typography>
<div className="row">
<div className="col-sm-12">
<div className="contenedorgrande">
<div className="column">
<div className="col-sm-12">
<div className="row">
<div className="col-md-6">
    <div className="contenedor-selector">
        <Grid item xs={12} md={8} >
            <select onChange={selecCodigo} className="form-select" aria-label="Default select seguro">
                {codigo.map((dato, index) => (<option key={index} value={dato.codigo}>{dato.equipo}</option>))}
                    </select>
                </Grid>
            </div>
        </div>
              <div className="col-md-6">
                 <div className="contenedor-equipo">
                 <Grid item xs={12}   md={2}>
                        <Input
                            readOnly
                            value={equipo}
                            label="Equipo"
                        />
                    </Grid>
                    </div>   
   </div>    
   <div className="col-sm-12">
       <div className="contenedor-grafico">
            <Barchart equipo={equipo.toString()} datos={mttr} />
        </div> 
    </div>
    <div className="col-sm-12">
    <div className="row">
    <div className="col-md-6">
                 <div class="contenedor-mttr">
                 <Grid item xs={12} md={8} >
                        <p className="parr">MTTR</p>
                        <Input
                            readOnly
                            value={mttr}
                            label="mttr"
                        />
    </Grid>
                 </div>

              </div>
              <div className="col-md-6">
                 <div className="contenedor-fallos">
                 <Grid item xs={12} md={2} >
                 <p className="parr"># Fallos</p>
                          <Input
                            readOnly
                            value={reportes}
                            label="reportes"
                        />
                         </Grid>
                    </div>   
              </div>
    </div>
    </div>
    
</div>
</div>
</div>
</div>
</div>
</div>
</div>

          
        </>
    );
}

