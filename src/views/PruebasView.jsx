import React, { useEffect, useState, useRef } from "react";
import { jsPDF } from "jspdf";
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import Swal from 'sweetalert2';
import Grid from "@mui/material/Grid";
import { v4 as uuidv4, v4 } from 'uuid';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { db, storage } from "../firebase/firebase-config";
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import * as XLSX from 'xlsx';
import Container from '@mui/material/Container';
import ClearIcon from '@mui/icons-material/Clear';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
//select
import '../css/Plan.css'
import { collection, query, doc, onSnapshot, getDoc, updateDoc,getDocs } from "firebase/firestore";
import {
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    ModalFooter,
} from "reactstrap";
// dependencias para las tablas

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// configuracion de los reloges
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import DownloadIcon from '@mui/icons-material/Download';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

//iconos
import SettingsIcon from '@mui/icons-material/Settings';
export default function PruebasView() {

    const [modalEditar, setModalEditar] = useState(false);
    const [equipos, setEquipos] = useState([]);
    const [modalInsertar, setModalinsertar] = useState(false);
    const [modalArchivo, setModalarchivo] = useState(false);
    const [url, setUrl] = useState("");
    const [currentform, setCurrentform] = useState({});
    //variables de mantenimiento
    const [time1, setTime1] = useState(new Date());
    const [finicio, setFinicio] = useState();
    const [ftermina, setFtermina] = useState();
    const periodicidad = ['mensual', 'trimestral', '4 meses', '6 meses', 'anual']
    const [empresas, setEmpresas] = useState([]);
    const [validados, setValidados] = useState("");
    const [deshabilitar,setDeshabilitar] = useState(false);
    const [currentPlan ,setCurrentPlan] = useState({})
    const [eventos, setEventos] = useState([{codigo:"",equipo:{nombre:""},man_actual:{start:""},departamento:{nombre:""}}]);
    // variables para editar la fecha
    const [currentMan, setCurrentMan] = useState({});
    const [equipoEmpresa, setEquipoEmpresa] = useState('');
    const [equipoPeriodicidad, setEquipoPeriodicidad] = useState(4);

    const [nombresActivos, setNombresActivos] = useState([]);
    const aux_equipos = useRef([])
	const equipos_totales = useRef([])
    const codigo_seleccionado = useRef("")
    const [codigo,setCodigo] = useState("")
    const [codigos, setCodigos] = useState([]);
    const [crearplan, setCrearplan] = useState(true);
    const [reset, setReset] = useState(false);
    const [nombre, setNombre] = useState("");
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	//variables para los filtros
	const [departamentos,setDepartamentos] = useState([{nombre:"sin cargar",codigo:0}]);
	const [departamento,setDepartamento]  = useState({nombre:"",codigo:0});
	const [nombresEquipo, setNombresEquipo] = useState([]);
	const [equipo,setEquipo]= useState({nombre:"",codigo:0});
    //modal crear plan
    const [btnPlan,setBtnPlan] = useState(false)
    const [currentEmpresa, setCurrentEmpresa] = useState('');


	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
    const SelectFecha1 = (newValue) => {
        const dateStart = new Date(newValue)
        console.log(dateStart);
        setTime1(newValue);
    };


    // Funciones modal Editar
    const abrirModalEditar = (data) => {
        setModalEditar(true);
        setCurrentMan(data)
        setFinicio(new Date(data.start))
        setFtermina(new Date(data.end))
    }
    const cerrrarModalEditar = () => {
        setModalEditar(false);
        limpiarCampos()
    }
    const SelectFechaInicio = (newValue) => {
        setFinicio(newValue);
    };

    const SelectFechaFinal = (newValue) => {
        setFtermina(newValue);
    };

    function actualizarMantenimiento() {
		console.log(aux_equipos.current)
        let temp = aux_equipos.current.filter(item=> currentMan.id_equipo === item.id)[0]
        let aux3 = temp.mantenimientos
        var mantenimientoActualizado = aux3.map(item2 => {
            if (item2.id === currentMan.id) {
                item2.start = finicio.toLocaleString()
                item2.end = ftermina.toLocaleString()
            }
            return (item2)
        })
        console.log('mantenimientos actualizados', temp)
        if (finicio.getTime() < ftermina.getTime()) {

            console.log('se puede actualizar')
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

                    const ref = doc(db, "ingreso", `${currentMan.id}`);
                    updateDoc(ref, {
                        mantenimientos: mantenimientoActualizado
                    })

                    Swal.fire(
                        "¡Dato Guardado!",
                        '',
                        'success'
                    )
                    setModalEditar(false)

                } else {
                    setModalEditar(false)
                }

            })

        } else {
            console.log('no se puede actualizar')
            setModalEditar(false)
        }

        //setModalEditar(false);
    }
    const eliminarMantenimiento = (_plan) => {
        let aux3 = eventos
        var temp2 = aux3.filter(item => item.id !== _plan.id)
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
                setEventos(temp2);
                const ref = doc(db, "ingreso", `${_plan.id_equipo}`);
                updateDoc(ref, {
                    mantenimientos: temp2
                })
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
        if(diaselect >28){
            diaselect = 28; // este condicional es porque a veces hay meses que tienen meenos de 31 dias 
        }
        let equipo_seleccionado = equipos_totales.current.filter(filterbycodigo)[0]

        if(equipoEmpresa !== ""){
            if(equipo_seleccionado.mantenimientos.length >  0){
                Swal.fire({
                            icon: 'error',
                            title: 'Ya Tiene Mantenimientos !',
                            showConfirmButton: false,
                            timer: 1500
                        })

            }else{
                let mantenimientos = []
                let flag_year = true
                for (var i = month + equipoPeriodicidad; i < 24; i += equipoPeriodicidad) {
                    let month_target = i
                    if(i > 12 ){
                        month_target = i - 12
                        if(flag_year){
                            year = year +1
                            flag_year = false
                        }
                    }
                    let string_fecha_start = `${diaselect}/${month_target}/${year} 14:00:00`
                    let string_fecha_end = `${diaselect}/${month_target}/${year} 15:00:00`
                    let objeto_mantenimiento = {
                        codigo_equipo:equipo_seleccionado.codigo,
                        id: v4(),
                        id_equipo:equipo_seleccionado.id,
                        start: string_fecha_start,
                        end:string_fecha_end,
                        periodicidad:equipoPeriodicidad,
                        title:equipo_seleccionado.equipo.nombre,
                        verificacion:false,
                        empresa:equipoEmpresa,
                    }
                    mantenimientos.push(objeto_mantenimiento)
                }   
                const ref = doc(db, "ingreso", `${equipo_seleccionado.id}`);
                updateDoc(ref, {
                    mantenimientos: mantenimientos,
                });
                setModalinsertar(false);
            } //aqui termina la segunda condicional del if
        }else{
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
        setNombre("")
        setCodigos([])
        setValidados("Todos")
        setCodigo("")
        codigo_seleccionado.current = ""
       setEquipo(null)
    }
    const getData = async () => {
		const mes_actual = new Date().getMonth() + 1
		const equiposRef = await getDocs(collection(db, "ingreso"));
		let equipos_aux = []
		equiposRef.forEach((doc) => {
			equipos_aux.push(doc.data())
		})
		equipos_totales.current =equipos_aux
		let dataFilter = equipos_aux.filter(filterbysituacion);
		let equipos_mantenimiento = dataFilter.filter(item => item.mantenimientos.length > 0);
		let formated_mans = equipos_mantenimiento.map((item)=>{
			let man_actual = {}
			item.mantenimientos.forEach(item=>{
				let aux_fecha = item.start
				let mes_mantenimiento = aux_fecha.indexOf("/");
				let n = parseInt(aux_fecha[mes_mantenimiento+1],10)
				if(n === mes_actual){
					man_actual = item
				}
				
			})
			item['man_actual'] = man_actual
			return item
		})
		aux_equipos.current =  formated_mans
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
			setDepartamentos(params.data().departamentos)
        } else {
            console.log("No such document!");
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



    const cerrarModalArchivo = () => {
        setModalarchivo(false);
    };


    const filterbysituacion = (_equipo) => {
        if (_equipo.situacion === "Activo") {
            return _equipo
        } else {
            return null;
        }
    }
    const filterbyNombre = (_equipo) => {
        if (nombre !== "") {
            if (_equipo.equipo.nombre === nombre) {
                return _equipo
            }else{
                return null;
            }
        }else{
            return _equipo
        }
    }


const filterbyDepartamento = (_equipo) => {
		if (_equipo.departamento.nombre === departamento.nombre) {
			return _equipo
		}else if(departamento.nombre ==="") {
			return _equipo;
		}
		
}
const filterbycodigo = (_equipo) => {
    if (codigo !== "") {
        setDeshabilitar(false)
    if (_equipo.codigo === codigo) {
        return _equipo
    }else {
        return null;
    }
    }else{
        return _equipo
    }
}

const buscarMantenimiento = () => {

    let aux_1 = JSON.parse(JSON.stringify(aux_equipos.current))
    let aux = aux_1.filter(filterbyNombre).filter(filterbyDepartamento)
	setEventos(aux);
    setReset(!reset);
	setDepartamento({nombre:"",codigo:0})


}

const nombreSeleccionado = (_nombre) => {
	setEquipo(nombre)
	let aux_1 = JSON.parse(JSON.stringify(equipos_totales.current))
    const codigos_obtenidos = aux_1.filter(item => item.equipo.nombre === _nombre)
    const codigos_finales = codigos_obtenidos.filter(item => item.situacion === "Activo").map(item => (item.codigo))
    
    setReset(!reset);
    setCodigos(codigos_finales);

}

const descargarPDF = () => {
    var crono = []
    const doc = new jsPDF({
        orientation: "landscape"
    });
    doc.text("Hospital del Río ", 130, 10);
    doc.text("Cronograma de Mantenimiento ", 110, 20);
    doc.setFontSize(9)
    equipos.map((item) => {
        item.mantenimientos.forEach((item) => {
            crono.push(item)
        }
        )
    })
    let aux1 = crono.map(item => item.title)

    let result = aux1.filter((item, index) => {
        return aux1.indexOf(item) === index;
    })
    let arreglosfinales = []
    for (let i = 0; i < result.length; i++) {
        let aux3 = crono.filter(item => {
            if (item.title === result[i]) {
                return item.start
            } else {
                return null
            }
        })
        let aux4 = aux3.map(item => item.start)
        let newObjectM = {
            name: result[i],
            mtn: aux4
        }
        arreglosfinales.push(newObjectM)
    }
    console.log(arreglosfinales)
    let aux = 30
    for (let i = 0; i < arreglosfinales.length; i++) {
        doc.text(`${arreglosfinales[i].name}`, 20, aux)
        let aux5 = 20
        for (let j = 0; j < arreglosfinales[i].mtn.length; j++) {
            doc.text(`${arreglosfinales[i].mtn[j]}`, aux5, aux + 10)
            aux5 = aux5 + 40
            if (aux5 >= 280) {
                aux = aux + 10
                aux5 = 20
            }
        }
        aux = aux + 30

    }

    doc.save("cronograma_mantenimiento.pdf");
}
const descargarExcel = () => {
    var crono = []
    equipos.map((item) => {
        item.mantenimientos.forEach((item) => {
            crono.push(item)
        }
        )
    })
    console.log(crono)
    const myHeader = ["title", "codigo", "start", "end"];
    const worksheet = XLSX.utils.json_to_sheet(crono, { header: myHeader });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(worksheet, [["Equipo", "Código", "Inicio del Mantenimiento", "Final del Mantenimiento"]], { origin: "A1" });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");
    worksheet["!cols"] = [{ wch: 50 }, { wch: 30 }, { wch: 30 }];
    XLSX.writeFile(workbook, "MantenimientosHospiRio.xlsx", { compression: true });

}



useEffect(() => {

// eslint-disable-next-line
}, [])
return (
    <>
        <Container maxWidth="lg" sx={{paddingTop:10}}>
            <Grid container spacing={2}>
		
			
			<Grid item xs={12}>
			<Button variant="contained" onClick={getData}  size="large" className="boton-plan" startIcon={<CloudDownloadIcon />}>
                        LEER DATOS
                    </Button>
			</Grid>
                <Grid item xs={12} md={4}>
                    <Autocomplete
                        disableClearable
                        id="combo-box-demo"
                        key={reset}
                        options={nombresEquipo}
                        getOptionLabel={(option) => {
                            return option.nombre;
                        }}
                        onChange={(event, newValue) => { setEquipo(newValue.nombre) }}
                        renderInput={(params) => <TextField {...params}  fullWidth label="EQUIPO" type="text" />}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Autocomplete
                        key={reset}
                        disableClearable
                        id="combo-box-demo"
                        options={departamentos}
						getOptionLabel={(option) => {
                            return option.nombre;
                        }}
                        onChange={(event, newValue) => { setDepartamento(newValue) }}
                        renderInput={(params) => <TextField {...params}  fullWidth label="DEPARTAMENTO" type="text" />}
                    />
                </Grid>
                <Grid item xs={12}  md={2}>
                    <Button variant="outlined" onClick={buscarMantenimiento} fullWidth size="large" className="boton-plan" startIcon={<SearchIcon />}>
                        Buscar
                    </Button>
                </Grid>
                <Grid item xs={12}  md={2}>
                    <Button variant="outlined" size="large" className="boton-plan" fullWidth startIcon={<AddIcon />} onClick={() => mostrarModalInsertar()} >
                        Crear Plan
                    </Button>
                </Grid>

                {/* <Grid item xs={1}>
                    <Button variant="outlined" size="large" className="boton-plan" fullWidth startIcon={<DownloadIcon />} onClick={descargarPDF} >
                        PDF
                    </Button>
                </Grid>
                <Grid item xs={1}>
                    <Button variant="outlined" size="large" className="boton-plan" fullWidth startIcon={<DownloadIcon />} onClick={descargarExcel} >
                        EXCEL
                    </Button>
                </Grid> */}
				<Grid item xs={12}>
				<TableContainer sx={{ maxHeight: 430 }}>
						<Table stickyHeader aria-label="sticky table">
							<TableHead>
								<TableRow>
								<TableCell
											key={"equipo"}
											align={"left"}
											style={{ minWidth: 150 }}
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
											key={"proximo"}
											align={"left"}
											style={{ minWidth: 100 }}
										>
											Proximo Mantenimiento
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
												<TableCell align="left">{row.man_actual.start}</TableCell>
												<TableCell align="left">
													<Button variant="outlined"   size="large" className="boton-plan" startIcon={<SettingsIcon/>}>
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
                <div><h3>Crear Plan de Mantenimiento Anual</h3></div>
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
                        renderInput={(params) => <TextField {...params}  fullWidth label="EQUIPO" type="text" />}
                    />
                </Grid>
				
                <Grid item xs={12}>
                    <Autocomplete
                        disableClearable
                        key={reset}
                        id="combo-box-demo"
                        options={codigos}
			
                        onChange={(event, newValue) => { setCodigo(newValue) }}
                        renderInput={(params) => <TextField {...params}  fullWidth label="CÓDIGO" type="text" />}
                    />
                </Grid>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                    label={"Fecha Mantenimiento"}
                                    inputFormat="MM/dd/yyyy"
                                    value={time1}
                                    onChange={SelectFecha1}
                                    renderInput={(params) => <TextField  fullWidth {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                disableClearable
                                id="combo-box-demo"
                                options={empresas.map(item => item.empresa)}
                                renderInput={(params) => <TextField {...params} fullWidth label="Empresas" type="text"  />}
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
                            disabled={codigo !== "" ? false:true}
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

        <Modal isOpen={modalArchivo}>
            <ModalHeader>
                <div><h1>Información Plan</h1></div>
            </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <label>
                                Empresa:
                            </label>
                            <input
                                className="form-control"
                                readOnly
                                type="text"
                                value={currentform.empresa}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <label>
                                Código Equipo:
                            </label>
                            <input
                                className="form-control"
                                readOnly
                                type="text"
                                value={currentform.cequipo}
                            />
                        </Grid>
                        <Grid className="fila" item xs={12}>
                            <label className="archivo">
                                Archivo:
                            </label>
                            <a
                                component="button"
                                variant="body2"
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Visualizar Plan
                            </a>
                        </Grid >
                    </Grid>
                </FormGroup>

            </ModalBody>
            <ModalFooter>
                <Button
                    // color="danger"
                    className="editar"
                    onClick={() => cerrarModalArchivo()}
                >
                    Cancelar
                </Button>
            </ModalFooter>
        </Modal>
        <Modal isOpen={modalEditar}>
            <ModalHeader>
                <div><h1>Editar Plan Mantenimiento</h1></div>
                SelectFecha1                </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Grid container spacing={4}>

                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    renderInput={(props) => <TextField fullWidth {...props} />}
                                    label="Fecha Inicial del Mantenimiento"
                                    value={finicio}
                                    onChange={SelectFechaInicio}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>

                                <DateTimePicker
                                    renderInput={(props) => <TextField fullWidth {...props} />}
                                    label="Fecha Final del Mantenimiento"
                                    value={ftermina}
                                    onChange={SelectFechaFinal}
                                />

                            </LocalizationProvider>

                        </Grid>
                    </Grid>
                </FormGroup>

            </ModalBody>
            <ModalFooter>
                <Button
                    color="azul1"
                    variant="contained"
                    onClick={() => cerrrarModalEditar()}
                    sx={{ marginRight: 5 }}
                >
                    Cancelar
                </Button>
                <Button
                    color="warning"
                    variant="contained"
                    onClick={() => actualizarMantenimiento()}
                >
                    Guardar
                </Button>
            </ModalFooter>
        </Modal>
    </>
);
}
const validarOptions = ["Realizados", "Pendientes", "Todos"]

