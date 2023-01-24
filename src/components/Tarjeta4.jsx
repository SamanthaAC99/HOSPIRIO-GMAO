import React from "react";
import '../css/Presentacion.css';
import '../css/Ordentrabajo.css';
import '../css/Usuarios.css';
import '../css/Inicio.css';
import '../css/tarjetas2.css';
import { green, pink } from '@mui/material/colors';
import styled from 'styled-components';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Avatar from '@mui/material/Avatar';
import AssessmentIcon from '@mui/icons-material/Assessment';

export default function Cards4(props) {

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
                               <h5 className="titui">MTTR</h5>
                                        </div>
                           
                                       <div className="card-h2">
                                       <Avatar sx={{ bgcolor: green[500] }}>
        <AssessmentIcon />
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
                <p className="box-content-header">{props.mttr}</p>
      
              </div>
                }


{
<div className="card-footer1 small">
          <div className="days">
          <div className="alinear1">
          <ArrowDownwardIcon color="primary" fontSize="small"/>
          <p className="box-content-foo">Indicador</p>
          </div>
          </div>
        </div>
           
        }
         </div>
        </>
    );
}


