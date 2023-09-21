// import { useSelector } from "react-redux";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import HailIcon from '@mui/icons-material/Hail';
import Grid from '@mui/material/Grid'; // Grid version 1
import "../css/TestView.css"
import "../css/GestionOtView.css"
import { collection, query, doc, updateDoc, onSnapshot } from "firebase/firestore";
import Avatar from '@mui/material/Avatar';
import { db } from "../firebase/firebase-config"
import { useState, useEffect } from "react";
import { blue, pink,deepPurple, yellow, cyan} from '@mui/material/colors';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
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

import { useParams } from "react-router-dom";
import TarjetaGestionar from '../components/TarjetaGestionar';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';
import React from 'react';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRef } from 'react';
export default function GestionOtVIew() {
    // const [externos, setExternos] = useState([]);
    // const [internos, setInternos] = useState([]);
    const [encargados, setEncargados] = useState([]);
    const [tecnicos, setTecnicos] = useState([]);
    const tecnicosFiltrados= useRef([]);
    const [startButton,setStartButton] = useState(true);
    const [clearAutoComplete,setClearAutoComplete] = useState(false)
    // const [tiempo,setTiempo]= useState(0);
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
    const currentUser = useSelector(state => state.auths);
    const navigate = useNavigate();
    let params = useParams();


    const navegarView = (ruta) => {
        navigate(`/${params.uid}/${ruta}`);
    }

    const cancelar = () => {
        navegarView('mantenimiento/estatus');
    };

    const activarTarea = () => {
        Swal.fire({
            title: '¿Deseas Continuar?',
            // text: "¡Se eliminará el reporte generado anteriormente!",
            text: "¡Se generará un nuevo reporte!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, actualizar!'
          }).then((result) => {
            if (result.isConfirmed) {
                // if (currentOrden.reporte === true) { 
                   
                //     deleteDoc(doc(db,`${currentOrden.tipo}`, `${currentOrden.reporteId}`));
                // }
                const ref = doc(db, "ordenes", `${currentOrden.id}`);
                updateDoc(ref, {
                    estado: "Pendiente",
                    play: false,
                    reporte:false,
                    // reporteId:"",
                    razonp: "",
                    horas: "",
                    horat: "",
                    tiempos:[],
                    mparada:[],
                    tiempot: "",
                    encargado: {},
                    verificacion: false,
                });
                Swal.fire(
                  "¡Orden Activada!",
                  '',
                  'success'
                  )
                
                
            }
          })



      
    };

    const anular = async () => {
        const ref = doc(db, "ordenes", `${currentOrden.id}`);
        await updateDoc(ref, {
            estado: "Rechazada",
            play: true
        });
        sendEmail("Rechazada");
    };

    //event detecta presionar switch o cualquier accion selec,etc. Pero no botones porque no dan indformacion
    const handleNewData = (event) => {
        setDatosactualizados({
            ...datosactualizados,
            [event.target.name]: event.target.value,
        })
    }


    const sendEmail = (estado) => {

        emailjs.send("service_22xh03a", "template_1n1prz4", {
            email: currentOrden.correo,
            id_orden: currentOrden.id,
            estado_orden: estado,
            jefe_name: currentUser.name + " " + currentUser.lastname,
            jefe_departamental: currentUser.area,
            cel_jefe: currentUser.cellphone,
            reply_to: currentUser.email,
        }, "Z1YvVmzlMz2V1hOEO");
    };



    const getData = async () => {
        const reference = query(collection(db, "usuarios"));
         await onSnapshot(reference, (querySnapshot) => {
            let aux= querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            let filtrados= aux.filter(item=>item.cargo!== "Usuario")
            setTecnicos(filtrados);
        });

        // const ref1 = query(collection(db, "reportesext"));
        // onSnapshot(ref1, (querySnapshot) => {
           
        //     querySnapshot.forEach((doc) => {
        //         externo.push(doc.data());
        //     });
        //     setExternos(externo);
        // });

        // const ref2 = query(collection(db, "reportesint"));
        // onSnapshot(ref2, (querySnapshot) => {
  
        //     querySnapshot.forEach((doc) => {
        //         interno.push(doc.data());
        //     });
        //     setInternos(interno);
        // });

        onSnapshot(doc(db, "ordenes", `${currentOrden.id}`), (doc) => {
            setEncargados(doc.data().tecnicos);
            setOrdenFirebase(doc.data());
        });

    };
    
    const agregarDelegado = () => {
        const ref = doc(db, "ordenes", `${currentOrden.id}`);
        updateDoc(ref, {
            encargado: delegado,
        });
        
        
        Swal.fire({
            icon: 'warning',
            title: 'RECUERDE INICIAR TAREA',
            text:"¡Designar Prioridad, Tipo de Trabajo, Técnicos y Responsable!",
            showConfirmButton: true,
          })
    }
    const agregarEncargado = () => {
        if (newEncargado !== null) {
            var delegados = JSON.parse(JSON.stringify(encargados)); // llamamos a la lista de encargados
            var tareas = newEncargado.tareas;
            tareas.push(currentOrden.id)
            delegados.push({ id: newEncargado.uid, lastname: newEncargado.lastname, name: newEncargado.name, secondlastname: newEncargado.secondlastname,play:false,pause:true,tiempos:[],motivos_parada:[],tiempo_horas:0,tiempo_total:"" });
            setEncargados(delegados);
            const ref = doc(db, "ordenes", `${currentOrden.id}`);
            updateDoc(ref, {
                tecnicos: delegados,
            });
            const ref2 = doc(db, "usuarios", `${newEncargado.uid}`);
            updateDoc(ref2, {
                tareas: tareas,
            });
            setStartButton(false)
            setClearAutoComplete(!clearAutoComplete)
        } else {
            return;
        }
    }



    const eliminarEncargado = (index) => {
        const data = encargados.filter(item => item.id !== index.id)
        const newData = tecnicos.filter((item) => item.uid === index.id)
        var tareasTecnico = newData[0].tareas
        const tareasNew = tareasTecnico.filter((item) => item !== currentOrden.id)
        setEncargados(data)
        const ref = doc(db, "ordenes", `${currentOrden.id}`);
        updateDoc(ref, {
            tecnicos: data,
        });
        const ref2 = doc(db, "usuarios", `${index.id}`);
        updateDoc(ref2, {
            tareas: tareasNew,
        }
        )
    }

    const cambiartipopriori = async () => {
        Swal.fire({
            icon: 'success',
            title: 'Orden de Trabajo Actualizada con éxito',
            showConfirmButton: false,
            timer: 1500
        })

        const ref = doc(db, "ordenes", `${currentOrden.id}`);
        await updateDoc(ref, {
            prioridad: datosactualizados.prioridad,
            tipotrabajo: datosactualizados.tipotrabajo,
        });
        if (ordenFirebase.estado === "Pendiente") {
            await updateDoc(ref, {
                estado: "Iniciada"
            });
            sendEmail("Aprobada");
        }
        console.log("Se actualizaron los datos");
        navegarView('mantenimiento/estatus');
    };


    useEffect(() => {
        getData();
        // eslint-disable-next-line
    }, [])

    return (
        <>
            <div className="container-test-2">
                <Grid container spacing={{ xs: 3 }} >
                <Grid item xs={6} sm={6} md={3}>
                            <Button variant="outlined"
                              sx={{height:"100%"}}
                                fullWidth
                                color='rojo'
                                startIcon={<ArrowBackIcon sx={{ fontSize: 90 }} />}
                                onClick={() => { cancelar() }} >
                                SALIR</Button>
                        </Grid>
                        <Grid item xs={6} sm={6} md={3}>
                            <Button variant="contained"
                                sx={{height:"100%"}}
                                fullWidth
                                color='verde'
                                onClick={() => { cambiartipopriori() }}
                                disabled={startButton || ordenFirebase.estado !== "Pendiente" ?true:false }
                            >
                                INICIAR
                            </Button>
                        </Grid>
                        <Grid item xs={6} sm={6} md={3}>
                            <Button variant="outlined"
                                className="boton-gestiont"
                                disabled={ordenFirebase.estado === "Pendiente" ?false:true}
                                endIcon={<ThumbDownAltIcon sx={{ fontSize: 90 }} />}
                                onClick={anular}  >Anular</Button>

                        </Grid>
                        <Grid item xs={6} sm={6} md={3}>
                            <Button variant="outlined"
                                className="boton-gestiont"
                                disabled={currentOrden.estado === "Solventado"? false:true}
                                endIcon={<PlayArrowIcon sx={{ fontSize: 90 }} />}
                                onClick={activarTarea} >Reactivar</Button>
                        </Grid> 
                   
                    <Grid item xs={12} sm={6} md={3}>
                        <Grid container spacing={{ xs: 1, md: 4 }}>
                            <Grid item xs={12} sm={12} md={12}>
                                <div className="card12" >
                                    {
                                        <div className="card-header13">
                                            <div className="alinear1">
                                                <h5 className="titui-ges">Prioridad</h5>
                                                <Avatar sx={{ bgcolor: yellow[700] }}>
                                                    <PriorityHighIcon />
                                                </Avatar>
                                            </div>
                                        </div>
                                    }

                                    {
                                        <div className="card-body12 small">
                                            <select onChange={handleNewData} name="prioridad" value={datosactualizados.prioridad} className="form-select2" aria-label="Default select tipo">
                                                <option value="Crítica" >Crítica</option>
                                                <option value="Alta">Alta</option>
                                                <option value="Media">Media</option>
                                                <option value="Baja">Baja</option>
                                            </select>


                                      

                                        </div>
                                    }

                                </div>

                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <div className="card12" >
                                    {
                                        <div className="card-header14">
                                            <div className="alinear1">
                                                <h5 className="titui-ges">Tipo de Trabajo</h5>
                                                <Avatar sx={{ bgcolor: deepPurple[700] }} >
                                                    <HandymanIcon />
                                                </Avatar>
                                            </div>

                                        </div>
                                    }
                                    {
                                        <div className="card-body12 small">
                                            <select onChange={handleNewData} name="tipotrabajo" className="form-select2" value={datosactualizados.tipotrabajo} aria-label="Default select tipo">
                                                <option value="Equipo Médico">Equipo Médico</option>
                                                <option value="Infraestructura">Infraestructura</option>
                                                <option value="Sistemas">Sistemas</option>
                                                <option value="Sistema Eléctrico">Sistema Eléctrico</option>
                                                <option value="Carpintería/Mobiliario">Carpintería/Mobiliario</option>
                                                <option value="Civil/Plomería">Civil/Plomería</option>
                                            </select>
                                        </div>
                                    }

                                </div>

                            </Grid>

                            <Grid item xs={12} sm={12} md={12}>
                                <TarjetaGestionar
                                    icon={<FlakyIcon />}
                                    headerColor={"#ffff"}
                                    avatarColor={cyan[700]}
                                    title={'Estado'}
                                    value={ordenFirebase.estado}
                                />

                            </Grid>


                            <Grid item xs={12} sm={12} md={12}>

                                <TarjetaGestionar
                                    icon={<CoPresentIcon />}
                                    headerColor={"#fff"}
                                    avatarColor={pink[700]}
                                    title={'Responsable'}
                                    value={ordenFirebase.encargado.name + ' ' + ordenFirebase.encargado.lastname + ' ' + ordenFirebase.encargado.secondlastname}
                                />

                            </Grid>



                        </Grid>
                    </Grid>

                    {/* empieza container tablas  */}

                    <Grid item xs={12} sm={6} md={9}>
                        <Grid container spacing={{ xs: 3, md: 4 }}>

                            <Grid item xs={12} sm={12} md={12}>
                                <div className='card13'>
                                    {
                                        <div className="card-header-t">

                                            <h5 className="titulo-t">Formulario</h5>
                                            <Avatar sx={{ bgcolor: blue[700] }} >
                                                <ArticleIcon />
                                            </Avatar>

                                        </div>
                                    }
                                    {
                                        <div className="body-t">
                                            <div className='outlined-c-t'>
                                                <div className="name-outlined2">{currentOrden.id}</div>
                                            </div>
                                            <ul className='ul-t'>
                                                <li className='li-tv'>
                                                    <EventAvailableIcon sx={{ color: blue[600] }} />
                                                    <p className='p-ot'><b>Fecha: </b>{currentOrden.fecha}</p>
                                                </li>

                                                <li className='li-tv' >
                                                    <PersonIcon sx={{ color: blue[600]  }} />
                                                    <p className='p-ot'><b>Cédula: </b>{currentOrden.cedula}</p>
                                                </li>
                                                <li className='li-tv'>
                                                    <DomainIcon sx={{ color:blue[600]  }} />
                                                    <p className='p-ot'><b>Departamento: </b>{currentOrden.departamento}</p>
                                                </li>


                                                <li className='li-tv'>
                                                    <CommentIcon sx={{ color: blue[600] }} />
                                                    <p className='p-ot'><b>Descripción: </b>{currentOrden.descripcion}</p>
                                                </li>

                                                <li className='li-tv'>
                                                    <ReportIcon sx={{ color: blue[600]  }} />
                                                    <p className='p-ot'><b>Problemática: </b>{currentOrden.problematica}</p>
                                                </li>

                                                <li className='li-tv'>
                                                    <FeedIcon sx={{ color: blue[600]  }} />
                                                    <p className='p-ot'> <b>Observaciones: </b>{currentOrden.observaciones}</p>
                                                </li>
                                            </ul>

                                        </div>
                                    }
                                </div>
                            </Grid>



                            <Grid item xs={12} sm={12} md={12}>
                                <div className="card13" >
                                    {
                                        <div className="card-header12">

                                            <div className="alinear1">
                                                <h5 className="titulo-ev">Asignar Técnicos</h5>
                                                <Avatar sx={{ bgcolor: blue[700] }} >
                                                    <EngineeringIcon />
                                                </Avatar>
                                            </div>

                                        </div>
                                    }
                                    {
                                        <div className="card-body12 small">
                                            <div className="alineartecnicos">
                                                <Autocomplete
                                                    disableClearable
                                                    id="combo-box-demo"
                                                    className='seleccionadortabla'
                                                    key={clearAutoComplete}
                                                    onChange={(event, newValue) => {
                                                        setNewEncargado(newValue);
                                                    }}
                                                    isOptionEqualToValue={(option, value) => option.name === value.name}
                                                    options={tecnicos}
                                                    getOptionLabel={(option) => option.name + ' ' + option.lastname + ' ' + option.secondlastname}
                                                    renderInput={(params) => <TextField {...params} fullWidth label="Técnicos" type="text" focused />}
                                                />

                                                <Button variant="outlined" className='buttonagre' onClick={agregarEncargado} startIcon={<AddIcon />}>
                                                    Agregar
                                                </Button>
                                            </div>
                                        </div>
                                    }
                                    {
                                       
                                       <div className="card-body12-tabla small">
                                       <div className="Scroll">
   
                                           <Table className='table table-light table-hover'>
                                               <Thead>
                                                   <Tr>
                                                       <Th>#</Th>
                                                       <Th className="t-encargados">Encargados</Th>
                                                       <Th className="t-encargados">Acciones</Th>
                                        
                                                   </Tr>
                                               </Thead>
                                               <Tbody>
                                               {encargados.map((dato, index) => (
                                                       <Tr key={index}  >
                                                           <Td>
                                                               {index + 1}
                                                           </Td>
                                                           <Td className="t-encargados">
                                                           <div className="names-personal">
                                                                    <p className="parrafos-personal2">{dato.name} {dato.lastname} {dato.secondlastname}</p>
                                                                </div>
                                                           </Td>
                                                           <Td className="t-encargados">
                                                           <button type="button" className="btn btn-outline-danger" onClick={() => { eliminarEncargado(dato) }}>Eliminar</button>
                                                           </Td>
                                        
   
                                                       </Tr>
   
                                                   ))}
                                               </Tbody>
                                           </Table>
                                       </div>
                                       </div>
            
                                    }
                                    {

                                        <div className="contenedor-delegado">
                                            <Grid container spacing={{xs:1}}>
                                                <Grid item xs={6} >
                                                    <Autocomplete
                                                        disableClearable
                                                        id="combo-box-demo"
                                                        className='seleccionadortabla'

                                                        onChange={(event, newValue) => {
                                                            setDelegado(newValue);
                                                        }}
                                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                                        options={encargados}
                                                        getOptionLabel={(option) => option.name + ' ' + option.lastname + ' ' + option.secondlastname}
                                                        renderInput={(params) => <TextField {...params} fullWidth label="Técnicos" type="text" focused />}
                                                    />

                                                </Grid>
                                                <Grid item xs={6} >

                                                    <Button variant="outlined" className='buttonagre' onClick={agregarDelegado} startIcon={<HailIcon />}>
                                                        Delegar
                                                    </Button>

                                                </Grid>
                                            </Grid>

                                        </div>
                                    }
                                </div>
                            </Grid>

                        </Grid>
                    </Grid>



                </Grid>
            </div>
            <div style={{height:"50px"}}>

            </div>
        </>
    );

}