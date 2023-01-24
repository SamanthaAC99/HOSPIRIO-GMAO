import React, { useEffect, useState } from "react";
import { query, collection, doc, deleteDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import Stack from '@mui/material/Stack';
import { storage } from "../firebase/firebase-config";
import { ref, getDownloadURL } from "firebase/storage";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import '../css/Tabla.css'
import '../css/Ordentrabajo.css';
import '../css/Presentacion.css';
import '../css/TablaExternos.css';
import PrintIcon from '@mui/icons-material/Print';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {
    Container,
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    ModalFooter,
} from "reactstrap";
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';


export default function Reportexterno() {

    const [elementosext, setElementosext] = useState([]);
    const [modalActualizar, setModalactualizar] = useState(false);
    const [modalInformacion, setModalinformacion] = useState(false);
    const [cambioex, setCambioex] = useState("");
    const [currentform, setCurrentform] = useState({});
    const [url, setUrl] = useState("");

    const getData13 = async () => {
        const reference = query(collection(db, "reportesext"));
        onSnapshot(reference, (querySnapshot) => {
            setElementosext(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
        });
    }



    const vistaedi = (data) => {
        setCurrentform(data);
        setCambioex("Reparado Completamente");
        setModalactualizar(true);
    };

    const cerrarvistaedi = () => {
        setModalactualizar(false);
    };

    const vistainformacion = (data) => {
        setCurrentform(data);
        setModalinformacion(true);
    };

    const cerrarvistainformacion = () => {
        setModalinformacion(false);
    };

    const cambiarestado = async (id) => {
        console.log("Se cambio el estado");
        setModalactualizar(false);
        const ref = doc(db, "reportesext", `${id}`);
        await updateDoc(ref, { estadoext: cambioex });
        console.log("Se actualizaron los datos");
    };

    const selecEst = (e) => {
        console.log(e.target.value);
        setCambioex(e.target.value);
    };

    // const descargararchivo = (nombre) => {
    //     getDownloadURL(ref(storage, `externos/${nombre}`)).then((url) => {
    //         console.log(url);
    //         setUrl(url);
    //     })
    // };

    const eliminar = async (id) => {
        var opcion = window.confirm("Estás Seguro que deseas Eliminar el elemento ");
        if (opcion === true) {
            await deleteDoc(doc(db, "reportesext", `${id}`));
            setModalactualizar(false);
        }
    };

    const obtenerUrlPhoto = (uid) => {
        getDownloadURL(ref(storage,`externos/${uid}`)).then((url) => {
          console.log(url);
          const ref = doc(db, "usuarios", `${uid}`);
          updateDoc(ref, {
            "photo": url,
            "uid": uid
          });
        })
      };

      const generarPdf = () => {
        var doc = new jsPDF({
            orientation: "portrait",
        })
        doc.text("Hospital del Río ", 90, 10); //fontsize 15
        doc.setFontSize(12)// de aqui para abajo todo estara con fontsize 9
        doc.text("Reporte de Mantenimiento", 85, 20)
        let aux = 15
        let datos_tabla =
            [
                ["Id Reporte",currentform.id],
                ["Id O/T",currentform.OrdenId],
                ["Código Equipo",currentform.codigoe],
                ["Equipo",currentform.equipo],
                ["Técnico",currentform.nombreT],
                ["Estado",currentform.estadof],
                ["Tipo de Mantenimiento",currentform.tmantenimiento],
                ["Tiempo",currentform.tiempo],
                ["Costo",currentform.costo],
                ["Falla",currentform.falla],
                ["Causas",currentform.causas],
                ["Observaciones",currentform.observaciones]
            ]

        autoTable(doc, {
            startY: aux + 10,
            head: [['Item', 'Descripción']],
            body: datos_tabla,
        })

        doc.save(`reporte_${currentform.id}.pdf`);
    }

    useEffect(() => {
        getData13();
    }, [])

    return (
        <>
            <Container>
                <Typography component="div" variant="h4" className="princi3" >
                    MANTENIMIENTO EXTERNO
                </Typography>
                <Table className='table table-ligh table-hover'>
                    <Thead>
                        <Tr>
                            <Th>#</Th>
                            <Th>Id Reporte</Th>
                            <Th>Técnico</Th>
                            <Th>Duración</Th>
                            <Th>Equipo</Th>
                            <Th>Código Equipo</Th>
                            <Th>Estado</Th>
                            {/* <Th>Acciones</Th> */}
                            <Th>Información</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        {elementosext.sort((a, b) => (a.indice - b.indice)).map((rexterno, index) => (
                            <Tr key={rexterno.indice}>
                                <Td>{index + 1}</Td>
                                <Td>{rexterno.id}</Td>
                                <Td>{rexterno.nombreT}</Td>
                                <Td>{rexterno.tiempo}</Td>
                                <Td>{rexterno.equipo}</Td>
                                <Td>{rexterno.codigoe}</Td>
                                <Td>{rexterno.estadof}</Td>
                                {/* <Td>
                                    <Stack direction="row" spacing={0.5} alignitems="center" justifyContent="center" >
                                        {/* <Button
                                            color="primary" onClick={() => { vistaedi(rexterno) }}>Cambiar Estado </Button>{" "}
                                                <Button color="danger" onClick={() => eliminar(rexterno.id)}>Eliminar</Button> */}
                                        {/* <button className="btn btn-outline-warning" onClick={() => { vistaedi(rexterno) }}>Estado</button> */}
                                        {/* <button className="btn btn-outline-danger" onClick={() => eliminar(rexterno.id)}>Eliminar</button>
                                    </Stack>
                                </Td> */} 
                                <Td>
                                    <IconButton aria-label="delete" onClick={() => { vistainformacion(rexterno) }} color="gris"><InfoIcon /></IconButton>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Container>
            <Modal isOpen={modalInformacion}>
                <Container>
                    <ModalHeader>
                        <div><h1>Información Reporte</h1></div>
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <div className="name-outlined">{currentform.id}</div>
                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Estado:  </b>
                                    {currentform.estadof}
                                </label>
                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Orden de Trabajo: </b>
                                    {currentform.OrdenId}
                                </label>
                            </Grid>

                            <Grid item xs={12}>
                                <label>
                                    <b>Técnico: </b>
                                    {currentform.nombreT}
                                </label>
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                    <b>Equipo:  </b>
                                    {currentform.equipo}
                                </label>
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                    <b>Código Equipo:  </b>
                                    {currentform.codigoe}
                                </label>
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                    <b>Tipo de mantenimiento:  </b>
                                    {currentform.tmantenimiento}
                                </label>
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                    <b>Tiempo:  </b>
                                    {currentform.tiempo}
                                </label>
                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Costo:  </b>
                                    {currentform.costo}
                                </label>
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                    <b>Falla:  </b>
                                </label>
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={2}
                                    placeholder="Falla"
                                    className="text-area-encargado"
                                    name="falla"
                                    readOnly
                                    value={currentform.falla} />

                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    Causas:
                                </label>
                                <TextareaAutosize

                                    aria-label="minimum height"
                                    minRows={2}
                                    placeholder="Causas"
                                    className="text-area-encargado"
                                    name="causas"
                                    readOnly
                                    value={currentform.causas} />
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                    Actividades:
                                </label>

                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={2}
                                    placeholder="Causas"
                                    className="text-area-encargado"
                                    name="actividadesR"
                                    readOnly
                                    value={currentform.actividadesR}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                    Repuestos:
                                </label>
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={2}
                                    placeholder="Repuestos"
                                    className="text-area-encargado"
                                    name="repuestos"
                                    readOnly
                                    value={currentform.repuestos}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                    Observaciones:
                                </label>
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={2}
                                    placeholder="Observaciones"
                                    className="text-area-encargado"
                                    name="observaciones"
                                    readOnly
                                    value={currentform.observaciones}
                                />
                            </Grid>
                                <Grid className="fila" item xs={12}>
                                    {/* <label className="archivo">
                                        Visualizar:
                                    </label> */}
                                    <a
                                        component="button"
                                        variant="body2"
                                        href={currentform.imgreporte}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Reporte Físico
                                    </a>
                                </Grid >
                            </Grid>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter className="modal-footer">
                    <Button
                        variant="contained"
                        className="boton-modal-pdf"
                        startIcon={<PrintIcon />}
                        onClick={generarPdf} >
                        Imprimir
                    </Button>
                    <Button
                        variant="outlined"
                        className="boton-modal-d"
                        onClick={cerrarvistainformacion}
                    >
                        Cerrar
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
                                    <select onChange={selecEst} className="form-select" aria-label="Default select tipo">
                                        <option value="Reparado Completamente" >Reparado Completamente</option>
                                        <option value="Reparado Parcialmente">Reparado Parcialmente</option>
                                        <option value="En espera de repuestos">En espera de repuestos</option>
                                        <option value="Baja">Baja</option>
                                    </select>
                                </Grid >
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
                            onClick={cerrarvistaedi}
                        >
                            Cerrar
                        </Button>
                        {/* <button className="btn btn-warning" onClick={() => {cambiarestado(currentform.id)}}>Aceptar</button>
                        <button className="btn btn-success" onClick={cerrarvistaedi}>Cerrar</button> */}
                    </ModalFooter>
                </Container>
            </Modal>
        </>
    );
}
