import React, { useEffect, useState } from "react";
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Swal from 'sweetalert2';
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { collection, setDoc, query, doc, deleteDoc, onSnapshot } from "firebase/firestore";
import Grid from "@mui/material/Grid";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { db, storage } from "../firebase/firebase-config";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import '../css/Tabla.css';
import '../css/Ordentrabajo.css';
import Autocomplete from '@mui/material/Autocomplete';
import '../css/Presentacion.css';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
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
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function Ingresoequipos() {
    const [data, setData] = useState([]);
    const [modalInsertar, setModalinsertar] = useState(false);
    const [modalInformacion, setModalinformacion] = useState(false);
    const [fechainicio, setFechainicio] = React.useState(new Date().toLocaleString("en-US")); 
    const [fechafinal, setFechafinal] = React.useState(new Date().toLocaleString("en-US"));
    const [ncontrato, setNcontrato] = useState('');
    const [empresa2,setEmpresa2] = useState([]);
    const [equipos, setEquipos] = useState('');
    const [empresa, setEmpresa] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState("");
    const [form, setForm] = useState({});

    const buscarImagen = (e) => {
        if (e.target.files[0] !== undefined) {
            setFile(e.target.files[0]);
            console.log(e.target.files[0]);
        } else {
            console.log('no hay archivo');
        }
    };



    const getData = async () => {
        const reference = query(collection(db, "contratos"));
        onSnapshot(reference, (querySnapshot) => {
            setData(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
        });
        const refe = query(collection(db, "empresas"));
        onSnapshot(refe, (querySnapshot) => {
            setEmpresa2(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
        });
    }

    const sendData = () => {
        var contrato = {};
        var val = Date.now();
        var newId =  uuidv4();
        if (file === null) {
            contrato = {
                finicio: fechainicio.toLocalString(),
                ffinal: fechafinal.toLocalString(),
                indice: val,
                ncontrato: ncontrato,
                equipos: equipos,
                empresa: empresa,
                descripcion: descripcion,
                nameImg: 'SP.PNG',
                id: newId,
            };
            sendFirestore(contrato);
        } else {
            contrato = {
                finicio: fechainicio.toDateString(),
                ffinal: fechafinal.toDateString(),
                indice: val,
                ncontrato: ncontrato,
                equipos: equipos,
                empresa: empresa,
                descripcion: descripcion,
                nameImg: newId,
                id: newId,
            };
            sendFirestore(contrato);
            sendStorage(contrato.id);
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

    const sendFirestore = (contrato) => {
        try {
            setDoc(doc(db, "contratos", `${contrato.id}`), contrato);
            console.log("Contrato agregada")
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };
    const sendStorage = (id) => {
        //pasar parametros variables
        const storageRef = ref(storage, `contratos/${id}`);
        uploadBytes(storageRef, file).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });
    };

    const mostrarModalInformacion = (dato) => {
        setForm(dato);
        descargararchivo(dato.nameImg);
        setModalinformacion(true);
    };

    const cerrarModalInformacion = () => {
        setModalinformacion(false);
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
            await deleteDoc(doc(db, "contratos", `${dato.id}`));
        }
    };
    const handleChange4 = (newValue) => {
        setFechainicio(newValue);
    };
    const handleChange5 = (newValue) => {
        setFechafinal(newValue);
    };

    const descargararchivo = (nombre) => {
        getDownloadURL(ref(storage, `contratos/${nombre}`)).then((url) => {
            console.log(url);
            setUrl(url);
        })
    };
    useEffect(() => {
        getData();
    }, [])

    return (
        <>
            <Container>
                <Typography component="div" variant="h3" className="princi3" >
                    CONTRATOS MANTENIMIENTO
                </Typography>
                <Button variant="contained"
                        className="boton-modal-g" onClick={() => mostrarModalInsertar()}>Agregar</Button>
                <Table className='table table-ligh table-hover'>
                    <Thead>
                        <Tr>
                            <Th>#</Th>
                            <Th>N. Contrato</Th>
                            <Th>Empresa</Th>
                            <Th>Fecha Final</Th>
                            {/* <Th>Descripción</Th> */}
                            <Th>Acciones</Th>
                            <Th>Información</Th>

                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.sort((a, b) => (a.indice - b.indice)).map((contrato, index) => (
                            <Tr key={contrato.indice} >
                                <Td>{index + 1}</Td>
                                <Td>{contrato.ncontrato}</Td>
                                <Td>{contrato.empresa}</Td>
                                <Td>{contrato.ffinal}</Td>
                                {/* <Td>{contrato.descripcion}</Td> */}
                                <Td>
                                    <Stack direction="row" spacing={2} alignitems="center" justifyContent="center" >
                                        <button className="btn btn-outline-danger" onClick={() => eliminar(contrato)}>Eliminar</button>
                                    </Stack>
                                </Td>
                                <Td>
                                    <IconButton aria-label="delete" color="gris" onClick={() => mostrarModalInformacion(contrato)}><InfoIcon /></IconButton>

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
                                INICIO CONTRATO:
                                </label>
                                <TextareaAutosize
                                                                style={{textTransform:"uppercase"}}
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="INICIO CONTRATO"
                                                                className="text-area-encargado"
                                                                name="finicio"
                                                                readOnly
                                                                value={form.finicio}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                EQUIPOS:
                                </label>
                                <TextareaAutosize
                                                                style={{textTransform:"uppercase"}}
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="EQUIPOS"
                                                                className="text-area-encargado"
                                                                name="equipos"
                                                                readOnly
                                                                value={form.equipos}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                DESCRIPCIÓN:
                                </label>
                                <TextareaAutosize
                                                                style={{textTransform:"uppercase"}}
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="DESCRIPCIÓN"
                                                                className="text-area-encargado"
                                                                name="descripcion"
                                                                readOnly
                                                                value={form.descripcion}
                                />
                            </Grid>
                            <Grid className="fila" item xs={12}>
                                {/* <label className="archivo">
                                    Archivo:
                                </label> */}
                                <a
                                    component="button"
                                    variant="body2"
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Visualizar Contrato
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

            <Modal className="{width:0px}" isOpen={modalInsertar}>
                <ModalHeader>
                    <div><h3>Insertar</h3></div>
                </ModalHeader>

                <ModalBody>
                    <FormGroup>
                        <Grid container spacing={4}>
                            <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Stack spacing={3}>
                                        <DateTimePicker
                                            label="Fecha Inicio"
                                            value={fechainicio}
                                            onChange={handleChange4}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </Stack>
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Stack spacing={3}>
                                        <DateTimePicker
                                            label="Fecha Final"
                                            value={fechafinal}
                                            onChange={handleChange5}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </Stack>
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                                                style={{textTransform:"uppercase"}}
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="Contrato"
                                                                className="text-area-encargado"
                                                                name="contrato"
                                                                onChange={(e) => { setNcontrato(e.target.value) }}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                            disableClearable
                         
                            id="combo-box-demo"
                            options={empresa2}
                            getOptionLabel={(option) => {
                                return option.empresa;
                              }}
                            onChange={(event, newvalue) => setEmpresa(newvalue.empresa)}
                            renderInput={(params) => <TextField {...params} fullWidth label="EMPRESA"  type="text" />}
                        />
                                {/* <TextareaAutosize
                                                                style={{textTransform:"uppercase"}}
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="Empresa"
                                                                className="text-area-encargado"
                                                                name="empresa"
                                                                onChange={(e) => { setEmpresa(e.target.value) }}/> */}
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                                                style={{textTransform:"uppercase"}}
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="Equipos"
                                                                className="text-area-encargado"
                                                                name="equipos"
                                                                onChange={(e) => { setEquipos(e.target.value) }}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                                                style={{textTransform:"uppercase"}}
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="Descripción"
                                                                className="text-area-encargado"
                                                                name="descripcion"
                                                                onChange={(e) => { setDescripcion(e.target.value) }}/>
                            </Grid>
                            <Grid item xs={12}>
                                <div className="mb-3">
                                    <label >Cargar Contrato</label>
                                    <input className="form-control" onChange={buscarImagen} type="file" id="formFile" />
                                </div>
                            </Grid>
                        </Grid>
                    </FormGroup>
                    {/* aqui termina el grid */}


                </ModalBody>

                <ModalFooter>

                    <Button
                    variant="outlined"
                    className="boton-modal-d"
                        onClick={() => sendData()}
                    >
                        Insertar
                    </Button>
                    <Button
                    variant="contained"
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



