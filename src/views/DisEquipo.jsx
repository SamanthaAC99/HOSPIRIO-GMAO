// import { useSelector } from "react-redux";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import TarjetaSamylu from "../components/TarjetaSamylu";
import AddIcon from '@mui/icons-material/Add';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import HailIcon from '@mui/icons-material/Hail';
import Grid from '@mui/material/Grid'; // Grid version 1
import "../css/TestView.css"
import "../css/GestionOtView.css"
import "../css/Disponibilidad.css"
import { collection, query, doc, updateDoc, onSnapshot,getDoc  } from "firebase/firestore";
import Avatar from '@mui/material/Avatar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { db } from "../firebase/firebase-config"
import { useState, useEffect } from "react";
import { blue, pink, lightGreen, lightBlue, deepPurple, green } from '@mui/material/colors';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import PersonIcon from '@mui/icons-material/Person';
import DomainIcon from '@mui/icons-material/Domain';
import ReportIcon from '@mui/icons-material/Report';
import CommentIcon from '@mui/icons-material/Comment';
import FeedIcon from '@mui/icons-material/Feed';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import HandymanIcon from '@mui/icons-material/Handyman';
import FlakyIcon from '@mui/icons-material/Flaky';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ArticleIcon from '@mui/icons-material/Article';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import { useParams } from "react-router-dom";
import TarjetaGestionar from '../components/TarjetaGestionar';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';
import React from 'react';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InventoryIcon from '@mui/icons-material/Inventory';
import TarjetasDisp from '../components/TarjetasDisp';
import TarjetasMt from '../components/TarjetaMttr';

export default function DispEquipo() {
    const [encargados, setEncargados] = useState([]);
    const [mttr, setMttr] = useState(0);
    const [fallos, setFallos] = useState(0);
    const [fallosf, setFallosf] = useState(0);
    const [ctdad, setCtdad] = useState(0);
    const [data, setData] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [nombresEquipo, setNombresEquipo] = useState([]);
    const [codigoEquipo, setCodigoEquipo] = useState([]);
    const [selecEquipo, setSelecEquipo] = useState([]);
    const [ordenFirebase, setOrdenFirebase] = useState({
        fecha: '',
        indice: '',
        cedula: '',
        departamento: '',
        codigoe: '',
        asunto: '',
        problematica: '',
        observaciones: '',
        estado: "Pendiente", // valores iniciados por defecto
        prioridad: "Pendiente", // valores iniciados por defecto
        tipotrabajo: "Pendiente", // valores iniciados por defecto
        tecnicos: [],  // valores iniciados por defecto
        encargado: {
            id: '',
            name: '',
            lastname: '',
            secondlastname: '',
        }, // valores iniciados por defecto
        play: false, // valores iniciados por defecto
        pause: true,// valores iniciados por defecto
        nameImg: 'SP.PNG',
        id: '',
    });
    const [newEncargado, setNewEncargado] = useState({});
    const [delegado, setDelegado] = useState();
    const [datosactualizados, setDatosactualizados] = useState({
        prioridad: "Crítica",
        tipotrabajo: "Equipo Médico",
    });
    const [equipo, setEquipo] = useState({

    });
    const currentOrden = useSelector(state => state.ordens);
    const currentInventario = useSelector(state => state.inventarios);
    const [user, setUser] = useState({});
    const [time1, setTime1] = useState(new Date('Wen Nov 02 2022 24:00:00 GMT-0500'));
    const [time2, setTime2] = useState(new Date('Wen Nov 04 2022 23:59:59 GMT-0500'));
    const [ordenes, setOrdenes] = useState([]);
    const [externos, setExternos] = useState([]);
    const [internos, setInternos] = useState([]);
    const [codigos, setCodigos] = useState([]);
    const [reportesTotales, setReportesTotales] = useState([]);
    const [tabla, setTabla] = useState([]);
    const [horasCorrectivos, setHorasCorrectivos] = useState(0);
    const [disponibilidad2, setDisponibilidad2] = useState(0);
    const [mttri, setMttri] = useState(0);
    const [mtbf, setMtbf] = useState(0);
    const [horasProgramados, setHorasProgramados] = useState(0);
    const [fallosTarjeta, setFallosTarjeta] = useState(0);
    const [tiemposFechas, setTiemposFechas] = useState("");
    const [departamentos, setDepartamentos] = useState([]);
    const [departamento, setDepartamento] = useState("ALL");
    const [programadas, setProgramadas] = useState(0);

    const [correctivo, setCorrectivo] = useState(0);
    const navigate = useNavigate();
    let params = useParams();


    const navegarView = (ruta) => {
        navigate(`/${params.uid}/${ruta}`);
    }

    const cancelar = () => {
        navegarView('mantenimiento/estatus');
    };


    const getData = async () => {
        var interno = [];
        var externo = [];
        const reference = query(collection(db, "ingreso"));
        onSnapshot(reference, (querySnapshot) => {
            setData(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
        });
        const docRef = doc(db, "informacion", "parametros");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setNombresEquipo(docSnap.data().equipos);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        const ref1 = query(collection(db, "reportesext"));
        onSnapshot(ref1, (querySnapshot) => {
           
            querySnapshot.forEach((doc) => {
                externo.push(doc.data());
            });
            setExternos(externo);
            // setReportesUnidos(externo.concat(interno))
        });

        const ref2 = query(collection(db, "reportesint"));
        onSnapshot(ref2, (querySnapshot) => {
  
            querySnapshot.forEach((doc) => {
                interno.push(doc.data());
            });
            setInternos(interno);
        });
    };

    const handleOrdenes = () => {
        const reportes = internos.concat(externos)
        const filterFechas =reportes.filter(filteryByDateOrdenes)
        const filtercodigo =filterFechas.filter(filterByCodigo)
        const filtermantenimiento =filtercodigo.filter(filterCorrectivo)
        // const filteralerta =filtermantenimiento.filter(filterbyAlerta)
       
        const numeroalerta =filtermantenimiento.length
        const horasalerta =filtermantenimiento.map(state => state.horas).reduce((a, b) => a + b, 0)
        const mttr =(horasalerta/numeroalerta).toFixed(2);


        const feInicio = new Date(time1).getTime() / 1000
        const feFinal = new Date(time2).getTime() / 1000
        
        const fechas = [feInicio, feFinal]
        const horas = calcularHoras(fechas)
        console.log("HORAS",horas)
        const numerocorrectivos =filtermantenimiento.length
        const mtbf =(horas/numerocorrectivos).toFixed(2);

        const alertadeTodas =filtercodigo.filter(filterCorrectivo)
        const sumatoriaalertas =alertadeTodas.map(state => state.horas).reduce((a, b) => a + b, 0)
        const disponibilidad =(((horas-sumatoriaalertas)/horas)*100).toFixed(2);
        const fallostotales = filtercodigo.length
        console.log(feInicio)
        console.log(feFinal)
        console.log("fecha",filterFechas)
        console.log("codigo",filtercodigo)
        console.log(disponibilidad)
        setTabla(filtercodigo)
        setMttr(mttr)
        setMtbf(mtbf)
        setFallosTarjeta(fallostotales)
        setDisponibilidad2(disponibilidad)
    }

    const filteryByDateOrdenes = (orden)=>{
        console.log(orden)
        const fechaInicio = new Date(time1).getTime()
        const fechaFinal = new Date(time2).getTime()
        const fechaOrden = new Date(orden.indice).getTime()
        if(fechaOrden >= fechaInicio && fechaOrden <= fechaFinal){
            return orden
        }else{
            return null;
        }
    }

    const filterByCodigo = (reporte) => {
        if (reporte.codigoe === equipo) {
            return reporte;
        } else {
            return
        }
    }

    const filterCorrectivo = (tipo) => {
        if (tipo.tmantenimiento ==="CORRECTIVO") {
            return tipo;
        } else {
            return
        }
    }

    const filterbyAlerta = (alerta) => {
        if (alerta.nivelDeAlerta ==="No Funcional") {
            return alerta;
        } else {
            return
        }
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
        const horas = ((hfinal - hinicio) / 3600) + 24
        return horas

    }


    const SelectFecha1 = (newValue) => {
        setTime1(newValue);
    };
    const SelectFecha2 = (newValue) => {
        setTime2(newValue);
    };

    const nombreSeleccionado = (dato) => {
        console.log(dato)
        let aux_equipos = JSON.parse(JSON.stringify(data))
        console.log(aux_equipos)
        setSelecEquipo(dato)
        const codigos_obtenidos = aux_equipos.filter(item => item.equipo === dato)
        setCodigos(codigos_obtenidos)
        console.log(codigos_obtenidos)
    }

    const equipoSeleccionado = (dato) => {
        console.log("equipo", dato);
        setEquipo(dato.codigo);
    }

    const filterbyequipo = (_equipo) => {

        if (_equipo.equipo === selecEquipo) {
            return _equipo;
        } else {
            return null;
        }
    }





    //TERMINA SELEC FECHA ORDENES









    useEffect(() => {
        getData();
    }, [])

    return (
        <>
            <div className="container-test-2">
                <Grid container spacing={{ xs: 4 }} columns={{ xs: 4, sm: 8, md: 12 }}>


                    <Grid item xs={6} sm={6} md={2.75}>

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
                    <Grid item xs={6} sm={6} md={2.75}>
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



                    <Grid item xs={6} sm={6} md={2.75}>

                        <Autocomplete
                            disableClearable
                            id="combo-box-demo"
                            options={nombresEquipo}
                            getOptionLabel={(option) => {
                              return option.nombre;
                            }}
                            onChange={(event, newValue) =>{nombreSeleccionado(newValue.nombre)}}
                            renderInput={(params) => <TextField {...params} fullWidth label="Equipos" type="text" />}
                        />

                    </Grid>
                    <Grid item xs={6} sm={6} md={2.75}>
                        <Autocomplete
                            disableClearable
                            id="combo-box-demo"
                            options={codigos}
                            getOptionLabel={(option) => option.codigo}
                            onChange={(event, newValue) => { equipoSeleccionado(newValue) }}
                            renderInput={(params) => <TextField {...params} focused fullWidth label="CÓDIGO" type="text" />}
                        />
                    </Grid>

                    <Grid item xs={6} sm={6} md={1}>


                        <Button variant="outlined" startIcon={<DeleteIcon />} onClick={handleOrdenes} className="filtrar"  >
                            Filtrar</Button>
                    </Grid>


                    <Grid item xs={12} sm={6} md={3}>
                        <Grid container spacing={{ xs: 1, md: 4 }}>
                            <Grid item xs={12} sm={12} md={12}>
                                <TarjetasMt icono={<InventoryIcon />} valor1={disponibilidad2} unidades={"%"} 

                                    bgicon={blue[700]} titulo={'Disponibilidad'} indicador2={"Médico"} colort={"#598ec7"} />

                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>

                                <TarjetasMt icono={<MonitorHeartIcon />} valor1={mtbf} unidades={"[horas/fallos]"} bgicon={blue[700]} titulo={'MTBF'} indicador2={"20% Total"} colort={"#92b1d0"} />

                            </Grid>

                            <Grid item xs={12} sm={12} md={12}>
                                <TarjetasMt icono={<AssessmentIcon />} valor1={mttr} unidades={"[horas/fallos]"}  bgicon={blue[700]} titulo={'MTTR'} indicador2={"Indicador"} colort={"#9bbde2"} />

                            </Grid>

                            <Grid item xs={12} sm={12} md={12}>
                                <TarjetasMt icono={< ReportProblemIcon />} valor1={fallosTarjeta} bgicon={blue[700]} titulo={'Fallos'} indicador2={"Anual"} colort={"#b3cde8"} />

                            </Grid>

                        </Grid>
                    </Grid>

                    {/* empieza container tablas  */}

                    <Grid item xs={12} sm={6} md={9}>
                        <Grid container spacing={{ xs: 3, md: 4 }}>

                            <Grid item xs={12} sm={12} md={12}>
                                <div className="card13" >
                                    {
                                        <div className="header-ev-dis">
                                            <h5 className="titulo-ev">Indicadores de Disponibilidad</h5>

                                            <Avatar sx={{ bgcolor: blue[700] }} >
                                                {/* <WorkHistoryIcon /> */}
                                            </Avatar>

                                        </div>
                                    }
                                    {
                                        <div className="card-body12-tabla small">
                                            <div className="ScrollStyle">

                                                <Table className='table table-light table-hover'>
                                                    <Thead>
                                                        <Tr>
                                                            <Th>#</Th>
                                                            <Th className="t-encargados">Mantenimiento</Th>
                                                            {/* <Th className="t-encargados">Nivel Alerta</Th> */}
                                                            <Th className="t-encargados">Tiempo</Th>
                                                            <Th className="t-encargados">Falla</Th>


                                                        </Tr>
                                                    </Thead>
                                                    <Tbody>
                                                        {tabla.sort((a, b) => (a.indice - b.indice)).map((dato, index) => (
                                                            <Tr key={dato.indice}>
                                                                <Td>{index + 1}</Td>

                                                                <Td className="t-encargados">
                                                                    {dato.tmantenimiento}
                                                                </Td>
                                                                {/* <Td className="t-encargados">
                                                                    {dato.nivelDeAlerta}
                                                                </Td> */}
                                                                <Td className="t-encargados">
                                                                    {dato.tiempo}
                                                                </Td>

                                                                <Td className="t-encargados">
                                                                    {dato.falla}
                                                                </Td>
                                                            </Tr>
                                                        ))}
                                                    </Tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    }

                                </div>
                            </Grid>




                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </>
    );

}