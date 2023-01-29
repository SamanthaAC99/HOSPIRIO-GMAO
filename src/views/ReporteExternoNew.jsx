import React, { useEffect, useState, useRef } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { collection, setDoc, query, doc, deleteDoc, onSnapshot, updateDoc,addDoc,getDoc} from "firebase/firestore";
import Grid from "@mui/material/Grid";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { db, storage } from "../firebase/firebase-config";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import '../css/Tabla.css';
import '../css/Compras.css';
import '../css/Presentacion.css';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export default function Contactosempresas() {
    const [data, setData] = useState([]);
    const [modalInsertar, setModalinsertar] = useState(false);
    const [modalInformacion, setModalinformacion] = useState(false);
    const [empresa, setEmpresa] = useState('');
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState("");
    const [form, setForm] = useState({});
    const reportes =  useRef([])
    const [empresa2, setEmpresa2] = useState([]);
    const [cequipo, setCequipo] = useState("");
    const equipos = useRef([])
    const [nombresEquipos,setNombresEquipos] = useState([])
    const [codigosEquipos,setCodigosEquipos] = useState([]);
    const [codigo,setCodigo] = useState("");
    const [time1, setTime1] = useState(new Date('Sat Dec 31 2022 24:00:00 GMT-0500'));
    const [time2, setTime2] = useState(new Date('Sun Dec 31 2023 23:59:59 GMT-0500'));
    const [codigoe, setCodigoe] = useState("");
    const [codigosEquipo, setCodigosEquipo] = useState([]);
    const [inventario, setInventario] = useState([]);
    const [rtmantenimiento, setRtmantenimiento] = useState("");
    const [estadof, setEstadof] = useState('');
    const [btnReport, setBtnReport] = useState(false);
    const [modalEditarReporte,setModalEditarReporte] = useState(false);
    const [modalReportexistente, setModalReportexistente] = useState(false);
    const [currentReporte, setCurrentReporte] = useState({});
    const [reset,setReset] = useState(false);
    const [nreporte, setNreporte] = useState({
        nombreT: '',
        codigoe: '',
        equipo: '',
        tmantenimiento: '',
        costo: '',
        falla: '',
        causas: '',
        actividadesR: [],
        repuestos: '',
        observaciones: '',
        fecha: '',
        tiempo: '',
        horas: '',
        horasi:'',
        min:'',
        tipo: "Externo",
        imgreporte: '',
    });

    const getData = async () => {
      const refe3 = query(collection(db, "reportesext"));
        onSnapshot(refe3, (querySnapshot) => {
            let temp = querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            setData(temp);
            reportes.current = temp
        });
        const reference = query(collection(db, "ingreso"));
        onSnapshot(reference, (querySnapshot) => {
            var inventarioD = [];
            querySnapshot.forEach((doc) => {
                inventarioD.push(doc.data());
            });
            var codigos = inventarioD.map(item => item.codigo)
            setInventario(inventarioD);
            setCodigosEquipo(codigos);

        });
        const refe = query(collection(db, "empresas"));
        onSnapshot(refe, (querySnapshot) => {
            setEmpresa2(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
        });
    
        onSnapshot(doc(db, "informacion", "parametros"), (doc) => {
            setNombresEquipos(doc.data().equipos)
          });
          const refe4 = query(collection(db, "ingreso"));
          onSnapshot(refe4, (querySnapshot) => {

             equipos.current = querySnapshot.docs.map((doc) => ({ ...doc.data() }))
           
          });
    };
    const SelectFecha1 = (newValue) => {
        setTime1(newValue);
    };
    const SelectFecha2 = (newValue) => {
        setTime2(newValue);
    };

    const filteryByDateReportes = (_reporte) => {
        //console.log(ordenes)
        const aux1 = new Date(time1)
        const fechaInicio = aux1.getTime()
        const aux2 = new Date(time2)
        const fechaFinal = aux2.getTime()
        const fechaOrden = new Date(_reporte.indice).getTime()

        if (fechaOrden >= fechaInicio && fechaOrden <= fechaFinal) {
            return _reporte
        } else {
            return null;
        }
    }
    const filtrobyCodigo =(_reporte)=>{
      
        if (_reporte.codigoe === codigo) {
            return _reporte
        }
        else {
            return null;
        }   
}
const seleccionarEquipo =(_data)=> {
    let aux = equipos.current.filter(item =>  item.equipo === _data).map(item => (item.codigo))
    setCodigosEquipos(aux)
}

    const filtrarReportes = () =>{
        let aux = JSON.parse(JSON.stringify(reportes.current))
        if (codigo!==""){
        let datos_filtrados = aux.filter(filteryByDateReportes).filter(filtrobyCodigo)
        setData(datos_filtrados)
        setReset(!reset);
        setCodigo("") } else{
        let datos_filtrados = JSON.parse(JSON.stringify(reportes.current))
        setData(datos_filtrados)
        setReset(!reset);
        console.log(datos_filtrados)
        }
    }

    const ActualizarReporte=()=>{
    let horasAux=parseInt(currentReporte.horasi)
    console.log("hor",horasAux)
    let minAux=parseInt(currentReporte.min)
    console.log("min",minAux)
    let tiempom=minAux/60
    let h=(horasAux+tiempom).toFixed(2);
    console.log("h",h)  

    
    // const ref = doc(db, "reportesext", `${currentReporte.id}`);
    //     updateDoc(ref, {
    //         horas:h,
    //         nombreT:empresa,
    //         estadof:estadof,
    //         tmantenimiento:rtmantenimiento,
    //         costo: currentReporte.costo,
    //         horasi:currentReporte.horasi,
    //         min:currentReporte.min,
    //         falla:currentReporte.falla,
    //         causas:currentReporte.causas,
    //         actividadesR:currentReporte.actividadesR,
    //         repuestos:currentReporte.repuestos,
    //         observaciones:currentReporte.observaciones,
    //     });
    //     setModalEditarReporte(false)
        
    //     Swal.fire({
    //         icon: 'warning',
    //         title: '¡Reporte Actualizado!',
    //         showConfirmButton: false,
    //         timer: 2000

    //     })
        
    }

    const obtenerUrlPhoto = (uid) => {
        getDownloadURL(ref(storage, `externos/${uid}`)).then((url) => {
          console.log(url);
          const reference2 = doc(db, "reportesext", `${uid}`);
          updateDoc(reference2, {
              imgreporte: url
          });
          console.log(url);
        })
      };
      const cambiarDatosReporte = (event)=>{
        setCurrentReporte({
            ...currentReporte,
            [event.target.name]: event.target.value,
        });
    }
      const sendReportFirebase = async () => {
        const re = nreporte;
        re['nombreT'] = empresa;
        re['equipo'] = cequipo;
        re['codigoe'] = codigoe;
        re['tmantenimiento'] = rtmantenimiento;
        re['estadof'] = estadof;
        re['fecha'] = new Date().toLocaleDateString();
        console.log(re)
        const newReporte = await addDoc(collection(db, "reportesext"), re);
        if (newReporte.id !== null) {
            console.log(newReporte.id)
            const reference2 = doc(db, "reportesext", `${newReporte.id}`);
            updateDoc(reference2, {
                id: newReporte.id,
            });
            sendStorage(newReporte.id)
       
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se agrego el reporte a la orden',
            })
        }
    }

    const sendStorage = (cod) => {
        //pasar parametros variables
        if (file == null) {
            const reference2 = doc(db, "reportesext", `${cod}`);
            updateDoc(reference2, {
                imgreporte: 'https://firebasestorage.googleapis.com/v0/b/app-mantenimiento-91156.appspot.com/o/orden%2FSP.PNG?alt=media&token=a607ce4a-5a40-407c-ac03-9cd6a771e0d1'
            });
        } else {
            const storageRef = ref(storage, `externos/${cod}`);
            uploadBytes(storageRef, file).then((snapshot) => {
                console.log('Uploaded a blob or file!', snapshot);
                //setUrlimg(snapshot.url)
                obtenerUrlPhoto(cod)
            });

        }

    };

    const buscarImagen = (e) => {
        if (e.target.files[0] !== undefined) {
            setFile(e.target.files[0]);
            console.log(e.target.files[0]);
        } else {
            console.log('no hay archivo');
        }
    };

   
    const mostrarModalInsertar = () => {
        setModalinsertar(true);
    };

    const cerrarModalInsertar = () => {
        setModalinsertar(false);
    };

    const eliminar = async (dato) => {
        Swal.fire({
            title: '¿Deseas eliminar el reporte?',
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!'
          }).then((result) => {
            if (result.isConfirmed) {
                 deleteDoc(doc(db, "reportesext", `${dato.id}`));
                Swal.fire(
                  "¡Reporte Eliminado!",
                  '',
                  'success'
                  )
            }
          })
    };
  

    const crearReporte = async () => {
        let horasAux=parseInt(nreporte.horasi)
        let minAux=parseInt(nreporte.min)
       let tiempom=minAux/60
       let h=(horasAux+tiempom).toFixed(2);
       const re = nreporte;
       re['nombreT'] = empresa;
       re['equipo'] = cequipo;
       re['codigoe'] = codigoe;
       re['tmantenimiento'] = rtmantenimiento;
       re['estadof'] = estadof;
       re['fecha'] = new Date().toLocaleDateString();
       re['horas']=h
       re['tiempo'] = `${horasAux}h${Math.round(minAux)}m`
       console.log(re)
       const newReporte = await addDoc(collection(db, "reportesext"), re);
        if (newReporte.id !== null) {
            console.log(newReporte.id)
            const reference2 = doc(db, "reportesext", `${newReporte.id}`);
            updateDoc(reference2, {
                id: newReporte.id,
            });
            sendStorage(newReporte.id)
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se agrego el reporte a la orden',
            })
        }
    }
    const selectEquipo = (val) => {
        console.log(val);
        const equipos = inventario.find(item => item.codigo === val)
        setCequipo(equipos.equipo);
        setCodigoe(val);
        console.log(equipos.equipo)

    }

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

    const createReport = (event) => {
        setNreporte({
            ...nreporte,
            [event.target.name]: event.target.value,
        });
    }
    const mostrarModalInformacion = (dato) => {
        setModalReportexistente(true);
        setCurrentReporte(dato);
    };

    const cerrarModalInformacion = () => {
        setModalinformacion(false);
    };

    const EditarReporte= async(_data)=>{    
                setCurrentReporte(_data);
                setModalEditarReporte(true);
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <>
            <Container>
                <Typography component="div" variant="h4" className="princi3" >
                    REPORTES EXTERNOS
                </Typography>
                <Grid container spacing={2} >
                    <Grid item xs={12} md={12} sm={3}>
                        <Button variant="contained"
                            className="boton-modal-d"
                            onClick={() => mostrarModalInsertar()}>Agregar Reporte
                        </Button>
                    </Grid>
                    <Grid item xs={2.4}>
                <Autocomplete
                            disableClearable
                            key={reset}
                            id="combo-box-demo"
                            options={nombresEquipos}
                            getOptionLabel={(option) => {
                                return option.nombre;
                              }}
                            onChange={(event, newvalue) => seleccionarEquipo(newvalue.nombre)}
                            renderInput={(params) => <TextField {...params} fullWidth label="EQUIPO"  type="text" />}
                        />
                </Grid >
                <Grid item xs={2.4}>
                <Autocomplete
                            disableClearable
                            key={reset}
                            id="combo-box-demo"
                            options={codigosEquipos}
                            onChange={(event, newvalue) => setCodigo(newvalue)}
                            renderInput={(params) => <TextField {...params} fullWidth label="CODIGO"  type="text"  />}
                        />
                </Grid >
                   <Grid item xs={12} sm={12} md={2.4}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                label={"Desde"}
                                inputFormat="MM/dd/yyyy"
                                value={time1}
                                onChange={SelectFecha1}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2.4}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                label={"Hasta"}
                                inputFormat="MM/dd/yyyy"
                                value={time2}
                                onChange={SelectFecha2}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                    </Grid>
                <Grid item xs={2.4}>
                <Button  variant="contained" className="boton-gestion" onClick={filtrarReportes}  endIcon={<FilterAltIcon />}>
                        Filtrar
                    </Button>
                </Grid >
                </Grid>
                <br />
                <Table className='table table-ligh table-hover'>
                    <Thead>
                        <Tr>
                            <Th>#</Th>
                            <Th>Fecha</Th>
                            <Th>T. Mantenimiento</Th>
                            <Th>Empresa</Th>
                            <Th>Equipo</Th>
                            <Th>Código</Th>
                            <Th>Acciones</Th>

                        </Tr>
                    </Thead>

                    <Tbody>
                        {data.sort((a, b) => (a.indice - b.indice)).map((contactos, index) => (
                            <Tr key={contactos.indice} >
                                <Td>{index + 1}</Td>
                                <Td>{contactos.fecha}</Td>
                                <Td>{contactos.tmantenimiento}</Td>
                                <Td>{contactos.nombreT}</Td>
                                <Td>{contactos.equipo}</Td>
                                <Td>{contactos.codigoe}</Td>
                                <Td>
                                    <Stack direction="row" spacing={2} alignitems="center" justifyContent="center" >
                                    <IconButton aria-label="delete" onClick={() => mostrarModalInformacion(contactos)} color="rosado">
                                                                <RemoveRedEyeIcon />
                                                            </IconButton>
                                                            <IconButton aria-label="delete" onClick={() =>EditarReporte(contactos) } color="warning">
                                                                <EditIcon />
                                                            </IconButton>
                                                            <IconButton aria-label="delete" onClick={() => eliminar(contactos)} color="rojo">
                                                                <DeleteIcon />
                                                            </IconButton>
                                    </Stack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Container>

            <Modal className="{width:0px}" isOpen={modalInsertar}>
                <ModalHeader>
                    <div><h3>Insertar</h3></div>
                </ModalHeader>

                <ModalBody>
                    <FormGroup>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Autocomplete
                                    disableClearable
                                    
                                    id="combo-box-demo"
                                    options={empresa2}
                                    getOptionLabel={(option) => {
                                        return option.empresa;
                                    }}
                                    onChange={(event, newvalue) => setEmpresa(newvalue.empresa)}
                                    renderInput={(params) => <TextField {...params} fullWidth label="EMPRESA" type="text" />}
                                />
                            </Grid>
                            <Grid item xs={6}>

<Autocomplete
    disableClearable
    id="combo-box-demo"
    className='seleccionadortabla'

    onChange={(event, newValue) => {
        selectEquipo(newValue);
    }}
    value={codigoe}
    options={codigosEquipo}
    renderInput={(params) => <TextField {...params} fullWidth label="CÓDIGO EQUIPO" type="text" />}
/>
</Grid>
<Grid item xs={6}>
                                <TextField id="outlined-basic" label="EQUIPO" variant="outlined" InputProps={{ readOnly: true }} value={cequipo} fullWidth />
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    className='seleccionadortabla'

                                    onChange={(event, newValue) => {
                                        setRtmantenimiento(newValue);
                                    }}
                                    options={["PREVENTIVO", "CORRECTIVO"]}

                                    renderInput={(params) => <TextField name="tmantenimiento"  {...params} fullWidth label="T.MANTENIMIENTO" type="text" />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic" name="costo" onChange={createReport} label="COSTO" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic" name="horasi" onChange={createReport} label="HORAS" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic" name="min" onChange={createReport} label="MINUTOS" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    className='seleccionadortabla'

                                    onChange={(event, newValue) => {
                                        setEstadof(newValue);
                                    }}
                                    options={["ARREGLADO", "REPARADO"]}

                                    renderInput={(params) => <TextField name="estadof"  {...params} fullWidth label="ESTADO" type="text" />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    style={{textTransform:"uppercase"}} 
                                    aria-label="minimum height"
                                    minRows={1}
                                    placeholder="Falla"
                                    className="text-area-encargado"
                                    name="falla"
                                    onChange={createReport} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    style={{textTransform:"uppercase"}} 
                                    aria-label="minimum height"
                                    minRows={1}
                                    placeholder="Causas"
                                    className="text-area-encargado"
                                    name="causas"
                                    onChange={createReport}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    style={{textTransform:"uppercase"}} 
                                    aria-label="minimum height"
                                    minRows={1}
                                    placeholder="Actividades"
                                    className="text-area-encargado"
                                    name="actividadesR"
                                    onChange={createReport}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    style={{textTransform:"uppercase"}} 
                                    aria-label="minimum height"
                                    minRows={1}
                                    placeholder="Repuestos"
                                    className="text-area-encargado"
                                    name="repuestos"
                                    onChange={createReport}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    style={{textTransform:"uppercase"}} 
                                    aria-label="minimum height"
                                    minRows={1}
                                    placeholder="Observaciones"
                                    className="text-area-encargado"
                                    name="observaciones"
                                    onChange={createReport}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <label> Cargar reporte físico:</label>
                                <input className="form-control " onChange={buscarImagen} type="file" id="formFile" />
                            </Grid>
                        </Grid>
                    </FormGroup>
                </ModalBody>

        
                <ModalFooter>
                    <Button     variant="outlined"
                          className="boton-modal-d2"
                        onClick={crearReporte}>Añadir</Button>
                    <Button
                               variant="contained"
                               className="boton-modal-d"
                        onClick={() => cerrarModalInsertar()}
                    >
                        Cancelar
                    </Button>

                </ModalFooter>
            </Modal>



            <Modal isOpen={modalReportexistente}>
                    <ModalHeader>
                        <div><h1>Ver Reporte Externo</h1></div>
                    </ModalHeader>
                    <ModalBody>
                        <Grid container spacing={2}>
                        <Grid item xs={12}>
                                            <div className="name-outlined">{currentReporte.id}</div>
                                        </Grid >
                                        <Grid item xs={12}>
                                <label>
                                    <b>Estado:  </b>
                                    {currentReporte.estadof}
                                </label>
                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Empresa: </b>
                                    {currentReporte.nombreT}
                                </label>
                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Equipo:  </b>
                                    {currentReporte.equipo}
                                </label>
                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Código Equipo:  </b>
                                    {currentReporte.codigoe}
                                </label>
                            </Grid >
                            <Grid item xs={12}>
                                            <label>
                                                <b>Tipo de mantenimiento:  </b>
                                                {currentReporte.tmantenimiento}
                                            </label>
                                        </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Duración:  </b>
                                    {currentReporte.tiempo}
                                </label>
                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Costo:  </b>
                                    {currentReporte.costo}
                                </label>
                            </Grid >
                            <Grid item xs={12}>
                                            <label>
                                                <b>Falla:  </b>
                                            </label>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={1}
                                                placeholder="Falla"
                                                className="text-area-encargado"
                                                name="falla"
                                                readOnly
                                                value={currentReporte.falla} />

                                        </Grid >
                                        <Grid item xs={12}>
                                            <label>
                                                <b>Causas:  </b>
                                            </label>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={1}
                                                placeholder="Causa"
                                                className="text-area-encargado"
                                                name="causa"
                                                readOnly
                                                value={currentReporte.causas} />

                                        </Grid >
                                        <Grid item xs={12}>
                                            <label>
                                                <b>Actividades:  </b>
                                            </label>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={1}
                                                placeholder="Actividades"
                                                className="text-area-encargado"
                                                name="actividadesR"
                                                readOnly
                                                value={currentReporte.actividadesR} />
                                        </Grid >
                                        <Grid item xs={12}>
                                            <label>
                                                <b>Repuestos:  </b>
                                            </label>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={1}
                                                placeholder="Repuestos"
                                                className="text-area-encargado"
                                                name="repuestos"
                                                readOnly
                                                value={currentReporte.repuestos} />
                                        </Grid >

                                        <Grid item xs={12}>
                                            <label>
                                                <b>Observaciones:  </b>
                                            </label>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={1}
                                                placeholder="Observaciones"
                                                className="text-area-encargado"
                                                name="observaciones"
                                                readOnly
                                                value={currentReporte.observaciones} />
                                        </Grid >
                        </Grid>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                           variant="contained"
                           className="boton-modal-d"
                            onClick={() => { setModalReportexistente(false) }}
                        >
                            Cerrar
                        </Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={modalEditarReporte}>
                    <ModalHeader>
                        <div><h5>Editar Reporte Externo</h5></div>
                    </ModalHeader>
                    <ModalBody>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    className='seleccionadortabla'
                                    name="tmantenimiento"
                                    defaultValue={currentReporte.tmantenimiento}
                                    onChange={(event, newValue) => {
                                        setRtmantenimiento(newValue);
                                    }}
                                    options={["PREVENTIVO", "CORRECTIVO"]}
                                    renderInput={(params) => <TextField   {...params} fullWidth label="T.MANTENIMIENTO" type="text" />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField inputProps={{ style: { textTransform: "uppercase"} }} id="outlined-basic" value={currentReporte.costo} name="costo"   onChange={cambiarDatosReporte} label="COSTO" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField inputProps={{ style: { textTransform: "uppercase"} }} id="outlined-basic" value={currentReporte.horasi} name="horasi"   onChange={cambiarDatosReporte} label="HORAS" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField inputProps={{ style: { textTransform: "uppercase"} }} id="outlined-basic" value={currentReporte.min} name="min"   onChange={cambiarDatosReporte} label="MINUTOS" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    className='seleccionadortabla'
                                    name="estadof" 
                                    defaultValue={currentReporte.estadof}
                                    onChange={(event, newValue) => {
                                        setEstadof(newValue);
                                    }}
                                    options={["ARREGLADO", "REPARADO"]}

                                    renderInput={(params) => <TextField  {...params} fullWidth label="ESTADO" type="text" />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <strong>FALLA:</strong>
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    style={{textTransform:"uppercase"}} 
                                    aria-label="minimum height"
                                    minRows={2}
                                    placeholder="Falla"
                                    className="text-area-encargado"
                                    name="falla"
                                    value={currentReporte.falla}
                                    onChange={cambiarDatosReporte} />
                            </Grid>
                            <Grid item xs={12}>
                                <strong>CAUSAS:</strong>
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    style={{textTransform:"uppercase"}} 
                                    aria-label="minimum height"
                                    minRows={2}
                                    placeholder="Causas"
                                    className="text-area-encargado"
                                    name="causas"
                                    value={currentReporte.causas}
                                    onChange={cambiarDatosReporte}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <strong>ACTIVIDADES:</strong>
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    style={{textTransform:"uppercase"}} 
                                    aria-label="minimum height"
                                    minRows={2}
                                    placeholder="Actividades"
                                    className="text-area-encargado"
                                    name="actividadesR"
                                    value={currentReporte.actividadesR}
                                    onChange={cambiarDatosReporte}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <strong>REPUESTOS:</strong>
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    style={{textTransform:"uppercase"}} 
                                    aria-label="minimum height"
                                    minRows={2}
                                    placeholder="Repuestos"
                                    className="text-area-encargado"
                                    name="repuestos"
                                    value={currentReporte.repuestos}
                                    onChange={cambiarDatosReporte}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <strong>OBSERVACIONES:</strong>
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    style={{textTransform:"uppercase"}} 
                                    aria-label="minimum height"
                                    minRows={2}
                                    placeholder="Observaciones"
                                    className="text-area-encargado"
                                    name="observaciones"
                                    value={currentReporte.observaciones}
                                    onChange={cambiarDatosReporte}
                                />
                            </Grid>
                        </Grid>

                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outlined"
                            className="boton-modal-d2"
                            disabled={btnReport} onClick={ActualizarReporte}>Añadir</Button>
                        <Button
                            variant="contained"
                            className="boton-modal-d"
                            onClick={()=>{setModalEditarReporte(false)}}
                        >
                            Cancelar
                        </Button>

                    </ModalFooter>
                </Modal>
        </>
    );
}

