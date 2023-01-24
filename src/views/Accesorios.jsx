import React, { useEffect, useState } from "react";
import { collection, setDoc, query, doc, deleteDoc, onSnapshot } from "firebase/firestore";
import Grid from "@mui/material/Grid"
import { db } from "../firebase/firebase-config";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import '../css/Tabla.css';
import '../css/Ordentrabajo.css';
import '../css/Presentacion.css';
import '../css/Accesorios.css';
import Typography from '@mui/material/Typography';
import {
    Button,
    Container,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "reactstrap";
import { v4 as uuidv4 } from 'uuid';
import Stack from '@mui/material/Stack';



export default function Accesoriosview(){
    const [data, setData] = useState([]);
    const [modalInsertar, setModalinsertar] = useState(false);
    const [accesorioing, setAccesoriosing] = useState('');
    const [codigoac, setCodigoac] = useState('');
    const [form, setForm] = useState({});



    const getData = async () => {
        const reference = query(collection(db, "accesorios"));
        onSnapshot(reference, (querySnapshot) => {
            setData(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
        });
    }

    const sendData = () => {
        var acce = {};
        var val = Date.now();
        var newId =  uuidv4();
  
            acce = {
                indice: val,
                accesorioing: accesorioing,
                codigoac: codigoac,
                id: newId,
            };
            sendFirestore(acce);
            cerrarModalInsertar()
    };

    const sendFirestore = (accesorio) => {
        try {
            setDoc(doc(db, "accesorios", `${accesorio.id}`), accesorio);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const mostrarModalInsertar = () => {
        setModalinsertar(true);
    };

    const cerrarModalInsertar = () => {
        setModalinsertar(false);
    };

    const eliminar = async (dato) => {
        var opcion = window.confirm("Estás Seguro que deseas Eliminar el elemento " + dato.id);
        if (opcion === true) {
            await deleteDoc(doc(db, "accesorios", `${dato.id}`));
        }
    };

    useEffect(() => {
        getData();
    }, [])

    return (
        <>
            <Container>
                <Typography component="div" variant="h3" className="princi3" >
                   INVENTARIO ACCESORIOS
                </Typography>
                <Button variant="outlined" className="boton-gestionA" onClick={() => mostrarModalInsertar()}>Agregar </Button>
                <div style={{height:500,overflow:"scroll"}}>
                <Table className='table table-ligh table-hover'>
                    <Thead>
                        <Tr>
                            <Th>#</Th>
                            <Th>Accesorio</Th>
                            <Th>Código</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.sort((a, b) => (a.indice - b.indice)).map((contrato, index) => (
                            <Tr key={contrato.indice} >
                                <Td>{index + 1}</Td>
                                <Td>{contrato.accesorioing}</Td>
                                <Td>{contrato.codigoac}</Td>
                                <Td>
                                    <Stack direction="row" spacing={2} alignitems="center" justifyContent="center" >
                                        <button className="btn btn-outline-danger" onClick={() => eliminar(contrato)}>Eliminar</button>
                                    </Stack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
                </div>
            </Container>

           

            <Modal className="{width:0px}" isOpen={modalInsertar}>
                <ModalHeader>
                    <div><h3>Insertar</h3></div>
                </ModalHeader>

                <ModalBody>
                            <Grid item xs={12}>
                                <label>
                                    Accesorio:
                                </label>
                                <input
                                    className="form-control"
                                    name="accesoriosing"
                                    type="text"
                                    onChange={(e) => { setAccesoriosing(e.target.value) }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <label>
                                    Código:
                                </label>
                                <input
                                    className="form-control"
                                    name="codigoac"
                                    type="text"
                                    onChange={(e) => { setCodigoac(e.target.value) }}
                                />
                            </Grid>
                </ModalBody>

                <ModalFooter>

                    <Button
                        className="editar"
                        onClick={() => sendData()}
                    >
                        Insertar
                    </Button>
                    <Button
                        className="editar"
                        onClick={() => cerrarModalInsertar()}
                    >
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );

}

