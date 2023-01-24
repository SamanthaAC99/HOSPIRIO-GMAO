import React from "react";
import '../css/TarjetaSamylu.css'
import Avatar from '@mui/material/Avatar';


export default function TarjetasDisp({ icono, valor, bgicon, titulo,colort }) {
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
                    <p className="valor-card-s">{`${valor}%`}</p>
                </div>
                <div className="card-footer15 small">
               
               
                </div>
            </div>
        </>
    );
} 