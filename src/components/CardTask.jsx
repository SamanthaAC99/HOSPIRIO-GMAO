import React from "react";
import '../css/Presentacion.css';
import '../css/Ordentrabajo.css';
import '../css/Usuarios.css';
import '../css/Inicio.css';
import '../css/tarjetas.css';
import styled from 'styled-components';
import Avatar from '@mui/material/Avatar';

export default function Cardsview(props) {

    return (
        <>
            <div className="card" >
                {
                    <div className={`card-header ${props.tema}`}>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="row">
                                    <div className="alinear">
                                
                                            <div className="card-h">
                                                <Avatar sx={{ bgcolor: '#f8fbfc', color: 'black' }} aria-label="recipe">
                                                    {props.tipo}
                                                </Avatar>
                                            </div>
                                   

                                   
                                            <div className="card-h">
                                                {props.prioridad}</div>
                
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                }

                {
                    <div className="card-body small">
                        {props.fecha}
                        <StyledInput required type="text" readOnly value={props.departamento} name="departamento" />
                        <StyledInput required type="text" readOnly value={props.equipo} name="equipo" />
                    </div>
                }
                {
                    <div className={`card-footer ${props.tema}`}>
                        {props.id}
                    </div>
                }
            </div>
        </>
    );
}



const StyledInput = styled.input`
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border-radius: 2rem;
  margin-bottom:4px;
  margin-top:4px;
  width: 100%;
  height: 2rem;
  padding: 1rem;
  border: none;
  outline: none;
  color: #0e0d0d;
  font-size: 1rem;
  font-weight: bold;
  &:focus {
    display: inline-block;
    box-shadow: 0 0 0 0.2rem #b9abe0;
    backdrop-filter: blur(12rem);
    border-radius: 2rem;
  }
  &::placeholder {
    color: #0e0d0d;
    font-weight: 100;
    font-size: 1rem;
  }
`;