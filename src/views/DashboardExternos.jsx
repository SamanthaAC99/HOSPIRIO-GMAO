import { useSelector } from "react-redux";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { collection, query, doc, updateDoc, onSnapshot, addDoc, getDoc } from "firebase/firestore";
import { db, storage } from "../firebase/firebase-config"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { uploadBytes, ref,getDownloadURL} from "firebase/storage";
import Stack from '@mui/material/Stack';
import { pink, cyan, lightGreen, orange } from '@mui/material/colors';
import { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import EngineeringIcon from '@mui/icons-material/Engineering';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import Autocomplete from '@mui/material/Autocomplete';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import TarjetaDashboard from "../components/TarjetaDashBoard";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Swal from 'sweetalert2';
import Button from '@mui/material/Button';
import {
    Container,
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    ModalFooter,
} from "reactstrap";
import { Grid } from "@mui/material";
import '../css/EncargadoView.css'



export default function DashboardExternos() {
    const currentUser = useSelector(state => state.auths);
    const [user, setUser] = useState({});
    const [modalEditarReporte,setModalEditarReporte] = useState(false);
    const [ordenesTecnico, setOrdenesTecnico] = useState([]);
    const [modalPendientes, setModalPendientes] = useState(false);
    const [codigosEquipo, setCodigosEquipo] = useState([]);
    const [estado, setEstado] = useState('');
    const [ctdPendientes, setCtdPendientes] = useState(0);
    const [estadof, setEstadof] = useState('');
    const [ctdSolventadas, setCtdSolventadas] = useState(0);
    const [ctdActivas, setCtdActivas] = useState(0);
    const [modalInformacion2, setModalinformacion2] = useState(false);
    const [currentForm, setCurrentForm] = useState({});
    const [modalReportexistente, setModalReportexistente] = useState(false);
    const [modalReportin, setModalReportin] = useState(false);
    const [currentOrden, setCurrentOrden] = useState([]);
    const [inventario, setInventario] = useState([]);
    const [cequipo, setCequipo] = useState("");
    const [codigoe, setCodigoe] = useState("");
    const [file, setFile] = useState(null);
    const [rtmantenimiento, setRtmantenimiento] = useState("");
    const [btnReport, setBtnReport] = useState(false);
    const [currentReporte, setCurrentReporte] = useState({});
    const [urlimg, setUrlimg] = useState("");
    const [nreporte, setNreporte] = useState({
        OrdenId: '',
        cedula: '',
        nombreT: '',
        falla: '',
        id: '',
        codigoe: '',
        estado: '',
        estadof: '',
        equipo: '',
        tmantenimiento: '',
        costo: '',
        causas: '',
        actividadesR: [],
        repuestos: '',
        observaciones: '',
        fecha: '',
        departamento: '',
        razonp: '',
        tiempo: '',
        horas: 0,
        tipo: "Interno",
        imgreporte: '',
    });
    const play = async (data) => {
        if (data.encargado.id === currentUser.uid) {
            const reference = doc(db, "ordenes", `${data.id}`);
            console.log(data.encargado.id)
            console.log(currentUser.uid)
            var tiempos = data.tiempos;
            console.log(tiempos)
            var someDate = Math.round(Date.now() / 1000);
            tiempos.push(someDate);

            await updateDoc(reference, {
                play: true,
                pause: false,
                tiempos: tiempos,
            });

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Acceso Denegado',
            })
        }
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

    const ActualizarReporte=()=>{

        const ref = doc(db, "reportesint", `${currentReporte.id}`);
        updateDoc(ref, {
            tmantenimiento:rtmantenimiento,
            costo: currentReporte.costo,
            falla:currentReporte.falla,
            causas:currentReporte.causas,
            actividadesR:currentReporte.actividadesR,
            repuestos:currentReporte.repuestos,
            observaciones:currentReporte.observaciones,
        });
        setModalEditarReporte(false)
        
        Swal.fire({
            icon: 'warning',
            title: '¡Actividad Actualizada!',
            showConfirmButton: false,
            timer: 2000

        })
        
    }

    const calcularHoras = (data) => {
        const arreglo = data
        var inicio = []
        var final = []
        var longitud = arreglo.length;
        for (var i = 0; i < longitud; i++) {
            if ((i % 2) === 0 || i === 0) {
                inicio.push(arreglo[i])
            } else {
                final.push(arreglo[i])
            }
        }
        const temp1 = 0;
        const hinicio = inicio.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            temp1
        );
        const temp2 = 0;
        const hfinal = final.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            temp2
        );
        const horas = (hfinal - hinicio) / 3600
        return horas

    }

    const calcularTiempos = (data) => {
        const arreglo = data
        var inicio = []
        var final = []
        var longitud = arreglo.length;
        for (var i = 0; i < longitud; i++) {
            if ((i % 2) === 0 || i === 0) {
                inicio.push(arreglo[i])
            } else {
                final.push(arreglo[i])
            }
        }
        const temp1 = 0;
        const hinicio = inicio.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            temp1
        );
        const temp2 = 0;
        const hfinal = final.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            temp2
        );

        const t = (hfinal - hinicio) / 3600
        const horas = Math.trunc(t)
        const decimales = t - (Math.floor(t))
        const minutos = decimales * 60
        const tiempo = `${horas}h${Math.round(minutos)}m`
        return tiempo

    }
    const abrirModalReporte = (data) => {
        if (data.encargado.id === currentUser.uid) {
            if (data.reporte === true) {
                setBtnReport(true);
            } else {
                setBtnReport(false);
            }
            setModalReportin(true);
            setCurrentOrden(data);
            console.log(codigosEquipo);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Acceso Denegado',
            })
        }
    }
    const cerrarModalReporte = () => {
        setModalReportin(false);
    }

    const pause = async (data) => {
        await Swal.fire({
            title: 'Seleccione el motivo de la pausa',
            input: 'select',
            inputOptions: {
                'Suspendida': 'Suspendida',
                'Repuestos': 'Espera de Repuestos',
                'Disposicion': 'Disp. Área',
                'Autorizacion': 'Autorización'
            },
            inputPlaceholder: 'Motivo',
            showCancelButton: true,
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    if (value === '') {
                        resolve('Necesita seleccionar una opción')
                    } else {
                        resolve()
                        const reference = doc(db, "ordenes", `${data.id}`);
                        var tiempos = data.tiempos;
                        var razonparada = data.mparada;
                        razonparada.push(value);
                        var someDate = Math.round(Date.now() / 1000);
                        tiempos.push(someDate);


                        updateDoc(reference, {
                            play: false,
                            pause: true,
                            tiempos: tiempos,
                            mparada: razonparada,
                            razonp: value,
                        });
                        Swal.fire({
                            icon: 'warning',
                            title: '¡Actividad en Espera!',
                            showConfirmButton: false,
                            timer: 2000

                        })
                    }
                })
            }
        })



    }


    const stop = (data) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger mx-3'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: '¿Deseas finalizar la actividad?',
            text: "Al finalizar la actividad no podrás editarla nuevamente!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, terminar!',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                var razonfinal = ""
                var tiempos = data.tiempos;
                var someDate = Math.round(Date.now() / 1000);
                tiempos.push(someDate);
                var horas = calcularHoras(tiempos);
                var horasminutos = calcularTiempos(tiempos);
                if (data.mparada.length === 0) {
                    razonfinal = "Sin Interrupción"
                } else {
                    razonfinal = data.mparada.pop()
                }
                const reference = doc(db, "ordenes", `${data.id}`);
                updateDoc(reference, {
                    play: true,
                    pause: true,
                    estado: "Solventado",
                    razonp: razonfinal,
                    tiempos: tiempos,
                    tiempot: horasminutos,
                    horat: horas,
                });
                swalWithBootstrapButtons.fire(
                    'Felicidades!',
                    'Acitividad Finalizada',
                    'success'

                )
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Cancelado',
                    'Puedes continuar trabajando en la actividad',
                    'error'
                )
            }
        })

    }

    const getData = () => {

        onSnapshot(doc(db, "usuarios", currentUser.uid), (doc) => {
            setUser(doc.data());
            updateOrdenes(doc.data());

        });
        const reference = query(collection(db, "ingreso"));
        onSnapshot(reference, (querySnapshot) => {
            var inventarioD = [];
            querySnapshot.forEach((doc) => {
                inventarioD.push(doc.data());
            });
            var codigos = inventarioD.map(item => item.codigo)
            console.log(codigos);
            setInventario(inventarioD);
            setCodigosEquipo(codigos);

        });



    }

    const selectEquipo = (val) => {
        console.log(val);
        const equipos = inventario.find(item => item.codigo === val)
        setCequipo(equipos.equipo);
        setCodigoe(val);
        console.log(equipos.equipo)

    }
    const filterbyId = (item) => {
        if (user.tareas.includes(item.id)) {
            return item;
        } else {
            return
        }
    }

    const filterStateSolventadas = (state) => {
        if (state.estado === "Solventado") {
            return state;
        } else {
            return
        }
    }

    const filterStateIniciadas = (state) => {
        if (state.estado === "Iniciada") {
            return state;
        } else {
            return
        }
    }

    const createReport = (event) => {
        setNreporte({
            ...nreporte,
            [event.target.name]: event.target.value,
        });
    }



    const sendReportFirebase = async () => {
        const re = nreporte;
        re['OrdenId'] = currentOrden.id;
        re['cedula'] = currentUser.indentification;
        re['nombreT'] = currentUser.name + ' ' + currentUser.lastname + ' ' + currentUser.secondlastname;
        re['equipo'] = cequipo;
        re['codigoe'] = codigoe;
        re['tmantenimiento'] = rtmantenimiento;
        re['estado'] = estado;
        re['estadof'] = estadof;
        re['fecha'] = new Date().toLocaleDateString();
        re['departamento'] = currentOrden.departamento;
        re['razonp'] = currentOrden.razonp;
        re['horas'] = calcularHoras(currentOrden.tiempos);
        re['tiempo'] = calcularTiempos(currentOrden.tiempos);
        console.log(re)
        const newReporte = await addDoc(collection(db, "reportesext"), re);
        if (newReporte.id !== null) {
            console.log(newReporte.id)
            var reportesID = currentOrden.reporteId
            reportesID.push(newReporte.id)
            const reference2 = doc(db, "reportesext", `${newReporte.id}`);
            updateDoc(reference2, {
                id: newReporte.id,
            });
            sendStorage(newReporte.id)
            const reference = doc(db, "ordenes", `${currentOrden.id}`);
            updateDoc(reference, {
                reporte: true,
                reporteId: reportesID
            });
            Swal.fire(
                'Completado',
                'Reporte Agregado con éxito',
                'success'
            )
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se agrego el reporte a la orden',
            })
        }
        cerrarModalReporte();
    }

    const vistaTablaPendientes = (data) => {
        setCurrentForm(data);
        setModalPendientes(true);
    };
    const cerrarvistainfo = () => {
        setModalPendientes(false);
    };


    const visualizarReporte = async (orden) => {
        if (orden.reporte === false) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Acceso Denegado',
            })
        } else {
        
            const docRef = doc(db, "reportesext", `${orden.reporteId.slice(-1)}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCurrentReporte(docSnap.data());
                setModalReportexistente(true);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }

        }

    }

    const buscarImagen = (e) => {
        if (e.target.files[0] !== undefined) {
            setFile(e.target.files[0]);
            console.log(e.target.files[0]);
        } else {
            console.log('no hay archivo');
        }
    };

    const EditarReporte= async(_data)=>{
        const docRef = doc(db, "reportesint", `${_data.reporteId.slice(-1)}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCurrentReporte(docSnap.data());
                console.log(docSnap.data())
                setModalEditarReporte(true);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
    }

    const vistainformacion2 = (data) => {
        setCurrentForm(data);
        setModalinformacion2(true);
    };
    const cerrarvistainfo2 = () => {
        setModalinformacion2(false);
    };
    const updateOrdenes = (usern) => {
        const reference = query(collection(db, "ordenes"));
        onSnapshot(reference, (querySnapshot) => {
            var ordenes = [];
            querySnapshot.forEach((doc) => {
                ordenes.push(doc.data());
            });
            setOrdenesTecnico(
                ordenes.sort((a, b) =>{

                    return b.indice  - a.indice
                })
            );
            const p = ordenes.filter(item => usern.tareas.includes(item.id)).filter(filterStateIniciadas).length
            const s = ordenes.filter(item => usern.tareas.includes(item.id)).filter(filterStateSolventadas).length
            const a = ordenes.filter(item => usern.tareas.includes(item.id)).filter(filterStateIniciadas).filter(item => item.pause === false).length
            setCtdPendientes(p);
            setCtdSolventadas(s);
            setCtdActivas(a);
        });
    }

    const filterbyEncargado = (data) => {
        console.log("DATA",data)
        if (data.encargado.id === currentUser.uid) {
            return data;
        } else {
            return
        }
    }

    
    
    useEffect(() => {
        getData();
    }, [])

    return (
        <>
            <div className="container-test">
                <Grid container spacing={{ xs: 1, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={12} sm={6} md={6}>
                        <div className="card13" >
                            {
                                <div className="header-ev">
                                    <h5 className="titulo-ev">Información del Técnico Externo</h5>
                                </div>
                            }
                            {
                                <div className="card-body12 small">
                                    <div className="name-outlined">{currentUser.name} {currentUser.lastname} {currentUser.secondlastname}</div>
                                    <div className="alinearforms">
                                        <div className="alinear15">
                                            < QrCode2Icon sx={{ color: cyan[300] }} />
                                            <h1 className='texticone mx-4'>{currentUser.indentification} </h1>
                                            <EngineeringIcon sx={{ color: cyan[300] }} />
                                            <h1 className='texticone mx-4'>{currentUser.cargo}</h1>
                                            <PhoneAndroidIcon sx={{ color: cyan[300] }} />
                                            <h1 className='texticone mx-4'>{currentUser.cellphone}</h1>
                                        </div>


                                    </div>

                                </div>
                            }
                        </div>

                    </Grid>


                    <Grid item xs={12} sm={6} md={6}>


                        <Grid container spacing={{ xs: 1, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>

                            <Grid item xs={4} sm={6} md={4} >
                                <TarjetaDashboard
                                    icon={<PlayArrowIcon />}
                                    headerColor={"#ADCF9F"}
                                    avatarColor={lightGreen[700]}
                                    title={'Activas'}
                                    value={ctdActivas}
                                />
                            </Grid>
                            <Grid item xs={4} sm={6} md={4} >
                                <TarjetaDashboard
                                    icon={<PendingActionsIcon />}
                                    headerColor={"#F7A76C"}
                                    avatarColor={orange[700]}
                                    title={'Pendientes'}
                                    value={ctdPendientes}
                                />
                            </Grid>
                            <Grid item xs={4} sm={6} md={4} >
                                <TarjetaDashboard
                                    icon={<AssignmentTurnedInIcon />}
                                    headerColor={"#E4AEC5"}
                                    avatarColor={pink[700]}
                                    title={'Participadas'}
                                    value={ctdSolventadas}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* empieza la tarjeta    de la tabla  pendientes  */}


                    <Grid item xs={12} sm={6} md={6}>
                        <div className="card13" >
                            {
                                <div className="header-ev">
                                    <h5 className="titulo-ev">Actividades Pendientes</h5>

                                    <Avatar sx={{ bgcolor: orange[700] }} >
                                        <WorkHistoryIcon />

                                    </Avatar>

                                </div>
                            }
                            {
                                <div className="card-body12-tabla small">
                                    <div className=".ScrollStyleDT">

                                        <Table className='table table-light table-hover'>
                                            <Thead>
                                                <Tr>
                                                    <Th>#</Th>
                                                    <Th className="t-encargados">Prioridad</Th>
                                                    <Th className="t-encargados">Asunto</Th> 
                                                    <Th className="t-encargados">Acciones</Th>
                                                    <Th className="t-encargados">Información</Th>

                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {ordenesTecnico.filter(filterbyId).filter(filterStateIniciadas).map((dato, index) => (
                                                    <Tr key={index}  >
                                                        <Td>
                                                            {index + 1}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                            {dato.prioridad}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                            {dato.asunto}
                                                        </Td>
                                                        <Td>
                                                            <Stack direction="row" spacing={0.5} alignitems="center" justifyContent="center" >
                                                                <IconButton aria-label="play" onClick={() => play(dato)} disabled={dato.play} sx={{ color: lightGreen[500] }}><PlayCircleFilledWhiteIcon /></IconButton>
                                                                <IconButton aria-label="pause" onClick={() => pause(dato)} disabled={dato.pause} sx={{ color: orange[500] }}><PauseCircleIcon /></IconButton>
                                                                <IconButton aria-label="stop" onClick={() => stop(dato)} disabled={dato.pause} sx={{ color: pink[500] }}><StopCircleIcon /></IconButton>
                                                            </Stack>
                                                        </Td>
                                                        <Td>
                                                            <IconButton aria-label="delete" color="gris" onClick={() => { vistaTablaPendientes(dato) }}  ><InfoIcon /></IconButton>
                                                        </Td>

                                                    </Tr>

                                                ))}
                                            </Tbody>
                                        </Table>
                                    </div>

                                    <Modal isOpen={modalPendientes}>
                                        <Container>
                                            <ModalHeader>
                                                <div><h1>Orden de Trabajo</h1></div>
                                            </ModalHeader>
                                            <ModalBody>
                                                <FormGroup>
                                                    <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                            <div className="name-outlined">{currentForm.id}</div>
                                        </Grid >
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Asunto:  </b>
                                                                {currentForm.asunto}
                                                            </label>

                                                        </Grid >
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Fecha: </b>
                                                                {currentForm.fecha}
                                                            </label>

                                                        </Grid >
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Departamento:  </b>
                                                                {currentForm.departamento}
                                                            </label>

                                                        </Grid >
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Cédula Solicitante:  </b>
                                                                {currentForm.cedula}
                                                            </label>

                                                        </Grid >
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Prioridad:  </b>
                                                                {currentForm.prioridad}
                                                            </label>

                                                        </Grid >
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Tipo de Trabajo:  </b>
                                                                {currentForm.tipotrabajo}
                                                            </label>
                                                        </Grid >
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Descripción Equipo:  </b>
                                                            </label>
                                                            <TextareaAutosize
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="Descripción"
                                                                className="text-area-encargado"
                                                                name="descripcion"
                                                                readOnly
                                                                value={currentForm.descripcion} />
                                                        </Grid >
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Problemática:  </b>                                                        
                                                            </label>
                                                            <TextareaAutosize
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="Problematica"
                                                                className="text-area-encargado"
                                                                name="problematica"
                                                                readOnly
                                                                value={currentForm.problematica} />
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
                                                                value={currentForm.observaciones} />
                                                        </Grid >
                                                    </Grid>
                                                </FormGroup>
                                            </ModalBody>
                                            <ModalFooter className="modal-footer">
                                                <Button  variant="contained"
                        className="boton-modal-d"
                        onClick={cerrarvistainfo}>Cerrar </Button>
                                            </ModalFooter>
                                        </Container>
                                    </Modal>
                                </div>
                            }

                        </div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                        <div className="card13" >
                            {
                                <div className="header-ev">

                                    <h5 className="titulo-ev">Actividades Acabadas</h5>
                                    <Avatar sx={{ bgcolor: lightGreen[500] }} >
                                        <DoneAllIcon />
                                    </Avatar>

                                </div>
                            }
                            {
                                <div className="card-body12-tabla small">
                                    <div className="ScrollStyleDT">

                                        <Table className='table table-light table-hover'>
                                            <Thead>
                                                <Tr>
                                                    <Th>#</Th>
                                                    <Th className="t-encargados">Fecha</Th>
                                                    <Th className="t-encargados">Asunto</Th>
                                                    <Th className="t-encargados">Información</Th>
                                                    <Th className="t-encargados">Reporte</Th>

                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {ordenesTecnico.filter(filterbyId).filter(filterbyEncargado).filter(filterStateSolventadas).map((dato, index) => (
                                                    <Tr key={index} >
                                                        <Td>
                                                            {index + 1}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                            {dato.fecha}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                            {dato.asunto}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                            <IconButton aria-label="informacion" color="gris" onClick={() => { vistainformacion2(dato) }}><InfoIcon /></IconButton>
                                                        </Td>
                                                        <Td className="t-encargados">
                                                            <IconButton aria-label="delete" onClick={() => { abrirModalReporte(dato) }} disabled={dato.reporte} color="primary">
                                                                <AddIcon />

                                                            </IconButton>
                                                            <IconButton aria-label="delete" onClick={() => { visualizarReporte(dato) }} disabled={!dato.reporte} color="rosado">
                                                                <RemoveRedEyeIcon />
                                                            </IconButton>
                                                            <IconButton aria-label="delete" onClick={() => { EditarReporte(dato) }} disabled={!dato.reporte} color="warning">
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Td>
                                                    </Tr>
                                                ))}
                                            </Tbody>
                                        </Table>
                                    </div>
                                    <Modal isOpen={modalInformacion2}>
                                        <Container>
                                            <ModalHeader>
                                                <div><h1> Orden de Trabajo </h1></div>
                                            </ModalHeader>
                                            <ModalBody>
                                                <FormGroup>
                                                    <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                            <div className="name-outlined">{currentForm.id}</div>
                                        </Grid >
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Asunto:  </b>
                                                                {currentForm.asunto}
                                                            </label>
                                                        </Grid >
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Fecha: </b>
                                                                {currentForm.fecha}
                                                            </label>

                                                        </Grid >
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Departamento:  </b>
                                                                {currentForm.departamento}
                                                            </label>

                                                        </Grid >
                                                        {/* <Grid item xs={12}>
                                                            <label>
                                                                <b>Cédula Solicitante:  </b>
                                                                {currentForm.cedula}
                                                            </label>

                                                        </Grid > */}
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Prioridad:  </b>
                                                                {currentForm.prioridad}
                                                            </label>

                                                        </Grid >
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Tipo de Trabajo:  </b>
                                                                {currentForm.tipotrabajo}
                                                            </label>
                                                        </Grid >
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Descripción Equipo:  </b>
                                                            </label>
                                                            <TextareaAutosize
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="Descripción"
                                                                className="text-area-encargado"
                                                                name="descripcion"
                                                                readOnly
                                                                value={currentForm.descripcion} />
                                                        </Grid >
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Problemática:  </b>
                                                            </label>
                                                            <TextareaAutosize
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="Problematica"
                                                                className="text-area-encargado"
                                                                name="problematica"
                                                                readOnly
                                                                value={currentForm.problematica} />
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
                                                                value={currentForm.observaciones} />
                                                        </Grid >
                                                    </Grid>
                                                </FormGroup>
                                            </ModalBody>
                                            <ModalFooter className="modal-footer">
                                                <Button  variant="contained"
                        className="boton-modal-d"
                         onClick={cerrarvistainfo2}>Cerrar </Button>

                                            </ModalFooter>
                                        </Container>
                                    </Modal>
                                </div>
                            }

                        </div>
                    </Grid>

                </Grid>
                <Modal isOpen={modalReportin}>
                    <ModalHeader>
                        <div><h1>Reporte Externo</h1></div>
                    </ModalHeader>
                    <ModalBody>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <TextField id="outlined-basic" InputProps={{ readOnly: true }} label="Código Orden" defaultValue={currentOrden.id} variant="outlined" fullWidth />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic" label="Cédula Técnico" variant="outlined" InputProps={{ readOnly: true }} defaultValue={currentUser.indentification} fullWidth />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic" label="Nombre Técnico" variant="outlined" InputProps={{ readOnly: true }} defaultValue={currentUser.name + ' ' + currentUser.lastname + ' ' + currentUser.secondlastname} fullWidth />
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
                                    renderInput={(params) => <TextField {...params} fullWidth label="Código Equipo" type="text" />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic" label="Equipo" variant="outlined" InputProps={{ readOnly: true }} value={cequipo} fullWidth />
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

                                    renderInput={(params) => <TextField name="tmantenimiento"  {...params} fullWidth label="T.Mantenimiento" type="text" />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic" name="costo" onChange={createReport} label="Costo" variant="outlined" fullWidth />
                            </Grid>
                            {/* <Grid item xs={12}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    className='seleccionadortabla'

                                    onChange={(event, newValue) => {
                                        setNivelDeAlerta(newValue);
                                    }}
                                    options={["No Funcional", "Funcional"]}

                                    renderInput={(params) => <TextField name="tmantenimiento"  {...params} fullWidth label="Nivel de Alerta" type="text" />}
                                />
                            </Grid> */}
                            <Grid item xs={12}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    className='seleccionadortabla'

                                    onChange={(event, newValue) => {
                                        setEstadof(newValue);
                                    }}
                                    options={["ARREGLADO", "REPARADO"]}

                                    renderInput={(params) => <TextField name="tmantenimiento"  {...params} fullWidth label="Estado" type="text" />}
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

                    </ModalBody>
                    <ModalFooter>
                    <Button     variant="outlined"
                          className="boton-modal-d2"
                         disabled={btnReport} onClick={sendReportFirebase}>Añadir</Button>

                        <Button
                          variant="contained"
                          className="boton-modal-d"
                            onClick={cerrarModalReporte}
                        >
                            Cancelar
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modalReportexistente}>
                    <ModalHeader>
                        <div><h1>Ver Reporte Interno</h1></div>
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
                                    <b>OrdenId:  </b>
                                    {currentReporte.OrdenId}
                                </label>
                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Técnico: </b>
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
                                    <b>Tiempo:  </b>
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
                        <div><h5>Editar Reporte Externo - {currentReporte.OrdenId}</h5></div>
                    </ModalHeader>
                    <ModalBody>
                        <Grid container spacing={1}>
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
                                    renderInput={(params) => <TextField   {...params} fullWidth label="T.Mantenimiento" type="text" />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField inputProps={{ style: { textTransform: "uppercase"} }} id="outlined-basic" value={currentReporte.costo} name="costo"   onChange={cambiarDatosReporte} label="Costo" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <strong>Falla:</strong>
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
                                <strong>Causas:</strong>
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
                                <strong>Actividades:</strong>
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
                                <strong>Repuestos:</strong>
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
                                <strong>Observaciones:</strong>
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
            </div>
        </>
    );
}