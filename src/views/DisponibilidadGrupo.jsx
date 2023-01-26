import React, { useState, useEffect } from "react";
import { collection, doc, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import GraficaDona from "../components/GraficoDona";
import BarChart from "../components/Graficabarras";
import Example from "../components/MenuContent/ProgressBar";
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Avatar from '@mui/material/Avatar';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { blue, deepPurple, green, pink, orange } from '@mui/material/colors';
import TarjetaIndicadores from "../components/TarjetasIndicadores";
import TarjetasGraficos from "../components/TarjetasGraficos";
import DomainDisabledIcon from '@mui/icons-material/DomainDisabled';
import RadialSeparators from "../components/RadialSeparator";
import NotificationsPausedIcon from '@mui/icons-material/NotificationsPaused';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import Button from '@mui/material/Button';
import { useSelector } from "react-redux";

import Autocomplete from '@mui/material/Autocomplete';
import {
    CircularProgressbarWithChildren,
    buildStyles
} from "react-circular-progressbar";
import "../css/PruebasView.css"
import "../css/Grupo.css"
import "react-circular-progressbar/dist/styles.css";
import GraficaDisponibilidadTotal from "../components/GraficaDisponibilidadT";

export default function DisponibilidadGrupo() {
    const currentUser = useSelector(state => state.auths);
    const currentInventario = useSelector(state => state.inventarios);
    const [user, setUser] = useState({});
    const [mttr, setMttr] = useState(0);
    const [reportes, setReportes] = useState([]);
    const [ctdad, setCtdad] = useState(0);
    const [time1, setTime1] = useState(new Date());
    const [time2, setTime2] = useState(new Date());
    const [ordenes, setOrdenes] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [departamento, setDepartamento] = useState("ALL");
    const [data, setData] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [selecEquipo, setSelecEquipo] = useState([]);
    const [codigose, setCodigose] = useState([]);
    const [reportesTotales, setReportesTotales] = useState([]);



    //EMPIEZA SELEC FECHA ORDENES
    const SelectFecha1 = (newValue) => {
        setTime1(newValue);
    };
    const SelectFecha2 = (newValue) => {
        setTime2(newValue);
    };

    const handleReportes = () => {
        const filtroImportancia = reportesTotales.filter(filterByImportancia)
        const filtroFecha = filtroImportancia.filter(filteryByDate)
        const filtroCorrectivo = filtroFecha.filter(filterbyCorrectivo)
        const filtrarAlertas = filtroCorrectivo.filter(filterNivelAlerta).map(item=> item.horas)
        const longitud =  filtroImportancia.length
        const horas = filtrarAlertas.reduce((a, b) => a + b, 0)
        const disponibilidad = (horas/longitud)*100
        console.log(disponibilidad)
    }
    const filterbyCorrectivo = (_reporte) => {
        if (_reporte.tmantenimiento === "Correctivo") {
            return _reporte;
        } else {
            return null;
        }

    }
    const filterNivelAlerta = (_reporte) => {
        if (_reporte.nivelDeAlerta === "No Funcional") {
            return _reporte;
        } else {
            return null;
        }

    }
    const filteryByDate = (_reporte) => {
        const fechaInicio = new Date(time1).getTime()
        const fechaFinal = new Date(time2).getTime()
        const fechaReporte = new Date(_reporte.fecha).getTime()
        if (fechaReporte >= fechaInicio && fechaReporte <= fechaFinal) {
            return _reporte
        } else {
            return null;
        }

    }


    const EquipoSeleccionado = (holis) => {
        setSelecEquipo(holis)
        var codigoe = data.filter(item => item.equipo === holis)
        setCodigose(codigoe.map((item) => item.codigo))
        console.log(codigoe)
    }


    const getData = () => {
        var interno = [];
        var externo = [];
        const reference = query(collection(db, "ingreso"));
        onSnapshot(reference, (querySnapshot) => {
            setData(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
        });

        onSnapshot(doc(db, "usuarios", currentUser.uid), (doc) => {
            setUser(doc.data());
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

    }

    //TERMINA SELEC FECHA ORDENES

    const filterByImportancia = (_reporte) => {
        if (_reporte.importancia === "Significativas") {
            return _reporte;
        } else {
            return null;
        }

    }
    useEffect(() => {
        getData();
    }, [])
    return (
        <>
            <div className="contenedor-indicadores-dispi">
                <Grid container spacing={{ xs: 4 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={6} sm={6} md={2.50}>

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
                    <Grid item xs={6} sm={6} md={2.50}>
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



                    {/* <Grid item xs={6} sm={6} md={2.75}>

                <Autocomplete
                                                        disableClearable
                                                 
                                                        id="combo-box-demo"
                                                        options= {equipos}
                                                        onChange={(event, newvalue) =>EquipoSeleccionado(newvalue)} 
                                                        renderInput={(params) => <TextField {...params} fullWidth label="Equipos" type="text" />}
                                                    />

</Grid>
<Grid item xs={6} sm={6} md={2.75}>
<Autocomplete
                                                        disableClearable
                                                 
                                                        id="combo-box-demo"
                                                        options=  {codigose}
                                                        onChange={(event, newvalue) => setEquipos(newvalue)}
                                                        renderInput={(params) => <TextField {...params} fullWidth label="Códigos"  type="text" />}
                                                    />
                  
                
                 
                </Grid> */}



                    <Grid item xs={6} sm={6} md={0.5}>


                        <Button variant="outlined" startIcon={<DeleteIcon />} className="filtrar"  onClick={handleReportes} >
                            Filtrar2</Button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}></Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <div className="card12" >

                            {
                                <div className="card-body12 small ">
                                    {/* <LineChart labels={['Ene', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov','Dec']} datos={[1,2,3,4,5,6,7,8,9,10,11,12]}/> */}
                                    <GraficaDisponibilidadTotal labels={['Ene', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec',]} datos={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} info={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} />
                                </div>
                            }

                        </div>
                    </Grid>

                    <Grid item xs={12} sm={12} md={3}>
                        <div className="card12" >

                            {
                                <div className="card-body12 small ">
                                    {/* <ProgressBar
            radius={140}
            progress={94}
            strokeWidth={20}
            strokeColor="#3e98c7"
            strokeLinecap="round"
            trackStrokeWidth={18}
            counterClockwise
        >
            <div className="indicator">
                <div>{94}%</div>
            </div>
        </ProgressBar> */}

                                    <Example>
                                        <p className="titulo-card-g">Disponibilidad</p>
                                        <CircularProgressbarWithChildren
                                            value={currentInventario.disponibilidad}
                                            text={`${currentInventario.disponibilidad}%`}
                                            strokeWidth={10}
                                            styles={buildStyles({
                                                strokeLinecap: "butt"
                                            })}
                                        >

                                        </CircularProgressbarWithChildren>
                                    </Example>

                                </div>
                            }

                        </div>
                    </Grid>


                    <Grid item xs={12} sm={12} md={3}>
                        <div className="card12" >

                            {
                                <div className="card-body12 small ">

                                    <Example>
                                        <p className="titulo-card-g">Fiabilidad</p>
                                        <CircularProgressbarWithChildren
                                            value={currentInventario.disponibilidad}
                                            text={`${currentInventario.disponibilidad}%`}
                                            strokeWidth={10}
                                            styles={buildStyles({
                                                strokeLinecap: "butt"

                                            })}
                                        >

                                        </CircularProgressbarWithChildren>
                                    </Example>

                                </div>
                            }

                        </div>
                    </Grid>

               

                    <Grid item xs={6} sm={6} md={12}>
                        <Grid container spacing={{ xs: 4 }}>

                            <Grid item xs={6} sm={6} md={3}>
                                <div className="card-container">
                                    <TarjetaIndicadores icono={<StackedBarChartIcon />} valor={currentInventario.mttr} bgicon={blue[700]} titulo={'MTBF Total'} colort={"#598ec7"} />
                                </div>
                            </Grid>
                            <Grid item xs={6} sm={6} md={3}>
                                <div className="card-container">
                                    <TarjetaIndicadores icono={< StackedBarChartIcon />} valor={currentInventario.mtbf} bgicon={blue[700]} titulo={'MTTR Total'} colort={"#598ec7"} />
                                </div>
                            </Grid>
                            <Grid item xs={6} sm={6} md={3}>
                                <div className="card-container">
                                    <TarjetaIndicadores icono={<StackedBarChartIcon />} valor={currentInventario.mttr} bgicon={blue[700]} titulo={'MTBF Total'} colort={"#598ec7"} />
                                </div>
                            </Grid>
                            <Grid item xs={6} sm={6} md={3}>
                                <div className="card-container">
                                    <TarjetaIndicadores icono={< StackedBarChartIcon />} valor={currentInventario.mtbf} bgicon={blue[700]} titulo={'MTTR Total'} colort={"#598ec7"} />
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>









                    {/* <Grid item xs={12} sm={12} md={6}>
                    <div className="card-tabla-dis" >
                            {
                                <div className="header-ev-dis">
                                    <h5 className="titulo-ev">MTTR</h5>

                                    <Avatar sx={{ bgcolor: blue[700] }} >
                                        <TrendingDownIcon />
                                    </Avatar>

                                </div>
                            }
                            {
                                <div className="card-bodyd">
                                    <div className="Scroll">

                                        <Table className='table table-light table-hover'>
                                            <Thead>
                                                <Tr>
                                                    <Th>#</Th>
                                                    <Th className="t-encargados">Código</Th>
                                                    <Th className="t-encargados">Equipo</Th>
                                                    <Th className="t-encargados">MTTR</Th>
                                                   

                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                            {data.sort((a, b) => (a.indice - b.indice)).map((dato, index) => (
                                                     <Tr key={dato.indice}>
                                                     <Td>{index + 1}</Td>

                                                        <Td className="t-encargados">
                                                        {dato.codigo}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                        {dato.equipo}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                        {dato.mttr}
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
               

                    <Grid item xs={12} sm={12} md={6}>
                    <div className="card-tabla-dis" >
                            {
                                <div className="header-ev-dis">
                                    <h5 className="titulo-ev">MTBF</h5>

                                    <Avatar sx={{ bgcolor: blue[700] }} >
                                        <TrendingUpIcon />
                                    </Avatar>

                                </div>
                            }
                            {
                                <div className="card-bodyd">
                                    <div className="Scroll">

                                        <Table className='table table-light table-hover'>
                                            <Thead>
                                                <Tr>
                                                    <Th>#</Th>
                                                    <Th className="t-encargados">Código</Th>
                                                    <Th className="t-encargados">Equipo</Th>
                                                    <Th className="t-encargados">MTBF</Th>
                                                   

                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                            {data.sort((a, b) => (a.indice - b.indice)).map((dato, index) => (
                                                     <Tr key={dato.indice}>
                                                     <Td>{index + 1}</Td>

                                                        <Td className="t-encargados">
                                                        {dato.codigo}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                        {dato.equipo}
                                                        </Td>
                                                        <Td className="t-encargados">
                                                        {dato.mtbf}
                                                        </Td>
                                                    </Tr>
                                                      ))}
                                            </Tbody>
                                        </Table>
                                        </div>
                                        </div>
                                    }

</div>
                    </Grid> */}

                </Grid>
            </div>
        </>
    );

}