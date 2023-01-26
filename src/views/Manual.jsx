import React, { useEffect, useState } from "react";
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Grid from "@mui/material/Grid";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { db, storage } from "../firebase/firebase-config";
import { collection, setDoc, query, doc, deleteDoc, onSnapshot } from "firebase/firestore";
import {
    Table,
    Container,
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    ModalFooter,
} from "reactstrap";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { v4 as uuidv4 } from 'uuid';

import { uploadBytes, ref, getDownloadURL } from "firebase/storage";


export default function Manual() {

    const [data, setData] = useState([]);
    const [modalInsertar, setModalinsertar] = useState(false);
    const [modalArchivo, setModalarchivo] = useState(false);
    const [equipos, setEquipos] = useState([]);
    const [equiposRegistrados, setEquiposRegistrados] = useState(false);
    const [codigosDisponibles, setCodigosDisponibles] = useState([]);
    const [deshabilitar, setDeshabilitar] = useState(false);
    const [currentManual, setCurrentManual] = useState(initial_data);
    const [equipo, setEquipo] = useState('');
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState("");




    const buscarArchivo = (e) => {
        if (e.target.files !== undefined) {
            setFile(e.target.files);
            console.log(e.target.files[0]);
        } else {
            console.log('no hay archivo');
        }

    };

    const getData = async () => {
        const reference = query(collection(db, "manuales"));
        onSnapshot(reference, (querySnapshot) => {
            setData(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
        });
        const reference2 = query(collection(db, "ingreso"));
        onSnapshot(reference2, (querySnapshot) => {
            setEquiposRegistrados(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            )
        });

        onSnapshot(doc(db, "informacion", "parametros"), (doc) => {
            setEquipos(doc.data().equipos)
        });
    };

    const sendData = async () => {
        var newId = uuidv4();
        var manual = {};
        var val = Date.now();
        if (file === null) {
            manual = {
                equipo: equipo,
                indice: val,
                manuales_ref: [no_img],
                id: newId,
            };
            await sendFirestore(manual);
        } else {
            let manual_urls = await sendStorage()
            manual = {
                equipo: equipo,
                indice: val,
                manuales_ref: manual_urls,
                id: newId,
            };
            await sendFirestore(manual);

        }
        setFile(null);
        cerrarModalInsertar();
        Swal.fire({
            icon: 'success',
            title: '¡Manual Agregado!',
            showConfirmButton: false,
            timer: 1500
          })
    };
    const ObtenerCodigo = (_value) => {
        let aux = equiposRegistrados.filter(item => item.equipo === _value).map(item => (item.codigo))
        setCodigosDisponibles(aux)
        setEquipo(_value)
    }
    const sendFirestore = async(manual) => {
        try {
            await setDoc(doc(db, "manuales",manual.id), manual);
            console.log("Manual agregada")
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const sendStorage = async () => {
        setDeshabilitar(true);
        let urls_manuales = []
        for (let i = 0; i < file.length; i++) {
            var storageRef = ref(storage, `manualequipos/${file[i].name}`);
            try {
                // eslint-disable-next-line no-loop-func
                let url2 = await uploadBytes(storageRef, file[i]).then((snapshot) => {
                    let url = getDownloadURL(storageRef).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        return downloadURL;
                    });
                    return url
                });
                urls_manuales.push(url2)
            } catch (error) {
                urls_manuales.push(no_img)
            }
        }
        setDeshabilitar(false);
        return urls_manuales
    };
    const mostrarModalInsertar = () => {
        setModalinsertar(true);
    };

    const cerrarModalInsertar = () => {
        setModalinsertar(false);
    };

    const mostrarModalArchivo = (dato) => {
        setModalarchivo(true);
        setCurrentManual(dato);
    };

    const cerrarModalArchivo = () => {
        setModalarchivo(false);
    };

    // const eliminar = async (dato) => {
    //     var opcion = window.confirm("Estás Seguro que deseas Eliminar el elemento " + dato.id);
    //     if (opcion === true) {
    //         await deleteDoc(doc(db, "manuales", `${dato.id}`));
    //         // setModalactualizar(false);
    //     }
    // };

    const eliminar =  (dato) => {
        Swal.fire({
          title:  "Eliminar Equipo",
          text: "¿Estás Seguro que deseas Eliminar al equipo?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí'
        }).then(async(result) => {
          if (result.isConfirmed) {
            await deleteDoc(doc(db, "manuales", `${dato.id}`));
            Swal.fire({
                icon: 'success',
                title: '¡Equipo Eliminado!',
                showConfirmButton: false,
                timer: 1500
              })
          }
        })
       
      };


    useEffect(() => {
        getData();
    }, [])
    return (
        <>
            <Container>
                <Stack direction="row" spacing={2} alignitems="center" justifyContent="center" >
                    <Button variant="outlined" onClick={() => mostrarModalInsertar()}>Agregar Manual</Button>
                </Stack>
                <br />
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
            
                            <th>Equipo</th>
                            <th>Archivo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.sort((a, b) => (a.indice - b.indice)).map((manual, index) => (
                            <tr key={manual.indice} >
                                <td>{index + 1}</td>
                              
                                <td>{manual.equipo}</td>
                                <td>
                                    <IconButton aria-label="delete" color="gris" onClick={() => mostrarModalArchivo(manual)}><InfoIcon /></IconButton>
                                </td>
                                <td>
                                    <Stack direction="row" spacing={2} alignitems="center" justifyContent="center" >
                                        {/* <Button color="danger" onClick={() => eliminar(manual)}>Eliminar</Button> */}
                                        <button className="btn btn-outline-danger" onClick={() => eliminar(manual)}>Eliminar</button>
                                    </Stack>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
            <Modal className="{width:0px}" isOpen={modalInsertar}>
                <ModalHeader>
                    <div><h3>Insertar</h3></div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={2}>
                        <Grid item xs={12} >
                            <Autocomplete
                                disableClearable
                                id="combo-box-demo"
                                options={equipos}
                                getOptionLabel={(option) => {
                                    return option.nombre;
                                }}
                                onChange={(event, newvalue) => ObtenerCodigo(newvalue.nombre)}
                                fullWidth
                                renderInput={(params) => <TextField {...params} fullWidth label="Tipo de equipo" type="text" />}
                            />
                        </Grid>
                        {/* <Grid item xs={12}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    options={codigosDisponibles}
                                    onChange={setCequipo}
                                    fullWidth
                                    renderInput={(params) => <TextField {...params} fullWidth label="Codigo" type="text" />}
                                />
                            </Grid> */}
                        <Grid item xs={12}>
                            <div >
                                <label className="form-label">Cargar Manual</label>
                                <input className="form-control" onChange={buscarArchivo} multiple="multiple" type="file" id="formFile" />
                            </div>
                        </Grid>
                    </Grid>


                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="outlined"
                        onClick={() => sendData()}
                        sx={{
                            marginRight: 2
                        }}
                    >
                        Insertar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => cerrarModalInsertar()}
                    >
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalArchivo}>
                <ModalHeader>
                    <div><h1>Informacion Manual</h1></div>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Grid container spacing={4}>
                            <Grid className="fila" item xs={12}>
                                <label className="archivo">
                                    Archivos Disponibles:
                                </label>
                                <ul>
                                 {currentManual.manuales_ref.map((item,index)=>(

                                 <li key={index}><a
                                    component="button"
                                    variant="body2"
                                    href={item}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Visualizar Manual
                                </a></li>

                                 ))}
                 
                                </ul>
                                
                            </Grid >
                        </Grid>
                    </FormGroup>

                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="contained"
                        onClick={() => cerrarModalArchivo()}
                    >
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={deshabilitar}

            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}
const no_img = "https://firebasestorage.googleapis.com/v0/b/app-mantenimiento-91156.appspot.com/o/inventario%2FSP.PNG?alt=media&token=835f72e6-3ddf-4e64-bd7c-b95564da4ec8"
const initial_data = {
    equipo: "",
    indice: "",
    manuales_ref: [no_img],
    id: "",
};