import { useSelector } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import { collection, query, doc, updateDoc, onSnapshot, getDoc,setDoc } from "firebase/firestore";
import Backdrop from '@mui/material/Backdrop';
import { db } from "../firebase/firebase-config"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { pink, cyan, lightGreen, orange } from '@mui/material/colors';
import { useEffect, useRef, useState } from "react";
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
// import { jsPDF } from "jspdf";
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
import PrintIcon from '@mui/icons-material/Print';
import FormLabel from '@mui/material/FormLabel';
// dependencias para las tablas

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { generarPdf } from "../scripts/pdfReporte";
//
import Swal from 'sweetalert2';
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
import EditIcon from '@mui/icons-material/Edit';
export default function DashboardTecnicos() {
    const currentUser = useSelector(state => state.auths);
    const [loading,setLoading] = useState(false);
    const [modalPendientes, setModalPendientes] = useState(false);
    const [codigosEquipo, setCodigosEquipo] = useState([]);
    const [codigosEquipoCal, setCodigosEquipoCal] = useState([]);
    const [estadof, setEstadof] = useState('');
    const [ctdPendientes, setCtdPendientes] = useState(0);
    const [ctdSolventadas, setCtdSolventadas] = useState(0);
    const [ctdActivas, setCtdActivas] = useState(0);
    const [modalInformacion2, setModalinformacion2] = useState(false);
    const [currentForm, setCurrentForm] = useState(orden_initialData);
    const [modalReportexistente, setModalReportexistente] = useState(false);
    const [modalReportexistenteCal, setModalReportexistenteCal] = useState(false);
    const [modalReportin, setModalReportin] = useState(false);
    const [modalReportesCalibracion, setModalReportesCalibracion] = useState(false);
    const [currentOrden, setCurrentOrden] = useState([]);
    const [inventario, setInventario] = useState([]);
    const [inventariocal, setInventariocal] = useState([]);
    const [cequipo, setCequipo] = useState("");
    const [codigoe, setCodigoe] = useState("");
    const [rtmantenimiento, setRtmantenimiento] = useState("");
    const [btnReport, setBtnReport] = useState(false);
    const [equipment, setEquipment] = useState({});
    const [currentReporte, setCurrentReporte] = useState({});
    const [modalEditarReporte, setModalEditarReporte] = useState(false);
    const [modalEditarReporteCal, setModalEditarReporteCal] = useState(false);
    //variables para las tablas
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [user, setUser] = useState({});
    const [pagePendientes, setPagePendientes] = useState(0);
    const [rowsPendientes, setRowsPendientes] = useState(10);
    const [ordenesTecnico, setOrdenesTecnico] = useState([]);
    // variables del modal reporte
    const codigos_totales = useRef([])

    const [nreporte, setNreporte] = useState(reporte_structure);
    const [nreporte2, setNreporte2] = useState(reporte_calibracion);
    const play = async (data) => {
        const reference = doc(db, "ordenes", `${data.id}`);
        let register_times;
        var lista_tecnicos = data.tecnicos.map((item) => {
            register_times = item.tiempos.slice()
            if (item.id === currentUser.uid) {
                var someDate = Math.round(Date.now() / 1000);
                register_times.push(someDate)

                return {
                    id: item.id,
                    lastname: item.lastname,
                    name: item.name,
                    pause: false,
                    play: true,
                    tiempos: register_times,
                    secondlastname: item.secondlastname,
                    motivos_parada: item.motivos_parada,
                }
            } else {
                return {
                    id: item.id,
                    lastname: item.lastname,
                    name: item.name,
                    pause: item.pause,
                    play: item.play,
                    tiempos: item.tiempos,
                    secondlastname: item.secondlastname,
                    motivos_parada: item.motivos_parada,
                }
            }


        });

        await updateDoc(reference, {

            tecnicos: lista_tecnicos,
        });

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
        const arreglo = data.slice()
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
            let aux_codigos = JSON.parse(JSON.stringify(codigos_totales.current))
            let codigos_filter = aux_codigos.filter(item => item.departamento.nombre === data.departamento).map(item => (item.codigo))
            setCodigosEquipo(codigos_filter)
            // setModalReportin(true);
            setCurrentOrden(data);

            //let codigos_filtrados = aux_codigos.filter(item)
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                confirmButton:'btn btn-outline-primary',
                cancelButton:'btn btn-outline-primary',  
                },
                buttonsStyling: true
              })
              
              swalWithBootstrapButtons.fire({
                title: 'Tipo de Trabajo',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Mantenimiento',
                cancelButtonText: 'Calibracion',
             
              }).then((result) => {
                if (result.isConfirmed) {
                    setModalReportin(true)
                } else if (
                  /* Read more about handling dismissals below */
                  result.dismiss === Swal.DismissReason.cancel
                ) {
                    setModalReportesCalibracion(true)
                }
              })




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
    const cerrarModalReporteCalibracion = () => {
        setModalReportesCalibracion(false);
    }
  
    // funciones para las tablas
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handlePagePendientes = (event, newPage) => {
        setPagePendientes(newPage)
    };
    const handleRowsPendientes = (event) => {
        setRowsPendientes(+event.target.value);
        setPagePendientes(0);
    };
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
                return new Promise(async (resolve) => {
                    if (value === '') {
                        resolve('Necesita seleccionar una opción')
                    } else {
                        const reference = doc(db, "ordenes", `${data.id}`);
                        var razonparada = data.tecnicos.find(item => item.id === currentUser.uid).motivos_parada;
                        razonparada.push(value);
                        let register_times;
                        var lista_tecnicos = data.tecnicos.map((item) => {
                            register_times = item.tiempos.slice()
                            if (item.id === currentUser.uid) {
                                var someDate = Math.round(Date.now() / 1000);
                                register_times.push(someDate)

                                return {
                                    id: item.id,
                                    lastname: item.lastname,
                                    name: item.name,
                                    pause: true,
                                    play: false,
                                    tiempos: register_times,
                                    secondlastname: item.secondlastname,
                                    motivos_parada: razonparada
                                }
                            } else {
                                return {
                                    id: item.id,
                                    lastname: item.lastname,
                                    name: item.name,
                                    pause: item.pause,
                                    play: item.play,
                                    tiempos: item.tiempos,
                                    secondlastname: item.secondlastname,
                                    motivos_parada: item.motivos_parada,
                                }
                            }

                        });

                        Swal.fire({
                            icon: 'warning',
                            title: '¡Actividad en Espera!',
                            showConfirmButton: false,
                            timer: 2000

                        })

                        // tiempos.push(someDate);
                        //console.log(lista_tecnicos)
                        await updateDoc(reference, {
                            tecnicos: lista_tecnicos,
                        });

                    }
                })
            }
        })



    }


    const stop = (data) => {
        if (data.encargado.id === currentUser.uid) {
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
                    //var razonfinal = ""
                    var horas;
                    var horasminutos;
                    var someDate = Math.round(Date.now() / 1000);
                    //aqui empezamos nuevamente 
                    var lista_tecnicos = JSON.parse(JSON.stringify(data.tecnicos))
                    for (let i = 0; i < lista_tecnicos.length; i++) {
                        var tiempos = lista_tecnicos[i].tiempos.slice();

                        // if (data.mparada.length === 0) {
                        //     razonfinal = "Sin Interrupción"
                        // } else {
                        //     razonfinal = lista_tecnicos[i].motivo_parada.pop()
                        // }
                        if (tiempos.length === 0) {
                            tiempos = []
                            horas = 0
                            horasminutos = "0h00"
                        } else {
                            tiempos.push(someDate);
                            horas = calcularHoras(tiempos);
                            horasminutos = calcularTiempos(tiempos);
                        }

                        lista_tecnicos[i].tiempo_horas = horas
                        lista_tecnicos[i].tiempo_total = horasminutos
                        lista_tecnicos[i].tiempos = tiempos
                        lista_tecnicos[i].play = true
                        lista_tecnicos[i].pause = true
                    }
                    const reference = doc(db, "ordenes", `${data.id}`);
                    updateDoc(reference, {
                        tecnicos: lista_tecnicos,
                        estado: "Solventado",
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
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No eres el Encargado de la Orden',
            })
        }
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
            var codigos = inventarioD.map(item => item.codigo);
            codigos_totales.current = inventarioD;
            setInventario(inventarioD);
            setCodigosEquipo(codigos);
        });


        const reference2 = query(collection(db, "ingresocalibracion"));
        onSnapshot(reference2, (querySnapshot) => {
            var inventarioC = [];
            querySnapshot.forEach((doc) => {
                inventarioC.push(doc.data());
            });
            var codigosC = inventarioC.map(item => item.codigo);
            codigos_totales.current = inventarioC;
            setInventariocal(inventarioC);
            setCodigosEquipoCal(codigosC);
        });

    }

    const updateOrdenes = (usern) => {
        const reference = query(collection(db, "ordenes"));
        onSnapshot(reference, (querySnapshot) => {
            var ordenes = [];
            querySnapshot.forEach((doc) => {
                ordenes.push(doc.data());
            });
            setOrdenesTecnico(
                ordenes.sort((a, b) => {

                    return b.indice - a.indice
                })
            );

            const p = ordenes.filter(item => usern.tareas.includes(item.id)).filter(filterStateIniciadas).length
            const s = ordenes.filter(item => usern.tareas.includes(item.id)).filter(filterStateSolventadas).length
            let a = ordenes.filter(item => usern.tareas.includes(item.id)).filter(filterStateIniciadas)
            let aux = 0
            for (let i = 0; i < a.length; i++) {
                let tec = a[i].tecnicos

                for (let j = 0; j < tec.length; j++) {
                    let aux2 = tec[j]
                    if (aux2.id === currentUser.uid) {
                        if (aux2.pause === false) {
                            aux = aux + 1
                        }
                    }
                }

            }
            setCtdPendientes(p);
            setCtdSolventadas(s);
            setCtdActivas(aux);



        });
    }

    const selectEquipo = (val) => {
     
        if(val !== null){
            let aux_inventario = JSON.parse(JSON.stringify(inventario))
            const equipos = aux_inventario.find(item => item.codigo === val)
            setEquipment(equipos);
            setCequipo(equipos.equipo.nombre);
            setCodigoe(val);
        }

    }

    const selectEquipoCalibracion = (val) => {
     
        if(val !== null){
            let aux_inventariocal = JSON.parse(JSON.stringify(inventariocal))
            const equipos = aux_inventariocal.find(item => item.codigo === val)
            setEquipment(equipos);
            setCequipo(equipos.equipo.nombre);
            setCodigoe(val);
        }

    }

    const filterbyId = (item) => {
        if (user.tareas.includes(item.id)) {
            return item;
        } else {
            return
        }
    }


    const filterbyEncargado = (data) => {
        if (data.encargado.id === currentUser.uid) {
            return data;
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

    const createReporte = (event) => {
        setNreporte2({
            ...nreporte2,
            [event.target.name]: event.target.value,
        });
    }

    const sendReportFirebase = async () => {
        const re = nreporte;
        setLoading(true)
        if(cequipo !== "" && rtmantenimiento !== "" && estadof !== ""){
        let aux = uuidv4()
        let id_formateada = aux.slice(0,13)
        re['id'] = id_formateada;
        re['orden_id'] = currentOrden.id;
        re['cedula'] = currentUser.indentification;
        re['tecnico'] = currentUser.name + ' ' + currentUser.lastname + ' ' + currentUser.secondlastname;
        re['equipo'] = cequipo;
        re['codigo_equipo'] = codigoe;
        re['equipo_id'] = equipment.id;
        re['mantenimiento'] = rtmantenimiento;
        re['estado'] = estadof;
        re['fecha'] = new Date().toLocaleString("es-EC");
        re['departamento'] = currentOrden.departamento;
        re['nro_orden'] = currentOrden.numero;
        re['razonp'] = currentOrden.razonp;
        re['importancia'] = equipment.importancia;
        re['indice'] = new Date().getTime();
        // parametros adicionales
        re['marca'] = equipment.marca;
        re['modelo'] = equipment.modelo;
        re['serie'] = equipment.serie;
        re['responsable'] = equipment.responsable.nombre;
        re['propietario'] = equipment.propietario.nombre;
        re['tipo_equipo'] = equipment.tipo_equipo.nombre;
        let tecnicos_aux = JSON.parse(JSON.stringify(currentOrden.tecnicos))

        let tiempos_aux = []
        for (let i = 0; i < tecnicos_aux.length; i++) {
            let temp = tecnicos_aux[i].tiempos

            for (let j = 0; j < temp.length; j++) {
                tiempos_aux.push(temp[j])
            }
        }
        re['horas'] = calcularHoras(tiempos_aux);
        re['tiempo'] = calcularTiempos(tiempos_aux);
        try {
            setModalReportin(false);
            await setDoc(doc(db, "reportesint", re.id),re)
            const reference = doc(db, "ordenes", `${currentOrden.id}`);
            updateDoc(reference, {
                reporte: true,
                reporteId: re.id,
            });
            setLoading(false)
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se agrego el reporte a la orden error:' + error,
            })
            setModalReportin(false);
            setLoading(false)
        }

        }else{
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Faltan Campos',
            })
            setModalReportin(false);
            setLoading(false)
        }
        setNreporte(reporte_structure)
        setEquipment({})
        setCequipo("")
        setEstadof("")
        setRtmantenimiento("")
       
    }



    const sendReportFirebase2 = async () => {
        const re = nreporte2;
        let aux = uuidv4()
        let id_formateada = aux.slice(0,13)
        re['id'] = id_formateada;
        re['orden_id'] = currentOrden.id;
        re['cedula'] = currentUser.indentification;
        re['tecnico'] = currentUser.name + ' ' + currentUser.lastname + ' ' + currentUser.secondlastname;
        re['equipo'] = cequipo;
        re['codigo_equipo'] = codigoe;
        re['tipom'] = rtmantenimiento;
        setNreporte2(reporte_calibracion)
        console.log(nreporte2)


        try {
            setModalReportesCalibracion(false);
            await setDoc(doc(db, "reportescalibraciones", re.id),re)
            const reference = doc(db, "ordenes", `${currentOrden.id}`);
            updateDoc(reference, {
                reporte: true,
                reporteId: re.id,
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se agrego el reporte a la orden error:' + error,
            })
            setModalReportesCalibracion(false);
        }
        setEquipment({})
        setCequipo("")
        setEstadof("")
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
            const docRef = doc(db, "reportesint", `${orden.reporteId}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCurrentReporte(docSnap.data());
                setModalReportexistente(true);
            } else {
                const docRef = doc(db, "reportescalibraciones", `${orden.reporteId}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCurrentReporte(docSnap.data());
                setModalReportexistenteCal(true);
            } else{
            console.log("No such document!"); } 
        } 
            }
        }
    

    const vistainformacion2 = (data) => {
        setCurrentForm(data);
        setModalinformacion2(true);
    };
    const cerrarvistainfo2 = () => {
        setModalinformacion2(false);
    };

    const downloadPdf = () => {
        var props_pdf ={
            nombre:  currentReporte.equipo,
            area_responsable:currentReporte.departamento,
            tipo:currentReporte.tipo_equipo,
            nro_orden:currentReporte.nro_orden,
            marca:currentReporte.marca,
            serie:currentReporte.serie,
            modelo:currentReporte.modelo,
            propietario:currentReporte.propietario,
            fecha:currentReporte.fecha,
            tipo_mantenimiento:currentReporte.mantenimiento,
            estado:currentReporte.estado,
            problema:currentReporte.falla,
            actividades:currentReporte.actividades,
            conclusiones:currentReporte.observaciones,
            causas:currentReporte.causas,
            responsable:currentReporte.tecnico,
        }
        generarPdf(props_pdf)

    }
    // creamos el codigo para editar los reportes
    const EditarReporte = async (_data) => {
        const docRef = doc(db, "reportesint", `${_data.reporteId}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setCurrentReporte(docSnap.data());
            setModalEditarReporte(true);
        } else {
                const docRef = doc(db, "reportescalibraciones", `${_data.reporteId}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCurrentReporte(docSnap.data());
                setModalEditarReporteCal(true);
            } else{
            console.log("No such document!"); } 
            }
    }
    const cambiarDatosReporte = (event) => {
        setCurrentReporte({
            ...currentReporte,
            [event.target.name]: event.target.value,
        });
    }
    const ActualizarReporte = () => {
        setLoading(true);
        try {
            const ref = doc(db, "reportesint", `${currentReporte.id}`);
            updateDoc(ref, {
                tmantenimiento: rtmantenimiento,
                costo: currentReporte.costo,
                falla: currentReporte.falla,
                causas: currentReporte.causas,
                actividades: currentReporte.actividades,
                repuestos: currentReporte.repuestos,
                observaciones: currentReporte.observaciones,
            });
            setModalEditarReporte(false)
    
            Swal.fire({
                icon: 'warning',
                title: '¡Actividad Actualizada!',
                showConfirmButton: false,
                timer: 2000
    
            })
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
       

    }


    const ActualizarReporteCal = () => {
        try {
            const ref = doc(db, "reportescalibraciones", `${currentReporte.id}`);
            updateDoc(ref, {
                tipom: rtmantenimiento,
                fecha_calibracion: currentReporte.fecha_calibracion,
                fecha_verificacion: currentReporte.fecha_calibracion,
                fecha_proximacalibracion: currentReporte.fecha_proximacalibracion,
                codigo_calibracion: currentReporte.codigo_calibracion,
            });
            setModalEditarReporte(false)
    
            Swal.fire({
                icon: 'warning',
                title: '¡Actividad Actualizada!',
                showConfirmButton: false,
                timer: 2000
    
            })
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
       

    }
    useEffect(() => {
        getData();
        // eslint-disable-next-line
    }, [])

    return (
        <>
            <div className="container-test">
                <Grid container spacing={{ xs: 1, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={12} sm={6} md={6}>
                        <div className="card13" >
                            {
                                <div className="header-ev">
                                    <h5 className="titulo-ev">Información del Técnico Interno</h5>
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
                    <Grid item xs={12} sm={6} md={6}>
                        <div className="card13" >
                            <div className="header-ev">
                                <h5 className="titulo-ev">Actividades Pendientes</h5>
                                <Avatar sx={{ bgcolor: orange[700] }} >
                                    <WorkHistoryIcon />
                                </Avatar>
                            </div>
                            <div className="card-body12-tabla small" style={{ height: 330 }}>
                                <TableContainer sx={{ maxHeight: 280 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell
                                                    align={"left"}
                                                    style={{ minWidth: 100 }}
                                                >
                                                    Prioridad
                                                </TableCell>
                                                <TableCell
                                                    align={"left"}
                                                    style={{ minWidth: 100 }}
                                                >
                                                    Asunto
                                                </TableCell>
                                                <TableCell
                                                    align={"center"}
                                                    style={{ minWidth: 100 }}
                                                >
                                                    Acciones
                                                </TableCell>
                                                <TableCell
                                                    align={"center"}
                                                    style={{ minWidth: 100 }}
                                                >
                                                    Información
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {ordenesTecnico.filter(filterbyId).filter(filterStateIniciadas).slice(pagePendientes * rowsPendientes, pagePendientes * rowsPendientes + rowsPendientes)
                                                .map((row, index) => {
                                                    return (
                                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                            <TableCell align="left">{row.prioridad}</TableCell>
                                                            <TableCell align="left">{row.asunto}</TableCell>
                                                            <TableCell align="center">
                                                                <Stack direction="row" spacing={0.5} alignitems="center" justifyContent="center" >
                                                                    <IconButton aria-label="play" onClick={() => play(row)} disabled={row.tecnicos.find(item => item.id === currentUser.uid).play} sx={{ color: lightGreen[500] }}><PlayCircleFilledWhiteIcon /></IconButton>
                                                                    <IconButton aria-label="pause" onClick={() => pause(row)} disabled={row.tecnicos.find(item => item.id === currentUser.uid).pause} sx={{ color: orange[500] }}><PauseCircleIcon /></IconButton>
                                                                    <IconButton aria-label="stop" onClick={() => stop(row)} disabled={row.tecnicos.find(item => item.id === currentUser.uid).pause} sx={{ color: pink[500] }}><StopCircleIcon /></IconButton>
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <IconButton aria-label="delete" color="gris" onClick={() => { vistaTablaPendientes(row) }}  ><InfoIcon /></IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"
                                    count={ctdPendientes}
                                    rowsPerPage={rowsPendientes}
                                    page={pagePendientes}
                                    onPageChange={handlePagePendientes}
                                    onRowsPerPageChange={handleRowsPendientes}
                                />
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <div className="card13" >
                            <div className="header-ev">
                                <h5 className="titulo-ev">Reportes Encargados</h5>
                                <Avatar sx={{ bgcolor: lightGreen[500] }} >
                                    <DoneAllIcon />
                                </Avatar>
                            </div>
                            <div className="card-body12-tabla small" style={{ height: 330 }}>
                                <TableContainer sx={{ maxHeight: 280 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell
                                                    align={"left"}
                                                    style={{ minWidth: 100 }}
                                                >
                                                    Prioridad
                                                </TableCell>
                                                <TableCell
                                                    align={"left"}
                                                    style={{ minWidth: 100 }}
                                                >
                                                    Asunto
                                                </TableCell>
                                                <TableCell
                                                    align={"left"}
                                                    style={{ minWidth: 100 }}
                                                >
                                                    Información
                                                </TableCell>
                                                <TableCell
                                                    align={"left"}
                                                    style={{ minWidth: 100 }}
                                                >
                                                    Reporte
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {ordenesTecnico.filter(filterbyId).filter(filterbyEncargado).filter(filterStateSolventadas).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row, index) => {
                                                    return (
                                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                            <TableCell align="left">{row.fecha}</TableCell>
                                                            <TableCell align="left">{row.asunto}</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton aria-label="informacion" color="gris" onClick={() => { vistainformacion2(row) }}><InfoIcon /></IconButton>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Stack direction="row" spacing={1}>
                                                                    <IconButton aria-label="delete" onClick={() => { abrirModalReporte(row) }} disabled={row.reporte} color="primary">
                                                                        <AddIcon />

                                                                    </IconButton>
                                                                    <IconButton aria-label="delete" onClick={() => { visualizarReporte(row) }} disabled={!row.reporte} color="rosado">
                                                                        <RemoveRedEyeIcon />
                                                                    </IconButton>
                                                                    <IconButton aria-label="delete" onClick={() => { EditarReporte(row) }} disabled={!row.reporte} color="warning">
                                                                        <EditIcon />
                                                                    </IconButton>
                                                                </Stack>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"
                                    count={ctdSolventadas - 1}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Modal isOpen={modalReportin}>
                    <ModalHeader>
                        <div><h1>Reporte Interno</h1></div>
                    </ModalHeader>
                    <ModalBody style={{height:500,overflowY:"scroll"}}>
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
                                    disablePortal
                                    id="combo-box-demo"
                                    onChange={(event, newValue) => {
                                        selectEquipo(newValue);
                                    }}
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
                            <Grid item xs={12}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    className='seleccionadortabla'

                                    onChange={(event, newValue) => {
                                        setEstadof(newValue);
                                    }}
                                    options={["ARREGLADO", "OPERATIVO","NO OPERATIVO"]}

                                    renderInput={(params) => <TextField name="tmantenimiento"  {...params} fullWidth label="Estado" type="text" />}
                                />
                            </Grid>
        
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    style={{ textTransform: "uppercase" }}
                                    aria-label="minimum height"
                                    minRows={2}
                                    placeholder="Falla"
                                    className="text-area-encargado"
                                    maxLength={300}
                                    name="falla"
                                    onChange={createReport} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    style={{ textTransform: "uppercase" }}
                                    aria-label="minimum height"
                                    minRows={2}
                                    placeholder="Causas"
                                    className="text-area-encargado"
                                    name="causas"
                                    maxLength={300}
                                    onChange={createReport}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    style={{ textTransform: "uppercase" }}
                                    aria-label="minimum height"
                                    minRows={2}
                                    placeholder="Actividades"
                                    className="text-area-encargado"
                                    name="actividades"
                                    maxLength={300}
                                    onChange={createReport}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    style={{ textTransform: "uppercase" }}
                                    aria-label="minimum height"
                                    minRows={2}
                                    placeholder="Repuestos"
                                    className="text-area-encargado"
                                    name="repuestos"
                                    maxLength={300}
                                    onChange={createReport}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    style={{ textTransform: "uppercase" }}
                                    aria-label="minimum height"
                                    minRows={2}
                                    placeholder="Observaciones"
                                    className="text-area-encargado"
                                    name="observaciones"
                                    maxLength={300}
                                    onChange={createReport}
                                />
                            </Grid>
                        </Grid>

                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outlined"
                            className="boton-modal-d2"
                            disabled={btnReport} onClick={sendReportFirebase}>CREAR</Button>
                        <Button
                            variant="contained"
                            className="boton-modal-d"
                            onClick={cerrarModalReporte}
                        >
                            CANCELAR
                        </Button>

                    </ModalFooter>
                </Modal>

                <Modal isOpen={modalReportexistente}>
                    <ModalHeader>
                        <div><h4>Visualizar Reporte</h4></div>
                    </ModalHeader>
                    <ModalBody style={{height:500,overflowY:"scroll"}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <div className="name-outlined">{currentReporte.id}</div>
                            </Grid >
                            <Grid item xs={6}>
                                <label>
                                    <b>Estado:  </b>
                                    {currentReporte.estado}
                                </label>
                            </Grid >
                            <Grid item xs={6}>
                                <label>
                                    <b>Id Orden:  </b>
                                    {currentReporte.orden_id}
                                </label>
                            </Grid >
                            <Grid item xs={6}>
                                <label>
                                    <b>Técnico: </b>
                                    {currentReporte.tecnico}
                                </label>
                            </Grid >
                            <Grid item xs={6}>
                                <label>
                                    <b>Equipo:  </b>
                                    {currentReporte.equipo}
                                </label>
                            </Grid >
                            <Grid item xs={6}>
                                <label>
                                    <b>Código:</b>
                                    {currentReporte.codigo_equipo}
                                </label>
                            </Grid >
                            <Grid item xs={6}>
                                <label>
                                    <b>Mantenimiento:  </b>
                                    {currentReporte.mantenimiento}
                                </label>

                            </Grid >
                            <Grid item xs={6}>
                                <label>
                                    <b>Tiempo:  </b>
                                    {currentReporte.tiempo}
                                </label>

                            </Grid >
                            <Grid item xs={6}>
                                <label>
                                    <b>Costo:  </b>
                                    {currentReporte.costo}
                                </label>

                            </Grid >
                            <Grid item xs={12}>
                            <FormLabel id="demo-radio-buttons-group-label">Falla:</FormLabel>
                                <TextareaAutosize
                                    style={{ textTransform: "uppercase" }}
                                    aria-label="minimum height"
                                    minRows={1}
                                    placeholder="Falla"
                                    className="text-area-encargado"
                                    name="falla"
                                    readOnly
                                    value={currentReporte.falla} />

                            </Grid >
                            <Grid item xs={12}>
                            <FormLabel id="demo-radio-buttons-group-label">Causas:</FormLabel>
                                <TextareaAutosize
                                    style={{ textTransform: "uppercase" }}
                                    aria-label="minimum height"
                                    minRows={1}
                                    placeholder="Causa"
                                    className="text-area-encargado"
                                    name="causa"
                                    readOnly
                                    value={currentReporte.causas} />
                            </Grid >
                            <Grid item xs={12}>
                            <FormLabel id="demo-radio-buttons-group-label">Actividades:</FormLabel>
                                <TextareaAutosize
                                    style={{ textTransform: "uppercase" }}
                                    aria-label="minimum height"
                                    minRows={1}
                                    placeholder="Actividades"
                                    className="text-area-encargado"
                                    name="actividadesR"
                                    readOnly
                                    value={currentReporte.actividades} />
                            </Grid >
                            <Grid item xs={12}>
                            <FormLabel id="demo-radio-buttons-group-label">Repuestos:</FormLabel>
                                <TextareaAutosize
                                    style={{ textTransform: "uppercase" }}
                                    aria-label="minimum height"
                                    minRows={1}
                                    placeholder="Repuestos"
                                    className="text-area-encargado"
                                    name="repuestos"
                                    readOnly
                                    value={currentReporte.repuestos} />
                            </Grid >

                            <Grid item xs={12}>
                            <FormLabel id="demo-radio-buttons-group-label">Observaciones:</FormLabel>
                                <TextareaAutosize
                                    style={{ textTransform: "uppercase" }}
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
                            className="boton-modal-pdf"
                            startIcon={<PrintIcon />}
                            onClick={downloadPdf} >
                            Imprimir
                        </Button>
                        <Button
                            variant="outlined"
                            className="boton-modal-d"
                            onClick={() => { setModalReportexistente(false) }}
                        >
                            Cerrar
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
            <Modal isOpen={modalEditarReporte}>
                <ModalHeader>
                    <div><h5>Editar Reporte Interno - {currentReporte.orden_id}</h5></div>
                </ModalHeader>
                <ModalBody style={{height:500,overflowY:"scroll"}}>
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
                            <TextField inputProps={{ style: { textTransform: "uppercase" } }} id="outlined-basic" value={currentReporte.costo} name="costo" onChange={cambiarDatosReporte} label="Costo" variant="outlined" fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                        <FormLabel id="demo-radio-buttons-group-label">Falla:</FormLabel>
                        </Grid>
                        <Grid item xs={12}>
                            <TextareaAutosize
                                style={{ textTransform: "uppercase" }}
                                aria-label="minimum height"
                                minRows={2}
                                placeholder="Falla"
                                className="text-area-encargado"
                                name="falla"
                                value={currentReporte.falla}
                                onChange={cambiarDatosReporte} />
                        </Grid>
                        <Grid item xs={12}>
                        <FormLabel id="demo-radio-buttons-group-label">Causas:</FormLabel>
                        </Grid>
                        <Grid item xs={12}>
                            <TextareaAutosize
                                style={{ textTransform: "uppercase" }}
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
                        <FormLabel id="demo-radio-buttons-group-label">Actividades:</FormLabel>
                        </Grid>
                        <Grid item xs={12}>
                            <TextareaAutosize
                                style={{ textTransform: "uppercase" }}
                                aria-label="minimum height"
                                minRows={2}
                                placeholder="Actividades"
                                className="text-area-encargado"
                                name="actividades"
                                value={currentReporte.actividades}
                                onChange={cambiarDatosReporte}
                            />
                        </Grid>
                        <Grid item xs={12}>
                        <FormLabel id="demo-radio-buttons-group-label">Repuestos:</FormLabel>
                        </Grid>
                        <Grid item xs={12}>
                            <TextareaAutosize
                                style={{ textTransform: "uppercase" }}
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
                        <FormLabel id="demo-radio-buttons-group-label">Observaciones:</FormLabel>
                        </Grid>
                        <Grid item xs={12}>
                            <TextareaAutosize
                                style={{ textTransform: "uppercase" }}
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
                        onClick={() => { setModalEditarReporte(false) }}
                    >
                        Cancelar
                    </Button>

                </ModalFooter>
            </Modal>


            <Modal isOpen={modalInformacion2}>
                <Container>
                    <ModalHeader>
                        <div><h1> Orden de Trabajo </h1></div>
                    </ModalHeader>
                    <ModalBody style={{height:500,overflowY:"scroll"}}>
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
                                        <b>Prioridad:  </b>
                                        {currentForm.prioridad}
                                    </label>

                                </Grid >
                                <Grid item xs={12}>
                                    <label>
                                        <b>Responsable:  </b>
                                        {currentForm.encargado.name}
                                    </label>

                                </Grid >
                               
                                <Grid item xs={12}>
                                    <label>
                                        <b>Tipo:  </b>
                                        {currentForm.tipotrabajo}
                                    </label>
                                </Grid >
                                <Grid item xs={12}>
                                <FormLabel id="demo-radio-buttons-group-label">Descripción:</FormLabel>
                                    <TextareaAutosize
                                        style={{ textTransform: "uppercase" }}
                                        aria-label="minimum height"
                                        minRows={2}
                                        placeholder="Descripción"
                                        className="text-area-encargado"
                                        name="descripcion"
                                        readOnly
                                        value={currentForm.descripcion} />
                                </Grid >
                                <Grid item xs={12}>
                                <FormLabel id="demo-radio-buttons-group-label">Problemática:</FormLabel>
                                    <TextareaAutosize
                                        style={{ textTransform: "uppercase" }}
                                        aria-label="minimum height"
                                        minRows={2}
                                        placeholder="Problematica"
                                        className="text-area-encargado"
                                        name="problematica"
                                        readOnly
                                        value={currentForm.problematica} />
                                </Grid >
                                <Grid item xs={12}>
                                <FormLabel id="demo-radio-buttons-group-label">Observaciones:</FormLabel>
                                    <TextareaAutosize
                                        style={{ textTransform: "uppercase" }}
                                        aria-label="minimum height"
                                        minRows={2}
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
                        <Button variant="contained"
                            className="boton-modal-d"
                            onClick={cerrarvistainfo2}>Cerrar </Button>

                    </ModalFooter>
                </Container>
            </Modal>



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
                                        <b>Encargado:  </b>
                                        {currentForm.encargado.name + " " + currentForm.encargado.lastname + " " + currentForm.encargado.secondlastname}
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
                                        style={{ textTransform: "uppercase" }}
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
                                        style={{ textTransform: "uppercase" }}
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
                                        style={{ textTransform: "uppercase" }}
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
                        <Button variant="contained"
                            className="boton-modal-d"
                            onClick={cerrarvistainfo}>
                            Cerrar
                        </Button>
                    </ModalFooter>
                </Container>
            </Modal>

            <Modal isOpen={modalReportesCalibracion}>
                    <ModalHeader>
                        <div><h1>Reporte Calibración</h1></div>
                    </ModalHeader>
                    <ModalBody style={{height:500,overflowY:"scroll"}}>
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
                                    disablePortal
                                    id="combo-box-demo"
                                    onChange={(event, newValue) => {
                                        selectEquipoCalibracion(newValue);
                                    }}
                                    options={codigosEquipoCal}
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
                                    options={["CALIBRACIÓN", "VERIFICACIÓN"]}
                                    renderInput={(params) => <TextField name="tipom"  {...params} fullWidth label="T.Mantenimiento" type="text" />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic" name="codigo_calibracion" onChange={createReporte} label="Código Calibración" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic" name="fecha_calibracion" onChange={createReporte} label="Fecha Calibración" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic" name="fecha_proximacalibracion" onChange={createReporte} label="Fecha Proxima Calibración" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic" name="fecha_verificacion" onChange={createReporte} label="Fecha Verificación" variant="outlined" fullWidth />
                            </Grid>
                        </Grid>

                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outlined"
                            className="boton-modal-d2"
                            disabled={btnReport} onClick={sendReportFirebase2}>CREAR</Button>
                        <Button
                            variant="contained"
                            className="boton-modal-d"
                            onClick={cerrarModalReporteCalibracion}
                        >
                            CANCELAR
                        </Button>

                    </ModalFooter>
                </Modal>      


                <Modal isOpen={modalReportexistenteCal}>
                    <ModalHeader>
                        <div><h4>Visualizar Reporte</h4></div>
                    </ModalHeader>
                    <ModalBody style={{height:500,overflowY:"scroll"}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <div className="name-outlined">{currentReporte.id}</div>
                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Id Orden:  </b>
                                    {currentReporte.orden_id}
                                </label>
                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Técnico: </b>
                                    {currentReporte.tecnico}
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
                                    <b>Código:</b>
                                    {currentReporte.codigo_equipo}
                                </label>
                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Tipo:  </b>
                                    {currentReporte.tipom}
                                </label>

                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Código Calibración:  </b>
                                    {currentReporte.codigo_calibracion}
                                </label>
                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Fecha Calibración:  </b>
                                    {currentReporte.fecha_calibracion}
                                </label>
                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Proxima Calibración:  </b>
                                    {currentReporte.fecha_proximacalibracion}
                                </label>
                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Fecha Verificación:  </b>
                                    {currentReporte.fecha_verificacion}
                                </label>
                            </Grid >
                          

                    
                        </Grid>
                    </ModalBody>
                    <ModalFooter>
                        {/* <Button
                            variant="contained"
                            className="boton-modal-pdf"
                            startIcon={<PrintIcon />}
                            onClick={downloadPdf} >
                            Imprimir
                        </Button> */}
                        <Button
                            variant="outlined"
                            className="boton-modal-d"
                            onClick={() => { setModalReportexistenteCal(false) }}
                        >
                            Cerrar
                        </Button>
                    </ModalFooter>
                </Modal>    

                <Modal isOpen={modalEditarReporteCal}>
                <ModalHeader>
                    <div><h5>Editar Reporte Calibraciones - {currentReporte.orden_id}</h5></div>
                </ModalHeader>
                <ModalBody style={{height:250,overflowY:"scroll"}}>
                    <Grid container spacing={1}>
                    <Grid item xs={12}>
                                <TextField id="outlined-basic" name="codigo_calibracion" onChange={createReporte} label="Código Calibración" variant="outlined" fullWidth />
                            </Grid>
                        <Grid item xs={6}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    className='seleccionadortabla'
                                    onChange={(event, newValue) => {
                                        setRtmantenimiento(newValue);
                                    }}
                                    options={["CALIBRACIÓN", "VERIFICACIÓN"]}
                                    renderInput={(params) => <TextField name="tipom"  {...params} fullWidth label="T.Mantenimiento" type="text" />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic" name="fecha_verificacion" onChange={createReporte} label="Fecha Verificación" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic" name="fecha_calibracion" onChange={createReporte} label="Fecha Calibración" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic" name="fecha_proximacalibracion" onChange={createReporte} label="Fecha Proxima Calibración" variant="outlined" fullWidth />
                            </Grid>
                            
                        
                    </Grid>

                </ModalBody>
                <ModalFooter>
                    <Button variant="outlined"
                        className="boton-modal-d2"
                        disabled={btnReport} onClick={ActualizarReporteCal}>Añadir</Button>
                    <Button
                        variant="contained"
                        className="boton-modal-d"
                        onClick={() => { setModalEditarReporteCal(false) }}
                    >
                        Cancelar
                    </Button>

                </ModalFooter>
            </Modal>
  


            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
        </>
    );
}

const orden_initialData = {


    encargado: {
        name: "",
        lastname: "",
        secondlastname: "",
    }
}

let reporte_structure = {
    orden_id: '',
    cedula: '',
    tecnico: '',
    falla: '',
    id: '',
    codigo_equipo: '',
    estado: '',
    equipo: '',
    mantenimiento: '',
    costo: '',
    causas: '',
    actividades:'',
    repuestos: '',
    observaciones: '',
    fecha: '',
    departamento: '',
    razon: '',
    tiempo: '',
    horas: 0,
    tipo: "Interno",
}



let reporte_calibracion = {
    orden_id: '',
    cedula: '',
    tecnico: '',
    id: '',
    codigo_equipo: '',
    equipo: '',
    tipom:'',
    codigo_calibracion: '',
    fecha_calibracion: '',
    fecha_proximacalibracion: '',
    fecha_verificacion: '',
}