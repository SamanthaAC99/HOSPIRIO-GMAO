import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { collection, setDoc, query, doc, onSnapshot } from "firebase/firestore";
import { uploadBytes, ref } from "firebase/storage";
import { db, storage } from "../firebase/firebase-config";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import { v4 as uuidv4 } from 'uuid';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from "@mui/material/Grid"
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useParams } from "react-router-dom";
import '../css/Ordentrabajo.css';
import '../css/Presentacion.css';
import Swal from 'sweetalert2';

export default function Formularioscompras() {
  const navigate = useNavigate();
  let params = useParams();
  const [cedulacom, setCedulacom] = useState('');
  const [codigoeqcom, setCodigoeqcom] = useState('');
  const [equipocom, setEquipocom] = useState('');
  const [articulocom, setArticulocom] = useState('');
  const [cantidadcom, setCantidadcom] = useState('');
  const [preciocom, setPreciocom] = useState('');
  const [proveedorcom, setProveedorcom] = useState('');
  const [file, setFile] = useState(null);
  const [modal1, setModal1] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [scompras, setScompras] = useState(0);
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
  const handleClose = (e) => {
    setModal1(false);
  };
  const handleOpen2 = () => {
    setModal2(true);
  };
  const handleClose2 = () => {
    setModal2(false);
    setModal1(false);
    navegarView('home')

  };
  const handleClose3 = () => {
    setModal2(false);
  };
  const getData = () => {
    const reference = query(collection(db, "compras"));
    onSnapshot(reference, (querySnapshot) => {
      const cantidad = [];
      querySnapshot.forEach((doc) => {
        cantidad.push(doc.data());
      });
      setScompras(cantidad.length);

    });
  };
  const navegarView = (ruta) => {
    navigate(`/${params.uid}/${ruta}`);
  }
  const cancelar = () => {
    navegarView('home')
  };
  const buscarImagen = (e) => {
    if (e.target.files[0] !== undefined) {
      setFile(e.target.files[0]);
      console.log(e.target.files[0]);
    } else {
      console.log('no hay archivo');
    }
  };

  const sendData = () => {
    Swal.fire({
      icon: 'success',
      title: '¡Solicitud envida con éxito!',
      showConfirmButton: false,
      timer: 1500
    })
    var compra = {};
    var val = Date.now();
    var val2 = new Date(val);
    var val3 = val2.toLocaleDateString("en-US");
    var newId = uuidv4();
    console.log(val);
    console.log(val3);
    if (cedulacom !== '' && codigoeqcom !== '' && equipocom !== '' && articulocom !== '' && cantidadcom !== '') {
      if (file === null) {
        compra = {
          fechacom: val3,
          indice: val,
          cedulacom: cedulacom,
          codigoeqcom: codigoeqcom,
          equipocom: equipocom,
          articulocom: articulocom,
          cantidadcom: cantidadcom,
          preciocom: preciocom,
          proveedorcom: proveedorcom,
          comentariocom: "",
          estadocom: "En Proceso",
          nameImg: 'SP.PNG',
          id: newId,
        };
        sendFirestore(compra);
        // handleOpen();
        setCedulacom("");
        setCodigoeqcom("");
        setEquipocom("");
        setArticulocom("");
        setCantidadcom("");
        setPreciocom("");
        setProveedorcom("");
      } else {
        compra = {
          fechacom: val3,
          indice: val,
          cedulacom: cedulacom,
          codigoeqcom: codigoeqcom,
          equipocom: equipocom,
          articulocom: articulocom,
          cantidadcom: cantidadcom,
          preciocom: preciocom,
          proveedorcom: proveedorcom,
          comentariocom: "",
          estadocom: "En Proceso",
          nameImg: newId,
          id: newId,
        };
        sendFirestore(compra);
        sendStorage(compra.id);
        // handleOpen();
        setCedulacom("");
        setCodigoeqcom("");
        setEquipocom("");
        setArticulocom("");
        setCantidadcom("");
        setPreciocom("");
        setProveedorcom("");
      }
    } else {
      console.log('faltan campos');
      window.confirm("Faltan Campos. Por favor complete toda la informacion de las casillas en rojo ");

    };
    setFile(null);



  };
  const sendFirestore = (compra) => {
    try {
      setDoc(doc(db, "compras", `${compra.id}`), compra);
      console.log("Solicitud agregada")
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const sendStorage = (id) => {
    //pasar parametros variables
    const storageRef = ref(storage, `proformas/${id}`);
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });
  };

  useEffect(() => {
    getData();
  }, [])
  return (
    <>
      {/* NOMBRE VISTA */}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography component="div" variant="h4" className="princi3" >
            SOLICITUD DE COMPRA
          </Typography>
        </Grid>
      </Grid>

      {/* INICIO CONTENEDOR */}

      <div className="container">
        <div className="column">
          <div className="col-sm-12">
            <div class="col-lg-12">
              <div className="panels">
                <label className="d-flex p-2">
                  <b>N° Solicitud: {scompras} </b>

                </label>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="panelt3">
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  <Grid item xs={6}>
                    <TextField value={cedulacom} color={cedulacom !== '' ? "gris" : "oficial"} fullWidth label="NÚMERO DE CÉDULA TÉCNICO" type="int" onChange={(e) => setCedulacom(e.target.value)} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField value={codigoeqcom} color={codigoeqcom !== '' ? "gris" : "oficial"} fullWidth label="CÓDIGO EQUIPO" type="int" onChange={(e) => setCodigoeqcom(e.target.value)} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField value={equipocom} color={equipocom !== '' ? "gris" : "oficial"} fullWidth label="EQUIPO" type="int" onChange={(e) => setEquipocom(e.target.value)} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField value={articulocom} color={articulocom !== '' ? "gris" : "oficial"} fullWidth label="ARTÍCULO" type="int" onChange={(e) => setArticulocom(e.target.value)} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField value={cantidadcom} color={cantidadcom !== '' ? "gris" : "oficial"} fullWidth label="CANTIDAD" type="int" onChange={(e) => setCantidadcom(e.target.value)} />
                  </Grid>
                  <Grid item xs={6}>

                    <TextField value={preciocom} color="oficial" fullWidth label="PRECIO" type="int" onChange={(e) => setPreciocom(e.target.value)} />
                  </Grid>
                  <Grid item xs={6}>

                    <TextField value={proveedorcom} color="oficial" fullWidth label="PROVEEDOR" type="int" onChange={(e) => setProveedorcom(e.target.value)} />

                  </Grid>
                  <Grid item xs={12}>
                    <div className="mb-3">
                      <Typography component="div" variant="h7" className="cargar" >
                        CARGAR PROFORMA
                      </Typography>
                      <input className="form-control" onChange={buscarImagen} type="file" id="formFile" />
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={2} alignitems="center" justifyContent="center" >
                      <Button variant="outlined" color="cancelarcp" startIcon={<DeleteIcon />} className="boton" onClick={cancelar}>
                        Cancelar</Button>
                      <Button variant="contained" color="enviarcp" endIcon={<SendIcon />} onClick={sendData}>
                        Enviar</Button>
                    </Stack>
                  </Grid>
                </Grid>
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
                ¿Seguro que desea salir?
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



