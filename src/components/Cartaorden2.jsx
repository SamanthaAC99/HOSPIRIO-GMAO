import React, { useEffect, useState } from "react";
import "../css/TestView.css"
import styled from 'styled-components';
import { blue, red } from '@mui/material/colors';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Avatar from '@mui/material/Avatar';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

export default function Cardo2(props) {
    const [tipocambiado, setTipocambiado] = useState("");

    const selecTipo = (e) => {
        console.log(e.target.value);
        setTipocambiado(e.target.value);
    };



    return (
        <>
            <div className="card12" >
                {
                    <div className="card-header12"> 
                   <div className="row">
                       <div className="col-sm-12">
                           <div className="row">
                               <div className="alinear1">
                               <h5 className="titui2">TIPO DE TRABAJO</h5>
                            
                           
                              
                                       <Avatar sx={{ bgcolor: blue[700] }} >
        <MonitorHeartIcon/>
      </Avatar>
                                    
                              

                              
                                      
           
                               </div>
                           </div>
                       </div>
                   </div>
                   </div>
                }
                
                {
              <div className="card-body12 small">
                                    <select onChange={selecTipo} className="seleccionador" aria-label="Default select tipo">
                                        <option value="Equipo Médico">Equipo Médico</option>
                                        <option value="Sistemas">Sistemas</option>
                                        <option value="Carpintería">Carpintería</option>
                                        <option value="Plomería">Plomería</option>
                                    </select>
              </div>
                }

         </div>
        </>
    );
}


