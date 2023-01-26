import '../css/Tabla.css'
import '../css/Ordentrabajo.css';
import '../css/Presentacion.css';
import '../css/InventarioView.css';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from "react";
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

  const [accesoriosEquipo, setAccesoriosEquipo] = useState([]);

  //variables de declaracion de equipo


  const [currentEquipo, setCurrentEquipo] = useState(initialData);



  const getData = async () => {
    const reference = query(collection(db, "ingreso"));
    onSnapshot(reference, (querySnapshot) => {
      setData(
        querySnapshot.docs.map((doc) => ({ ...doc.data() }))
      );
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
    dispatch(setEquipoState(data))
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
      <Typography component="div" variant="h4" className="princi3" >
        INVENTARIO EQUIPOS
      </Typography>
      <Typography component="div" variant="h5" className="princi9" >
        Médicos - Industriales
      </Typography>
      <Grid container>
              <Grid item xs={12} md={12}>
              <Button onClick={crearExcel} color='verde2' variant="contained">GENERAR EXCEL</Button>
              </Grid>
      </Grid>
      <Container>
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
                <Td>{dato.equipo}</Td>
                <Td>{dato.departamento}</Td>
                <Td>{dato.responsable}</Td>
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
                  <strong style={{ marginRight: 4 }}>Ubicacion:</strong><p style={{ margin:0 }}>{currentEquipo.ubicacion}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Equipo:</strong><p style={{ margin:0 }}>{currentEquipo.equipo}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Departamento:</strong><p style={{ margin:0 }}>{currentEquipo.departamento}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Tipo de Equipo:</strong><p style={{ margin:0 }}>{currentEquipo.tipo_equipo}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Responsable:</strong><p style={{ margin:0 }}>{currentEquipo.responsable}</p>
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