import React from "react";
import '../css/GraficosCard.css'


export default function TarjetasDona({grafico, titulo,colort }) {
    return (
        <>
            <div className="card-container-g" >
                <div className="card-header-g" style={{backgroundColor:colort}}>
                    <h5 className="titulo-card-g">{titulo}</h5>
                </div>
                <div className="card-body-dona">
                    <p className="valor-card-g">{grafico}</p>
                </div>
                <div className="card-footer15 small">
               
               
                </div>
            </div>
        </>
    );
} 