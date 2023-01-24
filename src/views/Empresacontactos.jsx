import React, { useEffect, useState } from "react";
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { collection, setDoc, query, doc, deleteDoc, onSnapshot, updateDoc, } from "firebase/firestore";
import Grid from "@mui/material/Grid";
import Swal from 'sweetalert2';
import { db, storage } from "../firebase/firebase-config";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import '../css/Tabla.css';
import '../css/Compras.css';
import '../css/Presentacion.css';
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
import { v4 as uuidv4 } from 'uuid';
import Stack from '@mui/material/Stack';


export default function Contactosempresas() {
    const [data, setData] = useState([]);
    const [modalActualizar, setModalactualizar] = useState(false);
    const [modalInsertar, setModalinsertar] = useState(false);
    const [modalInformacion, setModalinformacion] = useState(false);
    const [empresa, setEmpresa] = useState('');
    const [representante, setRepresentante] = useState('');
    const [direccion, setDireccion] = useState('');
    const [ruc, setRuc] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [producto, setProducto] = useState('');
    const [evaluacion, setEvaluacion] = useState('');
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState("");
    const [form, setForm] = useState({});

    const buscarImagen = (e) => {
        if (e.target.files[0] !== undefined) {
            setFile(e.target.files[0]);
        } else {
            console.log('no hay archivo');
        }
    };

    const getData = async () => {
        const reference = query(collection(db, "empresas"));
        onSnapshot(reference, (querySnapshot) => {
            setData(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
        });
    };

    const actualizar = async () => {
        const database = doc(db, "empresas", form.id);
        await updateDoc(database, form);
        cerrarModalActualizar();
    };

    const agregardatos = async () => {
        var contactos = {};
        var newId = uuidv4();
        if (file === null) {
            contactos = {
                empresa: empresa,
                representante: representante,
                direccion: direccion,
                ruc: ruc,
                correo: correo,
                telefono: telefono,
                producto: producto,
                evaluacion: evaluacion,
                nameImg: 'SP.PNG',
                id: newId,
                indice: Date.now(),
            };
            sendFirestore(contactos);
        } else {
            contactos = {
                empresa: empresa,
                representante: representante,
                direccion: direccion,
                ruc: ruc,
                correo: correo,
                telefono: telefono,
                producto: producto,
                evaluacion: evaluacion,
                nameImg: newId,
                id: newId,
                indice: Date.now(),
            };
            sendFirestore(contactos);
            sendStorage(contactos.id);
        }
        setFile(null);
        cerrarModalInsertar();
        Swal.fire({
            icon: 'success',
            title: '¡Empresa Agregada!',
            showConfirmButton: false,
            timer: 1500
          })
    };
    const sendFirestore = (contactos) => {
        try {
            setDoc(doc(db, "empresas", `${contactos.id}`), contactos);

        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };
    const sendStorage = (id) => {
        const storageRef = ref(storage, `evaluaciones/${id}`);
        uploadBytes(storageRef, file).then((snapshot) => {
        });
    };

    const mostrarModalActualizar = (dato) => {
        setForm(dato);
        setModalactualizar(true);
    };


    const mostrarModalInformacion = (dato) => {
        setForm(dato);
        descargararchivo(dato.nameImg);
        setModalinformacion(true);
    };

    const cerrarModalInformacion = () => {
        setModalinformacion(false);
    };

    const cerrarModalActualizar = () => {
        setModalactualizar(false);
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
            await deleteDoc(doc(db, "empresas", `${dato.id}`));
        }
    };

    const handleChange = (e) => {
        setForm(
            {
                ...form,
                [e.target.name]: e.target.value,
            },
        )
    };

    const descargararchivo = (nombre) => {
        getDownloadURL(ref(storage, `evaluaciones/${nombre}`)).then((url) => {
            setUrl(url);
        })

    };


    useEffect(() => {
        getData();
    }, [])

    return (
        <>
            <Container>
                <Typography component="div" variant="h4" className="princi3" >
                    EMPRESAS CONTRATISTAS
                </Typography>
                <Grid container >
                <Grid item xs={12} md={12} sm={3}>
                <Button variant="contained"
                          className="boton-modal-d" 
                          onClick={() => mostrarModalInsertar()}>Agregar Empresa
                </Button>
                </Grid>
                </Grid>
                <br />
                <Table className='table table-ligh table-hover'>
                    <Thead>
                        <Tr>
                            <Th>#</Th>
                            <Th>Empresa</Th>
                            <Th>Representante</Th>
                            <Th>Ruc</Th>
                            <Th>Contacto</Th>
                            <Th>Correo</Th>
                            <Th>Acciones</Th>
                            <Th>Información</Th>

                        </Tr>
                    </Thead>

                    <Tbody>
                        {data.sort((a, b) => (a.indice - b.indice)).map((contactos, index) => (
                            <Tr key={contactos.indice} >
                                <Td>{index + 1}</Td>
                                <Td>{contactos.empresa}</Td>
                                <Td>{contactos.representante}</Td>
                                <Td>{contactos.ruc}</Td>
                                <Td>{contactos.telefono}</Td>
                                <Td>{contactos.correo}</Td>
                                <Td>
                                    <Stack direction="row" spacing={2} alignitems="center" justifyContent="center" >
                                        <button className="btn btn-outline-warning" onClick={() => mostrarModalActualizar(contactos)}>Editar</button>
                                        <button className="btn btn-outline-danger" onClick={() => eliminar(contactos)}>Eliminar</button>
                                    </Stack>
                                </Td>
                                <Td>
                                    <IconButton aria-label="delete" color="gris" onClick={() => mostrarModalInformacion(contactos)}><InfoIcon /></IconButton>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Container>

            <Modal isOpen={modalInformacion}>
                <ModalHeader>
                    <div><h1>Información Equipo</h1></div>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <label>
                                <b>DIRECCIÓN:   </b> 
                                </label>
                                <TextareaAutosize
                                                                style={{textTransform:"uppercase"}} 
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="Dirección"
                                                                className="text-area-encargado"
                                                                name="direccion"
                                                                readOnly
                                                                value={form.direccion}/>
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                   <b>PRODUCTO/SERVICIO:   </b> 
                                </label>
                                <TextareaAutosize
                                                                style={{textTransform:"uppercase"}} 
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="PRODUCTO/SERVICIO"
                                                                className="text-area-encargado"
                                                                name="producto"
                                                                readOnly
                                                                value={form.producto}/>
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                <b>EVALUACIÓN:   </b> 
                                    {form.evaluacion}
                                </label>
{/* 
                                <input
                                    className="form-control"
                                    readOnly
                                    type="text"
                                    value={form.evaluacion}
                                /> */}
                            </Grid>
                            <Grid className="fila" item xs={12}>
                                {/* <label className="archivo">
                                <b>Archivo:   </b>  
                                </label> */}
                                <a
                                    component="button"
                                    variant="body2"
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Visualizar Evaluación
                                </a>
                            </Grid >
                        </Grid>
                    </FormGroup>

                </ModalBody>
                <ModalFooter>
                    <Button
                       variant="contained"
                       className="boton-modal-d"
                        onClick={() => cerrarModalInformacion()}
                    >
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalActualizar}>
                <ModalHeader>
                    <div><h3>Editar Registro</h3></div>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                                                style={{textTransform:"uppercase"}}
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="EMPRESA"
                                                                className="text-area-encargado"
                                                                name="empresa"
                                                                onChange={handleChange}
                                                                value={form.empresa}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                                                style={{textTransform:"uppercase"}}
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="REPRESENTANTE"
                                                                className="text-area-encargado"
                                                                name="representante"
                                                                onChange={handleChange}
                                                                value={form.representante}/>
                            </Grid>
                            <Grid item xs={6}>
                                <label>
                                    RUC:
                                </label>
                                <TextareaAutosize
                                                                style={{textTransform:"uppercase"}}
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="RUC"
                                                                className="text-area-encargado"
                                                                name="ruc"
                                                                onChange={handleChange}
                                                                value={form.ruc}/>
                            </Grid>
                            <Grid item xs={6}>
                                <TextareaAutosize
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="CONTACTO"
                                                                className="text-area-encargado"
                                                                name="telefono"
                                                                onChange={handleChange}
                                                                value={form.telefono}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="CORREO"
                                                                className="text-area-encargado"
                                                                name="correo"
                                                                onChange={handleChange}
                                                                value={form.correo}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                                                style={{textTransform:"uppercase"}}
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="DIRECCIÓN"
                                                                className="text-area-encargado"
                                                                name="direccion"
                                                                onChange={handleChange}
                                                                value={form.direccion}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                                                style={{textTransform:"uppercase"}}
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="PRODUCTO"
                                                                className="text-area-encargado"
                                                                name="producto"
                                                                onChange={handleChange}
                                                                value={form.producto}/>
                                {/* <input
                                    className="form-control"
                                    name="producto"
                                    type="text"
                                    onChange={handleChange}
                                    value={form.producto}
                                /> */}
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={6}>
                                <TextareaAutosize
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="EVALUACIÓN"
                                                                className="text-area-encargado"
                                                                name="evaluacion"
                                                                onChange={handleChange}
                                                                value={form.evaluacion}/>
                            </Grid>
                            <Grid item xs={3}></Grid>

                        </Grid>
                    </FormGroup>
                </ModalBody>

                <ModalFooter>
                <Button  variant="outlined"
                          className="boton-modal-d2"
                          onClick={() => actualizar()}>ACEPTAR</Button>
                    <Button   variant="contained"
                          className="boton-modal-d" onClick={() => cerrarModalActualizar()}>Cancelar </Button>                                  
                </ModalFooter>
            </Modal>

            <Modal className="{width:0px}" isOpen={modalInsertar}>
                <ModalHeader>
                    <div><h3>Insertar</h3></div>
                </ModalHeader>

                <ModalBody>
                    <FormGroup>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    style={{textTransform:"uppercase"}}
                                    aria-label="minimum height"
                                    minRows={1}
                                    placeholder="EMPRESA"
                                    className="text-area-encargado"
                                    name="empresa"
                                    onChange={(e) => { setEmpresa(e.target.value) }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    style={{textTransform:"uppercase"}}
                                    aria-label="minimum height"
                                    minRows={1}
                                    placeholder="REPRESENTANTE"
                                    className="text-area-encargado"
                                    name="representante"
                                    onChange={(e) => { setRepresentante(e.target.value) }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={1}
                                    placeholder="RUC"
                                    className="text-area-encargado"
                                    name="ruc"
                                    onChange={(e) => { setRuc(e.target.value) }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                   <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={1}
                                    placeholder="CONTACTO"
                                    className="text-area-encargado"
                                    name="telefono"
                                    onChange={(e) => { setTelefono(e.target.value) }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={1}
                                    placeholder="CORREO"
                                    className="text-area-encargado"
                                    name="correo"
                                    onChange={(e) => { setCorreo(e.target.value) }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                 <TextareaAutosize
                                    style={{textTransform:"uppercase"}}
                                    aria-label="minimum height"
                                    minRows={1}
                                    placeholder="DIRECCIÓN"
                                    className="text-area-encargado"
                                    name="direccion"
                                    onChange={(e) => { setDireccion(e.target.value) }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    style={{textTransform:"uppercase"}}
                                    aria-label="minimum height"
                                    minRows={1}
                                    placeholder="PRODUCTO/SERVICIO"
                                    className="text-area-encargado"
                                    name="producto"
                                    onChange={(e) => { setProducto(e.target.value) }}
                                />
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={6}>
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={1}
                                    placeholder="EVALUACIÓN"
                                    className="text-area-encargado"
                                    name="evaluacion"
                                    onChange={(e) => { setEvaluacion(e.target.value) }}
                                />
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={12}>
                                <div className="mb-3">
                                    <label >Cargar Evaluacion</label>
                                    <input className="form-control" onChange={buscarImagen} type="file" id="formFile" />
                                </div>
                            </Grid>
                        </Grid>
                    </FormGroup>
                </ModalBody>

                <ModalFooter>
                <Button
                 variant="contained"
                 className="boton-modal-d"
                        onClick={() => agregardatos()}
                    >
                        Insertar
                    </Button>
                    <Button
               variant="outlined"
               className="boton-modal-d"
                        onClick={() => cerrarModalInsertar()}
                    >
                        Cancelar
                    </Button>
                  
                </ModalFooter>
            </Modal>
        </>
    );
}

