import React, { useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import { setDoc, doc } from "firebase/firestore";
import { db, storage } from "../firebase/firebase-config";
import { v4 as uuidv4 } from 'uuid';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { uploadBytes, ref } from "firebase/storage";
import Grid from "@mui/material/Grid";
import Modal from '@mui/material/Modal';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import '../css/Compras.css';
import '../css/Presentacion.css';
import Typography from '@mui/material/Typography';
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';

export default function TercerizacionView() {
  const navigate = useNavigate();
  let params = useParams();
  const [value6, setValue6] = React.useState(new Date('2022-08-01T21:09:09'));
  const [value7, setValue7] = React.useState(new Date('2022-08-02T21:09:09'));
  const [empresaext, setEmpresaext] = useState('');
  const [numeroreportefisico, setNumeroreportefisico] = useState('');
  const [equipoter, setEquipoter] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nivelalerta, setNivelalerta] = useState('');
  const [file, setFile] = useState(null);
  const [modal1, setModal1] = useState(false);
  const [modal2, setModal2] = useState(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    borderRadius: 3,
  };

  const handleOpen = () => {
    setModal1(true);
  };
  const handleClose = () => {
    setModal1(false);
  };
  const handleOpen2 = () => {
    setModal2(true);
  };
  const handleClose2 = () => {
    setModal2(false);
    setModal1(false);
    navegarView('home');
  };
  const handleClose3 = () => {
    setModal2(false);
  };


  const navegarView = (ruta) => {
    navigate(`/${params.uid}/${ruta}`);
  }

  const regresar = () => {
    navegarView('home');
  };

  const buscarImagen = (e) => {
    if (e.target.files[0] !== undefined) {
      setFile(e.target.files[0]);
      console.log(e.target.files[0]);
    } else {
      console.log('no hay archivo');
    }
  };

  const enviardatoster = () => {
    Swal.fire({
      icon: 'success',
      title: '¡Reporte enviado con éxito!',
      showConfirmButton: false,
      timer: 1500
    })
    var externos = {};
    var val = Date.now();
    var val1 = value6.toLocaleString('en-US');
    var val2 = value7.toLocaleString('en-US');
    var newId = uuidv4();
    if (numeroreportefisico !== '' && equipoter !== '' && nivelalerta !== '' && codigo !== '' && empresaext !== '') {
      if (file === null) {
        externos = {
          indice: val,
          feinicio: val1,
          fetermino: val2,
          empresaext: empresaext,
          numeroreportefisico: numeroreportefisico,
          equipoter: equipoter,
          codigo: codigo,
          nivelalerta: nivelalerta,
          estadoext: "Pendiente",
          nameImg: 'SP.PNG',
          id: newId,
        };
        sendFirestore(externos);
        // handleOpen();
        setNumeroreportefisico("");
        setCodigo("");
      } else {
        externos = {
          indice: val,
          feinicio: val1,
          fetermino: val2,
          empresaext: empresaext,
          numeroreportefisico: numeroreportefisico,
          equipoter: equipoter,
          codigo: codigo,
          nivelalerta: nivelalerta,
          estadoext: "Pendiente",
          nameImg: newId,
          id: newId,
        };
        sendFirestore(externos);
        sendStorage(externos.id);
        // handleOpen();
        setNumeroreportefisico("");
        setCodigo("");
      }
    } else {
      console.log('faltan campos');
    };
    setFile(null);

  };
  const sendFirestore = (externos) => {
    try {
      setDoc(doc(db, "reportes externos", `${externos.id}`), externos);
      console.log("Reporte agregado")
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const sendStorage = (id) => {
    //pasar parametros variables
    const storageRef = ref(storage, `externos/${id}`);
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });
  };

  const handleChange6 = (newValue) => {
    setValue6(newValue);
  };
  const handleChange7 = (newValue) => {
    setValue7(newValue);
  };


  return (
    <>

      {/* NOMBRE VISTA */}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography component="div" variant="h4" className="princi3" >
            REPORTE MANTENIMIENTO
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
                  <b> EMPRESA EXTERNA </b>

                </label>
              </div>
            </div>
            <div className="panel">
              <div className="row">
                <div className="col-md-4">
                  <div className="panelt">
                    <Typography component="div" variant="h5" className="princi" >
                      !ESTIMADO TÉCNICO!
                    </Typography>
                      <br />
                      El formulario consta de 8 preguntas que nos permitirán llevar un registro de las actividades realizadas.
                      <br />
                      <br />
                      Por favor, responda todos los campos de manera específica.
                      <br />
                      <br />
                    <a
                      component="button"
                      className="link"
                      variant="body2"
                      href="https://drive.google.com/file/d/1wKh57MRPqArf2C7EQ30fN5PUld78WAcF/view?usp=sharing"
                      target="_blank"
                      rel="noreferrer"

                    >
                      Link de descarga manual de instrucciones
                    </a>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="panelt2">
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                      <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Stack spacing={4}>
                            <DateTimePicker
                              fullWidth
                              label="FECHA INICIO MANTENIMIENTO"
                              color="gris"
                              value={value6}
                              onChange={handleChange6}
                              renderInput={(params) => <TextField {...params} />}
                            />
                          </Stack>
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Stack spacing={4}>
                            <DateTimePicker
                              fullWidth label="FECHA FINAL MANTENIMIENTO"
                              value={value7}
                              onChange={handleChange7}
                              renderInput={(params) => <TextField {...params} />}
                            />
                          </Stack>
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12}>
                        <Autocomplete
                          disableClearable
                          id="combo-box-demo"
                          options={empresas}
                          onChange={(event, newvalue) => setEmpresaext(newvalue.label)}
                          renderInput={(params) => <TextField {...params} fullWidth label="EMPRESA" color={empresaext !== '' ? "gris" : "oficial"} type="text" />}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField value={numeroreportefisico} color={numeroreportefisico !== '' ? "gris" : "oficial"} fullWidth label="NÚMERO DE IDENTIFICACIÓN REPORTE" type="int" onChange={(e) => setNumeroreportefisico(e.target.value)} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField value={codigo} color={codigo !== '' ? "gris" : "oficial"} fullWidth label="CÓDIGO EQUIPO" type="int" onChange={(e) => setCodigo(e.target.value)} />
                      </Grid>
                      <Grid item xs={12}>
                        <Autocomplete
                          disableClearable
                          id="combo-box-demo"
                          options={equipo}
                          onChange={(event, newvalue) => setEquipoter(newvalue.label)}
                          renderInput={(params) => <TextField {...params} fullWidth label="EQUIPO" color={equipoter !== '' ? "gris" : "oficial"} type="text" />}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Autocomplete
                          disableClearable
                          id="combo-box-demo"
                          options={nivel}
                          onChange={(event, newvalue) => setNivelalerta(newvalue.label)}
                          renderInput={(params) => <TextField {...params} fullWidth label="NIVEL ALERTA" color={nivelalerta !== '' ? "gris" : "oficial"} type="text" />}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <div className="mb-3">
                          <Typography component="div" variant="h7" className="cargar" >
                            CARGAR REPORTE FÍSICO
                          </Typography>
                          <input className="form-control " onChange={buscarImagen} type="file" id="formFile" />
                        </div>
                        <Stack direction="row" spacing={2} alignitems="center" justifyContent="center" >
                          <Button variant="outlined" color="cancelarcp" startIcon={<DeleteIcon />} className="boton" onClick={regresar}>
                            Cancelar
                          </Button>
                          <Button variant="contained" color="enviarcp" className="botone" endIcon={<SendIcon />} onClick={enviardatoster}>
                            Enviar
                          </Button>
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

      <Modal
        open={modal1}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h2 id="parent-modal-title">Su solicitud fue enviada</h2>
          <Button onClick={handleOpen2}>Salir</Button>
          <Button onClick={handleClose}>Nueva Orden</Button>
          <Modal
            hideBackdrop
            open={modal2}
            onClose={handleClose}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
          >
            <Box sx={{ ...style, width: 200 }}>
              {/* <h2 id="child-modal-title">Text in a child modal</h2> */}
              <p id="child-modal-description">
              ¿Esta seguro que desea salir?
              </p>
              <Button onClick={handleClose2}>Si</Button>
              <Button onClick={handleClose3}>No</Button>
            </Box>
          </Modal>
        </Box>
      </Modal>
    </>
  );
}

const empresas = [
  { label: 'Softcase' },
  { label: 'Ing. Color' },
  { label: 'Indura' },
  { label: 'Viat' },
  { label: 'Conter' },
  { label: 'Corpoimpex' },
]

const nivel = [
  { label: 'Funcional' },
  { label: 'No Funcional' },
]

const equipo = [
  { label: "Angiógrafo" },
  { label: "Arco en C" },
  { label: "Autoclave" },
  { label: "Balanza" },
  { label: "Bomba de Infusión" },
  { label: "Broncoscopio" },
  { label: "Cabina de Flujo Laminar" },
  { label: "Central de Monitoreo" },
  { label: "Cuna de calor radiante" },
  { label: "Densitómetro" },
  { label: "Desfibrilador" },
  { label: "Digitalizador AGFA" },
  { label: "Doppler Fetal" },
  { label: "Electrobisturí" },
  { label: "Electrocardiógrafo" },
  { label: "Electrocauterio" },
  { label: "Electromiógrafo" },
  { label: "Equipo de Artroscopia" },
  { label: "Ecógrafo" },
  { label: "Electroencefalógrafo" },
  { label: "Equipo de Rayos X" },
  { label: "Equipo Ultrasonido" },
  { label: "Esterilizador de Peróxido" },
  { label: "Esterilizador 3M" },
  { label: "Impresora Drystar" },
  { label: "Incubadora Neonatal" },
  { label: "Inyector" },
  { label: "Lámpara Cialíticas" },
  { label: "Lavadora Desinfectadora" },
  { label: "Mamógrafo" },
  { label: "Máquina de Anestesia" },
  { label: "Mesa Quirúrgica" },
  { label: "Microscopio Oftalmológico" },
  { label: "Monitor de Radiación" },
  { label: "Monitor Fetal" },
  { label: "Monitor Multiparámetros" },
  { label: "Oftalmoscopio" },
  { label: "Portatil Rayos X" },
  { label: "Refrigeradora" },
  { label: "Resonancia Magnética" },
  { label: "Tomógrafo" },
  { label: "Torre de Endoscopía" },
  { label: "Torre de Laparoscopia" },
  { label: "Ventilador" },
]