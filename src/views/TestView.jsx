// import { useSelector } from "react-redux";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Grid from '@mui/material/Grid'; // Grid version 1
import "../css/TestView.css"
import { collection, query, doc, updateDoc, onSnapshot } from "firebase/firestore";
import Avatar from '@mui/material/Avatar';
import { db } from "../firebase/firebase-config"
import { useState, useEffect } from "react";
import "../css/TestView.css"
import { blue, pink, lightGreen, lightBlue, deepPurple } from '@mui/material/colors';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import id from 'date-fns/locale/id';
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

export default function TestView() {
    const [encargados, setEncargados] = useState([]);
    const [tecnicos, setTecnicos] = useState([]);
    const [newEncargado, setNewEncargado] = useState('Cargando....');
    const [datosactualizados, setDatosactualizados] = useState({
        prioridad: "Crítica",
        tipotrabajo: "Equipo Médico",
    });

    const currentOrden = useSelector(state => state.ordens);
    const navigate = useNavigate();
    let params = useParams();


    const navegarView = (ruta) => {
        navigate(`/${params.uid}/${ruta}`);
    }

    const cancelar = () => {
        navegarView('mantenimiento/estatus');
    };

    //event detecta presionar switch o cualquier accion selec,etc. Pero no botones porque no dan indformacion
    const handleNewData = (event) => {
        setDatosactualizados({
            ...datosactualizados,
            [event.target.name]: event.target.value,
        })
    }


    const getData = async () => {
        const reference = query(collection(db, "usuarios"));
        onSnapshot(reference, (querySnapshot) => {
            setTecnicos(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
        });
        onSnapshot(doc(db, "ordenes", `${currentOrden.id}`), (doc) => {
            setEncargados(doc.data().tecnicos)
        });

    };


    const agregarEncargado = () => {
        if (newEncargado !== '') {
            var datos = encargados
            var tareas =[]
            const newData = tecnicos.filter(filterbyname)
            tareas=newData[0].tareas
            tareas.push(currentOrden.id)
            datos.push({id: newData[0].uid,lastname: newData[0].lastname, name: newData[0].name });
            setEncargados(datos);
            setNewEncargado('');
            const ref = doc(db, "ordenes", `${currentOrden.id}`);
            updateDoc(ref, {
                tecnicos: datos,
            });
            const ref2 = doc(db, "usuarios", `${newData[0].uid}`);
            updateDoc(ref2, {
                tareas: tareas,
            });
        } else {
            return;
        }
    }

    const filterbyname = (item) => {
        if (`${item.name} ${item.lastname} ${item.secondlastname}` === newEncargado) {
            return item
        } else {
            return;
        }
    }


    const eliminarEncargado = (index) => {
        const data = encargados.filter(item => item.id !== index.id)
        const newData = tecnicos.filter((item)=> item.uid === index.id)
        var tareasTecnico = newData[0].tareas
        const tareasNew = tareasTecnico.filter((item) => item !== currentOrden.id)
        console.log(tareasNew);
        setEncargados(data)
        const ref = doc(db, "ordenes", `${currentOrden.id}`);
        updateDoc(ref, {
            tecnicos: data,
        });
        const ref2 = doc(db, "usuarios", `${index.id}`);
        updateDoc(ref2,{
            tareas: tareasNew
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
        var idtecnico = encargados.map((item) => ({id: item.uid,name: item.name, lastname: item.lastname } ))
        console.log(idtecnico)
        console.log("Se cambio el tipo");
        const ref = doc(db, "ordenes", `${currentOrden.id}`);
        await updateDoc(ref, {
            prioridad: datosactualizados.prioridad,
            tipotrabajo: datosactualizados.tipotrabajo,
        });
        console.log("Se actualizaron los datos");
    };



    useEffect(() => {
        getData();
    }, [])

    return (
        <>
            <div className="container-test-2">
                <Grid container spacing={{ xs: 1, md: 9 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Grid container spacing={{ xs: 1, md: 4 }}>
                        <Grid item xs={12} sm={12} md={12}>
                            <div className="card12" >
                                {
                                    <div className="card-header13">
                                        <div className="alinear1">
                                            <h5 className="titui2">Prioridad</h5>
                                            <Avatar sx={{ bgcolor: deepPurple[300] }}>
                                                <PriorityHighIcon />
                                            </Avatar>
                                        </div>
                                    </div>
                                }

                                {
                                    <div className="card-body12 small">
                                        <select onChange={handleNewData} name="prioridad"  value={datosactualizados.prioridad} className="seleccionador" aria-label="Default select tipo">
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
                                            <h5 className="titui2">Tipo de Trabajo</h5>



                                            <Avatar sx={{ bgcolor: lightBlue[700] }} >
                                                <HandymanIcon />
                                            </Avatar>






                                        </div>

                                    </div>
                                }

                                {
                                    <div className="card-body12 small">
                                        <select onChange={handleNewData} name="tipotrabajo" className="seleccionador" value={datosactualizados.tipotrabajo} aria-label="Default select tipo">
                                            <option value="Equipo Médico">Equipo Médico</option>
                                            <option value="Sistemas">Sistemas</option>
                                            <option value="Carpintería">Carpintería</option>
                                            <option value="Plomería">Plomería</option>
                                        </select>
                                    </div>
                                }

                            </div>

                        </Grid>

                        <Grid item xs={12} sm={12} md={12}>
                        <TarjetaGestionar 
                                icon={   <FlakyIcon />} 
                                headerColor={"#ADCF9F"} 
                                avatarColor={lightGreen[700]}
                                title={'Estado'}
                                value={currentOrden.estado}
                                />

                        </Grid>

                        <Grid item xs={12} sm={12} md={12}>

                        <TarjetaGestionar 
                                icon={   <AccessTimeFilledIcon />} 
                                headerColor={"#E4AEC5"} 
                                avatarColor={ pink[300] }
                                title={'Horas Empleadas'}
                                value={0}
                                />

                        </Grid>
                        </Grid>
                    </Grid>

{/* empieza container tablas  */}
                    <Grid item xs={12} sm={6} md={9}>
                    <Grid container spacing={{ xs: 3, md: 4 }}>

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

                                                onChange={(event, newValue) => {
                                                    setNewEncargado(newValue);
                                                }}
              
                                                options={tecnicos.map((item) => (`${item.name} ${item.lastname} ${item.secondlastname}`))}
                                                renderInput={(params) => <TextField {...params} fullWidth label="Técnicos" type="text" focused />}
                                            />

                                            <Button variant="outlined" className='buttonagre' onClick={agregarEncargado} startIcon={<AddIcon />}>
                                                Agregar
                                            </Button>
                                        </div>
                                    </div>
                                }
                                {
                                    <div className="card-body12 small">


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
                                                    <Tr key={index} >
                                                        <Td>
                                                            {index + 1}
                                                        </Td>
                                                        <Td>
                                                            <div className="names-personal">
                                                                <p className="parrafos-personal2">{dato.name} {dato.lastname}</p>
                                                            </div>
                                                        </Td>

                                                        <Td>
                                                            <button type="button" className="btn btn-outline-danger" onClick={() => { eliminarEncargado(dato) }}>Eliminar</button>
                                                        </Td>

                                                    </Tr>
                                                ))}
                                            </Tbody>
                                        </Table>
                                    </div>
                                }
                            </div>
                        </Grid>

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
                                                < EventAvailableIcon sx={{ color: lightGreen[500] }} />
                                                <p className='texticon1'>{currentOrden.fecha}</p>
                                                </li>

                                                <li className='li-tv' >
                                                <PersonIcon sx={{ color: lightGreen[500] }} />
                                                <p className='texticon1'>{currentOrden.cedula}</p>
                                                </li>
                                                <li className='li-tv'>
                                                <DomainIcon sx={{ color: lightGreen[500] }} />
                                                <p className='texticon1'>{currentOrden.departamento}</p>
                                                </li>

                                                <li className='li-tv' >
                                                <MonitorHeartIcon sx={{ color: lightGreen[500] }} />
                                                <p className='texticon1'>{currentOrden.codigoe}</p>
                                                </li>

                                                <li className='li-tv'>
                                                <CommentIcon sx={{ color: lightGreen[500] }} />
                                                <p className='texticon1'>{currentOrden.asunto}</p>
                                                </li>

                                                <li className='li-tv'>
                                                <ReportIcon sx={{ color: lightGreen[500] }} />
                                                <p className='texticon1'>{currentOrden.problematica}</p>
                                                </li>

                                                <li className='li-tv'>
                                                <FeedIcon sx={{ color: lightGreen[500] }} />
                                                <p className='texticon1'>Observaciones:{currentOrden.observaciones}</p>
                                                </li>
                                            </ul>
                                 
                                </div>
                            }
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                        <Stack direction="row" spacing={2} alignitems="center" justifyContent="center" >

                            <Button variant="outlined" startIcon={<DeleteIcon />} className="cancelar" onClick={() => { cancelar() }} >
                                Cancelar</Button>
                            <Button
                                className="actualizar"
                                variant="contained"
                                endIcon={<SendIcon />}
                                onClick={() => { cambiartipopriori() }}
                            >
                                ACTUALIZAR
                            </Button>

                        </Stack>
                        </Grid>

                    </Grid>
                    </Grid>
                </Grid>
            </div>         
        </>
    );

}