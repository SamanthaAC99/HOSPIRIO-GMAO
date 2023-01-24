import { useSelector } from "react-redux";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { collection, query, doc, updateDoc, onSnapshot, addDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import autoTable from 'jspdf-autotable'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { pink, cyan, lightGreen, orange } from '@mui/material/colors';
import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import { jsPDF } from "jspdf";
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
    const [user, setUser] = useState({});
    const [ordenesTecnico, setOrdenesTecnico] = useState([]);
    const [modalPendientes, setModalPendientes] = useState(false);
    const [codigosEquipo, setCodigosEquipo] = useState([]);
    const [estadof, setEstadof] = useState('');
    const [ctdPendientes, setCtdPendientes] = useState(0);
    const [ctdSolventadas, setCtdSolventadas] = useState(0);
    const [ctdActivas, setCtdActivas] = useState(0);
    const [modalInformacion2, setModalinformacion2] = useState(false);
    const [currentForm, setCurrentForm] = useState(orden_initialData);
    const [modalReportexistente, setModalReportexistente] = useState(false);
    const [modalReportin, setModalReportin] = useState(false);
    const [currentOrden, setCurrentOrden] = useState([]);
    const [inventario, setInventario] = useState([]);
    const [cequipo, setCequipo] = useState("");
    const [codigoe, setCodigoe] = useState("");
    const [rtmantenimiento, setRtmantenimiento] = useState("");
    const [btnReport, setBtnReport] = useState(false);
    const [equipment, setEquipment] = useState({});
    const [currentReporte, setCurrentReporte] = useState({});
    const [modalEditarReporte,setModalEditarReporte] = useState(false);
    const [nreporte, setNreporte] = useState({
        OrdenId: '',
        cedula: '',
        nombreT: '',
        falla: '',
        id: '',
        codigoe: '',
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
    });
    const play = async (data) => {

        const reference = doc(db, "ordenes", `${data.id}`);
        //var someDate = Math.round(Date.now() / 1000);
        //console.log(someDate)
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
                    motivos_parada:item.motivos_parada,
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
                    motivos_parada:item.motivos_parada,
                }
            }
            

        });

        //console.log(lista_tecnicos)

        // tiempos.push(someDate);

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
        console.log(inicio)
        console.log(final)
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
                return new Promise(async (resolve) => {
                    if (value === '') {
                        resolve('Necesita seleccionar una opción')
                    } else {
                        const reference = doc(db, "ordenes", `${data.id}`);
                        //var someDate = Math.round(Date.now() / 1000);
                        //console.log(someDate)
                        var razonparada = data.tecnicos.find(item=> item.id === currentUser.uid).motivos_parada;
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
                                    motivos_parada:item.motivos_parada,
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
        if(data.encargado.id === currentUser.uid){
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
                var horas ;
                var horasminutos ;
                var someDate = Math.round(Date.now() / 1000);            
                //aqui empezamos nuevamente 
                var lista_tecnicos =  JSON.parse(JSON.stringify(data.tecnicos))
                for(let i = 0;i<lista_tecnicos.length;i++){
                    var tiempos = lista_tecnicos[i].tiempos.slice();

                    // if (data.mparada.length === 0) {
                    //     razonfinal = "Sin Interrupción"
                    // } else {
                    //     razonfinal = lista_tecnicos[i].motivo_parada.pop()
                    // }
                    if(tiempos.length === 0){
                        tiempos = []
                         horas = 0
                         horasminutos = "0h00"                  
                    }else{
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
    }else{
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
            var codigos = inventarioD.map(item => item.codigo)

            setInventario(inventarioD);
            setCodigosEquipo(codigos);

        });



    }

    const selectEquipo = (val) => {
        const equipos2 = inventario.find(item => item.codigo === val)
        const equipos = inventario.find(item => item.codigo === val)
        setEquipment(equipos2);
        setCequipo(equipos.equipo);
        setCodigoe(val);
        console.log(equipos2)

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

    const sendReportFirebase = async () => {
        const re = nreporte;
        re['OrdenId'] = currentOrden.id;
        re['cedula'] = currentUser.indentification;
        re['nombreT'] = currentUser.name + ' ' + currentUser.lastname + ' ' + currentUser.secondlastname;
        re['equipo'] = cequipo;
        re['codigoe'] = codigoe;
        re['tmantenimiento'] = rtmantenimiento;
        re['estadof'] = estadof;
        re['fecha'] = new Date().toLocaleString("en-US");
        re['departamento'] = currentOrden.departamento;
        re['razonp'] = currentOrden.razonp;
        re['importancia'] = equipment.importancia;
        re['indice'] = new Date().getTime();
        
        let tecnicos_aux =  JSON.parse(JSON.stringify(currentOrden.tecnicos))

        let tiempos_aux = []
        for(let i=0;i<tecnicos_aux.length;i++){
            let temp = tecnicos_aux[i].tiempos

            for(let j = 0; j<temp.length;j++){
                tiempos_aux.push(temp[j])
            }
        }

        re['horas'] = calcularHoras(tiempos_aux);
        re['tiempo'] = calcularTiempos(tiempos_aux);


        Swal.fire(
            'Completado',
            'Reporte Agregado con éxito',
            'success'
        )
        const newReporte = await addDoc(collection(db, "reportesint"), re);
        if (newReporte.id !== null) {
            console.log(newReporte.id)
            const reference = doc(db, "ordenes", `${currentOrden.id}`);
            var reportesID = currentOrden.reporteId
            reportesID.push(newReporte.id)
            updateDoc(reference, {
                reporte: true,
                reporteId: reportesID,
            });
            const reference2 = doc(db, "reportesint", `${newReporte.id}`);
            updateDoc(reference2, {
                id: newReporte.id,
            });
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
            const docRef = doc(db, "reportesint", `${orden.reporteId.slice(-1)}`);
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
            let a = ordenes.filter(item => usern.tareas.includes(item.id)).filter(filterStateIniciadas)
            let aux = 0
            for(let i = 0;i<a.length;i++){
                let tec = a[i].tecnicos
              
                    for(let j = 0; j<tec.length;j++){
                        let aux2 = tec[j]
                        if(aux2.id === currentUser.uid){
                        if(aux2.pause === false){
                            aux= aux+1
                        }
                    }
                    }
                
            }
            console.log(a)
            setCtdPendientes(p);
            setCtdSolventadas(s);
            setCtdActivas(aux);



        });
    }


    const generarPdf = () => {
        var doc = new jsPDF({
            orientation: "portrait",
        })
        doc.text("Hospital del Río ", 90, 10); //fontsize 15
        doc.setFontSize(12)// de aqui para abajo todo estara con fontsize 9
        doc.text("Reporte de Mantenimiento", 85, 20)
        // doc.setFontSize(10)
        // doc.text("Id Reporte:",20, 30)
        // doc.text(currentReporte.id,70, 30)
        // doc.text("Id Orden de Trabajo:",20, 40)
        // doc.text(currentReporte.OrdenId,70, 40)
        // doc.text("Código Equipo:",20, 50)
        // doc.text(currentReporte.codigoe,70, 50)
        // doc.text("Equipo:",20, 60)
        // doc.text(currentReporte.equipo,70, 60)
        // doc.text("Técnico:",20, 70)
        // doc.text(currentReporte.nombreT,70, 70)
        // doc.text("Estado:",20, 80)
        // doc.text(currentReporte.estadof,70, 80)
        // doc.text("Tipo de Mantenimiento:",20, 90)
        // doc.text(currentReporte.tmantenimiento,70, 90)
        // doc.text("Tiempo:",20, 100)
        // doc.text(currentReporte.tiempo,70, 100)
        // doc.text("Costo:",20, 110)
        // doc.text(currentReporte.costo,70, 110)

        let aux = 15
        let datos_tabla =
            [
                ["Id Reporte", currentReporte.id],
                ["Id O/T", currentReporte.OrdenId],
                ["Código Equipo", currentReporte.codigoe],
                ["Equipo", currentReporte.equipo],
                ["Técnico", currentReporte.nombreT],
                ["Estado", currentReporte.estadof],
                ["Tipo de Mantenimiento", currentReporte.tmantenimiento],
                ["Tiempo", currentReporte.tiempo],
                ["Costo", currentReporte.costo],
                ["Falla", currentReporte.falla],
                ["Causas", currentReporte.causas],
                ["Observaciones", currentReporte.observaciones]
            ]

        autoTable(doc, {
            startY: aux + 10,
            head: [['Item', 'Descripción']],
            body: datos_tabla,
        })

        doc.save(`reporte_${currentReporte.id}.pdf`);

    }
    // creamos el codigo para editar los reportes
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
    const cambiarDatosReporte = (event)=>{
        setCurrentReporte({
            ...currentReporte,
            [event.target.name]: event.target.value,
        });
    }
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
                                <div className="card-body12-tabla small" style={{ height: 350, overflow: "scroll" }}>
                                    <div>

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
                                                                <IconButton aria-label="play" onClick={() => play(dato)} disabled={dato.tecnicos.find(item=> item.id === currentUser.uid).play} sx={{ color: lightGreen[500] }}><PlayCircleFilledWhiteIcon /></IconButton>
                                                                <IconButton aria-label="pause" onClick={() => pause(dato)} disabled={dato.tecnicos.find(item=> item.id === currentUser.uid).pause} sx={{ color: orange[500] }}><PauseCircleIcon /></IconButton>
                                                                <IconButton aria-label="stop" onClick={() => stop(dato)} disabled={dato.tecnicos.find(item=> item.id === currentUser.uid).pause} sx={{ color: pink[500] }}><StopCircleIcon /></IconButton>
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
                                                                style={{textTransform:"uppercase"}} 
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
                                                                style={{textTransform:"uppercase"}} 
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
                                                                style={{textTransform:"uppercase"}} 
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

                                    <h5 className="titulo-ev">Reportes Encargados</h5>
                                    <Avatar sx={{ bgcolor: lightGreen[500] }} >
                                        <DoneAllIcon />
                                    </Avatar>

                                </div>
                            }
                            {
                                <div className="card-body12-tabla small" style={{ height: 350, overflow: "scroll" }}>
                                    <div >

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
                                                        <Grid item xs={12}>
                                                            <label>
                                                                <b>Responsable:  </b>
                                                                {currentForm.encargado.name}
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
                                                                style={{textTransform:"uppercase"}} 
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
                                                                style={{textTransform:"uppercase"}} 
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
                                                                style={{textTransform:"uppercase"}} 
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
                        <div><h1>Reporte Interno</h1></div>
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
                                <TextareaAutosize
                                    style={{textTransform:"uppercase"}} 
                                    aria-label="minimum height"
                                    minRows={2}
                                    placeholder="Falla"
                                    className="text-area-encargado"
                                    name="falla"
                                    onChange={createReport} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    style={{textTransform:"uppercase"}} 
                                    aria-label="minimum height"
                                    minRows={2}
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
                                    minRows={2}
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
                                    minRows={2}
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
                                    minRows={2}
                                    placeholder="Observaciones"
                                    className="text-area-encargado"
                                    name="observaciones"
                                    onChange={createReport}
                                />
                            </Grid>
                        </Grid>

                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outlined"
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
                                    <b>Orden Trabajo:  </b>
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
                                    style={{textTransform:"uppercase"}} 
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
                                    style={{textTransform:"uppercase"}} 
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
                                    style={{textTransform:"uppercase"}} 
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
                                    style={{textTransform:"uppercase"}} 
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
                                    style={{textTransform:"uppercase"}} 
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
                            onClick={generarPdf} >
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
                        <div><h5>Editar Reporte Interno - {currentReporte.OrdenId}</h5></div>
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