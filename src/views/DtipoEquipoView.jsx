import React, { useState, useEffect } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { db } from "../firebase/firebase-config";
import Typography from '@mui/material/Typography';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Swal from 'sweetalert2';
import {  doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    ModalFooter,
  } from "reactstrap";
export default function DtipoEquipoView() {
  const navigate = useNavigate();
  let params = useParams();
  const [tipoEquipo, setTipoEquipo] = useState([])
  const [nombre, setNombre] = useState("")
  const [codigo, setCodigo] = useState("")
  const [deshabilitar,setDeshabilitar] = useState(false);
  const [modalEditar,setModalEditar] = useState(false);
  const [currentEquipo,setCurrentEquipo] = useState({})
  const getData = () => {
      onSnapshot(doc(db, "informacion", "parametros"), (doc) => {
        setTipoEquipo(doc.data().tequipo)
      });
  }
  const eliminarItem = async(_data) =>{
      Swal.fire({
          title: 'Quieres Eliminar este tipo de Equipo?',
          showCancelButton: true,
          confirmButtonText: 'Si',
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
              let aux = tipoEquipo
              let items_filtrados = aux.filter(item => item.nombre !== _data.nombre)
              updateData(items_filtrados)
            Swal.fire('Equipo Eliminado!', '', 'success')
          } 
        })
     
  }
  const updateData = async(_data)=>{
      const ref = doc(db, "informacion", "parametros");
      await updateDoc(ref, {
        tequipo: _data
      });
  }
  const abrirModalEditar = (_data) =>{
      setNombre(_data.nombre)
      setCodigo(_data.codigo)
      setCurrentEquipo(_data)
      setModalEditar(true)
  }
  const limpiarDatos = ()=>{
      setNombre("");
      setCodigo("")
  }
  const actualizarEquipo = () =>{
      let aux = tipoEquipo
      let temp = aux.map(item =>{
          if(item.nombre === currentEquipo.nombre){
              item.nombre = nombre.toUpperCase()
              item.codigo = codigo
          }
          return item
      })
      updateData(temp);
      limpiarDatos();
      setModalEditar(false)
  }
  const agregarItem = async () => {
      setDeshabilitar(true)
      let aux = JSON.parse(JSON.stringify(tipoEquipo))
      let temp = JSON.parse(JSON.stringify(tipoEquipo))
      let numCode
      if (nombre !== "") {


          let check1 = aux.find(item => item.codigo === codigo)
          let check2 = aux.find(item => item.nombre === nombre)
          if (check1 === undefined && check2 === undefined) {
              let ordenados = aux.sort((a, b) => parseInt(b.codigo) - parseInt(a.codigo));
              if(ordenados.length === 0){
                numCode = 1
              }else{
                  numCode = parseInt(ordenados[0].codigo) +1
              }
              let newItem = {
                  nombre: nombre.trim().toUpperCase(),
                  codigo: numCode
              }
              temp.push(newItem)
              temp.sort((a, b) => parseInt(a.codigo) - parseInt(b.codigo));
              const ref = doc(db, "informacion", "parametros");
              await updateDoc(ref, {
                  tequipo: temp
              });
              limpiarDatos();
              Swal.fire({
                icon: 'success',
                title: '¡Tipo de Equipo Agregado!',
                showConfirmButton: false,
                timer: 1500
              })
          } else {
              Swal.fire({
                  icon: 'warning',
                  title: 'Equipo ya declarado',
                  text: 'Lo siento ya existe ese equipo',
              })
          }
      } else {
          Swal.fire({
              icon: 'error',
              title: 'Faltan Campos',
              text: 'Llene todos los campos',
          })
      }
      setDeshabilitar(false)
  }
  const navegarView = (ruta) => {
    navigate(`/${params.uid}/${ruta}`);
}

  const salir = () => {
    navegarView('inventario/equipos_activos');
};
  useEffect(() => {
      getData();

  }, [])

    return(
      <>
    
      {/* <h3>Declare  el tipo de Equipo y código correspondiente</h3> */}

      <Container>

          <Grid container spacing={{ xs: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid item xs={12} md={12}>
          <Typography component="div" variant="h4" className="princicrear" >
        DECLARAR TIPO DE EQUIPO
      </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
              <Button variant="outlined"
                 sx={{height:"100%"}}
                                    className="boton-salir"
                                    fullWidth
                                    endIcon={<ReplyAllIcon sx={{ fontSize: 90 }} />}
                                    onClick={() => { salir() }}
                                >Regresar</Button>
              </Grid>
              <Grid item xs={12} md={7}>
                  <TextField id="outlined-basic" inputProps={{ style: { textTransform: "uppercase" } }} value={nombre} error={false} fullWidth label="TIPO DE TRABAJO" variant="outlined" onChange={(event) => { setNombre(event.target.value) }} />
              </Grid>
              {/* <Grid item xs={12} md={2}>
                  <TextField id="outlined-basic" value={codigo} fullWidth label="Código" type="number" variant="outlined" onChange={(event) => { setCodigo(event.target.value) }} />
              </Grid> */}
              <Grid item xs={12} md={3}>
                  <Button variant="contained" sx={{ height: "100%", width: "100%" }} onClick={agregarItem}>Agregar Tipo de Equipo</Button>
              </Grid>
          
              <Grid item xs={12} md={12}>
                <div style={{height:500,overflow:"scroll"}}>
                  <Table className='table table-ligh table-hover'>
                      <Thead>
                          <Tr>
                              <Th>#</Th>
                              <Th>Nombre</Th>
                              <Th>Código</Th>
                              <Th>Acciones</Th>
                          </Tr>
                      </Thead>

                      <Tbody>
                          {tipoEquipo.map((dato, index) => (
                              <Tr key={index}>
                                  <Td>{index + 1}</Td>
                                  <Td>{dato.nombre}</Td>
                                  <Td>{dato.codigo}</Td>
                                  <Td>
                                      <Button onClick={()=>{eliminarItem(dato)}} >Eliminar</Button>
                                      <Button onClick={()=>{abrirModalEditar(dato)}} >Editar</Button>
                                  </Td>
                              </Tr>
                          ))}
                      </Tbody>
                  </Table>
                </div>
              </Grid>
          </Grid>
      </Container>

      <Modal isOpen={modalEditar}>
  <ModalHeader>
    <div><h3>Editar Equipo</h3></div>
  </ModalHeader>
  <ModalBody>
    <FormGroup>
      <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
                  <TextField id="outlined-basic" value={nombre}  inputProps={{ style: { textTransform: "uppercase" } }}  error={false} fullWidth label="Nombre del Tipo de Equipo" variant="outlined" onChange={(event) => { setNombre(event.target.value) }} />
              </Grid>
              {/* <Grid item xs={12} md={12}>
                  <TextField id="outlined-basic" value={codigo} fullWidth label="Codigo" type="number" variant="outlined" onChange={(event) => { setCodigo(event.target.value) }} />
              </Grid> */}
      </Grid>
    </FormGroup>
  </ModalBody>

  <ModalFooter>
    <Button
      variant="outlined"
      className="boton-modal2"
      onClick={()=>{actualizarEquipo()}}
    >
      Aceptar
    </Button>

    <Button
      variant="contained"
      className="boton-modal"
      onClick={()=>{
          setModalEditar(false)
          limpiarDatos()
      }}      
    >
      Cancelar
    </Button>
  </ModalFooter>
</Modal>
<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deshabilitar}>
                <CircularProgress color="inherit" />
            </Backdrop>
  </>
    )
}