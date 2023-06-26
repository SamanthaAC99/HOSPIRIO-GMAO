import React, { useState, useEffect } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { db } from "../firebase/firebase-config";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Swal from 'sweetalert2';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import {  doc, onSnapshot, updateDoc } from "firebase/firestore";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    ModalFooter,
  } from "reactstrap";
export default function ParametrosView() {
  const [accesorios, setAccesorios] = useState([])
  const navigate = useNavigate();
  let params = useParams();
  const [codigo, setCodigo] = useState("")
  const [nombre, setNombre] = useState("")
  const [deshabilitar,setDeshabilitar] = useState(false);
  const [modalEditar,setModalEditar] = useState(false);
  const [currentEquipo,setCurrentEquipo] = useState({})
  const getData = () => {
      onSnapshot(doc(db, "informacion", "parametros"), (doc) => {
        setAccesorios(doc.data().pcalibracion)
  
      });
  }

  const eliminarItem = async(_data) =>{
      Swal.fire({
          title: 'Quieres Eliminar este Responsable?',
          showCancelButton: true,
          confirmButtonText: 'Si',
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
              let aux = accesorios
              let items_filtrados = aux.filter(item => item.nombre !== _data.nombre)
              updateData(items_filtrados)
            Swal.fire('Equipo Eliminado!', '', 'success')
          } 
        })
     
  }
  const updateData = async(_data)=>{
      const ref = doc(db, "informacion", "parametros");
      await updateDoc(ref, {
        pcalibracion: _data
      });
  }
  const abrirModalEditar = (_data) =>{
      setNombre(_data.nombre)
      setCodigo(_data.codigo)
                        setModalEditar(true)
  }




  const limpiarDatos = ()=>{
      setNombre("");
      setCodigo("");
  }
  const navegarView = (ruta) => {
    navigate(`/${params.uid}/${ruta}`);
}

  const salir = () => {
    navegarView('calibracion/equipos');
};

  const agregarItem = async () => {
    setDeshabilitar(true);
    let numCode
      let aux = JSON.parse(JSON.stringify(accesorios))
      let temp = JSON.parse(JSON.stringify(accesorios))
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
                codigo: numCode,
                nombre: nombre.trim().toUpperCase(),                
            }
            
            temp.push(newItem)
            temp.sort((a, b) => parseInt(a.codigo) - parseInt(b.codigo));
              const ref = doc(db, "informacion", "parametros");
              await updateDoc(ref, {
                pcalibracion: temp
              });
              limpiarDatos();
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
      setDeshabilitar(false);

  }
  useEffect(() => {
      getData();

  }, [])

    return(
      <>
      <Container>

          <Grid container spacing={{ xs: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid item xs={12} md={12}>
          <Typography component="div" variant="h4" className="princicrear" >
        CREAR PARÁMETROS DE CALIBRACIÓN
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
          
              
              <Grid item xs={12} md={8}>
                  <TextField id="outlined-basic" inputProps={{ style: { textTransform: "uppercase" } }} value={nombre} error={false} fullWidth label="Nombre" variant="outlined" onChange={(event) => { setNombre(event.target.value) }} />
              </Grid>
          
              <Grid item xs={12} md={2}>
                  <Button variant="contained" sx={{ height: "100%", width: "100%" }} onClick={agregarItem}>Agregar Accesorio</Button>
              </Grid>
              <Grid item xs={12} md={12}>
                <div style={{height:500,overflow:"scroll"}}>
                  <Table className='table table-ligh table-hover'>
                      <Thead>
                          <Tr>
                              <Th>Nombre</Th>
                              <Th>Código</Th>
                              <Th>Acciones</Th>
                          </Tr>
                      </Thead>

                      <Tbody>
                          {accesorios.map((dato, index) => (
                              <Tr key={index}>
                                  <Td>{dato.nombre}</Td>
                                  <Td>{dato.codigo}</Td>
                                  <Td>
                                    <Button onClick={()=>{eliminarItem(dato)}} >Eliminar</Button>
                                 {/* <Button onClick={()=>{abrirModalEditar(dato)}} >Editar</Button>  */}
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
    <div><h3>Editar Accesorio</h3></div>
  </ModalHeader>
  <ModalBody>
    <FormGroup>
      <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
                  <TextField id="outlined-basic" value={nombre} inputProps={{ style: { textTransform: "uppercase" } }} error={false} fullWidth label="Nombre del Equipo" variant="outlined" onChange={(event) => { setNombre(event.target.value) }} />
              </Grid>
              {/* <Grid item xs={12} md={12}>
                  <TextField id="outlined-basic" value={codigo} fullWidth label="Codigo" type="number" variant="outlined" onChange={(event) => { setCodigo(event.target.value) }} />
              </Grid> */}
      </Grid>
    </FormGroup>
  </ModalBody>

  <ModalFooter>
    {/* <Button
      variant="outlined"
      className="boton-modal2"
      onClick={()=>{actualizarEquipo()}}
    >
      Aceptar
    </Button> */}

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