import React, { useEffect, useState } from "react";
import '../css/Presentacion.css';
import '../css/Ordentrabajo.css';
import '../css/Usuarios.css';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';
import { db, storage } from "../firebase/firebase-config";
import { setDoc, doc, updateDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { onSnapshot } from "firebase/firestore";
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import Switch from '@mui/material/Switch';
import imagen1 from '../components/imagenes/perfil.png';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Swal from 'sweetalert2';
import Autocomplete from '@mui/material/Autocomplete';
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useRef } from "react";



export default function Usuarios_menu() {
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    const [departamentos, setDepartamentos] = useState([]);
    const [verification, setVerification] = useState('');
    const [area, setArea] = useState([]);
    const [reset,setReset] = useState(false);
    const [file, setFile] = useState(null);
    const [cargo, setCargo] = useState("");
    const deshabilitar =  useRef(false);
    const [urlObject, setUrlObject] = useState(imagen1);
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
        dashboardT: false,
        dashboardU: false,
        dashboardJM: false,
        dashboardJS: false,
        dashboardE: false,
    });

    const [newUserInformation, setNewUserInformation] = useState({
        tareas: [],//es obligatorio
        auth: false,
        situacion: true,
        name: '',
        lastname: '',
        photo: '',
        indentification: '',
        password: '',
        email: '',
        uid: '',
        cargo: '',
        permisions: {
            compras: false,
            gestiona: false,
            gestioni: false,
            gestionm: false,
            gestionp: false,
            gestionr: false,
            gestiont: false,
            otrabajo: false,
            dashboardT: false,
            dashboardU: false,
            dashboardJM: false,
            dashboardJS: false,
            dashboardE: false
        }

    });


    const buscarImagen = (e) => {
        if (e.target.files[0] !== undefined) {
            setFile(e.target.files[0]);
            setUrlObject(URL.createObjectURL(e.target.files[0]))
            console.log(e.target.files[0]);
        } else {
            console.log('no hay archivo');
        }
    };
    const limpiarCampos = () => {
        setNewUserInformation({
            tareas: [],//es obligatorio
            auth: false,
            situacion: true,
            name: '',
            lastname: '',
            photo: '',
            indentification: '',
            password: '',
            email: '',
            uid: '',
            cargo: '',
            permisions: {
                compras: false,
                gestiona: false,
                gestioni: false,
                gestionm: false,
                gestionp: false,
                gestionr: false,
                gestiont: false,
                otrabajo: false,
                dashboardT: false,
                dashboardU: false,
                dashboardJM: false,
                dashboardJS: false,
                dashboardE: false,
            }

        });
        setState({
            compras: false,
            gestiona: false,
            gestioni: false,
            gestionm: false,
            gestionp: false,
            gestionr: false,
            gestiont: false,
            otrabajo: false,
            dashboardT: false,
            dashboardU: false,
            dashboardJM: false,
            dashboardJS: false,
            dashboardE: false,
        });
        setVerification('');
        setCargo("")
    }
    const enviarDatosFirebase = () => {
        var datos = newUserInformation;
        datos['area'] = area
        datos['permisions'] = state
        datos['cargo'] = cargo
        console.log(datos)
        setReset(!reset);
        limpiarCampos();
        setNewUserInformation(datos);
        var contra = datos.password.length
        console.log('Contraseña tiene ' + newUserInformation.password.length + ' caracteres');
        if (newUserInformation.lastname !== '' && newUserInformation.name !== '' && newUserInformation.indentification !== '' && newUserInformation.email !== '' && contra >= 8) {
            agregarNuevoUsuario();
            limpiarCampos();
            Swal.fire(
                'Usuario Registrado',
                '',
                'success'
            )
        } else {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Faltan Campos',
                text: "¡Por favor complete toda la información o ingrese una contraseña mayor a 8 caracteres!",
                showConfirmButton: false,
                timer: 2000
            })
        };
    }




    const getData = async () => {
        onSnapshot(doc(db, "informacion", "parametros"), (doc) => {
            let datos = doc.data().departamentos.slice()
            var transformados = datos.map((item) => (item.nombre))
            setDepartamentos(transformados)

        });

    }

    const sendFirestore = (uid) => {
        try {
            setDoc(doc(db, "usuarios", `${uid}`), newUserInformation);

            sendStorage(uid);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    // const arreglar =()=>{

    //     let arreglos =  {
    //     tareas: [
    //         "0b35e643-70d7",
    //         "12d9ee74-438d",
    //         "2a8b3bd3-21d6",
    //         "53169ec6-e75b",
    //         "54f4d170-3aab",
    //         "5f0a9566-f31d",
    //         "6b2c0f20-a60f",
    //         "768f84b5-6728",
    //         "76e63ee5-deed",
    //         "a7d619b9-23ce",
    //         "a905b17c-ff1f",
    //         "da6cef06-ca19",
    //         "daf8a4de-b37f",
    //         "ed13319e-f09c",
    //         "f3531653-cb22"
    //     ],
    //     auth: false,
    //     name: 'Samantha',
    //     lastname: 'Avila',
    //     secondlastname: '',
    //     photo: 'https://firebasestorage.googleapis.com/v0/b/app-mantenimiento-91156.appspot.com/o/usuarios%2Fc5EbazdxwoQyzkrGSyQ1QjXapEz1%2Fprofile.jpeg?alt=media&token=a6dd9a49-d6af-4a13-bf1d-fdcafc602a5c',
    //     indentification: '0103399456',
    //     password: 'facil123',
    //     birthday: 0,
    //     cellphone: '',
    //     email: 'sami1salome@gmail.com',
    //     nivelEdu: '',
    //     area: [
    //         "Emergencia","Hemodinamia"
    //     ],
    //     titulacion: '',
    //     uid: 'HJc70PTUBSdeG1yNoL6VBuiC2is2',
    //     cargo: 'Jefe Mantenimiento',
    //     actividades: [
    //         "Mantenimiento","Inventario","Reparaciones","Sistemas"
    //     ],
    //     capacitacion: '',
    //     curriculum: '',
    //     codigo: '',
    //     icontrato: 0,
    //     fincontrato: 0,
    //     permisions: {
    //         compras: true,
    //         gestiona: true,
    //         gestioni: true,
    //         gestionm: true,
    //         gestionp: true,
    //         gestionr: true,
    //         gestiont: true,
    //         otrabajo: true,
    //         dashboardT: true,
    //         dashboardU: true,
    //         dashboardJM: true,
    //         dashboardJS: true,
    //         dashboardE: true,
    //     }
    // }

    //     try {
    //         setDoc(doc(db, "usuarios", `HJc70PTUBSdeG1yNoL6VBuiC2is2`), arreglos);

    //     } catch (e) {
    //         console.error("Error adding document: ", e);
    //     }
        
    // }



    const permisionByCargo = (event) => {
        // esta funcion nos permititra determinar los dashboard a los cuales pueden acceder.
        var permisos = state;
        setCargo(event.target.value);
        if (event.target.value === 'Administrativos') {
            permisos['dashboardT'] = false
            permisos['dashboardU'] = false
            permisos['dashboardJM'] = false
            permisos['dashboardJS'] = false
            permisos['otrabajo'] = false
            permisos['dashboardU'] = false
            //acesos adicionales
            permisos['gestionm'] = false
            permisos['gestioni'] = false
            permisos['gestionr'] = false
            permisos['gestionp'] = false
            permisos['gestiona'] = true
            setState(permisos);
            deshabilitar.current = true;
            setArea(departamentos)
        }
        else if (event.target.value === 'Técnico Externo') {
            permisos['dashboardT'] = false
            permisos['dashboardU'] = false
            permisos['dashboardJM'] = false
            permisos['dashboardJS'] = false
            permisos['dashboardE'] = true
            permisos['otrabajo'] = false
            //acesos adicionales
            permisos['gestionm'] = false
            permisos['gestioni'] = false
            permisos['gestionr'] = false
            permisos['gestionp'] = false
            permisos['gestiona'] = false
            setState(permisos);
            deshabilitar.current = true;
            setArea(departamentos)
        }
        else if (event.target.value === 'Técnico Interno') {
            permisos['dashboardT'] = true
            permisos['otrabajo'] = true
            permisos['dashboardU'] = false
            permisos['dashboardJM'] = false
            permisos['dashboardJS'] = false
            permisos['dashboardE'] = false
            //acesos adicionales
            permisos['gestionm'] = false
            permisos['gestioni'] = false
            permisos['gestionr'] = false
            permisos['gestionp'] = false
            permisos['gestiona'] = false
            setState(permisos);
            deshabilitar.current = true;
            setArea(departamentos)
        }
        else if (event.target.value === 'Jefe Sistemas') {
            permisos['dashboardT'] = true
            permisos['otrabajo'] = true
            permisos['dashboardU'] = false
            permisos['dashboardJM'] = false
            permisos['dashboardJS'] = true
            permisos['dashboardE'] = false
            //acesos adicionales
            permisos['gestionm'] = true
            permisos['gestioni'] = true
            permisos['gestionr'] = true
            permisos['gestionp'] = true
            permisos['gestiona'] = true
            setState(permisos);
            deshabilitar.current = true;
            setArea(departamentos)
        }
        else if (event.target.value === 'Jefe Mantenimiento') {
            permisos['dashboardT'] = true
            permisos['otrabajo'] = true
            permisos['dashboardU'] = false
            permisos['dashboardJM'] = false
            permisos['dashboardJS'] = false
            permisos['dashboardE'] = false
            //acesos adicionales
            permisos['gestionm'] = true
            permisos['gestioni'] = true
            permisos['gestionr'] = true
            permisos['gestionp'] = true
            permisos['gestiona'] = true
            deshabilitar.current = true;
            setState(permisos);
            setArea(departamentos)
        }
        else {
            permisos['dashboardT'] = false
            permisos['dashboardU'] = true
            permisos['dashboardJM'] = false
            permisos['dashboardJS'] = false
            permisos['dashboardE'] = false
            permisos['otrabajo'] = true
            //acesos adicionales
            permisos['gestionm'] = false
            permisos['gestioni'] = false
            permisos['gestionr'] = false
            permisos['gestionp'] = false
            permisos['gestiona'] = false
            setState(permisos);
            deshabilitar.current = false;
    
        }

    }

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        });
    };
    //funcion para mandar imagen a firebase storage
    const sendStorage = (uid) => {
        const storageRef = ref(storage, `usuarios/${uid}/profile.jpeg`);
        uploadBytes(storageRef, file).then((snapshot) => {
            obtenerUrlPhoto(uid);
        });
    };

    // const sendStorage = async (id) => {
    //     const storageRef = ref(storage, `inventario/${id}`);
    //     try {
    //       let url2 = await uploadBytes(storageRef, file).then((snapshot) => {
    //         let url = getDownloadURL(storageRef).then((downloadURL) => {
    //           console.log('File available at', downloadURL);
    //           return downloadURL;
    //         });
    //         return url
    //       });
    //       return url2
    //     } catch (error) {
    //       return no_img
    //     }
    
    //   };

    // funcion para autenticar al usuario
    const agregarNuevoUsuario = () => {
        const newUser = newUserInformation;
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                sendFirestore(user.uid);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode)
                console.log(errorMessage)
                // ..
            });
    }


    const handleUserForm = (event) => {
        setNewUserInformation({
            ...newUserInformation,
            [event.target.name]: event.target.value,
        });

    }
    const obtenerUrlPhoto = (uid) => {
        getDownloadURL(ref(storage, `usuarios/${uid}/profile.jpeg`)).then((url) => {
            console.log(url);
            const ref = doc(db, "usuarios", `${uid}`);
            updateDoc(ref, {
                "photo": url,
                "uid": uid
            });
        })
    };

    useEffect(() => {
        getData();
    }, [])

    return (
        <>
          <Typography component="div" variant="h4" className="princicrear" >
        REGISTRO DE USUARIOS
      </Typography>
            {/* <Typography component="div" variant="h4" sx={{ color: "black", marginY: '20px' }}>
                <b>Registro de Usuarios</b>
            </Typography> */}
            <div className="container">
                <div className="column">

                    <div className="col-sm-12">
                        <Grid container spacing={{ xs: 1, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }}>


                            <Grid item xs={8}>
                                <div className="panelp2">

                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Typography component="div" variant="h8" className="titulou" >
                                                <b>Datos de Registro</b>
                                            </Typography>

                                            <img
                                                className="imagen-usuarios w-40"
                                                src={urlObject}
                                                defaultValue={imagen1}
                                                alt="user profile"
                                            />
                                            <input className="form-control " onChange={buscarImagen} type="file" id="formFile" />

                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField inputProps={{ style: { textTransform: "uppercase" } }} value={newUserInformation.name} required name='name' fullWidth label="Nombre" type="text" onChange={handleUserForm} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField inputProps={{ style: { textTransform: "uppercase" } }} value={newUserInformation.lastname} required name='lastname' fullWidth label="Apellido" type="text" onChange={handleUserForm} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField value={newUserInformation.indentification} required name='indentification' fullWidth label="CI/RUC" type="text" onChange={handleUserForm} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Cargo</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    label="Cargo"
                                                    key={reset}
                                                    name="cargo"
                                                    value={cargo}
                                                    onChange={permisionByCargo}
                                                    sx={{ textAlign: 'left' }}
                                                >
                                                    <MenuItem value={'Usuario'}>USUARIO</MenuItem>
                                                    <MenuItem value={'Administrativos'}>ADMINISTRATIVOS</MenuItem>
                                                    <MenuItem value={'Técnico Interno'}>TÉCNICO INTERNO</MenuItem>        
                                                    <MenuItem value={'Técnico Externo'}>TÉCNICO EXTERNO</MenuItem>
                                                    <MenuItem value={'Jefe Sistemas'}>JEFE SISTEMAS</MenuItem>
                                                    <MenuItem value={'Jefe Mantenimiento'}>JEJE MANTENIMIENTO</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField value={newUserInformation.email} name="email" fullWidth label="Email" type="text" onChange={handleUserForm} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField value={newUserInformation.password} name='password' fullWidth label="Contraseña" type="password" onChange={handleUserForm} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Autocomplete
                                                multiple
                                                key={reset}
                                                id="checkboxes-tags-demo"
                                                options={departamentos}
                                                disabled={deshabilitar.current}
                                                disableCloseOnSelect
                                                getOptionLabel={(option) => option}
                                                onChange={(event, newValue) => {
                                                    setArea([...newValue]);
                                                }}
                                                renderOption={(props, option, { selected }) => (
                                                    <li {...props}>
                                                        <Checkbox
                                                            icon={icon}
                                                            checkedIcon={checkedIcon}
                                                            style={{ marginRight: 8 }}
                                                            checked={selected}
                                                        />
                                                        {option}
                                                    </li>
                                                )}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Departamentos" placeholder="Añadir" />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Stack direction="row" spacing={2} alignitems="center" justifyContent="center" >

                                                <Button variant="contained" color="enviarcp" className="botone" endIcon={<SendIcon />} onClick={enviarDatosFirebase}>
                                                    Enviar</Button>
                                                    {/* <Button variant="contained" color="enviarcp" className="botone" endIcon={<SendIcon />} onClick={arreglar}>
                                                    arreglar</Button> */}


                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>

                            <Grid item xs={4}>
                                {/* <div className="panelp2">
                  <div className="mb-3">
                    <Typography component="div" variant="h8" className="titulou" >
                      <b>Foto de Perfil</b>
                    </Typography>

                  </div>
                  <img
                    className="imagen-usuarios w-40"
                    src={urlObject}
                    defaultValue={imagen1}
                    alt="user profile"
                  />
                  <input className="form-control " onChange={buscarImagen} type="file" id="formFile" />
                </div> */}
                                <div className="panelp2">
                                    <Typography component="div" variant="h8" className="titulou" >
                                        <b>Accesos Predeterminados</b>
                                    </Typography>
                                    <FormControl component="fieldset" variant="standard">
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Switch checked={state.otrabajo} onChange={handleChange} name="otrabajo" />
                                                }
                                                label="Orden Trabajo"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch checked={state.dashboardE} onChange={handleChange} name="gestiona" />
                                                }
                                                label="Dashboard Externos"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch checked={state.dashboardT} onChange={handleChange} name="gestioni" />
                                                }
                                                label="Dashboard Tecnicos"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch checked={state.dashboardU} onChange={handleChange} name="gestionm" />
                                                }
                                                label="Dashboard Usuarios"
                                            />
                                            

          

                                        </FormGroup>
                                    </FormControl>
                                </div>
                                <div className="panelp2">
                                    <Typography component="div" variant="h8" className="titulou" >
                                        <b>Accesos Adicionales</b>
                                    </Typography>
                                    <FormControl component="fieldset" variant="standard">
                                        <FormGroup>
                                        <FormControlLabel
                                                control={
                                                    <Switch checked={state.gestionm} onChange={handleChange} name="gestionm" />
                                                }
                                                label="Gestión Mantenimiento"
                                            />
                                               <FormControlLabel
                                                control={
                                                    <Switch checked={state.gestioni} onChange={handleChange} name="gestioni" />
                                                }
                                                label="Gestión Inventario e Indicadores"
                                            />
                                         
                                         
                                         
                                            <FormControlLabel
                                                control={
                                                    <Switch checked={state.gestionr} onChange={handleChange} name="gestionr" />
                                                }
                                                label="Gestión Reportes"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch checked={state.gestionp} onChange={handleChange} name="gestionp" />
                                                }
                                                label="Gestión Personal"
                                            />

                                        <FormControlLabel
                                                control={
                                                    <Switch checked={state.gestiona} onChange={handleChange} name="gestiona" />
                                                }
                                                label="Gestión Activos"
                                            />
                                            {/* <FormControlLabel
                                                control={
                                                    <Switch checked={state.compras} onChange={handleChange} name="compras" />
                                                }
                                                label="Compras"
                                            /> */}


                                            {/* nuevos permisos */}

                                        </FormGroup>
                                    </FormControl>
                                </div>
                            </Grid>
                        </Grid>
                    </div>

                </div>



            </div>


        </>
    );
}


