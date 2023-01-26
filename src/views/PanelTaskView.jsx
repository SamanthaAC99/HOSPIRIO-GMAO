import React, { useState, useEffect } from "react";
import Cardsview from "../components/CardTask";
import { Grid } from "@mui/material";
import '../css/PaneltaskView.css';
import { collection, query, onSnapshot } from "firebase/firestore";
import Typography from '@mui/material/Typography';
import { db } from "../firebase/firebase-config";
export default function PaneltaskView() {
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const filterFuntion = (e) => {
        setFilter(e.target.value);
    }
    const filteredDataByPriority = (priority) => {
        if(priority.estado !== 'Solventado'){
        if (priority.prioridad === filter) {
            return priority
        } else if (filter === 'ALL') {
            return priority
        }else {
            return null;
        }
    }
}
    const getData = () => {
        const reference = query(collection(db, "ordenes"));
        onSnapshot(reference, (querySnapshot) => {
            const ordenes = [];
            querySnapshot.forEach((doc) => {
                ordenes.push(doc.data());
            });
            setData(ordenes);
        });
    }
    useEffect(() => {
        getData();
    }, [])
    return (
        <>
            <div className="container-paneltask">
          
                <Typography component="div" variant="h4" className="princi3" >
                    ORDENES DE TRABAJO PENDIENTES
                </Typography>
              
                <div className="seleccionador"> 
            <select onChange={filterFuntion} value={filter} className="form-select1" aria-label="Default select tipo">
                    <option value='ALL'>TODAS</option>
                    <option value="CRITICA">CRITICA</option>
                    <option value="ALTA">ALTA</option>
                    <option value="MEDIA">MEDIA</option>
                    <option value="BAJA">BAJA</option>
                </select>
     
                </div>
                <div className="ScrollStyle">
                    <Grid container spacing={2}>
                        {data.filter(filteredDataByPriority).map((item, index) => (
                            <Grid item xs={12} sm={12} md={4} key={index}>
                                <div className="card-container">
                                    <Cardsview
                                        prioridad={item.prioridad}
                                        tipo={index+1}
                                        fecha={item.fecha}
                                        equipo={item.tipotrabajo}
                                        departamento={item.departamento}
                                        id={item.id}
                                        tema={item.prioridad}
                                    />
                                </div>
                            </Grid> 
                        ))}
                    </Grid>
                </div>
            </div>

        </>

    )


}