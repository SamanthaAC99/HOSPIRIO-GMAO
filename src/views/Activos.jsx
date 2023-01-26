import React, { useEffect, useState } from "react";
import { query, collection, getDocs,onSnapshot,doc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Grid from "@mui/material/Grid";
import { storage } from "../firebase/firebase-config";
import { ref, getDownloadURL } from "firebase/storage";
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import {Container, Modal, ModalHeader, ModalBody, FormGroup, ModalFooter } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import '../css/Tabla.css'
import '../css/Ordentrabajo.css';
import '../css/Presentacion.css';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function Activosview() {
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const [elementosin, setElementosin] = useState([{propietario:{nombre:""}}]);
  const [currentform, setCurrenform] = useState({});
  const [url, setUrl] = useState("");
  const [accesorios, setAccesorios] = useState([]);
  const [accesoriosEquipo, setAccesoriosEquipo] = useState([]);
  const [modalInformacion1, setModalinformacion1] = useState(false);
  const getData7 = async () => {
    const reference = query(collection(db, "ingreso"));
    const data = await getDocs(reference);
    setElementosin(
      data.docs.map((doc) => ({ ...doc.data() }))
    );
    onSnapshot(doc(db, "informacion", "parametros"), (doc) => {
      setAccesorios(doc.data().accesorios)
    });
  }


  const vistainformacion1 = (data) => {
    setCurrenform(data);
    console.log(currentform);
    descargararchivo(data.nameImg);
    setAccesoriosEquipo(data.accesorios)
    setModalinformacion1(true);
  }

  const descargararchivo = (nombre) => {
    getDownloadURL(ref(storage, `inventario/${nombre}`)).then((url) => {
        console.log(url);
        setUrl(url);
    })
};

  const cerrarmodalinf = () => {
    setModalinformacion1(false);
  }
  useEffect(() => {
    getData7();
  }, [])
  return (
    <>

      <Container>
        <Typography component="div" variant="h4" className="princi3" >
          INVENTARIO EQUIPOS
        </Typography>
        <Typography component="div" variant="h5" className="princi9" >
          Médicos - Industriales
        </Typography>
        <Table className='table table-ligh table-hover'>
          <Thead>
            <Tr>
              <Th>Código</Th>
              <Th>Equipo</Th>
              <Th>Departamento</Th>
              <Th>Propietario</Th>
              <Th>Seguro</Th>
              <Th>Información</Th>
            </Tr>
          </Thead>

          <Tbody>
            {elementosin.sort((a, b) => (a.indice - b.indice)).map((ingresos, index) => (
              <Tr key={index} >
                 <Td>{ingresos.codigo}</Td>
                <Td>{ingresos.equipo}</Td>
                <Td>{ingresos.departamento}</Td>
                <Td>{ingresos.propietario.nombre}</Td>
                <Checkbox
                {...label}
                icon={<CheckBoxOutlinedIcon />}
                checked={ingresos.seguro}
                                                      /> 
                {/* <Td>{ingresos.seguro}</Td> */}
                <Td>
                  <IconButton aria-label="delete" onClick={() => { vistainformacion1(ingresos) }} color="gris"><InfoIcon /></IconButton>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Container>

      <Modal className="{width:0px}" isOpen={modalInformacion1}>
        <ModalHeader>
          <div><h3>Información Solicitud</h3></div>
        </ModalHeader>
        <ModalBody>

        <FormGroup>
            <Grid container spacing={1}>
            <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Código:</strong><p style={{ margin:0 }}>{currentform.codigo}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Ubicación:</strong><p style={{ margin:0 }}>{currentform.ubicacion}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Equipo:</strong><p style={{ margin:0 }}>{currentform.equipo}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Departamento:</strong><p style={{ margin:0 }}>{currentform.departamento}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Tipo de Equipo:</strong><p style={{ margin:0 }}>{currentform.tipo_equipo}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Responsable:</strong><p style={{ margin:0 }}>{currentform.responsable}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Marca:</strong><p style={{ margin:0 }}>{currentform.marca}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Modelo:</strong><p style={{ margin:0 }}>{currentform.modelo}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Serie:</strong><p style={{ margin:0 }}>{currentform.serie}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Importancia:</strong><p style={{ margin:0 }}>{currentform.importancia}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Seguro:</strong><p >{currentform.seguro ? "Asegurado" : "Sin seguro"}</p>
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
                      <Td>{}</Td>
                      <Td>{dato.nombre}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              </div>
                </Grid>
                <Grid className="fila" item xs={12}>
                                {/* <label className="archivo">
                                    Archivo:
                                </label> */}
                                <a
                                    component="button"
                                    variant="body2"
                                    href={currentform.img}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Visualizar Fotografía
                                </a>
                            </Grid >
            </Grid>
          </FormGroup>

        </ModalBody>
        <ModalFooter className="modal-footer">
          <Button
          variant="contained"
          className="boton-modal-d"
            onClick={() => cerrarmodalinf()}
          >
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>

    </>
  );
}





