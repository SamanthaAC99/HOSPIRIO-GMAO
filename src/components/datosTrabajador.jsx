
import React from "react";
import { Input } from "reactstrap";

export default function DatosPersonal(props) {

    return (
        <>

           

                <h4 className="grafi">Datos Trabajador</h4>
                    <p >Código</p>
                    <Input
                        readOnly
                        value={props.nombre}
                        label="Nombre"
                    />
                    <p >Horas Trabajadas</p>
                    <Input
                        readOnly
                        value={props.total}
                        label="total"
                    />

                    <p>Indicador</p>
                    <Input
                        readOnly
                        value={props.indicador}
                        label="indicador"
                    />

        </>

    );



}