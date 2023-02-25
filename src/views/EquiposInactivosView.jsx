import '../css/Tabla.css'
import '../css/Ordentrabajo.css';
import '../css/Presentacion.css';
import '../css/InventarioView.css';
import Typography from '@mui/material/Typography';
import React, { useEffect, useRef, useState } from "react";
import InfoIcon from '@mui/icons-material/Info';
import Swal from 'sweetalert2';
import IconButton from '@mui/material/IconButton';
import { collection, query, onSnapshot, doc, updateDoc } from "firebase/firestore";
import Grid from "@mui/material/Grid";
import { db } from "../firebase/firebase-config";
import { teal, deepOrange } from '@mui/material/colors';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { useNavigate } from 'react-router-dom';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { setEquipoState } from '../features/inventario/inventarioSlice';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import '../css/Inventario.css';
import Button from '@mui/material/Button';
import * as XLSX from 'xlsx';
import {
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
} from "reactstrap";

import { useDispatch } from "react-redux";

export default function EquiposInactivosView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [modalInformacion, setModalinformacion] = useState(false);
  const [equipos,setEquipos] = useState([])
  const [accesoriosEquipo, setAccesoriosEquipo] = useState([]);
  const [reset,setReset] = useState(false);
  const equipos_totales = useRef([])
  const [codigosFiltrados,setCodigosFiltrados] = useState([]);
  const equiposFiltro = useRef("")
  const [codigoSeleccionado,setCodigoSeleccionado] = useState("");
 
  //variables de declaracion de equipo
	const filtrarInventario = () => {
		let aux = JSON.parse(JSON.stringify(equipos_totales.current))
		let filtrados = aux.filter(filterByNombre).filter(filterByCodigo)
		setData(filtrados)
		setCodigoSeleccionado("")
		equiposFiltro.current = ""
		setReset(!reset)
	}
  const filterByNombre = (_equipo) => {
		if (equiposFiltro.current !== "") {
			if (_equipo.equipo.nombre === equiposFiltro.current) {
				return _equipo
			} else {
				return null
			}
		} else {
			return _equipo
		}
	}
	const filterByCodigo = (_equipo) => {
		if (codigoSeleccionado !== "") {
			if (_equipo.codigo === codigoSeleccionado) {
				return _equipo
			} else {
				return null
			}
		} else {
			return _equipo
		}
	}

	const traerCodigos = (value) => {
		let codigos_equipos = equipos_totales.current.filter(item => item.equipo.nombre === value.nombre && item.situacion === "Inactivo")
		let codigos_fifltrados = codigos_equipos.map(item => (item.codigo))
		setCodigosFiltrados(codigos_fifltrados)
		equiposFiltro.current = value.nombre
	}
  const [currentEquipo, setCurrentEquipo] = useState(initialData);



  const getData = async () => {
    const reference = query(collection(db, "ingreso"));
    onSnapshot(reference, (querySnapshot) => {
      setData(
        querySnapshot.docs.map((doc) => ({ ...doc.data() }))
      );
      equipos_totales.current = querySnapshot.docs.map((doc) => ({ ...doc.data() }))
    });
    onSnapshot(doc(db, "informacion", "parametros"), (doc) => {

			setEquipos(doc.data().equipos)

		});

  }

//metodos para gestionar los equipos activos de los que ya no estan operativos
 const FilterBySituacion = (_item) =>{
  if(_item.situacion === "Inactivo"){
    return _item
  }else{
    return null
  }
 }
//metodos para subir imagenes

const mostrarModalInformacion = (_dato) => {
    setCurrentEquipo(_dato)
    setAccesoriosEquipo(_dato.accesorios)
    setModalinformacion(true);
  };

  const cerrarModalInformacion = () => {
    setModalinformacion(false);
  };

const hojavida = (data) => {
  let aux = JSON.parse(JSON.stringify(data))
  let temp = aux.codigos_historial
  temp.unshift('TODOS')

  dispatch(setEquipoState(aux))
  navigate('hojadevida')
  }



  const ActivarN = (_data) =>{
    Swal.fire({
      title:  "Activar Equipo",
      text: "¿Desea activar este equipo?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí'
    }).then((result) => {
      if (result.isConfirmed) {
        const ref = doc(db, "ingreso", `${_data.id}`);
        updateDoc(ref, {
          situacion: "Activo",
        });
      
        Swal.fire(
          'Equipo Activado!',
          '',
          'success'
        )
      
      }
    })
   }

  const crearExcel = () => {
    console.log("hola mundo");
    console.log(data)
    const myHeader = ["equipo", "codigo", "marca", "modelo"];
    const worksheet = XLSX.utils.json_to_sheet(data.filter(FilterBySituacion), { header: myHeader });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(worksheet, [["Equipo", "Código", "Marca", "Modelo"]], { origin: "A1" });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");
    worksheet["!cols"] = [{ wch: 50 }, { wch: 30 }, { wch: 30 }];
    XLSX.writeFile(workbook, "Equipos.xlsx", { compression: true });
  }
  useEffect(() => {
    getData();

  }, [])



  return (
    <>   
    <Container>
      <Typography component="div" variant="h4" className="princi3" >
        INVENTARIO EQUIPOS INACTIVOS
      </Typography>
      <Typography component="div" variant="h5" className="princi9" >
        Médicos - Industriales
      </Typography>
      <Grid container  spacing={{ xs: 2 }} columns={{ xs: 4, sm: 8, md: 12 }} >
      <Grid item xs={12} sm={12} md={3}>
						<Autocomplete
							disablePortal
							id="combo-box-demo"
							key={reset}
							options={equipos}
							getOptionLabel={(option) => {
								return option.nombre;
							}}
							// isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
							onChange={(event, newvalue) => traerCodigos(newvalue)}
							renderInput={(params) => <TextField {...params} label="Equipos" type="text" />}
						/>
					</Grid>
					<Grid item xs={12} sm={12} md={3}>
						<Autocomplete
							disablePortal
							id="combo-box-demo"
							key={reset}
							options={codigosFiltrados}
							onChange={(event, newvalue) => setCodigoSeleccionado(newvalue)}
							renderInput={(params) => <TextField {...params} label="Codigo" type="text" />}
						/>
					</Grid>
					<Grid item xs={12} sm={12} md={3}>

						<Button
							variant="contained"
							fullWidth
							sx={{ height: "100%" }}
							color='azul1'
							// endIcon={<FilterAltIcon sx={{ fontSize: 90 }} />}
							onClick={filtrarInventario}

						>Filtrar</Button>

					</Grid>
              <Grid item xs={12} md={3}>
              <Button onClick={crearExcel} sx={{ height: "100%" }} fullWidth color='verde2' variant="contained">GENERAR EXCEL</Button>
              </Grid>
      </Grid>

        <br />
        <Table className='table table-ligh table-hover'>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Código</Th>
              <Th>Equipo</Th>
              <Th>Departamento</Th>
              <Th>Responsable</Th>
              <Th>Acciones</Th>
              <Th>Info</Th>
              <Th>Hoja</Th>
            </Tr>
          </Thead>

          <Tbody>
            {data.filter(FilterBySituacion).map((dato, index) => (
              <Tr key={dato.indice}>
                <Td>{index + 1}</Td>
                <Td>{dato.codigo}</Td>
                <Td>{dato.equipo.nombre}</Td>
                <Td>{dato.departamento.nombre}</Td>
                <Td>{dato.responsable.nombre}</Td>
                <Td> <Button variant="contained" color='morado' onClick={()=> {ActivarN(dato)}} >Activar</Button>
                </Td>
                <Td>
                  <IconButton aria-label="delete" sx={{ color: teal[200] }} onClick={() => mostrarModalInformacion(dato)}><InfoIcon /></IconButton>
                </Td>
                <Td>
                  <IconButton aria-label="delete" sx={{ color: deepOrange[200] }} onClick={() => { hojavida(dato) }} ><AssignmentIcon /></IconButton>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Container>

      <Modal isOpen={modalInformacion}>

        <ModalHeader>
          <div><h1>Información Equipo</h1></div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Grid container>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Ubicacion:</strong><p style={{ margin:0 }}>{currentEquipo.ubicacion.nombre}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Equipo:</strong><p style={{ margin:0 }}>{currentEquipo.equipo.nombre}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Departamento:</strong><p style={{ margin:0 }}>{currentEquipo.departamento.nombre}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Tipo de Equipo:</strong><p style={{ margin:0 }}>{currentEquipo.tipo_equipo.nombre}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Responsable:</strong><p style={{ margin:0 }}>{currentEquipo.responsable.nombre}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Marca:</strong><p style={{ margin:0 }}>{currentEquipo.marca}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Modelo:</strong><p style={{ margin:0 }} >{currentEquipo.modelo}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Serie:</strong><p style={{ margin:0 }}>{currentEquipo.serie}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Importancia:</strong><p style={{ margin:0 }}>{currentEquipo.importancia}</p>
                </div>
              </Grid>

              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Código:</strong><p style={{ margin:0 }}>{currentEquipo.codigo}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Seguro:</strong><p>{currentEquipo.seguro ? "Asegurado" : "Sin seguro"}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div style={{overflow:"scroll", height:"150px"}}>
              <Table className='table table-ligh table-hover'>
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Código</Th>
                    <Th>Accesorio</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {accesoriosEquipo.map((dato, index) => (
                    <Tr key={index}>
                      <Td>{index + 1}</Td>
                      <Td>{dato.codigo}</Td>
                      <Td>{dato.nombre}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              </div>
                </Grid>
            </Grid>
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




    </>
  );

}






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
    accesorios: [{ codigo: 123, nombre: "pepito" }],
    mantenimientos: [],
    mtbf: "",
    mttr: "",
    img: "",
    numero_fallos: "",
    disponibilidad: "",
  }