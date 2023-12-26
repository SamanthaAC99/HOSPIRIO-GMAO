import React, { useEffect, useState, useRef } from "react";
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import Swal from 'sweetalert2';
import Grid from "@mui/material/Grid";
import { v4 } from 'uuid';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { db } from "../firebase/firebase-config";
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import Container from '@mui/material/Container';
import ClearIcon from '@mui/icons-material/Clear';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
//select
import '../css/Plan.css'
import { collection, doc, getDoc, updateDoc, getDocs } from "firebase/firestore";
import {
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    ModalFooter,
} from "reactstrap";
// dependencias para las tablas
import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// configuracion de los reloges
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
// datePickers

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


//iconos
import SettingsIcon from '@mui/icons-material/Settings';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
export default function Plan() {

    const [modalEditar, setModalEditar] = useState(false);
    const [modalGestionar, setModalGestionar] = useState(false);
    const [modalInsertar, setModalinsertar] = useState(false);


    //variables de mantenimiento
    const [time1, setTime1] = useState(new Date());
    const [empresas, setEmpresas] = useState([]);
    const [deshabilitar, setDeshabilitar] = useState(true);

    const [eventos, setEventos] = useState([{ codigo: "", equipo: { nombre: "" }, man_actual: { start: "" }, departamento: { nombre: "" } }]);
    // variables para editar la fecha
    const [equipoEmpresa, setEquipoEmpresa] = useState('');
    const [equipoPeriodicidad, setEquipoPeriodicidad] = useState(4);
    const [modalReportes,setModalReportes] = useState(false);
    const aux_equipos = useRef([])
    const equipos_totales = useRef([])
    const codigo_seleccionado = useRef("")
    const [codigo, setCodigo] = useState("")
    const [codigos, setCodigos] = useState([]);
    const [reset, setReset] = useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    //variables para los filtros
    const [departamentos, setDepartamentos] = useState([{ nombre: "TODOS", codigo: 1000 }]);
    const [departamento, setDepartamento] = useState({ nombre: "TODOS", codigo: 1000 });
    const [nombresEquipo, setNombresEquipo] = useState([]);
    const [equipo, setEquipo] = useState({ nombre: "", codigo: 0 });
    // variables para la tabla de  mantenimientos
    const [currentPlan, setCurrentPlan] = useState({ id: '', empresa: '', end: '2/9/2023, 15:00:00', start: '2/9/2023, 15:00:00', periodicidad: 0, title: '', verificacion: false })
    const [fechaPlan, setFechanPlan] = useState("2/9/2023, 15:00:00")
    const [planes, setPlanes] = useState({ equipo: { nombre: '' }, mantenimientos: [{ start: '2/9/2023, 15:00:00' }], departamento: { nombre: '' }, verificacion: false })
    
    
    const [pageMan, setPageMan] = useState(0);
    const [pagesMan, setPagesMan] = useState(10);
    //variables para reporte
    const [year,setYear] = useState(2023)
    const [mesReporte,setMesReporte] = useState(1)
    const [tipoEquipo,setTipoEquipo] = useState(0)

    // funciones para la tabla de mantenimientos
    const handleVerificacion = (__data) => {
        let aux_data = JSON.parse(JSON.stringify(__data))
        let aux_equipo = JSON.parse(JSON.stringify(planes))
        let aux_planes = JSON.parse(JSON.stringify(eventos))
        let mantenimientos = aux_equipo.mantenimientos

        Swal.fire({
            title: '¿Deseas Continuar?',
            text: "¡Se cambiara la verificacion del Mantenimiento!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, Verificar!'
        }).then((result) => {
            if (result.isConfirmed) {
                aux_data.verificacion = !aux_data.verificacion
                let mantenimientos_edited = mantenimientos.map(item => {
                    if (item.id === aux_data.id) {
                        return aux_data
                    } else {
                        return item
                    }
                })
                aux_equipo.mantenimientos = mantenimientos_edited
                let eventos_edited = aux_planes.map((item) => {
                    if (item.id === aux_equipo.id) {
                        return aux_equipo
                    } else {
                        return item
                    }

                })
                try {
                    const ref = doc(db, "ingreso", `${planes.id}`);
                    updateDoc(ref, {
                        mantenimientos: mantenimientos_edited
                    })
                    Swal.fire(
                        "¡Dato Guardado!",
                        '',
                        'success'
                    )
                    setPlanes(aux_equipo)
                    setEventos(eventos_edited)
                } catch (error) {
                    Swal.fire(
                        "¡Vuelva a Intentarlo!",
                        '',
                        'error'
                    )
                }
                setModalEditar(false)

            } else {
                setModalEditar(false)
            }

        })


    };
    const handleChangeMan = (event, newPage) => {
        setPageMan(newPage);
    }

    const handleChangeRowsPerPageMan = (event) => {
        setPagesMan(+event.target.value);
        setPageMan(0);
    };
   

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const SelectFecha1 = (newValue) => {
        setTime1(newValue);
    };

    const abrirModalGestionar = (__data) => {
        setModalGestionar(true);
        setPlanes(__data)
    }
    // Funciones modal Editar
    const abrirModalEditar = (__data) => {
        setModalEditar(true);
        setCurrentPlan(__data);
        setFechanPlan(__data.start);
        setEquipoEmpresa(__data.empresa)
    }
    const cerrrarModalEditar = () => {
        setModalEditar(false);
    }


    function actualizarMantenimiento() {
        //console.log(currentPlan)  estas 3 variables son las que van a etar cambiando al editar
        //console.log(fechaPlan)
        // console.log(equipoEmpresa)
        let fecha_aux = new Date(fechaPlan)
        let format_fecha = fecha_aux.toLocaleString()
        fecha_aux.setHours(15);
        let format_fecha_end = fecha_aux.toLocaleString()
        let aux_equipo = JSON.parse(JSON.stringify(planes))
        let mantenimientos = aux_equipo.mantenimientos
        let aux_current_plan = JSON.parse(JSON.stringify(currentPlan))
        let aux_planes = JSON.parse(JSON.stringify(eventos))
        aux_current_plan.start = format_fecha
        aux_current_plan.end = format_fecha_end
        aux_current_plan.empresa = equipoEmpresa
        let mantenimientos_edited = mantenimientos.map(item => {

            if (item.id === aux_current_plan.id) {
                return aux_current_plan
            } else {
                return item
            }
        })

        aux_equipo.mantenimientos = mantenimientos_edited
        let eventos_edited = aux_planes.map((item) => {
            if (item.id === aux_equipo.id) {
                return aux_equipo
            } else {
                return item
            }

        })
        setPlanes(aux_equipo)
        Swal.fire({
            title: '¿Deseas Continuar?',
            // text: "¡Se eliminará el reporte generado anteriormente!",
            text: "¡Se cambiara la fecha de Mantenimiento!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, actualizar!'
        }).then((result) => {
            if (result.isConfirmed) {

                const ref = doc(db, "ingreso", `${planes.id}`);
                updateDoc(ref, {
                    mantenimientos: mantenimientos_edited
                })

                Swal.fire(
                    "¡Dato Guardado!",
                    '',
                    'success'
                )
                setEventos(eventos_edited)
                setModalEditar(false)

            } else {
                setModalEditar(false)
            }

        })

    }
    const formatFecha = (__fecha) => {
        let indiceComa = __fecha.indexOf(",");
        let substring = __fecha.substring(0, indiceComa);
        return substring
    }
    const eliminarMantenimiento = (__data) => {
        let aux_equipo = JSON.parse(JSON.stringify(planes))
        let aux_planes = JSON.parse(JSON.stringify(eventos))
        let mantenimientos = aux_equipo.mantenimientos
        let datos_nuevos = mantenimientos.filter(item => item.id !== __data.id)
        aux_equipo.mantenimientos = datos_nuevos
        let eventos_edited = aux_planes.map((item) => {
            if (item.id === aux_equipo.id) {
                return aux_equipo
            } else {
                return item
            }

        })
        Swal.fire({
            title: '¿Deseas Continuar?',
            text: "¡Se eliminara el mantenimiento!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, Eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                setPlanes(aux_equipo);
                const ref = doc(db, "ingreso", `${aux_equipo.id}`);
                updateDoc(ref, {
                    mantenimientos: datos_nuevos
                })
                setEventos(eventos_edited)
            }
        })
    }

    // funciones para crear el plan
    
    const handleChangePeriodicidad = (event) => {
        setEquipoPeriodicidad(parseInt(event.target.value));
    };


    const crearPlanMantenimiento = (_date) => {


        let year = _date.getFullYear()
        let diaselect = _date.getDate()
        let month = _date.getMonth() + 1
        if (diaselect > 28) {
            diaselect = 28; // este condicional es porque a veces hay meses que tienen meenos de 31 dias 
        }
        let equipo_seleccionado = equipos_totales.current.filter(filterbycodigo)[0]
        let aux_planes = JSON.parse(JSON.stringify(eventos))
        if (equipoEmpresa !== "") {
            if (equipo_seleccionado.mantenimientos.length > 0) {
                Swal.fire({
                    title: '¿Deseas Continuar?',
                    text: "¡Este Equipo Ya tiene Mantenimientos!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, Crear!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        let mantenimientos = JSON.parse(JSON.stringify(equipo_seleccionado.mantenimientos))
                        let flag_year = true
                        for (var i = month + equipoPeriodicidad; i < 24; i += equipoPeriodicidad) {
                            let month_target = i
                            if (i > 12) {
                                month_target = i - 12
                                if (flag_year) {
                                    year = year + 1
                                    flag_year = false
                                }
                            }
                            let string_fecha_start = `${month_target}/${diaselect}/${year}, 2:00:00 PM`
                            let string_fecha_end = `${month_target}/${diaselect}/${year}, 3:00:00 PM`
                            let objeto_mantenimiento = {
                                codigo_equipo: equipo_seleccionado.codigo,
                                id: v4(),
                                id_equipo: equipo_seleccionado.id,
                                start: string_fecha_start,
                                end: string_fecha_end,
                                periodicidad: equipoPeriodicidad,
                                title: equipo_seleccionado.equipo.nombre,
                                verificacion: false,
                                empresa: equipoEmpresa,
                            }
                            mantenimientos.push(objeto_mantenimiento)
                        }
                        equipo_seleccionado.mantenimientos = mantenimientos
                        const ref = doc(db, "ingreso", `${equipo_seleccionado.id}`);
                        updateDoc(ref, {
                            mantenimientos: mantenimientos,
                        });
                        setModalinsertar(false);
                        let eventos_edited = aux_planes.map((item) => {
                            if (item.id === equipo_seleccionado.id) {
                                return equipo_seleccionado
                            } else {
                                return item
                            }

                        })
                        setEventos(eventos_edited)
                    }
                })


            } else {
                let mantenimientos = []
                let flag_year = true
                for (var i = month + equipoPeriodicidad; i < 24; i += equipoPeriodicidad) {
                    let month_target = i
                    if (i > 12) {
                        month_target = i - 12
                        if (flag_year) {
                            year = year + 1
                            flag_year = false
                        }
                    }
                    let string_fecha_start = `${month_target}/${diaselect}/${year}, 2:00:00 PM`
                    let string_fecha_end = `${month_target}/${diaselect}/${year}, 3:00:00 PM`
                    let objeto_mantenimiento = {
                        codigo_equipo: equipo_seleccionado.codigo,
                        id: v4(),
                        id_equipo: equipo_seleccionado.id,
                        start: string_fecha_start,
                        end: string_fecha_end,
                        periodicidad: equipoPeriodicidad,
                        title: equipo_seleccionado.equipo.nombre,
                        verificacion: false,
                        empresa: equipoEmpresa,
                    }
                    mantenimientos.push(objeto_mantenimiento)
                }
                equipo_seleccionado.mantenimientos = mantenimientos
                const ref = doc(db, "ingreso", `${equipo_seleccionado.id}`);
                updateDoc(ref, {
                    mantenimientos: mantenimientos,
                });
                aux_planes.push(equipo_seleccionado)
                setEventos(aux_planes)
                setModalinsertar(false);
            } //aqui termina la segunda condicional del if
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Faltan Campos !',
                showConfirmButton: false,
                timer: 1500
            })
        }


    }

    //limpiar campos 
    const limpiarCampos = () => {
        setCodigos([])
        setCodigo("")
        codigo_seleccionado.current = ""
    }
    const getData = async () => {
        try {
            setDeshabilitar(true)
            const mes_actual = new Date().getMonth() + 1
            const equiposRef = await getDocs(collection(db, "ingreso"));
            let equipos_aux = []
            equiposRef.forEach((doc) => {
                equipos_aux.push(doc.data())
            })
            equipos_totales.current = equipos_aux
            let dataFilter = equipos_aux.filter(item=> item.situacion === 'Activo');
            let equipos_mantenimiento = dataFilter.filter(item => item.mantenimientos.length > 0);
            let formated_mans = equipos_mantenimiento.map((item) => {
                let man_actual = {}
                item.mantenimientos.forEach(item => {
                    let aux_fecha = item.start
                    let mes_mantenimiento = aux_fecha.indexOf("/");
                    let n = parseInt(aux_fecha[mes_mantenimiento + 1], 10)
                    if (n === mes_actual) {
                        man_actual = item
                    }
    
                })
                item['man_actual'] = man_actual
                return item
            })
            aux_equipos.current = formated_mans
            setEventos(formated_mans);
    
    
            const empresasRef = await getDocs(collection(db, "empresas"));
            let empresas_aux = []
            empresasRef.forEach((doc) => {
                empresas_aux.push(doc.data())
            })
            setEmpresas(empresas_aux)
            const refParam = doc(db, "informacion", "parametros");
            const params = await getDoc(refParam);
            if (params.exists()) {
                setNombresEquipo(params.data().equipos);
                let aux_departamentos =  params.data().departamentos
                aux_departamentos.unshift({codigo:1000,nombre:"TODOS"})
              
                setDepartamentos(aux_departamentos)
            } else {
                console.log("No such document!");
            }
            setDeshabilitar(false)
        } catch (error) {
            setDeshabilitar(true)
        }
       
    };




    const mostrarModalInsertar = () => {
        setEquipoPeriodicidad(4);
        setModalinsertar(true);
    };

    const cerrarModalInsertar = () => {
        setModalinsertar(false);
        limpiarCampos();
    };





    const filterbyNombre = (_equipo) => {
        if (equipo !== "") {
            if (_equipo.equipo.nombre === equipo) {
                return _equipo
            } else {
                return null;
            }
        } else {
            return _equipo
        }
    }


    const filterbyDepartamento = (_equipo) => {
        if (_equipo.departamento.nombre === departamento.nombre) {
            return _equipo
        } else if (departamento.nombre === "TODOS") {
            return _equipo;
        }

    }
    const filterbycodigo = (_equipo) => {
        if (codigo !== "") {
            if (_equipo.codigo === codigo) {
                return _equipo
            } else {
                return null;
            }
        } else {
            return _equipo
        }
    }

    const buscarMantenimiento = () => {

        let aux_1 = JSON.parse(JSON.stringify(aux_equipos.current))
        let aux = aux_1.filter(filterbyNombre).filter(filterbyDepartamento)
        setEventos(aux);
        setReset(!reset);
        setDepartamento({ nombre: "TODOS", codigo: 1000 })
        setEquipo("")


    }

    const nombreSeleccionado = (_nombre) => {
        let aux_1 = JSON.parse(JSON.stringify(equipos_totales.current))
        const codigos_obtenidos = aux_1.filter(item => item.equipo.nombre === _nombre)
        const codigos_finales = codigos_obtenidos.filter(item => item.situacion === "Activo").map(item => (item.codigo))

        setReset(!reset);
        setCodigos(codigos_finales);

    }

    

 
    const generarReporte=()=>{
        var fechaHoy = new Date();
        var dia = fechaHoy.getDate();
        var mes = fechaHoy.getMonth() + 1; // Meses en JavaScript van de 0 a 11
        var anio = fechaHoy.getFullYear();
        mes = mes < 10 ? '0' + mes : mes;
        // Agregar un cero al día si es menor que 10
        dia = dia < 10 ? '0' + dia : dia;
        // Formatear la fecha en 'MM/DD/YYYY'
        var fechaFormateada = `${dia}/${mes}/${anio}`;
        const datosJson = {
            date: fechaFormateada,
            month: mesReporte,
            year:year,
            departamento: departamento.codigo,
            tipo:tipoEquipo
          };
          console.log(datosJson)
          // Realiza la solicitud GET con Axios y agrega los datos en el cuerpo
          axios({
            method: 'post',
            url: 'https://excelrocklion09.online/excel',
            data: datosJson,  // Agrega los datos JSON en el cuerpo
            headers: {
              'Content-Type': 'application/json',  // Especifica el tipo de contenido como JSON
            },
          })
            .then(response => {
              // Manejar la respuesta del servidor
              let aux = response.data
              console.log(response.data);
              var enlaceURL = aux.url;

            // Abrir enlace en una nueva pestaña
            window.open(enlaceURL, '_blank');
            })
            .catch(error => {
              // Manejar errores
              console.error(error);
            });
          
       
        
    }
 

    useEffect(() => {

        // eslint-disable-next-line
    }, [])
    return (
        <>
            <Container maxWidth="lg" sx={{ paddingTop: 10 }}>
                <Grid container spacing={2}>


                    <Grid item xs={6}>
                        <Button variant="contained" onClick={getData} size="large" className="boton-plan" startIcon={<CloudDownloadIcon />}>
                            LEER DATOS
                        </Button>
                    </Grid>
                  
                    <Grid item xs={6}>
                        <Button variant="contained" color="verde" onClick={()=>{setModalReportes(true)}} disabled={deshabilitar} size="large" className="boton-plan" startIcon={<TextSnippetIcon />}>
                            GENERAR REPORTE
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Autocomplete
                            disabled ={deshabilitar}
                            disableClearable
                            id="combo-box-demo"
                            key={reset}
                            options={nombresEquipo}
                            getOptionLabel={(option) => {
                                return option.nombre;
                            }}
                            onChange={(event, newValue) => { setEquipo(newValue.nombre) }}
                            renderInput={(params) => <TextField {...params} fullWidth label="EQUIPO" type="text" />}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Autocomplete
                            disabled ={deshabilitar}
                            key={reset}
                            disableClearable
                            id="combo-box-demo"
                            options={departamentos}
                            getOptionLabel={(option) => {
                                return option.nombre;
                            }}
                            onChange={(event, newValue) => { setDepartamento(newValue) }}
                            renderInput={(params) => <TextField {...params} fullWidth label="DEPARTAMENTO" type="text" />}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button variant="outlined" onClick={buscarMantenimiento}     disabled ={deshabilitar} fullWidth size="large" className="boton-plan" startIcon={<SearchIcon />}>
                            Buscar
                        </Button>
                    </Grid>
                    
                    <Grid item xs={12} md={2}>
                        <Button variant="outlined" size="large"     disabled ={deshabilitar} className="boton-plan" fullWidth startIcon={<AddIcon />} onClick={() => mostrarModalInsertar()} >
                            Crear Plan
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <TableContainer sx={{ maxHeight: 430 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            key={"equipo"}
                                            align={"left"}
                                            style={{ minWidth: 350 }}
                                        >
                                            Equipo
                                        </TableCell>
                                        <TableCell
                                            key={"departamento"}
                                            align={"left"}
                                            style={{ minWidth: 150 }}
                                        >
                                            Departamento
                                        </TableCell>
                                        <TableCell
                                            key={"codigo"}
                                            align={"left"}
                                            style={{ minWidth: 100 }}
                                        >
                                            Codigo
                                        </TableCell>
                                        
                                        <TableCell
                                            key={"accion"}
                                            align={"left"}
                                            style={{ minWidth: 100 }}
                                        >
                                            Acciones
                                        </TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {eventos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                    <TableCell align="left">{row.equipo.nombre}</TableCell>
                                                    <TableCell align="left">{row.departamento.nombre}</TableCell>
                                                    <TableCell align="left">{row.codigo}</TableCell>
                                          
                                                    <TableCell align="left">
                                                        <Button variant="outlined"      disabled ={deshabilitar} onClick={() => { abrirModalGestionar(row) }} size="large" className="boton-plan" startIcon={<SettingsIcon />}>
                                                            gestionar
                                                        </Button>
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
                            count={eventos.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Grid>
                </Grid>

            </Container>
            <Modal className="{width:0px}" isOpen={modalInsertar}>
                <ModalHeader>
                    <div><h3>Crear Plan de Mantenimiento</h3></div>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    options={nombresEquipo}
                                    getOptionLabel={(option) => {
                                        return option.nombre;
                                    }}
                                    onChange={(event, newValue) => { nombreSeleccionado(newValue.nombre) }}
                                    renderInput={(params) => <TextField {...params} fullWidth label="EQUIPO" type="text" />}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Autocomplete
                                    disableClearable
                                    key={reset}
                                    id="combo-box-demo"
                                    options={codigos}

                                    onChange={(event, newValue) => { setCodigo(newValue) }}
                                    renderInput={(params) => <TextField {...params} fullWidth label="CÓDIGO" type="text" />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DesktopDatePicker
                                        label={"Fecha Mantenimiento"}
                                        inputFormat="MM/dd/yyyy"
                                        value={time1}
                                        onChange={SelectFecha1}
                                        renderInput={(params) => <TextField fullWidth {...params} />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    options={empresas.map(item => item.empresa)}
                                    renderInput={(params) => <TextField {...params} fullWidth label="Empresas" type="text" />}
                                    onChange={(event, newvalue) => setEquipoEmpresa(newvalue)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Periodicidad</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={equipoPeriodicidad}
                                        label="Periodicidad"
                                        onChange={handleChangePeriodicidad}
                                    >
                                        <MenuItem value={1}>Mensual</MenuItem>
                                        <MenuItem value={3}>Trimestral</MenuItem>
                                        <MenuItem value={4}>4 meses</MenuItem>
                                        <MenuItem value={6}>6 meses</MenuItem>
                                        <MenuItem value={12}>Anual</MenuItem>
                                    </Select>
                                </FormControl>

                            </Grid>
                        </Grid>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Button
                                onClick={() => crearPlanMantenimiento(time1, equipoPeriodicidad)}
                                disabled={codigo !== "" ? false : true}
                                variant="outlined"
                                size="large"
                                className="boton-plan"
                                fullWidth startIcon={<AddIcon />}
                            >
                                Crear Plan
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                onClick={() => cerrarModalInsertar()}
                                variant="outlined"
                                size="large"
                                className="boton-plan"
                                fullWidth startIcon={<ClearIcon />}
                            >
                                Cancelar
                            </Button>
                        </Grid>
                    </Grid>

                </ModalFooter>
            </Modal>

            <Modal  isOpen={modalReportes}>
                <ModalHeader>
                    <div><h5>Generar Reporte de Mantenimiento</h5></div>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Año</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select" 
                                        value={year}
                                        label="Año"
                                        onChange={(event)=>{setYear(event.target.value)}}
                                    >
                                        <MenuItem value={2023}>2023</MenuItem>
                                        <MenuItem value={2024}>2024</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Mes</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select" 
                                        value={mesReporte}
                                        label="Año"
                                        onChange={(event)=>{setMesReporte(event.target.value)}}
                                    >
                                        <MenuItem value={1}>Enero</MenuItem>
                                        <MenuItem value={2}>Febrero</MenuItem>
                                        <MenuItem value={3}>Marzo</MenuItem>
                                        <MenuItem value={4}>Abril</MenuItem>
                                        <MenuItem value={5}>Mayo</MenuItem>
                                        <MenuItem value={6}>Junio</MenuItem>
                                        <MenuItem value={7}>Julio</MenuItem>
                                        <MenuItem value={8}>Agosto</MenuItem>
                                        <MenuItem value={9}>Septiembre</MenuItem>
                                        <MenuItem value={10}>Octubre</MenuItem>
                                        <MenuItem value={11}>Noviembre</MenuItem>
                                        <MenuItem value={12}>Diciembre</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                      
                            <Grid item xs={12}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    defaultValue={{codigo:1000,nombre:"TODOS"}}
                                    options={departamentos}
                                    getOptionLabel={(option) => {
                                        return option.nombre;
                                    }}
                                    isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
                                    renderInput={(params) => <TextField {...params} fullWidth label="Departamentos" type="text" />}
                                    onChange={(event, newvalue) => setDepartamento(newvalue)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Tipo de Equipo</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={tipoEquipo}
                                        label="Tipo de Equipo"
                                        onChange={(event)=>{setTipoEquipo(event.target.value)}}
                                    >
                                        <MenuItem value={0}>TODOS</MenuItem>
                                        <MenuItem value={1}>Equipo Médico</MenuItem>
                                        <MenuItem value={2}>Equipo de Computo</MenuItem>
                                        <MenuItem value={3}>Equipo de Oficina</MenuItem>
                                        <MenuItem value={4}>Mobilario</MenuItem>
                                        <MenuItem value={5}>Maquinaria</MenuItem>
                                        <MenuItem value={6}>Equipo de Seguridad</MenuItem>
                                        <MenuItem value={7}>Equipo de Medición</MenuItem>
                                        <MenuItem value={8}>Equipo de Operación</MenuItem>
                                    </Select>
                                </FormControl>

                            </Grid>
                           
                        </Grid>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Button
                      
                                onClick={generarReporte}
                                variant="outlined"
                                size="large"
                                className="boton-plan"
                
                            >
                                Generar Reporte
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                onClick={() => setModalReportes(false)}
                                variant="outlined"
                                size="large"
                                className="boton-plan"
                                fullWidth startIcon={<ClearIcon />}
                            >
                                Cancelar
                            </Button>
                        </Grid>
                    </Grid>

                </ModalFooter>
            </Modal>

           
            <Modal size="sm" isOpen={modalEditar}>
                <ModalHeader>
                    <div><h1>Editar Plan</h1></div>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DesktopDatePicker
                                        label={"Fecha Mantenimiento"}
                                        inputFormat="MM/dd/yyyy"
                                        value={fechaPlan}
                                        onChange={(newValue) => setFechanPlan(newValue)}
                                        renderInput={(params) => <TextField fullWidth  {...params} />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    value={equipoEmpresa}
                                    options={empresas.map(item => item.empresa)}
                                    renderInput={(params) => <TextField fullWidth {...params} label="Empresas" type="text" />}
                                    onChange={(event, newvalue) => setEquipoEmpresa(newvalue)}

                                />
                            </Grid>
                        </Grid>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="rojo"
                        variant="contained"
                        onClick={() => cerrrarModalEditar()}
                        sx={{ marginRight: 5 }}
                    >
                        CANCELAR
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => actualizarMantenimiento()}
                    >
                        APLICAR
                    </Button>
                </ModalFooter>
            </Modal>
           
            <Modal size="xl" isOpen={modalGestionar}>
                <ModalHeader>
                    Planificacion de Mantenimientos
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <div>
                                <p><strong>Equipo: </strong> {planes.equipo.nombre} </p>
                                <p><strong>Departamento: </strong>{planes.departamento.nombre}</p>
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <div>
                                <p><strong>Codigo: </strong>{planes.codigo}</p>
                              
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <TableContainer sx={{ maxHeight: 430 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>

                                            <TableCell
                                                key={"departamento"}
                                                align={"left"}
                                                style={{ minWidth: 60 }}
                                            >
                                                Fecha
                                            </TableCell>

                                            <TableCell
                                                key={"proximo"}
                                                align={"left"}
                                                style={{ minWidth: 40 }}
                                            >
                                                Periodicidad
                                            </TableCell>
                                            <TableCell
                                                key={"encargado"}
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Encargado
                                            </TableCell>
                                            <TableCell
                                                key={"verificacion"}
                                                align={"left"}
                                                style={{ minWidth: 40 }}
                                            >
                                                Verificacion
                                            </TableCell>
                                            <TableCell
                                                key={"accion"}
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Acciones
                                            </TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {planes.mantenimientos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                        <TableCell align="left">{formatFecha(row.start)}</TableCell>
                                                        <TableCell align="center">{row.periodicidad}</TableCell>
                                                        <TableCell align="left">{row.empresa}</TableCell>
                                                        <TableCell align="center">
                                                            <Checkbox
                                                                checked={row.verificacion}
                                                                onChange={() => { handleVerificacion(row) }}
                                                                inputProps={{ 'aria-label': 'controlled' }}

                                                            />
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Stack direction="row" spacing={2}>
                                                                <IconButton aria-label="delete" color="rojo" onClick={() => { eliminarMantenimiento(row) }} size="small">
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                                <IconButton aria-label="editar" color="warning" size="small">
                                                                    <EditIcon fontSize="small" onClick={() => { abrirModalEditar(row) }} />
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
                                count={planes.mantenimientos.length}
                                rowsPerPage={pagesMan}
                                page={pageMan}
                                onPageChange={handleChangeMan}
                                onRowsPerPageChange={handleChangeRowsPerPageMan}
                            />
                        </Grid>
                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => setModalGestionar(false)}
                        sx={{ marginRight: 5 }}
                    >
                        cerrar
                    </Button>

                </ModalFooter>
            </Modal>


        </>
    );
}

