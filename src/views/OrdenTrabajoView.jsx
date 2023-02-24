import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import { db } from "../firebase/firebase-config";
import { v4 as uuidv4 } from 'uuid';
import Grid from "@mui/material/Grid";
import Autocomplete from '@mui/material/Autocomplete';
import { onSnapshot, collection, query, setDoc,doc } from "firebase/firestore";
import '../css/Ordentrabajo.css';
import '../css/Presentacion.css';
import Typography from '@mui/material/Typography';
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import { useSelector } from "react-redux";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


export default function OrdenTrabajoView() {
  const navigate = useNavigate();
  let params = useParams();
  const [asunto,setAsunto] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [descripcion,setDescripcion] = useState('');
  const [problematica, setProblematica] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [deshabilitar,setDeshabilitar] = useState(false);
  const [cantidad, setCantidad] = useState(0);
  const [reloadAuto,setReloadAuto] = useState(false);
  const currentUser = useSelector(state => state.auths);

  const getData =  () => {
    const q = query(collection(db, "ordenes"));
     onSnapshot(q, (querySnapshot) => {
      const ordenes = [];
      querySnapshot.forEach((doc) => {
        ordenes.push(doc.data());
      });
      setCantidad(ordenes.length)
    });
  }

  const navegarView = (ruta) => {
    navigate(`/${params.uid}/${ruta}`);
  }


  const regresar = () => {
    navegarView('home');
  };


  const enviardatos = () => {
    setDeshabilitar(true);
    let obserAux = "" 
    let fechaHoy = new Date().toLocaleString("en-US");
    let aux = uuidv4()
    let id_formateada = aux.slice(0,13)
    if (observaciones === ""){
        obserAux = "Ninguna"
    }else{
      obserAux = observaciones
    }
    if (departamento !== '' && descripcion !== '' && problematica !== '') {
    let orden = {
        fecha: fechaHoy,
        indice: Date.now(),
        cedula: currentUser.indentification,
        departamento: departamento,
        descripcion: descripcion.toUpperCase(),
        problematica: problematica.toUpperCase(),
        observaciones: obserAux.toUpperCase(),
        verificacion: false,
        asunto:asunto.toUpperCase(),
        estado: "Pendiente", // valores iniciados por defecto
        prioridad: "Pendiente", // valores iniciados por defecto
        tipotrabajo: "Pendiente", // valores iniciados por defecto
        tecnicos: [],  // valores iniciados por defecto
        encargado: {}, // valores iniciados por defecto
        play: false, // valores iniciados por defecto
        pause: true,// valores iniciados por defecto
        id: id_formateada,
        correo: currentUser.email,
        mparada: [],
        tiempos: [],
        reporte: false,
        reporteId: [],
        razonp: "",
        horat: "",
        tiempot: "",
        tipo: "",

      }

      sendFirestore(orden);
    } else {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Faltan Campos',
        text: "¡Por favor complete toda la información!",
        showConfirmButton: false,
        timer: 2000
      })
      setDeshabilitar(false);
    };
    
  };

  const sendFirestore = async (_orden) => {
    try {
      console.log(_orden)
      await setDoc(doc(db, "ordenes", _orden.id), _orden);
      setDeshabilitar(false);
      Swal.fire({
        icon: 'success',
        title: '¡Orden enviada con éxito!',
        showConfirmButton: false,
        timer: 1500
      })
      limpiarCampos();
   
    } catch (e) {
      setDeshabilitar(false);
      console.error("Error adding document: ", e);
      Swal.fire({
        icon: 'error',
        title: 'Orden No Generado',
        text: 'Error de conexion!',
        footer: '<a href="">Click Aqui Para Notificar tu Error?</a>'
      })
    }
  };

  const limpiarCampos = () =>{
    setReloadAuto(!reloadAuto);  
    setDescripcion("");
    setProblematica("");
    setObservaciones("");
    setAsunto("");
    setDepartamento("");
  }

  useEffect(() => {
    getData();
  }, [])



  return (
    <>


      {/* NOMBRE VISTA */}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography component="div" variant="h4" className="princi3" >
            SOLICITUD DE TRABAJO
          </Typography>
        </Grid>
      </Grid>

      {/* INICIO CONTENEDOR */}

      <div className="container">
        <div className="column">
          <div className="col-sm-12">
            <div className="col-sm-12">
              <div className="panels">
                <label className="d-flex p-2">
                  <b> N° Orden: {parseInt(cantidad) + 1}</b>

                </label>
              </div>
            </div>
            <div className="panel">
              <div className="row">
                <div className="col-md-4">
                  <div className="panelt">
                    <Typography component="div" variant="h5" className="princi" >
                      !ESTIMADO USUARIO!
                    </Typography>
                    <br />
                    El formulario consta de 6 preguntas que nos permitirán determinar los problemas y atender adecuadamente la solicitud.
                    <br />
                    <br />
                    Por favor, responda todos los campos de manera específica.
                    <br />
                    <br />
                    <a
                      component="button"
                      className="link"
                      variant="body2"
                      href="https://drive.google.com/file/d/19O-mC3F3OXb8RliOhCeJ_OeD_TtZtv_x/view?usp=sharing"
                      target="_blank"
                      rel="noreferrer"

                    >
                      Link de descarga manual de instrucciones
                    </a>
                  </div>

                </div>
                <div className="col-md-8">
                  <div className="panelt2">
                    <Grid container spacing={4}>
                      <Grid item xs={12}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={asunto} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="ASUNTO" type="text" onChange={(e) => setAsunto(e.target.value)} />
                      </Grid>
                      <Grid item xs={12}>
                        <Autocomplete
                          key={reloadAuto}
                          id="combo-box-demo"
                          options={currentUser.area}
                         
                          onChange={(event, newvalue) => setDepartamento(newvalue)}
                          renderInput={(params) => <TextField {...params} fullWidth label="DEPARTAMENTO SOLICITANTE" color={departamento !== '' ? "gris" : "oficial"} type="text" />}
                        />
                      </Grid>
            
                      <Grid item xs={12}>
                        <TextareaAutosize
                          style={{textTransform:"uppercase"}} 
                          aria-label="minimum height"
                          value={descripcion}
                          minRows={3}
                          color={descripcion !== '' ? "gris" : "oficial"}
                          placeholder="DESCRIPCIÓN DEL EQUIPO"
                          className="text-area-encargado"
                          onChange={(e) => setDescripcion(e.target.value)} />
                
                      </Grid>
                      <Grid item xs={12}>
                        <TextareaAutosize
                          style={{textTransform:"uppercase"}} 
                          aria-label="minimum height"
                          value={problematica}
                          minRows={3}
                          color={problematica !== '' ? "gris" : "oficial"}
                          placeholder="INCONVENIENTE O PROBLEMATICA"
                          className="text-area-encargado"
                          name="problematica"
                          onChange={(e) => setProblematica(e.target.value)} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextareaAutosize
                          style={{textTransform:"uppercase"}} 
                          aria-label="minimum height"
                          value={observaciones}
                          minRows={3}
                          color="gris"
                          placeholder="OBSERVACIONES"
                          className="text-area-encargado"
                          name="observaciones"
                          onChange={(e) => setObservaciones(e.target.value)} />      
                      </Grid>
                      <Grid item xs={12}>
                        <Stack direction="row" spacing={2} alignitems="center" justifyContent="center" >

                          <Button variant="outlined" color="cancelarcp" startIcon={<DeleteIcon />} onClick={regresar}>
                            Cancelar</Button>
                          <Button variant="contained" color="enviarcp"  endIcon={<SendIcon />} onClick={enviardatos}>
                            Enviar</Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deshabilitar}>
                <CircularProgress color="inherit" />
            </Backdrop>
    </>
  );
}

