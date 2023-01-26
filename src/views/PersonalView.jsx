import React, { useEffect, useState } from "react";
import { collection, query, doc, updateDoc, onSnapshot,deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config"
import Button from '@mui/material/Button';
import {Container, Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, } from "reactstrap";
import Stack from '@mui/material/Stack';
import Grid from "@mui/material/Grid";
import Avatar from '@mui/material/Avatar';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import PropTypes from 'prop-types';
import Switch from '@mui/material/Switch';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import '../css/Tabla.css'
import Tabs from '@mui/material/Tabs';
import { getAuth, updateProfile } from "firebase/auth";
import Swal from 'sweetalert2';
import Chip from '@mui/material/Chip';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import '../css/personalView.css'
import '../css/Ordentrabajo.css';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useRef } from "react";


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`action-tabpanel-${index}`}
            aria-labelledby={`action-tab-${index}`}
            {...other}

        >
            {value === index && <Box sx={{ p: 3, bgcolor: '#fff' }}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};


const pruebas4 = ["holi1", "holi2" , "holi3", "holi4", "holi5"]

function a11yProps(index) {
    return {
        id: `action-tab-${index}`,
        'aria-controls': `action-tabpanel-${index}`,
    };
}


export default function PersonalView() {
    const theme = useTheme();
    const [fnombre, setFnombre] = useState(false);
    const [fapellido, setFapellido] = useState(false);
    const [fcargos, setFcargos] = useState(false);
    const [reset,setReset] = useState(false);
    const [apellido,setApellido] = useState([]);
    const usuarios= useRef([]);
    const [nombre,setNombre] = useState([]);
    const [cargo,setCargo] = useState([]);
    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [modalActualizar, setModalactualizar] = useState(false);
    const [form, setForm] = useState({
        auth: false,
        name: '',
        lastname: '',
        secondlastname: '',
        photo: '',
        indentification: '',
        password: '',
        birthday: 0,
        cellphone: '',
        email: '',
        area: '',
        titulacion: '',
        uid: '',
        cargo: '',
        actividades: [],
        capacitacion: '',
        curriculum: '',
        codigo: '',
        icontrato: 0,
        fincontrato: 0,
        permisions: {
            compras: false,
            gestiona: false,
            gestioni: false,
            gestionm: false,
            gestionp: false,
            gestionr: false,
            gestiont: false,
            otrabajo: false,
            usuarios: false,
        }
    });
    const [state, setState] = useState({
        compras: false,
        gestiona: false,
        gestioni: false,
        gestionm: false,
        gestionp: false,
        gestionr: false,
        gestiont: false,
        otrabajo: false,
        usuarios: false,
        dashboardT:false,
        dashboardU:false,
        dashboardJM:false,
        dashboardJS:false,
        dashboardE:false,
      });
    const handleOpen = (dato) => {
        setForm(dato);
        setOpen(true);
        console.log('hola');

    };
    const handleClose = () => {
        setOpen(false);
    }
    const handleChange5 = (e, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const handleChange = (event) => {
        setState({
          ...state,
          [event.target.name]: event.target.checked,
        });
      };

    const getData = async () => {
        let aux=[]
        const reference = query(collection(db, "usuarios"));
        onSnapshot(reference, (querySnapshot) => {
            setData(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
            usuarios.current=querySnapshot.docs.map((doc) => ({ ...doc.data() }))
        });
    };

    // const inhabilitar = async (dato) => {

    //     var opcion = window.confirm("Estás Seguro que deseas inhabilitar el elemento " + dato.uid);
    //     if (opcion === true) {
    //         const nuevosp = {
    //             compras: false,
    //             dashboardE: false,
    //             dashboardJM: false,
    //             dashboardJS: false,
    //             dashboardT: false,
    //             dashboardU: false,
    //             gestiona: false,
    //             gestioni: false,
    //             gestionm: false,
    //             gestionp: false,
    //             gestionr: false,
    //             gestiont: false,
    //             otrabajo: false,
    //             usuarios: false,
           
    //         }

    //         const database = doc(db, "usuarios", dato.uid);
    //         await updateDoc(database,{
    //             persmisions:nuevosp
    //         })
            
    //         // await deleteDoc(doc(db, "usuarios", `${dato.uid}`));
    //         setModalactualizar(false);   
    //     }
    //   };


    const inhabilitar = async (dato) => {

        Swal.fire({
            title: dato.name + dato.lastname,
            text: "¿Estás Seguro que deseas inhabilitar al usuario?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, inhabilitar'
          }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Inhabilitado!',
                    showConfirmButton: false,
                    timer: 2000
                  })

            //   const nuevosp = {
            //     compras: false,
            //     dashboardE: false,
            //     dashboardJM: false,
            //     dashboardJS: false,
            //     dashboardT: false,
            //     dashboardU: false,
            //     gestiona: false,
            //     gestioni: false,
            //     gestionm: false,
            //     gestionp: false,
            //     gestionr: false,
            //     gestiont: false,
            //     otrabajo: false,
            //     usuarios: false,
           
            // }

            // const database = doc(db, "usuarios", dato.uid);
            //  updateDoc(database,{
            //     permisions:nuevosp
            // })

            const database = doc(db, "usuarios", dato.uid);
              updateDoc(database,{
                 situacion:false
            })
            
            // await deleteDoc(doc(db, "usuarios", `${dato.uid}`));
            setModalactualizar(false);   
            
            }
          })


        // var opcion = window.confirm("Estás Seguro que deseas inhabilitar el elemento " + dato.uid);
        // if (opcion === true) {
            // const nuevosp = {
            //     compras: false,
            //     dashboardE: false,
            //     dashboardJM: false,
            //     dashboardJS: false,
            //     dashboardT: false,
            //     dashboardU: false,
            //     gestiona: false,
            //     gestioni: false,
            //     gestionm: false,
            //     gestionp: false,
            //     gestionr: false,
            //     gestiont: false,
            //     otrabajo: false,
            //     usuarios: false,
           
            // }

            // const database = doc(db, "usuarios", dato.uid);
            // await updateDoc(database,{
            //     persmisions:nuevosp
            // })
            
            // await deleteDoc(doc(db, "usuarios", `${dato.uid}`));
            // setModalactualizar(false);   
        // }
      };



      const habilitar = async (dato) => {
        Swal.fire({
            title:  dato.name + dato.lastname,
            text: "¿Estás Seguro que deseas habilitar al usuario?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, habilitar'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡Habilitado!',
                showConfirmButton: false,
                timer: 2000
              })
              setForm(dato)
              const database = doc(db, "usuarios", dato.uid);
              updateDoc(database,{
                 situacion:true
            })
            //   setModalactualizar(true);  
            }
          })
        // var opcion = window.confirm("Estás Seguro que deseas habilitar el elemento " + dato.uid);
        // if (opcion === true) {
        //     setForm(dato)
        //     setModalactualizar(true);   
        // }
      };
      
      const editarU = async (dato) => {
        setModalactualizar(true); 
        setForm(dato)     
      };

    const actualizarUsuario= async()=>{
        const database = doc(db, "usuarios", form.uid);
        await updateDoc(database,{
            permisions:state
        })
        cerrarModalActualizar();
    }

    const mostrarModalActualizar = (dato) => {
        setForm(dato);
        setModalactualizar(true);
    };

    const cerrarModalActualizar = () => {
        setModalactualizar(false);
    };

    const handleUpdateForm = (e) =>{
        setForm({
            ...form,
            [e.target.name]: e.target.value,
          });
    }

    const filterbyname = (_dato) => {
        console.log("nom",fnombre)
        if(fnombre === true){
            if (_dato.name === nombre) {
                return _dato
            } else if (nombre === '') {
                return _dato
            } else {
                return null;
            }
        }else{
            return _dato
        }
    }

    const filterbyapellido = (_dato) => {
        console.log("apel",fapellido)
        if(fapellido=== true){
            if (_dato.lastname === apellido) {
                return _dato
            } else if (apellido === '') {
                return _dato
            } else {
                return null;
            }
        }else{
            return _dato
        }
    }

    const filterbycargo = (_dato) => {
        console.log("cargo",fcargos)
        console.log(cargo)
        if(fcargos === true){
            if (_dato.cargo === cargo) {
                return _dato
            } else if (cargo ==='') {
                return _dato
            } else {
                return null;
            }
        }else{
            return  _dato
        }
    }




    const filtar_datos =()=>{
        let aux=usuarios.current
        const filtro1 = aux.filter(filterbyname)
        const filtro2 = filtro1.filter(filterbyapellido)
        const filtro3 = filtro2.filter(filterbycargo)
        setNombre("")
        setCargo("")
        setApellido("")
       setReset(!reset)
       setData(filtro3)
    }

    // const eliminar = async (dato) => {
    //     var opcion = window.confirm("Estás Seguro que deseas Eliminar el elemento " + dato.id);
    //     if (opcion === true) {
    //         await deleteDoc(doc(db, "usuarios", `${dato.id}`));
    //         setModalactualizar(false);
    //     }
    // };






    useEffect(() => {
        getData();
    }, [])



    return (
        <>
            <Container>
                <Typography component="div" variant="h3" className="princi3" >
                    REGISTRO EMPLEADOS
                </Typography>
                <br />
                <Grid container spacing={{ xs: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid item xs={12} md={3}>
          <Autocomplete
                            disableClearable
                            key={reset}
                            id="combo-box-demo"
                            options={usuarios.current}
                            getOptionLabel={(option) => {
                                 return option.name;
                              }}
                            onChange={(event, newvalue) => setNombre(newvalue.name)}
                            renderInput={(params) => <TextField {...params} fullWidth label="Nombre"  type="text" />}
                        />
          </Grid>
          <Grid item xs={12} md={3}>
          <Autocomplete
                            disableClearable
                            key={reset}
                            id="combo-box-demo"
                            options={usuarios.current}
                            getOptionLabel={(option) => {
                                 return option.lastname;
                               }}
                            onChange={(event, newvalue) => setApellido(newvalue.lastname)}
                            renderInput={(params) => <TextField {...params} fullWidth label="Apellido"  type="text" />}
                        />
          </Grid>
          <Grid item xs={12} md={3}>
          <Autocomplete
                            disableClearable
                            key={reset}
                            id="combo-box-demo"
                            options={usuarios.current}
                            getOptionLabel={(option) => {
                                 return option.cargo;
                               }}
                            onChange={(event, newvalue) => setCargo(newvalue.cargo)}
                            renderInput={(params) => <TextField {...params} fullWidth label="Cargo"  type="text" />}
                        />
          </Grid>
          <Grid item xs={12} md={3}>
          <Button  variant="contained" className="boton-gestion" onClick={filtar_datos} endIcon={<FilterAltIcon />}>
                        Filtrar
                    </Button>
          </Grid>
          <Grid item xs={12} md={9}>
          <FormControlLabel control={<Switch onChange={(event,newValue)=>{setFnombre(newValue)}} inputProps={{ 'aria-label': 'controlled' }} />} value={fnombre}  label="Nombre" />
                    <FormControlLabel control={<Switch onChange={(event,newValue)=>{setFapellido(newValue)}} inputProps={{ 'aria-label': 'controlled' }} />} value={fapellido} label="Apellido" />
                    <FormControlLabel control={<Switch onChange={(event,newValue)=>{setFcargos(newValue)}} inputProps={{ 'aria-label': 'controlled' }} />} value={fcargos}  label="Cargo" />
          </Grid>
          </Grid>
          <div style={{overflow:"scroll", height:"400px"}}>
                <Table className='table table-light table-hover'>
                    <Thead>
                        <Tr>
                            <Th>#</Th>
                            <Th className="td-p">Nombres</Th>
                            <Th>Cargo</Th>
                            <Th>Id/Ruc</Th>
                            <Th>Correo</Th>
                            <Th>Contraseña</Th>
                            {/* <Th>Código</Th>                         */}
                            {/* <Th>Información</Th> */}
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.map((dato, index) => (
                            <Tr key={index} >
                                <Td>
                                    {index+1}
                                </Td>
                                <Td> 
                                    <div className="names-personal">
                                        <Avatar alt={dato.email} src={dato.photo} /> <p className="parrafos-personal">{dato.name} {dato.lastname} {dato.secondlastname}</p>
                                    </div>
                                </Td>
                                <Td>  <Chip label={dato.cargo} color="primary" /> </Td>
                                <Td>  {dato.indentification} </Td>
                                <Td>  {dato.email} </Td>
                                <Td>  {dato.password} </Td>
                                {/* <Td>{dato.codigo}</Td> */}
                                {/* <Td>
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => { handleOpen(dato) }}>Información</button>
                                </Td> */}
                                <Td>
                                    <Stack direction="row" spacing={2} alignitems="center" justifyContent="center" >
                                        {/* <button className="btn btn-outline-warning" onClick={() => mostrarModalActualizar(dato)}>Editar</button> */}
                                        <Button  variant="contained" color="warning"  disabled={!dato.situacion} onClick={() => { editarU(dato) }}>Editar</Button>
                                        <Button   variant="contained"  color="verde2" disabled={dato.situacion} onClick={() => { habilitar(dato) }}>Habilitar</Button>
                                        <Button   variant="contained" color="rojo" disabled={!dato.situacion} onClick={() => { inhabilitar(dato) }}>Inhabilitar</Button>
                                                         
                                    </Stack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
          </div>
            </Container>

            <Modal isOpen={modalActualizar}>
                <Container>
                    <ModalHeader>
                        <div><h3>Habilitar Usuario</h3></div>
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                <Typography component="div" variant="h8" className="titulou" >
                    <b>Accesos</b>
                  </Typography>
                  <FormControl component="fieldset" variant="standard">
                    <FormGroup>
                    <Grid item xs={12}>
                        <FormControlLabel
                        control={
                          <Switch checked={state.compras} onChange={handleChange} name="compras" />
                        }
                        label="Compras"
                      /></Grid>

<Grid item xs={12}>
                        <FormControlLabel
                        control={
                          <Switch checked={state.dashboardE} onChange={handleChange} name="dashboardE" />
                        }
                        label="Dashboard Técnico Externo"
                      /></Grid>

                      <Grid item xs={12}>
                        <FormControlLabel
                        control={
                          <Switch checked={state.dashboardJM} onChange={handleChange} name="dashboardJM" />
                        }
                        label="Dashboard Jefe de Mantenimiento"
                      /></Grid>

                        <Grid item xs={12}>
                        <FormControlLabel
                        control={
                          <Switch checked={state.dashboardJS} onChange={handleChange} name="dashboardJS" />
                        }
                        label="Dashboard Jefe de Sistemas"
                      />
                        </Grid>

                        <Grid item xs={12}>
                        <FormControlLabel
                        control={
                          <Switch checked={state.dashboardT} onChange={handleChange} name="dashboardT" />
                        }
                        label="Dashboard Técnico Interno"
                      />
                        </Grid>

                        <Grid item xs={12}>
                        <FormControlLabel
                        control={
                          <Switch checked={state.dashboardU} onChange={handleChange} name="dashboardU" />
                        }
                        label="Dashboard Usuarios"
                      />
                        </Grid>

                        <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch checked={state.gestioni} onChange={handleChange} name="gestioni" />
                        }
                        label="Inventario"
                      />
                        </Grid>
                        <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch checked={state.gestionm} onChange={handleChange} name="gestionm" />
                        }
                        label="Mantenimiento"
                      />
                         </Grid>
                         <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch checked={state.gestionp} onChange={handleChange} name="gestionp" />
                        }
                        label="Personal"
                      />
                       </Grid>
                         <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch checked={state.gestionr} onChange={handleChange} name="gestionr" />
                        }
                        label="Reportes"
                      />
                       </Grid>
                         <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch checked={state.gestiont} onChange={handleChange} name="gestiont" />
                        }
                        label="Tercerizados"
                      />
                       </Grid>
                         <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch checked={state.otrabajo} onChange={handleChange} name="otrabajo" />
                        }
                        label="Orden Trabajo"
                      />
                       </Grid>
                     
        

                      {/* nuevos permisos */}
                    
                    </FormGroup>
                  </FormControl>
                                </Grid>
                                {/* <Grid item xs={6}>
                                    <label>
                                        Código Empleado:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="codigo"
                                        type="text"
                                        onChange={handleUpdateForm}
                                        value={form.codigo}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        Nombre:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="name"
                                        type="text"
                                        onChange={handleUpdateForm}
                                        value={form.name}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        Apellido:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="lastname"
                                        type="text"
                                        onChange={handleUpdateForm}
                                        value={form.lastname}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        Segundo Apellido:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="secondlastname"
                                        type="text"
                                        onChange={handleUpdateForm}
                                        value={form.secondlastname}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        RUC:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="identification"
                                        type="text"
                                        onChange={handleUpdateForm}
                                        value={form.indentification}
                                    />
                                </Grid>
                               
                                <Grid item xs={6}>
                                    <label>
                                        Contacto:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="cellphone"
                                        type="text"
                                        onChange={handleUpdateForm}
                                        value={form.cellphone}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        Titulación:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="titulacion"
                                        type="text"
                                        onChange={handleUpdateForm}
                                        value={form.titulacion}
                                    />
                                </Grid>
                               
                                <Grid item xs={6}>
                                    <label>
                                        Cargo:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="cargo"
                                        type="text"
                                        onChange={handleUpdateForm}
                                        value={form.cargo}
                                    />
                                </Grid>
                               
                                <Grid item xs={12}>
                                    <label>
                                        Actividades:
                                    </label>
                                    <TextareaAutosize
                                        className="form-control"
                                        name="fincontrato"
                                        type="text"
                                        onChange={handleUpdateForm}
                                        value={form.actividades}
                                    />
                                </Grid>           */}
                            </Grid>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button sx={{marginRight:6}}  variant="contained" color="warning" onClick={actualizarUsuario}> Editar</Button>
                        <Button  variant="contained" color="rojo" onClick={() => cerrarModalActualizar()}>Cancelar</Button>
                    </ModalFooter>
                </Container>
            </Modal>

            <Modal
                isOpen={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"

            >
                <ModalHeader>
                    <div><h1>Información</h1></div>
                </ModalHeader>
                <ModalBody>


                    <Tabs
                        value={value}
                        onChange={handleChange5}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="action tabs example"
                    >
                        <Tab label="Datos laborales" {...a11yProps(0)} />
                        <Tab label="Datos Personales" {...a11yProps(1)} />
                        <Tab label="Datos Academicos" {...a11yProps(2)} />
                    </Tabs>



                    <Box sx={{ bgcolor: "#fff" }}>

                            <TabPanel value={value} index={0} >
                                <FormGroup>
                                    <Grid container spacing={4}>
                                        <Grid item xs={12}>
                                            <label>
                                                Departamento:
                                            </label>                                          
                                            <div className="chip-container-d">
                                                {pruebas4.map((item, index)=>
                                                (
                                                    
                                                    <Chip className="mx-1 chip-2"  key={index} label={item} color="primary" />
                                                
                                               ) )
                                               }
                                            </div>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <label>
                                                Cargo:
                                            </label>

                                            <input
                                                className="form-control"
                                                readOnly
                                                type="text"
                                                value={form.cargo}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <label>
                                                Actividades:
                                            </label>

                                            <TextareaAutosize
                                                aria-label="empty textarea"
                                                readOnly
                                                placeholder=""
                                                className="form-control"
                                                defaultValue={form.actividades}
                                            />
                                        </Grid>
                                
                                    </Grid>
                                </FormGroup>
                            </TabPanel>
                            <TabPanel value={value} index={1} >
                                <FormGroup>
                                    <Grid container spacing={4}>
                                        <Grid item xs={12}>
                                            <label>
                                                RUC:
                                            </label>

                                            <input
                                                className="form-control"
                                                readOnly
                                                type="text"
                                                value={form.indentification}
                                            />
                                        </Grid>
                                    
                                        <Grid item xs={12}>
                                            <label>
                                                Contacto:
                                            </label>

                                            <input
                                                className="form-control"
                                                readOnly
                                                type="text"
                                                value={form.cellphone}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <label>
                                                Correo:
                                            </label>

                                            <input
                                                className="form-control"
                                                readOnly
                                                type="text"
                                                value={form.email}
                                            />
                                        </Grid>
                                    </Grid>
                                </FormGroup>

                            </TabPanel>
                            <TabPanel value={value} index={2} >
                                <FormGroup>
                                    <Grid container spacing={4}>
                                    <Grid item xs={12}>
                                            <label>
                                                Nivel Educativo:
                                            </label>
                                            <input
                                                className="form-control"
                                                readOnly
                                                type="text"
                                                value={form.nivelEdu}
                                            />
                                             </Grid>
                                        <Grid item xs={12}>
                                            <label>
                                                Titulación:
                                            </label>

                                            <input
                                                className="form-control"
                                                readOnly
                                                type="text"
                                                value={form.titulacion}
                                            />
                                        </Grid>
                                        <Grid className="fila" item xs={12}>
                                            <label className="archivo">
                                                Archivo:
                                            </label>
                                            <a
                                                component="button"
                                                variant="body2"
                                                href={form.photo}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Visualizar Contrato
                                            </a>
                                        </Grid >
                                    </Grid>
                                </FormGroup>
                            </TabPanel>
             
                    </Box>

                </ModalBody>
                <ModalFooter>
                    <Button
                        className="editar"
                        onClick={() => handleClose()}
                    >
                        Salir
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );

}



