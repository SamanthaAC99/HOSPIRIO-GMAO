import React, { useEffect, useState } from "react";
import { query, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Grid from "@mui/material/Grid";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { storage } from "../firebase/firebase-config";
import { ref, getDownloadURL } from "firebase/storage";
import { Button, Container, Modal, ModalHeader, ModalBody, FormGroup, ModalFooter } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import '../css/Tabla.css'
import '../css/Ordentrabajo.css';
import '../css/Presentacion.css';
import Typography from '@mui/material/Typography';

export default function Vistacontratos() {
const [elementoscon, setElementoscon] = useState([]);
  const [currentform,setCurrenform]= useState({});
  const [modalInfor, setModalinfor] = useState(false);
  const [url, setUrl] = useState("");

  const getData = async () => {
    const reference = query(collection(db, "contratos"));
    const data = await getDocs(reference);
    setElementoscon(
      data.docs.map((doc) => ({ ...doc.data() }))
    );
  }


  const vistainfor = (data) => {
    setCurrenform(data);
    console.log(data);
    descargararchivo(data.nameImg);
    setModalinfor(true);
  };

  const cerrarmodalinfor =()=>{
    setModalinfor(false);
  };

  const descargararchivo = (nombre) => {
    getDownloadURL(ref(storage, `contratos/${nombre}`)).then((url) => {
        setUrl(url);
        console.log(url);
    })

};

  useEffect(() => {
    getData();
  }, [])

    return (
        <>
        <Container>
                <Typography component="div" variant="h4" className="princi3" >
                    CONTRATOS MANTENIMIENTO
                </Typography>
        <Table className='table table-ligh table-hover'>
                <Thead>
                <Tr>
                <Th>#</Th>
                <Th>N. Contrato</Th>
                <Th>Empresa</Th>
                <Th>Fecha Final</Th>
                <Th>Información</Th>
                </Tr>
                        </Thead>
                        <Tbody>
                  {elementoscon.sort((a, b) => (a.indice - b.indice)).map((contratos, index) => (
                    <Tr key={contratos.indice} >
                    <Td>{index + 1}</Td>
                    <Td>{contratos.ncontrato}</Td>
                    <Td>{contratos.empresa}</Td>
                    <Td>{contratos.ffinal}</Td>
                    <Td>
                        <IconButton aria-label="informacion" onClick={() => { vistainfor(contratos) }} color="gris"><InfoIcon /></IconButton>
                        </Td>
                                </Tr>
                        ))}
                 </Tbody>
                </Table>
            </Container>

      <Modal isOpen={modalInfor}>
        <Container>
          <ModalHeader>
            <div><h1>Información Contrato</h1></div>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Grid container spacing={2}>
              <Grid item xs={12}>
                                <label>
                                    Inicio Contrato:
                                </label>
                                <TextareaAutosize
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="Inicio Contrato"
                                                                className="text-area-encargado"
                                                                name="finicio"
                                                                readOnly
                                                                value={currentform.finicio}
                                />
                            </Grid>
                <Grid item xs={12}>
                                <label>
                                    Equipos:
                                </label>
                                <TextareaAutosize
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="Equipos"
                                                                className="text-area-encargado"
                                                                name="equipos"
                                                                readOnly
                                                                value={currentform.equipos}
                                />
                            </Grid>
                <Grid item xs={12}>
                                <label>
                                    Descripción:
                                </label>
                                <TextareaAutosize
                                                                aria-label="minimum height"
                                                                minRows={1}
                                                                placeholder="Descripción"
                                                                className="text-area-encargado"
                                                                name="descripcion"
                                                                readOnly
                                                                value={currentform.descripcion}
                                />
                            </Grid>

                <Grid className="fila" item xs={12}>
                                    <label className="archivo">
                                        Archivo:
                                    </label>
                                    <a
                                        component="button"
                                        variant="body2" 
                                        href={url}
                                        target="_blank" 
                                        rel="noreferrer"
                                    >
                                        Visualizar Contrato
                                    </a>
                                </Grid >
               
              </Grid>
            </FormGroup>
          </ModalBody>
          <ModalFooter className="modal-footer">
          <Button
                        className="editar"
                        onClick={() => cerrarmodalinfor()}
                    >
                        Cerrar
                    </Button>
          </ModalFooter>

        </Container>
      </Modal>
        </>
    );
}