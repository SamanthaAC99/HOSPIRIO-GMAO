import React from "react";
import '../css/Presentacion.css';
import '../css/Ordentrabajo.css';
import '../css/Usuarios.css';
import '../css/Inicio.css';
import '../css/tarjetas2.css';
import { amber, green } from '@mui/material/colors';
import styled from 'styled-components';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Avatar from '@mui/material/Avatar';
import InventoryIcon from '@mui/icons-material/Inventory';

export default function Cards2(props) {

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
                               <h5 className="titui">TOTAL</h5>
                                        </div>
                           
                                       <div className="card-h2">
                                       <Avatar sx={{ bgcolor: amber[200] }}>
        <InventoryIcon />
      </Avatar>
                                       </div>
                              

                              
                                      
           
                               </div>
                           </div>
                       </div>
                   </div>
                   </div>
                }
                
                {
              <div className="card-body2 small">
                <p className="box-content-header">{props.total}</p>
      
              </div>
                }


{
<div className="card-footer1 small">
<div className="alinear2">
          <div className="days">
          <div className="alinear3">
          <ArrowDownwardIcon color="primary" fontSize="small"/>
          <p className="box-content-foo">20% Industrial</p>
          </div>
          </div>

          <div className="days">
          <div className="alinear3">
          <ArrowDownwardIcon sx={{ color: green[500] }}fontSize="small" />
          <p className="box-content-foo">80% Médico</p> 
          </div>
          </div>
           {/* <div >
       <p className="box-content-subheader">Since blabla</p>
          </div> */}
        </div>
        </div>
           
        }
         </div>
        </>
    );
}


