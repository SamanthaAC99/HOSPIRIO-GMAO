import React from "react";
import '../css/TarjetaSamylu.css'
import Avatar from '@mui/material/Avatar';


export default function TarjetasMt({ icono, valor1, bgicon, titulo,unidades, colort }) {
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
                    <h7 className="unidades-card-s">{valor1}</h7>
                    <h7 className="unidades-card-s2">{unidades} </h7>
                </div>
                <div className="card-footer15 small">
               
               
                </div>
            </div>
        </>
    );
} 