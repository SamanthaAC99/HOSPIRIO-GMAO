import React, { useEffect, useState } from "react";
import { query, collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { storage } from "../firebase/firebase-config";
import { ref, getDownloadURL } from "firebase/storage";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import '../css/Compras.css';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import '../css/Tabla.css'
import '../css/Presentacion.css';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid";
import {
    Container,
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    Button,
    ModalFooter,
} from "reactstrap";

export default function Comprasview() {
    const [modalActualizar, setModalactualizar] = useState(false);
    const [modalInformacion, setModalinformacion] = useState(false);
    const [elementoscom, setElementoscom] = useState([]);
    const [cambioes, setCambioes] = useState("");
    const [currentform, setCurrentform] = useState({});
    const [changecom, setChangecom] = useState("");
    const [url, setUrl] = useState("");
    function fechaFormat(fechacom) {
        var fecha = new Date(fechacom).getFullYear();

        console.log(fecha);
    }

    const getData3 = async () => {
        const reference = query(collection(db, "compras"));
        onSnapshot(reference, (querySnapshot) => {
            setElementoscom(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
        });
    }
    const actcom = (e) => {
        setChangecom(e.target.value);
    }
    const cambiarestado = async (id) => {
        console.log("Se cambio el estado");

        setModalactualizar(false);
        const ref = doc(db, "compras", `${id}`);
        await updateDoc(ref, { estadocom: cambioes, comentariocom: changecom });
        console.log("Se actualizaron los datos");
    }
    const selecState = (e) => {
        console.log(e.target.value);
        setCambioes(e.target.value);
    };

    const vistainformacion = (data) => {
        setCurrentform(data);
        descargararchivo(data.nameImg);
        setModalinformacion(true);
    };

    const cerrarvistainformacion = () => {
        setModalinformacion(false);
    };

    const vistaeditar = (data) => {
        setCurrentform(data);
        setCambioes("En proceso");
        fechaFormat(currentform.fechacom);
        setModalactualizar(true);
    }

    const cerrarvistaeditar = () => {
        setModalactualizar(false);
    };

    const descargararchivo = (nombre) => {
        getDownloadURL(ref(storage, `proformas/${nombre}`)).then((url) => {
            console.log(url);
            setUrl(url);
        })

    };


    useEffect(() => {
        getData3();
    }, [])
    return (
        <>

            <Container>
                <Typography component="div" variant="h3" className="princi3" >
                    COMPRAS MANTENIMIENTO
                </Typography>
         
                <Table className='table table-ligh table-hover' >
                    <Thead>
                        <Tr>
                            <Th>#</Th>
                            <Th>Fecha</Th>
                            <Th>CI Solicitante</Th>
                            <Th>Equipo</Th>
                            <Th>Artículo</Th>
                            <Th>Estado</Th>
                            <Th>Acciones</Th>
                            <Th>Información</Th>

                        </Tr>
                    </Thead>

                    <Tbody>
                        {elementoscom.sort((a, b) => (a.indice - b.indice)).map((compras, index) => (
                            <Tr key={compras.indice} >
                                <Td>{index + 1}</Td>
                                <Td>{compras.fechacom}</Td>
                                <Td>{compras.cedulacom}</Td>
                                <Td>{compras.equipocom}</Td>
                                <Td>{compras.articulocom}</Td>
                                <Td>{compras.estadocom}</Td>
                                <Td>
                                    <button className="btn btn-outline-danger" onClick={() => { vistaeditar(compras) }}>Cambiar Estado</button>
                                </Td>
                                <Td>
                                    <IconButton aria-label="delete" onClick={() => { vistainformacion(compras) }} color="gris"><InfoIcon /></IconButton>

                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Container>

            <Modal isOpen={modalInformacion}>
                <Container>
                    <ModalHeader>
                        <div><h1>Información Solicitud</h1></div>
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <label>
                                        Id:
                                    </label>
                                    <input
                                        className="form-control"
                                        readOnly
                                        type="text"
                                        value={currentform.id}
                                    />
                                </Grid >
                                <Grid item xs={6}>
                                    <label>
                                        Código Equipo:
                                    </label>
                                    <input
                                        className="form-control"
                                        readOnly
                                        type="text"
                                        value={currentform.codigoeqcom}
                                    />
                                </Grid >
                                <Grid item xs={6}>
                                    <label>
                                        Proveedor:
                                    </label>
                                    <input
                                        className="form-control"
                                        readOnly
                                        type="text"
                                        value={currentform.proveedorcom}
                                    />
                                </Grid >
                                <Grid item xs={6}>
                                    <label>
                                        Cantidad:
                                    </label>
                                    <input
                                        className="form-control"
                                        readOnly
                                        type="text"
                                        value={currentform.cantidadcom}
                                    />
                                </Grid >
                                <Grid item xs={6}>
                                    <label>
                                        Precio:
                                    </label>
                                    <input
                                        className="form-control"
                                        readOnly
                                        type="text"
                                        value={currentform.preciocom}
                                    />
                                </Grid >
                                <Grid item xs={12}>
                                    <label>
                                        Comentario:
                                    </label>
                                    <input
                                        className="form-control"
                                        readOnly
                                        type="text"
                                        value={currentform.comentariocom}
                                    />
                                </Grid >

                                <Grid className="fila" item xs={12}>
                                    <label className="archivo">
                                        Archivo:
                                    </label>
                                    <a
                                        component="button"
                                        variant="body2"
                                        href={url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Visualizar Proforma
                                    </a>
                                </Grid >

                            </Grid>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter className="modal-footer">
                        <Button
                            className="editar"
                            onClick={cerrarvistainformacion}
                        >
                            Cancelar
                        </Button>
                    </ModalFooter>

                </Container>
            </Modal>

            <Modal isOpen={modalActualizar}>
                <Container>
                    <ModalHeader>
                        <div><h1>Editar Información</h1></div>
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <label>
                                        Estado
                                    </label>
                                    <select onChange={selecState} className="form-select" aria-label="Default select tipo">
                                        {/* <option selected>Estado solicitud:</option> */}
                                        <option value="En proceso">En proceso</option>
                                        <option value="Aprobada" >Aprobada</option>
                                        <option value="Rechazada">Rechazada</option>
                                        sele
                                    </select>
                                </Grid >
                                <Grid item xs={12}>
                                    <label>
                                        Comentario
                                    </label>
                                    <input
                                        className="form-control"
                                        name="comentario"
                                        type="text"
                                        onChange={actcom}
                                    />

                                </Grid>
                            </Grid>
                        </FormGroup>
                    </ModalBody>

                    <ModalFooter className="modal-footer">
                        <Button
                            className="editar"
                            onClick={() => { cambiarestado(currentform.id) }}
                        >
                            Aceptar
                        </Button>

                        <Button
                            className="editar"
                            onClick={cerrarvistaeditar}
                        >
                            Cerrar
                        </Button>
                    </ModalFooter>
                </Container>
            </Modal>
        </>
    );
}
