import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import Grid from '@mui/material/Grid';
import Barchart2 from "../components/Graficapersonal";
import { db } from "../firebase/firebase-config";
import { Input } from "reactstrap";
import '../css/Presentacion.css';
import Typography from '@mui/material/Typography';
import '../css/Ordentrabajo.css';
import { Container } from "@mui/material";
import DatosPersonal from "../components/datosTrabajador";


export default function Indicadores() {
    const [nombre, setNombre] = useState("");
    const [reportin, setReportin] = useState([]);
    const [personales, setPersonales] = useState([]);
    const [total, setTotal] = useState([]);
    const [datouser, setDatouser] = useState([]);
    const [indicador, setIndicador]= useState([]);


    const selecCedula = (e) => {
  
        setNombre(e.target.value);
        const filtrados = reportin.filter(machine => machine.cedulat === e.target.value)
        console.log('datos filtrados',filtrados)

        var reformat = filtrados.map(function (obj) {
            return obj.horasT
        });
        console.log('horas trabajo',reformat)
        var meses = filtrados.map(function (obj) {
            return obj.mesFinal
        });
        console.log('meses',meses)

        let total2 = reformat.reduce((a, b) => a + b, 0);
        setTotal([total2]);

        var datos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var i = 0;
        for (let value of meses){
            if(value === 0){
                datos[0] = reformat[i] + datos[0]
            }
            if(value === 1){
                datos[1] = reformat[i] + datos[1]
            }
            if(value === 2){
                datos[2] = reformat[i] + datos[2]
            }
            if(value === 3){
                datos[3] = reformat[i] + datos[3]
            }
            if(value === 4){
                datos[4] = reformat[i] + datos[4]
            }
            if(value === 5){
                datos[5] = reformat[i] + datos[5]
            }
            if(value === 6){
                datos[6] = reformat[i] + datos[6]
            }
            if(value === 7){
                datos[7] = reformat[i] + datos[7]
            }
            if(value === 8){
                datos[8] = reformat[i] + datos[8]
            }
            if(value === 9){
                datos[9] = reformat[i] + datos[9]
            }
            if(value === 10){
                datos[10] = reformat[i] + datos[10]
            }
            if(value === 11){
                datos[11] = reformat[i] + datos[11]
            }
           
            i++
            

        }
        var j = 0
        for(var value of datos){
            if (value !== 0){
                j++
            }
            
        }
        console.log('fila de datos',datos)
        const indi=(total2/(160*j))*100;

        setDatouser(datos);
        setIndicador(indi);
    };
 
    const getReportes = () => {
        const internos = query(collection(db, "reportesint"));
        onSnapshot(internos, (querySnapshot) => {
            setReportin(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
        });

        const empleados = query(collection(db, "dpersonales"));
        onSnapshot(empleados, (querySnapshot) => {
            setPersonales(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
        });
    }

    useEffect(() => {
        getReportes();

    }, [])

    return (
        <>
        <br />
        <Typography component="div" variant="h4" className="princi3" >
          INDICADOR PRODUCTIVIDAD LABORAL
        </Typography>
            <br />
            <Container >
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={12} md={6}>
                        <select onChange={selecCedula} className="form-select" aria-label="Default select seguro">
                            {personales.map((dato, index) => (<option key={index} value={dato.codigo}>{dato.apellidos}</option>))}
                        </select>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Input
                            readOnly
                            value={nombre}
                            label="Nombre"
                        />
                    </Grid>

                    <Grid itemxs={12} md={6}>
                        <div className="contenedor2 contenedor">
                        <Barchart2 datos={datouser} />
                        </div>              
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <DatosPersonal nombre={nombre} total={total} indicador={indicador}/>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

