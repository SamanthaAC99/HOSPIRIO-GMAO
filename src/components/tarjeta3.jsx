import React from "react";
import '../css/Presentacion.css';
import '../css/Ordentrabajo.css';
import '../css/Usuarios.css';
import '../css/Inicio.css';
import '../css/tarjetas2.css';
import { blue, pink } from '@mui/material/colors';
import styled from 'styled-components';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Avatar from '@mui/material/Avatar';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

export default function Cards3(props) {

    return (
        <>
            <div className="card1" >
                {
                    <div className="card-header1"> 
                   <div className="row">
                       <div className="col-sm-12">
                           <div className="row">
                               <div className="alinear1">
                               <div className="card-h1">
                               <h5 className="titui">EQUIPOS</h5>
                                        </div>
                           
                                       <div className="card-h2">
                                       <Avatar sx={{ bgcolor: blue[700] }}>
        <MonitorHeartIcon />
      </Avatar>
                                       </div>
                              

                              
                                      
           
                               </div>
                           </div>
                       </div>
                   </div>
                   </div>
                }
                
                {
              <div className="card-body1 small">
                <p className="box-content-header">{props.equipos}</p>
      
              </div>
                }


{
<div className="card-footer1 small">
          <div className="days">
          <div className="alinear1">
          <ArrowDownwardIcon color="primary" fontSize="small"/>
          <p className="box-content-foo">20% Total</p>
          </div>
          </div>
        </div>
           
        }
         </div>
        </>
    );
}


