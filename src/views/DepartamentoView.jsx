import React, { useState, useEffect } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { db } from "../firebase/firebase-config";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import Typography from '@mui/material/Typography';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import { doc, onSnapshot, updateDoc, query, collection, getDocs } from "firebase/firestore";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
} from "reactstrap";
export default function DepartamentoView() {
  const [departamentos, setDepartamentos] = useState([])
  const navigate = useNavigate();
  let params = useParams();
  const [nombre, setNombre] = useState("")
  const [responsable, setResponsable] = useState("")
  const [correo, setCorreo] = useState("")
  const [deshabilitar, setDeshabilitar] = useState(false);
  const [codigo, setCodigo] = useState("")
  const [modalEditar, setModalEditar] = useState(false);
  const [currentEquipo, setCurrentEquipo] = useState({})
  const [modalAgregar, setModalAgregar] = useState(false);
  const getData = () => {
    onSnapshot(doc(db, "informacion", "parametros"), (doc) => {
      setDepartamentos(doc.data().departamentos)
    });
  }
  const eliminarItem = async (_data) => {
    Swal.fire({
      title: 'Quieres Eliminar este Responsable?',
      showCancelButton: true,
      confirmButtonText: 'Si',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let aux = departamentos
        let items_filtrados = aux.filter(item => item.nombre !== _data.nombre)
        updateData(items_filtrados)
        Swal.fire('Equipo Eliminado!', '', 'success')
      }
    })

  }
  const updateData = async (_data) => {
    const ref = doc(db, "informacion", "parametros");
    await updateDoc(ref, {
      departamentos: _data
    });
  }
  const abrirModalEditar = (_data) => {
    setNombre(_data.nombre)
    setCodigo(_data.codigo)
    setResponsable(_data.responsable)
    setCorreo(_data.correo)
    setCurrentEquipo(_data)
    setModalEditar(true)
  }
  const navegarView = (ruta) => {
    navigate(`/${params.uid}/${ruta}`);
  }
  const salir = () => {
    navegarView('inventario/equipos_activos');
  };
  const limpiarDatos = () => {
    setNombre("");
    setCodigo("");
    setResponsable("");
    setCorreo("");
  }
  const actualizarEquipo = async () => {
    setDeshabilitar(true)
    let aux = departamentos
    let temp = aux.map(item => {
      if (item.nombre === currentEquipo.nombre) {
        item.nombre = nombre.toUpperCase()
        item.responsable = responsable.toUpperCase()
        item.correo = correo
        item.codigo = codigo
      }
      return item
    })
    let aux_equipos = []
    const reference = query(collection(db, "ingreso"));
    const querySnapshot = await getDocs(reference);
    querySnapshot.forEach((doc) => {
      aux_equipos.push(doc.data())
    });
    aux_equipos.forEach(async(item)=> {
      if(item.departamento.codigo === currentEquipo.codigo){
        const ref_equipo = doc(db, "ingreso", item.id);
        await updateDoc(ref_equipo, {
          departamento: currentEquipo
        });
        console.log(item)
      }
      return item
    })
    updateData(temp);
    limpiarDatos();
    setDeshabilitar(false)
    setModalEditar(false)

  }
  const agregarItem = async () => {
    setDeshabilitar(true)
    let aux = JSON.parse(JSON.stringify(departamentos))
    let temp = JSON.parse(JSON.stringify(departamentos))
    let numCode
    if (nombre !== "") {
      let check1 = aux.find(item => item.codigo === codigo)
      let check2 = aux.find(item => item.nombre === nombre)
      if (check1 === undefined && check2 === undefined) {

        let ordenados = aux.sort((a, b) => parseInt(b.codigo) - parseInt(a.codigo));
        if (ordenados.length === 0) {
          numCode = 1
        } else {
          numCode = parseInt(ordenados[0].codigo) + 1
        }
        let newItem = {
          nombre: nombre.trim().toUpperCase(),
          responsable: responsable.trim().toUpperCase(),
          correo: correo,
          codigo: numCode
        }
        temp.push(newItem)
        temp.sort((a, b) => parseInt(a.codigo) - parseInt(b.codigo));
        const ref = doc(db, "informacion", "parametros");
        await updateDoc(ref, {
          departamentos: temp
        });
        limpiarDatos();
        Swal.fire({
          icon: 'success',
          title: '¡Departamento Agregado!',
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
  useEffect(() => {
    getData();

  }, [])

  return (
    <>
      <Container>

        <Grid container spacing={{ xs: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid item xs={12} md={1.5}>
            <Button variant="outlined"
              sx={{ height: "70%" }}
              className="boton-salir2"
              fullWidth
              endIcon={<ReplyAllIcon sx={{ fontSize: 90 }} />}
              onClick={() => { salir() }}
            >Regresar</Button>
          </Grid>
          <Grid item xs={12} md={12}>
            <Typography component="div" variant="h4" className="princicrear2" >
              CREAR DEPARTAMENTO
            </Typography>
          </Grid>
          <Grid item xs={12} md={12}>

            <Button variant="contained"
              sx={{ height: "100%" }}
              color='azul1'
              onClick={() => { setModalAgregar(true) }}
            >AGREGAR DEPARTAMENTO</Button>

          </Grid>
          <Grid item xs={12} md={12}>
            <div style={{ height: 500, overflow: "scroll" }}>
              <Table className='table table-ligh table-hover'>
                <Thead>
                  <Tr>
                    <Th>Código</Th>
                    <Th>Departamento</Th>
                    <Th>Responsable</Th>
                    <Th>Correo</Th>
                    <Th>Acciones</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {departamentos.map((dato, index) => (
                    <Tr key={index}>
                      <Td>{dato.codigo}</Td>
                      <Td>{dato.nombre}</Td>
                      <Td>{dato.responsable} </Td>
                      <Td>{dato.correo}</Td>
                      <Td>
                        <Button onClick={() => { eliminarItem(dato) }} >Eliminar</Button>
                        <Button onClick={() => { abrirModalEditar(dato) }} >Editar</Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          </Grid>
        </Grid>
      </Container>

      <Modal isOpen={modalAgregar}>
        <ModalHeader>
          <div><h3>CREAR UN DEPARTAMENTO</h3></div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <TextField id="nombre" inputProps={{ style: { textTransform: "uppercase" } }} value={nombre} error={false} fullWidth label="NOMBRE DEPARTAMENTO" variant="outlined" onChange={(event) => { setNombre(event.target.value) }} />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField id="responsable" inputProps={{ style: { textTransform: "uppercase" } }} value={responsable} error={false} fullWidth label="RESPONSABLE" variant="outlined" onChange={(event) => { setResponsable(event.target.value) }} />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField id="correo" inputProps={{ style: { textTransform: "uppercase" } }} value={correo} error={false} fullWidth label="CORREO" variant="outlined" onChange={(event) => { setCorreo(event.target.value) }} />
              </Grid>
            </Grid>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outlined"
            className="boton-modal2"
            onClick={agregarItem}
          >
            Agregar
          </Button>

          <Button
            variant="contained"
            className="boton-modal"
            onClick={() => {
              setModalAgregar(false)
              limpiarDatos()
            }}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>


      <Modal isOpen={modalEditar}>
        <ModalHeader>
          <div><h3>Accesorios del Equipo</h3></div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <TextField id="nombre" name="nombre" value={nombre} error={false} fullWidth label="Nombre Departamento" variant="outlined" onChange={(event) => { setNombre(event.target.value) }} />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField id="responsable" name="responsable" value={responsable} error={false} fullWidth label="Responsable" variant="outlined" onChange={(event) => { setResponsable(event.target.value) }} />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField id="outlined-basic" name="correo" value={correo} error={false} fullWidth label="Correo" variant="outlined" onChange={(event) => { setCorreo(event.target.value) }} />
              </Grid>
            </Grid>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outlined"
            className="boton-modal2"
            onClick={() => { actualizarEquipo() }}
          >
            Aceptar
          </Button>

          <Button
            variant="contained"
            className="boton-modal"
            onClick={() => {
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