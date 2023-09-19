import '../css/Tabla.css'
import '../css/Ordentrabajo.css';
import '../css/Presentacion.css';
import '../css/InventarioView.css';
import React, { useRef, useState } from "react";
import Stack from '@mui/material/Stack';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import Typography from '@mui/material/Typography';
import { collection, setDoc, query, doc, deleteDoc, updateDoc,getDocs,getDoc } from "firebase/firestore";
import { styled } from '@mui/material/styles';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import AddIcon from '@mui/icons-material/Add';
import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';
import * as XLSX from 'xlsx';
import { db, storage } from "../firebase/firebase-config";
import { teal } from '@mui/material/colors';
import Autocomplete from '@mui/material/Autocomplete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Backdrop from '@mui/material/Backdrop';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import ExtensionIcon from '@mui/icons-material/Extension';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { setEquipoState } from '../features/inventario/inventarioSlice';
import Person2Icon from '@mui/icons-material/Person2';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Paper from '@mui/material/Paper';
import Swal from 'sweetalert2';
import '../css/Inventario.css';
import { useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import {
	Container,
	Modal,
	ModalHeader,
	ModalBody,
	FormGroup,
	ModalFooter,
} from "reactstrap";
import { v4 as uuidv4 } from 'uuid';

import { useDispatch } from "react-redux";
// dependencias para las tablas

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
// iconos
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhonelinkOffIcon from '@mui/icons-material/PhonelinkOff';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import SearchIcon from '@mui/icons-material/Search';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
	  backgroundColor: theme.palette.common.black,
	  color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
	  fontSize: 14,
	},
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(odd)': {
	  backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	'&:last-child td, &:last-child th': {
	  border: 0,
	},
  }));
  




export default function Inventarioview() {
	let params = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [data, setData] = useState([{ codigo: "", equipo: { nombre: "" }, departamento: { nombre: "" }, responsable: { nombre: "" } }]);
	const [modalActualizar, setModalactualizar] = useState(false);
	const [modalAccesorios, setModalAccesorios] = useState(false);
	const [reloadAuto, setReloadAuto] = useState(false);
	const [modalInsertar, setModalinsertar] = useState(false);
	const [modalInformacion, setModalinformacion] = useState(false);
	const [equipo, setEquipo] = useState({codigo:0,nombre:""});
	const [acc1, setAcc1] = useState({});
	const [propietario, setPropietario] = useState({codigo:0,nombre:""});
	const [marca, setMarca] = useState('');
	const [modelo, setModelo] = useState('');
	const [serie, setSerie] = useState('');
	const [tipo, setTipo] = useState({codigo:0,nombre:""});
	const [seguro, setSeguro] = useState({label:'Asegurado',value:true});
	const [file, setFile] = useState(null);
	const [equipos, setEquipos] = useState([]);
	const [eimportancia, setEimportancia] = useState([]);
	const [deshabilitar, setDeshabilitar] = useState(false);
	const [deshabilitar2,setDeshabilitar2] = useState(true); // esta variable nos servira para bloquear la funcionalidad si no le dan a leeer datos
	//variables de declaracion de accesorios
	const [accesorios, setAccesorios] = useState([]);
	const [accesoriosEquipo, setAccesoriosEquipo] = useState([]);
	// variables con los equipos declarados y filtros
	const equipos_totales = useRef([])
	const [codigoSeleccionado, setCodigoSeleccionado] = useState("")
	const [reset, setReset] = useState(false);
	//variables de declaracion de equipo
	const [tipoEquipo, setTipoEquipo] = useState([]);
	const [ubicaciones, setUbicaciones] = useState([]);
	const [ubicacion, setUbicacion] = useState({codigo:0,nombre:""})
	const [responsables, setResponsables] = useState([]);
	const [responsable, setResponsable] = useState({codigo:0,nombre:""});
	const [departamentos, setDepartamentos] = useState([]);
	const [propietarios, setPropietarios] = useState([]);
	const [modalReubicar, setModalReubicar] = useState(false);
	const [departamento, setDepartamento] = useState({codigo:0,nombre:""});
	const [currentEquipo, setCurrentEquipo] = useState(initialData);
	//modals
	const [modalParametros, setModalParametros] = useState(false);

	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	//variables para los filtros
	const [departamentoFilter, setDepartamentoFilter] = useState("");
	const [equipoFilter, setEquipoFilter] = useState("");
	//varbiables para la busqueda por codigo
	const [codigos, setCodigos] = useState([]);

	//funciones para la busqueda por codigo
	const ordenarCodigos = (lista) => {
		lista.sort(function (a, b) {
			var valorA = parseInt(a.split('-')[0]);
			var valorB = parseInt(b.split('-')[0]);
			return valorA - valorB;
		});

		return lista;
	}
	//funciones para los filtros
	const FilterByDepartamento = (_item) => {
		if (_item.departamento.nombre === departamentoFilter) {
			return _item
		} else if (departamentoFilter === "") {
			return _item
		}
	}
	const FilterByEquipo = (_item) => {
		if (_item.equipo.nombre === equipoFilter) {
			return _item
		} else if (equipoFilter === "") {
			return _item
		}
	}
	const FilterByCodigo = (_item) => {
		if (_item.codigo === codigoSeleccionado) {
			return _item
		} else if (codigoSeleccionado === "") {
			return _item
		}
	}
	const filtrarEquipos = () => {
		let aux_equipos = JSON.parse(JSON.stringify(equipos_totales.current))
		let aux_filter = []
		if (aux_equipos.length > 0) {
			console.log(departamentoFilter)
			aux_filter = aux_equipos.filter(FilterByDepartamento).filter(FilterByEquipo)
			setData(aux_filter)

		}
		setEquipoFilter("")
		setDepartamentoFilter("")
		setReset(!reset)
	}
	// 
	const btnBuscarCodigo =()=>{
		let aux_equipos = JSON.parse(JSON.stringify(equipos_totales.current))
		let equipo_target = aux_equipos.filter(FilterByCodigo)
		setReset(!reset)
		setData(equipo_target)
		setCodigoSeleccionado("")
	}


	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	const getData = async () => {
		let aux_equipos = []
		setDeshabilitar2(true)
		try {
		const reference = query(collection(db, "ingreso"));
		const querySnapshot = await getDocs(reference);
		querySnapshot.forEach((doc) => {
			aux_equipos.push(doc.data())
		  });
		setData(
			aux_equipos.filter(item => item.situacion === "Activo")
		);
		equipos_totales.current = aux_equipos;
		let codigos = aux_equipos.map((item, index) => {
			return item.codigo
		})
		let aux_codigos = ordenarCodigos(codigos)
		setCodigos(aux_codigos)
		const reference2 = doc(db, "informacion", "parametros");
		const docSnap = await getDoc(reference2);
		let parametros = {}
		if (docSnap.exists()) {
			parametros = docSnap.data();
			setTipoEquipo(parametros.tequipo)
			setEquipos(parametros.equipos)
			setDepartamentos(parametros.departamentos)
			setUbicaciones(parametros.ubicaciones)
			setResponsables(parametros.responsables)
			setAccesorios(parametros.accesorios)
			setPropietarios(parametros.propietarios)
		} else {
			console.log("No such document!");
		}
		setDeshabilitar2(false)
		} catch (error) {
			setDeshabilitar2(true)
		}
		
	


	}


	//metodos para gestionar los equipos activos de los que ya no estan operativos

	const DardeBaja = (_data) => {
		let aux_equipos = JSON.parse(JSON.stringify(data))
		Swal.fire({
			title: "Dar equipo de Baja",
			text: "¿Estás Seguro que deseas dar de baja al equipo?",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sí',
		}).then((result) => {
			if (result.isConfirmed) {
				const ref = doc(db, "ingreso", `${_data.id}`);
				let equipos_salvados = aux_equipos.filter(item=> item.id !== _data.id)
				setData(equipos_salvados)
				updateDoc(ref, {
					situacion: "Inactivo",
				});

				Swal.fire(
					'Equipo dado de baja!',
					'',
					'success'
				)

			}
		})
	}

	const FilterBySituacion = (_item) => {
		if (_item.situacion === "Activo") {
			return _item
		} else {
			return null
		}
	}
	//metodos para subir imagenes
	const sendStorage = async (id) => {
		const storageRef = ref(storage, `inventario/${id}`);
		try {
			let url2 = await uploadBytes(storageRef, file).then((snapshot) => {
				let url = getDownloadURL(storageRef).then((downloadURL) => {
					console.log('File available at', downloadURL);
					return downloadURL;
				});
				return url
			});
			return url2
		} catch (error) {
			return no_img
		}

	};

	const buscarImagen = (e) => {
		if (e.target.files[0] !== undefined) {
			setFile(e.target.files[0]);
			console.log(e.target.files[0]);
		} else {
			console.log('no hay archivo');
		}
	};
	

	const mostrarModalAccesorios = (_data) => {
		setCurrentEquipo(_data)
		setAccesoriosEquipo(_data.accesorios)
		setModalAccesorios(true);
	};
	const limpiarCampos = () => {
		setEimportancia("")
		setModelo("")
		setMarca("")
		setSerie("")
		setPropietario({nombre:"HOSPITAL DEL RIO",codigo:1})
	}


	const mostrarModalInformacion = (_dato) => {
		setCurrentEquipo(_dato)
		setAccesoriosEquipo(_dato.accesorios)
		setModalinformacion(true);
	};

	const cerrarModalInformacion = () => {
		setModalinformacion(false);
	};

	const cerrarModalActualizar = () => {
		setModalactualizar(false);
	};

	const cerrarModalAccesorios = () => {
		setModalAccesorios(false);
	};


	const mostrarModalInsertar = () => {
		setModalParametros(false);
		setModalinsertar(true);
	};

	const cerrarModalInsertar = () => {
		setModalinsertar(false);
	};





	const eliminar = (__dato) => {
		let aux_equipos = JSON.parse(JSON.stringify(data))

		Swal.fire({
			title: "Eliminar Equipo",
			text: "¿Estás Seguro que deseas Eliminar al equipo?",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sí'
		}).then(async (result) => {
			if (result.isConfirmed) {
				let equipos_salvados = aux_equipos.filter(item=> item.id !== __dato.id)
				setData(equipos_salvados)
				await deleteDoc(doc(db, "ingreso", `${__dato.id}`));
				Swal.fire(
					'Equipo eliminado!',
					'',
					'success'
				)

			}
		})

	};

	const sendFirestore = (_newEquipo) => {

		try {
			setDoc(doc(db, "ingreso", `${_newEquipo.id}`), _newEquipo);
		} catch (e) {
			console.error("Error adding document: ", e);
		}
	};

	const IngresarEquipo = async () => {
		let aux_equipos = JSON.parse(JSON.stringify(data))
		setDeshabilitar(true)
		let code = generateCodigo()
		var valorNuevo = {
			//valores iniciales por defecto
			ubicacion: ubicacion,
			departamento: departamento,
			responsable: responsable,
			tipo_equipo: tipo,
			equipo: equipo,
			modelo: modelo,
			marca: marca,
			serie: serie,
			propietario: propietario,
			seguro: seguro,
			importancia: eimportancia,
			codigo: code,
			id: uuidv4(),
			indice: Date.now(),
			situacion: "Activo",
			//valores que cambiaran en el futuro
			reubicado: false,
			codigos_historial: [code],
			mantenimientos: [],
			mtbf: "",
			mttr: "",
			img: "",
			numero_fallos: "",
			disponibilidad: "",
			accesorios: [],

		}
		
		if (file === null) {
			valorNuevo.img = no_img
		} else {
			let url = await sendStorage(valorNuevo.id)
			console.log(url)
			valorNuevo.img = url
		}
		aux_equipos.push(valorNuevo)
		setData(aux_equipos)
		equipos_totales.current = aux_equipos
		Swal.fire(
			'Equipo Registrado',
			'',
			'success'
		)
		console.log(valorNuevo)
		sendFirestore(valorNuevo)
		setModalinsertar(false);
		setDeshabilitar(false)
	}
	const generateCodigo = () => {
		let aux_equipos = equipos_totales.current
		let datos_filter = aux_equipos.filter(item => item.ubicacion.codigo === ubicacion.codigo && item.responsable.codigo === responsable.codigo && item.departamento.codigo === departamento.codigo && item.equipo.codigo === equipo.codigo)
		let index = datos_filter.length + 1
		let codigo = ubicacion.codigo + "-" + departamento.codigo + "-" + responsable.codigo + "-" + tipo.codigo + "-" + equipo.codigo + "-" + index.toString() + "-0"
		return codigo
	}


	const mostrarModalActualizar = (_dato) => {
	
		setCurrentEquipo(_dato);
		setEimportancia(_dato.importancia)
		setModelo(_dato.modelo)
		setMarca(_dato.marca)
		setSerie(_dato.serie)
		setPropietario(_dato.propietario)
		setModalactualizar(true);
		setSeguro(_dato.seguro ?   {label:'Asegurado',value:true}: { label: 'Sin seguro',value:false})
	};


	const ActualizarEquipo = async () => {
		let aux_equipos = JSON.parse(JSON.stringify(data))
		const ref = doc(db, "ingreso", `${currentEquipo.id}`);
		let equipo_modify =  JSON.parse(JSON.stringify(currentEquipo))

		if (file === null) {
			
			await updateDoc(ref, {
				marca: marca,
				modelo: modelo,
				serie: serie,
				propietario: propietario,
				seguro: seguro.value,
				importancia: eimportancia,
			});
		}
		 else {

			let url = await sendStorage(currentEquipo.id)
			await updateDoc(ref, {
				marca: marca,
				modelo: modelo,
				serie: serie,
				propietario: propietario,
				seguro: seguro.value,
				importancia: eimportancia,
				img: url
			});
			equipo_modify.img = url
		}
		equipo_modify.marca = marca
		equipo_modify.modelo = modelo
		equipo_modify.serie = serie
		equipo_modify.propietario = propietario
		equipo_modify.seguro = seguro.value
		equipo_modify.importancia = eimportancia

		Swal.fire(
			"¡Datos Actualizados!",
			'',
			'success'
		)
		let equipos_edited = aux_equipos.map(item=>{
			if(item.id === equipo_modify.id){
				return equipo_modify
			}else{
				return item
			}

		})
		setData(equipos_edited)
		setFile(null)
		setModalactualizar(false)

		limpiarCampos();

	}


	const hojavida = (data) => {
		let aux = JSON.parse(JSON.stringify(data))
		let temp = aux.codigos_historial
		temp.unshift('TODOS')

		dispatch(setEquipoState(aux))
		navigate('hojadevida')
	}
	const agregarAccesorio = () => {
		let aux_equipos = JSON.parse(JSON.stringify(data))
		let aux_equipo = JSON.parse(JSON.stringify(currentEquipo))
		
		aux_equipo.accesorios.push(acc1)
		setAccesoriosEquipo(aux_equipo.accesorios)
		let equipos_edited = aux_equipos.map(item=>{
			if(item.id === aux_equipo.id){
				return aux_equipo
			}else{
				return item
			}

		})
		setData(equipos_edited)
		const ref = doc(db, "ingreso", `${currentEquipo.id}`);
		updateDoc(ref, {
			accesorios: aux_equipo.accesorios,
		});
		
		setReloadAuto(!reloadAuto)
		Swal.fire({
			icon: 'success',
			title: '¡Accesorio Agregado!',
			showConfirmButton: false,
			timer: 1500
		})
	}

	const accesorio = (_accesorio) => {
		var aux = {
			codigo: currentEquipo.codigo.slice(0, -1) + _accesorio.codigo,
			nombre: _accesorio.nombre
		}
		console.log(aux)
		setAcc1(aux)
	}



	const navegarView = (ruta) => {
		navigate(`/${params.uid}/${ruta}`);
	}
	const quitarAccesorio = (_acc) => {
		let aux = accesoriosEquipo.filter(item => item.nombre !== _acc.nombre)
		const ref = doc(db, "ingreso", `${currentEquipo.id}`);
		updateDoc(ref, {
			accesorios: aux,
		});
		setAccesoriosEquipo(aux)
	}

	
	
	// const crearExcel = () => {
	// 	console.log("hola mundo");
	// 	console.log(data);
	// 	const myHeader = ["equipo", "codigo", "marca", "modelo"];
	// 	const worksheet = XLSX.utils.json_to_sheet(data.filter(FilterBySituacion), { header: myHeader });
	// 	const workbook = XLSX.utils.book_new();
	// 	XLSX.utils.sheet_add_aoa(worksheet, [["Equipo", "Código", "Marca", "Modelo"]], { origin: "A1" });
	// 	XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");
	// 	worksheet["!cols"] = [{ wch: 50 }, { wch: 30 }, { wch: 30 }];
	// 	XLSX.writeFile(workbook, "Equipos.xlsx", { compression: true });
	 // }

	 const crearExcel = () => {

        let aux_equipo = JSON.parse(JSON.stringify(data))
        let crono = aux_equipo.filter(FilterBySituacion).map((item)=>{
            let format_object = {
                codigo_equipo: item.codigo,
                equipo: item.equipo.nombre,
				tipo_equipo: item.tipo_equipo.nombre,
				ubicacion: item.ubicacion.nombre,
                marca: item.marca,
                modelo: item.modelo,
                serie: item.serie,
				propietario: item.propietario.nombre,
				responsable: item.responsable.nombre,
				importancia:item.importancia

            }
            return format_object
        })
		const myHeader = ["codigo_equipo","equipo","tipo_equipo","ubicacion","marca","modelo","serie","propietario","responsable","importancia"];
        const worksheet = XLSX.utils.json_to_sheet(crono, { header: myHeader });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.sheet_add_aoa(worksheet, [["Código","Equipo","Tipo Equipo","Ubicación","Marca","Modelo","Serie","Propietario","Responsable","Importancia"]], { origin: "A1" });
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");
        worksheet["!cols"] = [{ wch: 50 }, { wch: 30 }, { wch: 30 }];
        XLSX.writeFile(workbook, "InventarioHospiRio.xlsx", { compression: true });

    }

	const mostrarModalReubicar = (_data) => {
		let aux = JSON.parse(JSON.stringify(_data))
		setCurrentEquipo(aux)
		setModalReubicar(true)
		setUbicacion(aux.ubicacion)
		setDepartamento(aux.departamento)
		setResponsable(aux.responsable)
		setTipo(aux.tipo_equipo)
		setEquipo(aux.equipo)
	}
	const reubicarUbicado = () => {
		let aux_equipos = JSON.parse(JSON.stringify(data))
		let equipo_modify = JSON.parse(JSON.stringify(currentEquipo))
		let aux_historial = equipo_modify.codigos_historial
		console.log(aux_historial)
		equipo_modify.ubicacion = ubicacion
		equipo_modify.responsable = responsable
		equipo_modify.departamento = departamento
		equipo_modify.reubicado = true
		console.log("aqui ya cambiamo el valor del objeto",equipo_modify)
		let newCodigo = generateCodigo()
		equipo_modify.codigo = newCodigo
		aux_historial.push(newCodigo)
		let equipos_edited = aux_equipos.map(item=>{
			if(item.id === equipo_modify.id){
				return equipo_modify
			}else{
				return item
			}

		})
		setData(equipos_edited)
		const ref = doc(db, "ingreso", `${currentEquipo.id}`);
		updateDoc(ref, {
			codigos_historial: aux_historial,
			codigo: newCodigo,
			reubicado: true,
			departamento: departamento,
			ubicacion: ubicacion,
			responsable:responsable,

		});
		setModalReubicar(false)

	}



	return (
		<>
			<Container style={{paddingTop:10}}>
			<Typography component="div" variant="h3" className="princi3" >
          INVENTARIO EQUIPOS ACTIVOS
        </Typography>
				<Grid container spacing={{ xs: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
				
					<Grid item xs={12} md={12}>

						<Button
							variant="contained"

							sx={{ height: "100%" }}
							color='azul1'
							endIcon={<CloudDownloadIcon sx={{ fontSize: 90 }} />}
							onClick={() => { getData() }}

						>LEER DATOS</Button>

					</Grid>
					<Grid item xs={12} sm={12} md={3.5}>
						<Autocomplete
							disablePortal
							disabled = {deshabilitar2}
							id="combo-box-demo"
							key={reset}
							options={departamentos}
							getOptionLabel={(option) => {
								return option.nombre;
							}}
							onChange={(event, newvalue) => setDepartamentoFilter(newvalue.nombre)}
							renderInput={(params) => <TextField {...params} label="Departamento" type="text" />}
						/>
					</Grid>
					<Grid item xs={12} sm={12} md={4}>
						<Autocomplete
							disablePortal
							disabled = {deshabilitar2}
							id="combo-box-demo"
							key={reset}
							options={equipos}
							getOptionLabel={(option) => {
								return option.nombre;
							}}
							onChange={(event, newvalue) => setEquipoFilter(newvalue.nombre)}
							renderInput={(params) => <TextField {...params} label="Equipos" type="text" />}
						/>
					</Grid>



					<Grid item xs={12} sm={12} md={1.5}>

						<Button
							disabled = {deshabilitar2}
							variant="contained"
							fullWidth
							sx={{ height: "100%" }}
							color='azul1'
							endIcon={<FilterAltIcon sx={{ fontSize: 90 }} />}
							onClick={filtrarEquipos}

						>Filtrar</Button>

					</Grid>
					<Grid item xs={12} sm={12} md={1.5}>

						<Button variant="contained"
							disabled = {deshabilitar2}
							color='rojo'
							sx={{ height: "100%" }}
							fullWidth
							endIcon={<AddIcon sx={{ fontSize: 90 }} />}
							onClick={() => { setModalParametros(true) }}
						>AGREGAR</Button>

					</Grid>
					<Grid item xs={12} sm={12} md={1.5}>

						<Button variant="contained"
							disabled = {deshabilitar2}
							color='verde2'
							sx={{ height: "100%" }}
							fullWidth
							endIcon={<CalendarMonthIcon sx={{ fontSize: 90 }} />}
							onClick={crearExcel}
						>EXCEL</Button>

					</Grid>


					<Grid item xs={12} sm={12} md={3}>
						<Autocomplete
							disablePortal
							disabled = {deshabilitar2}
							key={reset}
							id="combo-box-demo"
							options={codigos}
							sx={{ width: 300 }}
							onChange={(event, newvalue) => setCodigoSeleccionado(newvalue)}
							renderInput={(params) => <TextField {...params} label="Buscar Codigo" />}
						/>
					</Grid>
					<Grid item xs={12} sm={12} md={1.5}>
						<Button variant="contained"
							sx={{ height: "100%" }}
							endIcon={<SearchIcon />}
							fullWidth
							onClick={btnBuscarCodigo}
							disabled = {deshabilitar2}
						>
							BUSCAR
						</Button>
					</Grid>
					<Grid item xs={12} sm={12} md={6}>
					<Stack spacing={2} direction={"row"} >
						<Stack spacing={2} direction={"row"} alignItems={"center"} >
							<strong>Editar:</strong><IconButton aria-label="edit" color='warning'><EditIcon /></IconButton>
						</Stack>
					
						<Stack spacing={2} direction={"row"} alignItems={"center"} >
							<strong>Eliminar:</strong><IconButton aria-label="delete" color='rojo'  ><DeleteIcon /></IconButton>
						</Stack>
						<Stack spacing={2} direction={"row"} alignItems={"center"} >
							<strong>Deshabilitar Equipo:</strong><IconButton aria-label="baja"  color='morado'  ><PhonelinkOffIcon /></IconButton>
						</Stack>
						<Stack spacing={2} direction={"row"} alignItems={"center"} >
							<strong>Reubicar:</strong><IconButton aria-label="reubicar"  color='crema'  ><EditLocationIcon /></IconButton>
						</Stack>
		
					</Stack>

					</Grid>



				</Grid>

				<br />
				<div style={{ height: 410 }}>

					<TableContainer  sx={{ maxHeight: 410 }}>
						<Table  stickyHeader aria-label="sticky table">
							<TableHead>
								<TableRow>
									{columns.map((column, index) => (
										<TableCell
											key={column.id}
											align={column.align}
											style={{ minWidth: column.minWidth }}
										>
											{column.label}
										</TableCell>
									))}

								</TableRow>
							</TableHead>
							<TableBody>
								{data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((row, index) => {
										return (
											<TableRow hover role="checkbox" tabIndex={-1} key={index}>
												<TableCell align="left">{row.codigo}</TableCell>
												<TableCell align="left">{row.equipo.nombre}</TableCell>
												<TableCell align="left">{row.departamento.nombre}</TableCell>
												<TableCell align="left">{row.responsable.nombre}</TableCell>
												<TableCell align="center">

													<Button variant='contained' disabled = {deshabilitar2}  color='dark' onClick={() => mostrarModalAccesorios(row)}>Accesorios</Button>

												</TableCell>
												<TableCell align="center">
													<Stack direction="row" spacing={1}>
														<IconButton aria-label="edit" onClick={() => mostrarModalActualizar(row)} color='warning' disabled = {deshabilitar2}><EditIcon /></IconButton>
														<IconButton aria-label="delete" onClick={() => eliminar(row)} color='rojo' disabled = {deshabilitar2} ><DeleteIcon /></IconButton>
														<IconButton aria-label="baja" onClick={() => DardeBaja(row)} color='morado' disabled = {deshabilitar2} ><PhonelinkOffIcon /></IconButton>
														<IconButton aria-label="reubicar" onClick={() => { mostrarModalReubicar(row) }} color='crema' disabled = {deshabilitar2} ><EditLocationIcon /></IconButton>
													</Stack>
												</TableCell>
												<TableCell align="center">
													<Stack direction="row" spacing={1}>
														<IconButton aria-label="delete" sx={{ color: teal[200] }} onClick={() => {mostrarModalInformacion(row)}} disabled = {deshabilitar2} ><InfoIcon /></IconButton>
														<IconButton aria-label="delete" sx={{ color: teal[200] }} onClick={() => {hojavida(row)}} disabled = {deshabilitar2} ><AssignmentIcon /></IconButton>
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
						count={data.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>

				</div>
			</Container>

			<Modal isOpen={modalInformacion}>

				<ModalHeader>
					<div><h1>Información Equipo</h1></div>
					<h1>David</h1>
				</ModalHeader>
				<ModalBody>
					<FormGroup>
						<Grid container spacing={0}>
							<Grid item xs={12} md={12}>
								<div className="i-informacion">
									<strong style={{ marginRight: 4 }}>Ubicación:</strong><p style={{ margin: 0 }}>{currentEquipo.ubicacion.nombre}</p>
								</div>
							</Grid>
							<Grid item xs={12} md={12}>
								<div className="i-informacion">
									<strong style={{ marginRight: 4 }}>Equipo:</strong><p style={{ margin: 0 }}>{currentEquipo.equipo.nombre}</p>
								</div>
							</Grid>
							<Grid item xs={12} md={12}>
								<div className="i-informacion">
									<strong style={{ marginRight: 4 }}>Departamento:</strong><p style={{ margin: 0 }}>{currentEquipo.departamento.nombre}</p>
								</div>
							</Grid>
							<Grid item xs={12} md={12}>
								<div className="i-informacion">
									<strong style={{ marginRight: 4 }}>Tipo de Equipo:</strong><p style={{ margin: 0 }}>{currentEquipo.tipo_equipo.nombre}</p>
								</div>
							</Grid>
							<Grid item xs={12} md={12}>
								<div className="i-informacion">
									<strong style={{ marginRight: 4 }}>Responsable:</strong><p style={{ margin: 0 }}>{currentEquipo.responsable.nombre}</p>
								</div>
							</Grid>
							<Grid item xs={12} md={12}>
								<div className="i-informacion">
									<strong style={{ marginRight: 4 }}>Propietario:</strong><p style={{ margin: 0 }}>{currentEquipo.propietario.nombre}</p>
								</div>
							</Grid>
							<Grid item xs={12} md={12}>
								<div className="i-informacion">
									<strong style={{ marginRight: 4 }}>Marca:</strong><p style={{ margin: 0 }}>{currentEquipo.marca}</p>
								</div>
							</Grid>
							<Grid item xs={12} md={12}>
								<div className="i-informacion">
									<strong style={{ marginRight: 4 }}>Modelo:</strong><p style={{ margin: 0 }}>{currentEquipo.modelo}</p>
								</div>
							</Grid>
							<Grid item xs={12} md={12}>
								<div className="i-informacion">
									<strong style={{ marginRight: 4 }}>Serie:</strong><p style={{ margin: 0 }}>{currentEquipo.serie}</p>
								</div>
							</Grid>
							<Grid item xs={12} md={12}>
								<div className="i-informacion">
									<strong style={{ marginRight: 4 }}>Importancia:</strong><p style={{ margin: 0 }}>{currentEquipo.importancia}</p>
								</div>
							</Grid>

							<Grid item xs={12} md={12}>
								<div className="i-informacion">
									<strong style={{ marginRight: 4 }}>Código:</strong><p style={{ margin: 0 }}>{currentEquipo.codigo}</p>
								</div>
							</Grid>
							<Grid item xs={12} md={12}>
								<div className="i-informacion">
									<strong style={{ marginRight: 4 }}>Seguro:</strong><p >{currentEquipo.seguro ? "ASEGURADO" : "SIN SEGURO"}</p>
								</div>
							</Grid>

							<Grid item xs={12} md={12}>

							</Grid>
						</Grid>
						<Grid className="fila" item xs={12}>
							{/* <label className="archivo">
                                    Archivo:
                                </label> */}
							<a
								component="button"
								variant="body2"
								href={currentEquipo.img}
								target="_blank"
								rel="noreferrer"
							>
								Visualizar Fotografía
							</a>
						</Grid >
					</FormGroup>

				</ModalBody>
				<ModalFooter>
					<Button
						variant="contained"
						className="boton-modal2"
						onClick={() => cerrarModalInformacion()}
					>
						Cancelar
					</Button>
				</ModalFooter>
			</Modal>

			<Modal isOpen={modalActualizar}>
				<ModalHeader>
					<div><h3>Editar Equipo</h3></div>
				</ModalHeader>
				<ModalBody>
					<Grid container spacing={2}>

						<Grid item xs={6}>
							<TextField fullWidth inputProps={{ style: { textTransform: "uppercase" } }} label="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} />
						</Grid>
						<Grid item xs={6}>
							<TextField fullWidth label="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} />
						</Grid>
						<Grid item xs={6}>
							<TextField fullWidth label="Serie" value={serie} onChange={(e) => setSerie(e.target.value)} />
						</Grid>
						<Grid item xs={6}>
							{/* <TextField fullWidth inputProps={{ style: { textTransform: "uppercase" } }} label="Propietario" value={propietario} type="int" onChange={(e) => setPropietario(e.target.value)} /> */}
							<Autocomplete
								disableClearable
								id="combo-box-demo"
								defaultValue={{nombre:"HOSPITAL DEL RIO",codigo:1}}
								value={propietario}
								options={propietarios}
								isOptionEqualToValue={(option, value) => option.codigo === value.codigo}
								getOptionLabel={(option) => {
									return option.nombre;
								}}
								onChange={(event, newvalue) => setPropietario(newvalue)}
								renderInput={(params) => <TextField {...params} fullWidth label="Propietarios" type="text" />}
							/>
						</Grid>
						<Grid item xs={6}>
							<Autocomplete
								disablePortal
								id="combo-box-demo"
								value={seguro}
								options={tseguro}
								isOptionEqualToValue={(option, value) => option.value === value.value}
								getOptionLabel={(option) => option.label}
								onChange={(event, newvalue) => setSeguro(newvalue)}
								renderInput={(params) => <TextField {...params} fullWidth label="Seguro" type="text" />}
							/>
						</Grid>

						<Grid item xs={12}>
							<b>Importancia:    </b>
							<RadioGroup
								row
								aria-labelledby="demo-radio-buttons-group-label"
								onChange={(event, newValue) => { setEimportancia(newValue) }}
								value={eimportancia}
								name="radio-buttons-group"
							>
								<FormControlLabel value="Prioritario" control={<Radio />} label="Prioritario" />
								<FormControlLabel value="Normal" control={<Radio />} label="Normal" />
							</RadioGroup>
						</Grid>
						<Grid item xs={12}>
							<div >
								<label className="form-label">Actualizar Fotografía</label>
								<input className="form-control" style={{ margin: 0 }} onChange={buscarImagen} type="file" id="formFile" />
							</div>
						</Grid>
					</Grid>
				</ModalBody>

				<ModalFooter>
					<Button
						variant="outlined"
						className="boton-modal2"
						onClick={() => ActualizarEquipo()}
					>
						Editar
					</Button>
					<Button
						variant="contained"
						className="boton-modal"
						onClick={() => cerrarModalActualizar()}
					>
						Cancelar
					</Button>
				</ModalFooter>
			</Modal>

			<Modal  isOpen={modalInsertar}>
				<ModalHeader>
					<div><h3>Ingresar Nuevo Equipo</h3></div>
				</ModalHeader>
				<ModalBody>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<Autocomplete
								disableClearable
								id="combo-box-demo"
								options={tipoEquipo}
								getOptionLabel={(option) => {
									return option.nombre;
								}}
								onChange={(event, newvalue) => setTipo(newvalue)}
								renderInput={(params) => <TextField {...params} fullWidth label="Tipo de equipo" type="text" />}
							/>
						</Grid>
						<Grid item xs={6}>
							<Autocomplete
								disableClearable
								id="combo-box-demo"
								options={equipos}
								getOptionLabel={(option) => {
									return option.nombre;
								}}
								onChange={(event, newvalue) => setEquipo(newvalue)}
								renderInput={(params) => <TextField {...params} fullWidth label="Equipo" type="text" />}
							/>
						</Grid>
						<Grid item xs={6}>
							<Autocomplete
								disableClearable
								id="combo-box-demo"
								options={ubicaciones}
								getOptionLabel={(option) => {
									return option.nombre;
								}}
								onChange={(event, newvalue) => setUbicacion(newvalue)}
								renderInput={(params) => <TextField {...params} fullWidth label="Ubicacion" type="text" />}
							/>
						</Grid>
						<Grid item xs={6}>
							<Autocomplete
								disableClearable
								id="combo-box-demo"
								options={responsables}
								getOptionLabel={(option) => {
									return option.nombre;
								}}
								onChange={(event, newvalue) => setResponsable(newvalue)}
								renderInput={(params) => <TextField {...params} fullWidth label="Responsable" type="text" />}
							/>
						</Grid>
						<Grid item xs={6}>
							<Autocomplete
								disableClearable
								id="combo-box-demo"
								options={departamentos}
								getOptionLabel={(option) => {
									return option.nombre;
								}}
								onChange={(event, newvalue) => setDepartamento(newvalue)}
								renderInput={(params) => <TextField {...params} fullWidth label="Departamento" type="text" />}
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField fullWidth inputProps={{ style: { textTransform: "uppercase" } }} label="Marca" type="int" onChange={(e) => setMarca(e.target.value)} />
						</Grid>
						<Grid item xs={6}>
							<TextField fullWidth label="Modelo" type="int" onChange={(e) => setModelo(e.target.value)} />
						</Grid>
						<Grid item xs={6}>
							<TextField fullWidth label="Serie" type="int" onChange={(e) => setSerie(e.target.value)} />
						</Grid>
						<Grid item xs={6}>
							{/* <TextField fullWidth inputProps={{ style: { textTransform: "uppercase" } }} label="Propietario" type="int" onChange={(e) => setPropietario(e.target.value)} /> */}
							<Autocomplete
								disableClearable
								id="combo-box-demo"
								options={propietarios}
								getOptionLabel={(option) => {
									return option.nombre;
								}}
								onChange={(event, newvalue) => setPropietario(newvalue)}
								renderInput={(params) => <TextField {...params} fullWidth label="Propietarios" type="text" />}
							/>
						</Grid>
						<Grid item xs={6}>
							<Autocomplete
								disableClearable
								id="combo-box-demo"
								getOptionLabel={(option) => {
									return option.label;
								}}
								options={tseguro}
								onChange={(event, newvalue) => setSeguro(newvalue.value)}
								renderInput={(params) => <TextField {...params} fullWidth label="Seguro" type="text" />}
							/>
						</Grid>
						<Grid item xs={12}>
						<strong>Codigo Generado: </strong>{ubicacion.codigo + "-" + departamento.codigo + "-" + responsable.codigo + "-" + tipo.codigo + "-" + equipo.codigo + "-1-0"}
						</Grid>
						<Grid item xs={12}>
							<b>Importancia:    </b>
							<RadioGroup
								row
								aria-labelledby="demo-radio-buttons-group-label"
								defaultValue="Normal"
								onChange={(event, newValue) => { setEimportancia(newValue) }}
								value={eimportancia}
								name="radio-buttons-group"
							>
								<FormControlLabel value="Prioritario" control={<Radio />} label="Prioritario" />
								<FormControlLabel value="Normal" control={<Radio />} label="Normal" />
							</RadioGroup>
						</Grid>
						<Grid item xs={12}>
							<div >
								<label className="form-label">Cargar Fotografía</label>
								<input className="form-control" style={{ margin: 0 }} onChange={buscarImagen} type="file" id="formFile" />
							</div>
						</Grid>
					</Grid>

				</ModalBody>

				<ModalFooter>
					<Button
						variant="outlined"
						className="boton-modal2"
						onClick={() => IngresarEquipo()}
					>
						Insertar
					</Button>
					<Button
						variant="contained"
						className="boton-modal"
						onClick={() => cerrarModalInsertar()}
					>
						Cancelar
					</Button>
				</ModalFooter>
			</Modal>


			<Modal isOpen={modalAccesorios}>
				<ModalHeader>
					<div><h3>Accesorios del Equipo</h3></div>
				</ModalHeader>
				<ModalBody>

					<Grid container spacing={2}>
						<Grid item xs={12}>

							<Autocomplete
								disableClearable
								id="combo-box-demo"
								options={accesorios}
								key={reloadAuto}
								isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
								getOptionLabel={(option) => option.nombre}
								onChange={(event, newValue) => { accesorio(newValue) }}
								renderInput={(params) => <TextField {...params} fullWidth label="Accesorios" type="text" />}
							/>
						</Grid>

						<Grid item xs={12} >
							<Button
								variant="contained"
								fullWidth
								onClick={() => agregarAccesorio()}

							>
								AGREGAR ACCESORIO
							</Button>
						</Grid>
						<Grid item xs={12} >
		

							<TableContainer sx={{overflowY:"scroll",height:300}} component={Paper}>
								<Table  aria-label="customized table">
									<TableHead>
									<TableRow>
						
										<StyledTableCell align="left">#</StyledTableCell>
										<StyledTableCell align="left">Código</StyledTableCell>
										<StyledTableCell align="left">Accesorio</StyledTableCell>
										<StyledTableCell align="left">Acciones</StyledTableCell>
									</TableRow>
									</TableHead>
									<TableBody>
									{accesoriosEquipo.map((row,index) => (
										<StyledTableRow key={index}>
			
										<StyledTableCell align="left">{index+1}</StyledTableCell>
										<StyledTableCell align="left">{row.codigo}</StyledTableCell>
										<StyledTableCell align="left">{row.nombre}</StyledTableCell>
										<StyledTableCell align="left"
										><Button variant="contained" color='warning' onClick={() => { quitarAccesorio(row) }}>
														Quitar
													</Button></StyledTableCell>
										</StyledTableRow>
									))}
									</TableBody>
								</Table>
								</TableContainer>

						</Grid>
					</Grid>
				</ModalBody>
				<ModalFooter>
					<Button
						variant="contained"
						onClick={() => cerrarModalAccesorios()}
					>
						Cerrar
					</Button>
				</ModalFooter>
			</Modal>

			<Modal isOpen={modalReubicar}>
				<ModalHeader>
					<div><h3>Reubicacion del Equipo</h3></div>
				</ModalHeader>
				<ModalBody>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<Autocomplete
								disableClearable
								id="combo-box-demo"
								options={ubicaciones}
								value={ubicacion}
								getOptionLabel={(option) => {
									return option.nombre;
								}}
								isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
								onChange={(event, newvalue) => setUbicacion(newvalue)}
								renderInput={(params) => <TextField {...params} fullWidth label="Ubicacion" type="text" />}
							/>
						</Grid>
						<Grid item xs={6}>
							<Autocomplete
								disableClearable
								id="combo-box-demo"
								options={responsables}
								isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
								value={responsable}
								getOptionLabel={(option) => {
									return option.nombre;
								}}
								onChange={(event, newvalue) => setResponsable(newvalue)}
								renderInput={(params) => <TextField {...params} fullWidth label="Responsable" type="text" />}
							/>
						</Grid>
						<Grid item xs={6}>
							<Autocomplete
								disableClearable
								id="combo-box-demo"
								value={departamento}
								options={departamentos}
								getOptionLabel={(option) => {
									return option.nombre;
								}}
								isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
								onChange={(event, newvalue) => setDepartamento(newvalue)}
								renderInput={(params) => <TextField {...params} fullWidth label="Departamento" type="text" />}
							/>
						</Grid>
						<Grid item xs={12} >
							<Button
								variant="contained"
								fullWidth
								onClick={() => { reubicarUbicado() }}
							>
								REUBICAR EQUIPO
							</Button>
						</Grid>
						<Grid item xs={12} >
						</Grid>
					</Grid>

				</ModalBody>

				<ModalFooter>


					<Button
						variant="contained"
						onClick={() => setModalReubicar(false)}
					>
						Cerrar
					</Button>
				</ModalFooter>
			</Modal>
			<Modal isOpen={modalParametros}>
				<ModalHeader>
					<div><h3>AGREGUE UN PARAMETRO</h3></div>
				</ModalHeader>
				<ModalBody>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Button variant="contained"
								color='azul1'
								fullWidth
								onClick={() => mostrarModalInsertar()}>Ingresar Equipo</Button>
						</Grid>

						<Grid item xs={12} >
							<Button variant="outlined"
								fullWidth
								endIcon={<DomainAddIcon sx={{ fontSize: 90 }} />}
								onClick={() => navegarView("inventario/invequipos/declarar_area")}
							>
								Crear Departamento
							</Button>
						</Grid>

						<Grid item xs={12} >
							<Button variant="outlined"
								fullWidth
								endIcon={<AddToQueueIcon sx={{ fontSize: 90 }} />}
								onClick={() => navegarView("inventario/invequipos/declarar_equipo")}
							>
								Crear Equipo
							</Button>
						</Grid>
						<Grid item xs={12} >
							<Button variant="outlined"
								fullWidth
								endIcon={<AddToQueueIcon sx={{ fontSize: 90 }} />}
								onClick={() => navegarView("inventario/invequipos/declarar_responsable")}
							>
								Crear Responsable
							</Button>
						</Grid>
						<Grid item xs={12}>
							<Button variant="outlined"
								fullWidth
								endIcon={<Person2Icon sx={{ fontSize: 90 }} />}
								onClick={() => navegarView("inventario/invequipos/declarar_propietario")}
							>
								Crear Propietario
							</Button>
						</Grid>
						<Grid item xs={12} >
							<Button variant="outlined"
								fullWidth
								endIcon={<ExtensionIcon sx={{ fontSize: 90 }} />}
								onClick={() => navegarView("inventario/invequipos/declarar_accesorios")}
							>
								Crear Accesorio
							</Button>
						</Grid>
						<Grid item xs={12} >
							<Button variant="outlined"
								fullWidth
								endIcon={<AddToQueueIcon sx={{ fontSize: 90 }} />}
								onClick={() => navegarView("inventario/invequipos/declarar_ubicacion")}
							>
								Crear Ubicación
							</Button>
						</Grid>
						<Grid item xs={12}>
							<Button variant="outlined"
								fullWidth
								endIcon={<AddToQueueIcon sx={{ fontSize: 90 }} />}
								onClick={() => navegarView("inventario/invequipos/declarar_tipo_equipo")}
							>
								Crear Tipo de Equipo
							</Button>
						</Grid>
					</Grid>

				</ModalBody>

				<ModalFooter>


					<Button
						variant="contained"
						onClick={() => setModalParametros(false)}
					>
						Cerrar
					</Button>
				</ModalFooter>
			</Modal>
			<Backdrop
				sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={deshabilitar}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
		</>
	);

}



const tseguro = [
	{ label: 'ASEGURADO', value: true },
	{ label: 'SIN SEGURO', value: false }
]

const initialData = {
	//valores iniciales por defecto
	ubicacion: "",
	departamento: "",
	responsable: "",
	tipo_equipo: "",
	equipo: "",
	modelo: "",
	marca: "",
	serie: "",
	propietario: "",
	seguro: "",
	importancia: "",
	codigo: "",
	id: "",
	indice: "",
	//valores pendientes a declarar
	codigos_historial: [],
	accesorios: [{ codigo: 123, nombre: "pepito" }],
	mantenimientos: [],
	mtbf: "",
	mttr: "",
	img: "",
	numero_fallos: "",
	disponibilidad: "",
}

const no_img = "https://firebasestorage.googleapis.com/v0/b/app-mantenimiento-91156.appspot.com/o/inventario%2FSP.PNG?alt=media&token=835f72e6-3ddf-4e64-bd7c-b95564da4ec8"
const columns = [
	{ id: 'codigo', label: 'Codigo', minWidth: 170 },
	{ id: 'equipo', label: 'Equipo', minWidth: 100 },
	{ id: 'departamento', label: 'Departamento', minWidth: 100 },
	{ id: 'responsable', label: 'Responsable', minWidth: 100 },
	{ id: 'accesoriops', label: 'Accesorios', minWidth: 100, align: 'center' },
	{ id: 'acciones', label: 'Acciones', minWidth: 100, align: 'center' },
	{ id: 'info', label: 'Info', minWidth: 100, align: 'center' },
];
