// import { useSelector } from "react-redux";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Grid from '@mui/material/Grid'; // Grid version 1
import "../css/TestView.css"
import "../css/GestionOtView.css"
import "../css/Disponibilidad.css"
import { collection, query, doc, onSnapshot } from "firebase/firestore";
import Avatar from '@mui/material/Avatar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { db } from "../firebase/firebase-config"
import { useState, useEffect } from "react";
import { blue} from '@mui/material/colors';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { useParams } from "react-router-dom";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InventoryIcon from '@mui/icons-material/Inventory';
import TarjetasDisp from '../components/TarjetasDisp';
import TarjetasMt from '../components/TarjetaMttr';

export default function DisponibilidadEquipo() {
    const [encargados, setEncargados] = useState([]);
    const [mttr, setMttr] = useState(0);
    const [fallos, setFallos] = useState(0);
    const [fallosf, setFallosf] = useState(0);
    const [ctdad, setCtdad] = useState(0);
    const [data, setData] = useState([]);
    const [equipos, setEquipos] = useState([]);
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

    const currentOrden = useSelector(state => state.ordens);
    const currentInventario = useSelector(state => state.inventarios);
    const [user, setUser] = useState({});
    const [time1, setTime1] = useState(new Date());
    const [time2, setTime2] = useState(new Date());
    const [ordenes, setOrdenes] = useState([]);
    const [codigose, setCodigose] = useState([]);
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
        onSnapshot(doc(db, "informacion", "ksCkGtZm1u2I0y5YoC4g"), (doc) => {
            setEquipos(doc.data().equipos)
        });
        const ref1 = query(collection(db, "reportesext"));
        onSnapshot(ref1, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                externo.push(doc.data());
            });

        });
        const ref2 = query(collection(db, "reportesint"));
        onSnapshot(ref2, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                interno.push(doc.data());
            });
            const ordenesUnidas = interno.concat(externo);
            console.log("ordenes unidas", ordenesUnidas);
            setReportesTotales(ordenesUnidas);
        });
    };

    const handleOrdenes = () => {
        const fechaInicio = new Date(time1).getTime() / 1000
        const fechaFinal = new Date(time2).getTime() / 1000
        // //PROGRAMADAS
        const  Filtradasporcodigo = reportesTotales.filter(filterByCodigo)
        const ProgramadasFiltradas = Filtradasporcodigo.filter(filterParadaprogramada)
        const ProgramadasFechas = ProgramadasFiltradas.filter(filteryByDateOrdenes).map(item => item.horas).reduce((a, b) => a + b, 0)
        const horasP = ProgramadasFechas
        // const  Filtradasporcodigo = reportesTotales.filter(filterByCodigo)
        // const ProgramadasFechas = Filtradasporcodigo.filter(filteryByDateReportes)
        // const ProgramadasFiltradas = ProgramadasFechas.filter(filterParadaprogramada).map(item => item.horas).reduce((a, b) => a + b, 0)
        // const horasP = ProgramadasFiltradas

        // // NO PROGRAMADAS
        const CorrectivasFiltradas = Filtradasporcodigo.filter(filterCorrectivo)
        console.log(CorrectivasFiltradas)
        const FiltroFechas2 = CorrectivasFiltradas.filter(filteryByDateOrdenes)
        console.log(FiltroFechas2)
        const FiltroFechas = CorrectivasFiltradas.filter(filteryByDateOrdenes).map(state => state.horas).reduce((a, b) => a + b, 0)
        const filtroalertanof = FiltroFechas2.filter(filterbyAlerta).map(state => state.horas).reduce((a, b) => a + b, 0)
        const HorasNP = FiltroFechas
        // const  Filtradasporcodigomttr = reportesTotales.filter(filteryByDateReportes)
        // console.log(Filtradasporcodigomttr)
        // const FiltroFechas2 = Filtradasporcodigomttr.filter(filterByCodigo)
        // console.log(FiltroFechas2)
        // const CorrectivasFiltradas = FiltroFechas2.filter(filterCorrectivo)
        // console.log(CorrectivasFiltradas)
        // const Filtroalertanof= CorrectivasFiltradas.filter(filterbyAlerta).map(state => state.horas).reduce((a, b) => a + b, 0)
        // const HorasNP = Filtroalertanof
        // disponibilidad
   
        const fechas = [fechaInicio, fechaFinal]
        const horas = calcularHoras(fechas)
        const fallosmtbf = CorrectivasFiltradas.length
        const fallosmttr = CorrectivasFiltradas.filter(filterbyAlerta).length
        const mtbf = (horas/fallosmtbf).toFixed(2);
        const mttr = (filtroalertanof/fallosmttr).toFixed(2);
        const disponibilidad = (((horas - horasP - HorasNP) / horas) * 100).toFixed(2);

        
        //Numero Fallos
        const CorrectivasNumero = Filtradasporcodigo.filter(filterCorrectivo)
        const FechasNumero = CorrectivasNumero.filter(filteryByDateReportes).length

        console.log(horas)
        console.log("mtbf",mtbf)
        console.log("mttr",mttr)
        console.log("disponibilidad",disponibilidad)
        setMttr(mttr)
        setMtbf(mtbf)
        setDisponibilidad2(disponibilidad)
        setTabla(FiltroFechas2)
        setFallosTarjeta(FechasNumero)

        //TABLA REPORTES
    }

    const filteryByDateReportes = (orden) => {
        const fechaInicio = new Date(time1).getTime()
        const fechaFinal = new Date(time2).getTime()
        const fechaReporte = new Date(orden.fecha).getTime()
        if (fechaReporte >= fechaInicio && fechaReporte <= fechaFinal) {
            return orden
        } else {
            return null;
        }

    }

    const filterByCodigo = (reporte) => {
        if (reporte.codigoe === codigoEquipo) {
            return reporte;
        } else {
            return
        }
    }

    const filterParadaprogramada = (state) => {
        if (state.tmantenimiento ==="PREVENTIVO") {
            return state;
        } else {
            return
        }
    }

    const filterCorrectivo = (dats) => {
        if (dats.tmantenimiento === 'CORRECTIVO') {
            return dats;
        } else {
            return
        }
    }

    const filterbyAlerta = (alert) => {
        if (alert.nivelDeAlerta ==="No Funcional") {
            return alert;
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

    const EquipoSeleccionado = (dato) => {
        setSelecEquipo(dato)
        var codigoe = data.filter(item => item.equipo === dato)
        setCodigose(codigoe.map((item) => item.codigo))
        console.log(codigoe)
    }

    const filterbyequipo = (_equipo) => {

        if (_equipo.equipo === selecEquipo) {
            return _equipo;
        } else {
            return null;
        }
    }

    // const selecCodigo =()=>{
    //     var equipos = data;
    //     var codigos=  equipos.map((dato, index) => (dato.codigo))

    // }






    const filteryByDateOrdenes = (orden) => {
        const fechaInicio = new Date(time1).getTime()
        const fechaFinal = new Date(time2).getTime()
        const fechaOrden = new Date(orden.fecha).getTime()
        if (fechaOrden >= fechaInicio && fechaOrden <= fechaFinal) {
            return orden
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
                            options={equipos}
                            onChange={(event, newvalue) => EquipoSeleccionado(newvalue)}
                            renderInput={(params) => <TextField {...params} fullWidth label="Equipos" type="text" />}
                        />

                    </Grid>
                    <Grid item xs={6} sm={6} md={2.75}>
                        <Autocomplete
                            disableClearable

                            id="combo-box-demo"
                            options={codigose}
                            onChange={(event, newvalue) => setCodigoEquipo(newvalue)}
                            renderInput={(params) => <TextField {...params} fullWidth label="Códigos" type="text" />}
                        />



                    </Grid>

                    <Grid item xs={6} sm={6} md={1}>


                        <Button variant="outlined" startIcon={<DeleteIcon />} onClick={handleOrdenes} className="filtrar"  >
                            Filtrar</Button>
                    </Grid>


                    <Grid item xs={12} sm={6} md={3}>
                        <Grid container spacing={{ xs: 1, md: 4 }}>
                            <Grid item xs={12} sm={12} md={12}>
                                <TarjetasDisp icono={<InventoryIcon />} valor={disponibilidad2}

                                    bgicon={blue[700]} titulo={'Disponibilidad'} indicador2={"Médico"} colort={"#598ec7"} />

                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>

                                <TarjetasMt icono={<MonitorHeartIcon />} valor={mtbf} bgicon={blue[700]} titulo={'MTBF'} indicador2={"20% Total"} colort={"#92b1d0"} />

                            </Grid>

                            <Grid item xs={12} sm={12} md={12}>
                                <TarjetasMt icono={<AssessmentIcon />} valor={mttr} bgicon={blue[700]} titulo={'MTTR'} indicador2={"Indicador"} colort={"#9bbde2"} />

                            </Grid>

                            <Grid item xs={12} sm={12} md={12}>
                                <TarjetasDisp icono={< ReportProblemIcon />} valor={fallosTarjeta} bgicon={blue[700]} titulo={'Fallos'} indicador2={"Anual"} colort={"#b3cde8"} />

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
                                            <h5 className="titulo-ev">Reportes de Mantenimientos</h5>

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
                                                            <Th className="t-encargados">Nivel Alerta</Th>
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
                                                                <Td className="t-encargados">
                                                                    {dato.nivelDeAlerta}
                                                                </Td>
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