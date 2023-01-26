import React from "react";
import '../css/TarjetaSamylu.css'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Avatar from '@mui/material/Avatar';


export default function TarjetaSamylu({ icono, valor, bgicon, titulo, indicador2,colort }) {
    return (
        <>
            <div className="card-container-s" >
                <div className="card-header-s" style={{backgroundColor:colort}}>
                    <h5 className="titulo-card-s">{titulo}</h5>
                    <Avatar sx={{ bgcolor: bgicon }}>
                        {icono}
                    </Avatar>
                </div>
                <div className="card-body-s">
                    <p className="valor-card-s">{valor}</p>
                </div>
                <div className="card-footer15 small">
               
                <div className="alinear1">
                    <ArrowDownwardIcon className="flecha" color="disabled"  fontSize="small" />
                    <p className="indicador-card-s" >{indicador2}</p>
                </div>
                </div>
            </div>
        </>
    );
} 