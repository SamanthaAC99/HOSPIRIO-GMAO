import React, { useEffect, useState } from "react";
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { collection, setDoc, query, doc, deleteDoc, onSnapshot, updateDoc } from "firebase/firestore";
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';
import * as XLSX from 'xlsx';
import { db, storage } from "../firebase/firebase-config";
import { teal, deepOrange } from '@mui/material/colors';
import Autocomplete from '@mui/material/Autocomplete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useNavigate } from 'react-router-dom';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import ExtensionIcon from '@mui/icons-material/Extension';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { setEquipoState } from '../features/inventario/inventarioSlice';
import Swal from 'sweetalert2';
import '../css/Tabla.css'
import '../css/Inventario.css'
import { useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import {
    Container,
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    ModalFooter,
} from "reactstrap";
import { v4 as uuidv4 } from 'uuid';
import Stack from '@mui/material/Stack';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function Ingresoequipos() {
    let params = useParams();
    const currentInventario = useSelector(state => state.inventarios);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [accesoriosp, setAccesoriosp] = useState({});
    const [modalActualizar, setModalactualizar] = useState(false);
    const [modalAccesorios, setModalAccesorios] = useState(false);
    const [modalDEquipo, setModalDEquipo] = useState(false);
    const [modalDDepartamento, setModalDDepartamento] = useState(false);
    const [modalInsertar, setModalinsertar] = useState(false);
    const [modalInformacion, setModalinformacion] = useState(false);
    const [codigo, setCodigo] = useState('');
    const [equipo, setEquipo] = useState('');
    const [acc1, setAcc1] = useState({});
    const [acc2, setAcc2] = useState({});
    const [acc3, setAcc3] = useState({});
    const [acc4, setAcc4] = useState({});
    const [acc5, setAcc5] = useState({});
    const [propietario, setPropietario] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [serie, setSerie] = useState('');
    const [accesorios, setAccesorios] = useState('');
    const [area, setArea] = useState('');
    const [tipo, setTipo] = useState('');
    const [seguro, setSeguro] = useState('');
    const [url, setUrl] = useState("");
    const [file, setFile] = useState(null);
    const [equipos, setEquipos] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [eimportancia, setEimportancia] = useState([]);
    const [newEquipo, setNewEquipo] = useState("");
    const [time2, setTime2] = useState(new Date());
    const [newDepartamento, setNewDepartamento] = useState("");
    const [acces, setAcces] = useState([]);
    //variables de mantenimiento
    const [time1, setTime1] = useState(new Date());
    const [empresas, setEmpresas] = useState([]);

    // formulario del equipo
    const [form, setForm] = useState({
        codigo: "",
        equipo: "",
        propietario: "",
        marca: "",
        modelo: "",
        serie: "",
        mantenimientos: [],
        // accesorios: "",
        area: "",
        mttr: "",
        mtbf: "",
        disponibilidad: "",
        nfallos: "",
        tipo: "",
        seguro: "",
        acc1: {},
        acc2: {},
        acc3: {},
        acc4: {},
        acc5: {},

    });

    const buscarImagen = (e) => {
        if (e.target.files[0] !== undefined) {
            setFile(e.target.files[0]);
            console.log(e.target.files[0]);
        } else {
            console.log('no hay archivo');
        }
    };

    const getData = async () => {
        const reference = query(collection(db, "ingreso"));
        onSnapshot(reference, (querySnapshot) => {
            setData(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
        });
        const reference2 = query(collection(db, "empresas"));
        onSnapshot(reference2, (querySnapshot) => {
            setEmpresas(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
        });
        onSnapshot(doc(db, "informacion", "ksCkGtZm1u2I0y5YoC4g"), (doc) => {
            setEquipos(doc.data().equipos)
        });
        onSnapshot(doc(db, "informacion", "nQmu9eTe3EV17oBSTgIW"), (doc) => {
            setDepartamentos(doc.data().departamentos)
        });
        const reference3 = query(collection(db, "accesorios"));
        onSnapshot(reference3, (querySnapshot) => {
            setAcces(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
        });
    }

    const agregarDepartamentoFirebase = async () => {
        if (departamentos.includes(newDepartamento)) {
            Swal.fire({
                icon: 'error',
                title: 'Lo siento ya existe ese Departamento',
                showConfirmButton: false,
                timer: 1500
            })
        } else {
            const datos = departamentos.slice()
            datos.push(newDepartamento)
            const ref = doc(db, "informacion", "nQmu9eTe3EV17oBSTgIW");
            await updateDoc(ref, {
                departamentos: datos
            });
            Swal.fire({
                icon: 'success',
                title: 'Departamento Agregado con Éxito',
                showConfirmButton: false,
                timer: 1500
            })
        }
        mostrarModalDDepartamento(false);
        setNewDepartamento("");
    }
    const agregarEquipoFirebase = async () => {
        if (equipos.includes(newEquipo)) {
            Swal.fire({
                icon: 'error',
                title: 'Lo siento ya existe ese Equipo',
                showConfirmButton: false,
                timer: 1500
            })
        } else {
            var datos = equipos.slice()
            datos.push(newEquipo)
            const ref = doc(db, "informacion", "ksCkGtZm1u2I0y5YoC4g");
            await updateDoc(ref, {
                equipos: datos
            });
            Swal.fire({
                icon: 'success',
                title: 'Equipo Agregado con Éxito',
                showConfirmButton: false,
                timer: 1500
            })
        }
        mostrarModalDEquipo(false);
        setNewEquipo("");
    }


    const agregardatos = async () => {
        var newEquipo = {};
        var newId = uuidv4();
        if (file === null) {
            newEquipo = {
                codigo: codigo,
                equipo: equipo,
                propietario: propietario,
                marca: marca,
                modelo: modelo,
                serie: serie,
                importancia: eimportancia,
                accesorios: accesorios,
                area: area,
                tipo: tipo,
                seguro: seguro,
                mantenimientos: [],
                mttr: "",
                mtbf: "",
                disponibilidad: "",
                nfallos: "",
                nameImg: 'SP.PNG',
                id: newId,
                indice: Date.now(),
                acc1: {},
                acc2: {},
                acc3: {},
                acc4: {},
                acc5: {},
            }
            sendFirestore(newEquipo);
        } else {
            newEquipo = {
                codigo: codigo,
                equipo: equipo,
                propietario: propietario,
                marca: marca,
                modelo: modelo,
                serie: serie,
                accesorios: accesorios,
                area: area,
                tipo: tipo,
                seguro: seguro,
                nameImg: newId,
                mantenimiento: "",
                mttr: "",
                mtbf: "",
                disponibilidad: "",
                nfallos: "",
                id: newId,
                indice: Date.now(),
                acc1: {},
                acc2: {},
                acc3: {},
                acc4: {},
                acc5: {},
            };
            sendFirestore(newEquipo);
            sendStorage(newEquipo.id);
        };
        setFile(null);
        cerrarModalInsertar();
    };

    // const agregardatos = async () => {
    //     var newEquipo = {};
    //     var newId = uuidv4();
    //     const fechaDiaHoy = new Date()
    //     var año = fechaDiaHoy.getFullYear()
    //     const añoSelec =  time1.getFullYear()
    //     const diaselec = time1.getDate()
    //     const mesSelect = time1.getMonth() + 1
    //     console.log("es el mes: ",mesSelect);
    //     const meses = [1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11,12]

    //     if(equipoPeriodicidad === "trimestral"){
    //         var mantenimientos = []
    //         var mesesPeriodo = []
    //         for (var i = mesSelect; i < 24; i+=3) {
    //             if(meses[i] === mesSelect){
    //                 break
    //             }else{
    //                 console.log(meses[i-1]);
    //                 mantenimientos.push(i);
    //             }
    //           }
    //         const dimension = mantenimientos.length  
    //         for(var i = 0 ; i < dimension;i++){
    //             if(mantenimientos[i] <= mantenimientos[i-1]){
    //                 var newAño = newAño+1 
    //             }
    //             const fecha1 = `${mantenimientos[i]} / ${newAño}`; 
    //             const mant = {
    //                  fecha: fecha1,
    //             }
    //           mantenimientos.push(mant)
    //       }

    //     }
    //     else if(equipoPeriodicidad === "mensual"){
    //         for (var i = 0; i < 4; i++) {
    //             console.log(i)
    //           }
    //     }
    //     else{
    //         console.log(time1);
    //     }

    //     if (file === null) {
    //         newEquipo = {
    //             codigo: codigo,
    //             equipo: equipo,
    //             propietario: propietario,
    //             marca: marca,
    //             modelo: modelo,
    //             serie: serie,
    //             importancia: eimportancia,
    //             // accesorios: accesorios,
    //             area: area,
    //             tipo: tipo,
    //             seguro: seguro,
    //             mttr: "",
    //             mtbf: "",
    //             disponibilidad: "",
    //             nfallos: "",
    //             nameImg: 'SP.PNG',
    //             id: newId,
    //             indice: Date.now(),
    //             acc1: {},
    //             acc2:  {},
    //             acc3:   {},
    //             acc4:  {},
    //             acc5:  {},
    //         }
    //         //sendFirestore(newEquipo);
    //     } else {
    //         newEquipo = {
    //             codigo: codigo,
    //             equipo: equipo,
    //             propietario: propietario,
    //             marca: marca,
    //             modelo: modelo,
    //             serie: serie,
    //             // accesorios: accesorios,
    //             area: area,
    //             tipo: tipo,
    //             seguro: seguro,
    //             nameImg: newId,
    //             mttr: "",
    //             mtbf: "",
    //             disponibilidad: "",
    //             nfallos: "",
    //             id: newId,
    //             indice: Date.now(),
    //            acc1: {},
    //     acc2:  {},
    //     acc3:   {},
    //     acc4:  {},
    //     acc5:  {},
    //         };
    //         //sendFirestore(newEquipo);
    //         //sendStorage(newEquipo.id);

    //     };
    //     setFile(null);
    //     cerrarModalInsertar();
    // };


    const sendStorage = (id) => {

        const storageRef = ref(storage, `inventario/${id}`);
        uploadBytes(storageRef, file).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });
    };

    const mostrarModalActualizar = (dato) => {
        setForm(dato);
        setModalactualizar(true);
    };

    const mostrarModalAccesorios = (dato) => {
        setForm(dato);
        setModalAccesorios(true);
    };



    const mostrarModalInformacion = (dato) => {
        setForm(dato);
        setAccesoriosp(dato)
        descargararchivo(dato.nameImg);
        setModalinformacion(true);
    };

    const cerrarModalInformacion = () => {
        setModalinformacion(false);
    };

    const cerrarModalActualizar = () => {
        setModalactualizar(false);
    };

    const cerrarModalAccesorios = () => {
        setModalAccesorios(false);
    };


    const mostrarModalInsertar = () => {
        setModalinsertar(true);
    };

    const cerrarModalInsertar = () => {
        setModalinsertar(false);
    };

    const editar = async (dato) => {

        var arreglo = data;
        console.log(data);
        const database = doc(db, "ingreso", dato.id);
        arreglo.map((registro) => {
            if (dato.id === registro.id) {
                registro.codigo = dato.codigo;
                registro.equipo = dato.equipo;
                registro.propietario = dato.propietario;
                registro.marca = dato.marca;
                registro.modelo = dato.modelo;
                registro.serie = dato.serie;
                // registro.accesorios = dato.accesorios;
                registro.area = dato.area;
                registro.tipo = dato.tipo;
                registro.seguro = dato.seguro;
                return 0;
            }
            return 0;
        });
        setData(arreglo);
        await updateDoc(database, {
            codigo: dato.codigo,
            equipo: dato.equipo,
            propietario: dato.propietario,
            marca: dato.marca,
            modelo: dato.modelo,
            serie: dato.serie,
            // accesorios: dato.accesorios,
            area: dato.area,
            tipo: dato.tipo,
            seguro: dato.seguro,
        });

        setModalactualizar(false);
    };

    const agregaracc = async (dato) => {
        const ref = doc(db, "ingreso", `${dato.id}`);
        updateDoc(ref, {
            acc1: acc1,
            acc2: acc2,
            acc3: acc3,
            acc4: acc4,
            acc5: acc5,

        });
        Swal.fire(
            "¡Accesorios Incluidos!",
            '',
            'success'
        )

        setModalactualizar(false);
        cerrarModalAccesorios()
    }

    const eliminar = async (dato) => {
        var opcion = window.confirm("Estás Seguro que deseas Eliminar el elemento " + dato.id);
        if (opcion === true) {
            await deleteDoc(doc(db, "ingreso", `${dato.id}`));
            setModalactualizar(false);
        }
    };

    const sendFirestore = (newEquipo) => {
        try {
            setDoc(doc(db, "ingreso", `${newEquipo.id}`), newEquipo);


        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const insertar = () => {
        var valorNuevo = { ...form };
        console.log(valorNuevo);
        setModalinsertar(false);
        agregardatos(valorNuevo);
    }

    const handleChange = (e) => {
        setForm(
            {
                ...form,
                [e.target.name]: e.target.value,
            },
        )
        console.log(form);
    };
    const selecSeguro = (e) => {
        console.log(e.target.value);
        var newForm = form;
        newForm.seguro = e.target.value;
        setForm(newForm);
    };
    const selecEquipo = (e) => {
        console.log(e.target.value);
        var newForm = form;
        newForm.equipo = e.target.value;
        setForm(newForm);
    }
    const selecTipo = (e) => {
        console.log(e.target.value);
        var newForm = form;
        newForm.tipo = e.target.value;
        setForm(newForm);
    };
    const selecDepartamento = (e) => {
        console.log(e.target.value);
        var newForm = form;
        newForm.area = e.target.value;
        setForm(newForm);
    };

    const mostrarModalDEquipo = (open) => {
        setModalDEquipo(open);
    }
    const mostrarModalDDepartamento = (open) => {
        setModalDDepartamento(open);
    }
    const descargararchivo = (nombre) => {
        getDownloadURL(ref(storage, `inventario/${nombre}`)).then((url) => {
            console.log(url);
            setUrl(url);
        })
    };

    const SelectFecha1 = (newValue) => {
        const dateStart = new Date(newValue)
        console.log(dateStart);
        setTime1(newValue);
    };
    const SelectFecha2 = (newValue) => {
        const dateEnd = new Date(newValue)
        console.log(dateEnd);
        setTime2(newValue);
    };


    const hojavida = (data) => {
        dispatch(setEquipoState(data))
        navigate('hojadevida')
    }

    const codigocompleto = (accesorioc) => {
        var naccesorio = {
            codigoa: form.codigo + accesorioc.codigoac,
            nombre: accesorioc.accesorioing
        }
        setAcc1(naccesorio)
    }

    const accesorio2 = (accesorioc) => {
        var naccesorio2 = {
            codigoa: form.codigo + accesorioc.codigoac,
            nombre: accesorioc.accesorioing
        }
        setAcc2(naccesorio2)
    }

    const accesorio3 = (accesorioc) => {
        var naccesorio3 = {
            codigoa: form.codigo + accesorioc.codigoac,
            nombre: accesorioc.accesorioing
        }
        setAcc3(naccesorio3)
    }

    const accesorio4 = (accesorioc) => {
        var naccesorio4 = {
            codigoa: form.codigo + accesorioc.codigoac,
            nombre: accesorioc.accesorioing
        }
        setAcc4(naccesorio4)
    }

    const accesorio5 = (accesorioc) => {
        var naccesorio5 = {
            codigoa: form.codigo + accesorioc.codigoac,
            nombre: accesorioc.accesorioing
        }
        setAcc5(naccesorio5)
    }



    const navegarView = (ruta) => {
        navigate(`/${params.uid}/${ruta}`);
    }
    const programarmantenimiento = () => {
        navegarView('mantenimiento/mantenimiento');
    };

    const accesoriosext = () => {
        navegarView('inventario/solicitudcompra');
    };

  
    const crearExcel = () => {
        console.log("hola mundo");
       console.log(data)
        const myHeader = ["equipo", "codigo", "marca", "modelo"];
        const worksheet = XLSX.utils.json_to_sheet(data, { header: myHeader });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.sheet_add_aoa(worksheet, [["Equipo", "Código", "Marca", "Modelo"]], { origin: "A1" });
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");
        worksheet["!cols"] = [{ wch: 50 }, { wch: 30 }, { wch: 30 }];

        XLSX.writeFile(workbook, "Equipos.xlsx", { compression: true });

    }
    useEffect(() => {
        getData();
        // eslint-disable-next-line
    }, [])



    return (
        <>
            <Container>

                <Grid container spacing={{ xs: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={12} sm={12} md={2.4}>
                        <Button variant="contained"
                            className="boton-principal"
                            onClick={() => mostrarModalInsertar()}>Ingresar Equipo</Button>
                    </Grid>



                    <Grid item xs={12} sm={12} md={2.4}>
                        <Button variant="outlined"
                            className="boton-secundarios"
                            endIcon={<DomainAddIcon sx={{ fontSize: 90 }} />}
                            onClick={() => mostrarModalDDepartamento(true)}>Agregar Área</Button>
                    </Grid>

                    <Grid item xs={12} sm={12} md={2.4}>
                        <Button variant="outlined"
                            className="boton-secundarios"
                            endIcon={<AddToQueueIcon sx={{ fontSize: 90 }} />}
                            onClick={() => mostrarModalDEquipo(true)}>Agregar Equipo</Button>
                    </Grid>

                    <Grid item xs={12} sm={12} md={2.4}>
                        <Button variant="outlined"
                            className="boton-secundarios"
                            endIcon={<ExtensionIcon sx={{ fontSize: 90 }} />}
                            onClick={() => { accesoriosext() }}
                        >Agregar Accesorio</Button>
                    </Grid>

                    <Grid item xs={12} sm={12} md={2.4}>
                        <Button variant="outlined"
                            className="boton-secundarios"
                            endIcon={<CalendarMonthIcon sx={{ fontSize: 90 }} />}
                            onClick={() => { programarmantenimiento() }}
                        >Plan Mantenimiento</Button>

                    

                        <Button variant="outlined"
                            className="boton-secundarios"
                            endIcon={<CalendarMonthIcon sx={{ fontSize: 90 }} />}
                            onClick={crearExcel}
                        >Crear EXCEL</Button>
                    </Grid>

                </Grid>


                <br />
                <Table className='table table-ligh table-hover'>
                    <Thead>
                        <Tr>
                            <Th>#</Th>
                            <Th>Código</Th>
                            <Th>Equipo</Th>
                            <Th>Departamento</Th>
                            {/* <Th>Propietario</Th>
                            <Th>Seguro</Th> */}
                            <Th>Accesorios</Th>
                            <Th>Acciones</Th>
                            <Th>Información</Th>
                            <Th>Hoja de Vida</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        {data.sort((a, b) => (a.indice - b.indice)).map((dato, index) => (
                            <Tr key={dato.indice}>
                                <Td>{index + 1}</Td>
                                <Td>{dato.codigo}</Td>
                                <Td>{dato.equipo}</Td>
                                <Td>{dato.area}</Td>
                                {/* <Td>{dato.propietario}</Td>
                                <Td>{dato.seguro}</Td> */}
                                <Td>

                                    <button className="btn btn-outline-dark" onClick={() => mostrarModalAccesorios(dato)}>Accesorios</button>


                                </Td>
                                <Td>
                                    <Stack direction="row" spacing={2} alignitems="center" justifyContent="center" >
                                        <button className="btn btn-outline-warning" onClick={() => mostrarModalActualizar(dato)}>Editar</button>
                                        <button className="btn btn-outline-danger" onClick={() => eliminar(dato)}>Eliminar</button>
                                    </Stack>
                                </Td>
                                <Td>
                                    <IconButton aria-label="delete" sx={{ color: teal[200] }} onClick={() => mostrarModalInformacion(dato)}><InfoIcon /></IconButton>
                                </Td>
                                <Td>
                                    <IconButton aria-label="delete" sx={{ color: deepOrange[200] }} onClick={() => { hojavida(dato) }} ><AssignmentIcon /></IconButton>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Container>

            <Modal isOpen={modalInformacion}>

                <ModalHeader>
                    <div><h1>Información Equipo</h1></div>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label=" Tipo de Equipo"
                                    focused type="int"
                                    value={form.tipo}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label=" Marca"
                                    focused type="int"
                                    value={form.marca}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label=" Modelo"
                                    focused type="int"
                                    value={form.modelo}
                                />

                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label=" Serie"
                                    focused type="int"
                                    value={form.serie}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label=" Propietario"
                                    focused type="int"
                                    value={form.propietario}
                                />

                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label=" Seguro"
                                    focused type="int"
                                    value={form.seguro}
                                />

                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label="Accesorio 1"
                                    focused type="int"
                                    value={form.acc1.nombre}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label="Código Accesorio 1"
                                    focused type="int"
                                    value={form.acc1.codigoa}
                                />
                            </Grid>



                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label="Accesorio 2"
                                    focused type="int"
                                    value={form.acc2.nombre}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label="Código Accesorio 2"
                                    focused type="int"
                                    value={form.acc2.codigoa}
                                />
                            </Grid>



                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label="Accesorio 3"
                                    focused type="int"
                                    value={form.acc3.nombre}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label="Código Accesorio 3"
                                    focused type="int"
                                    value={form.acc3.codigoa}
                                />
                            </Grid>



                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label="Accesorio 4"
                                    focused type="int"
                                    value={form.acc4.nombre}
                                />
                            </Grid>


                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label="Código Accesorio 4"
                                    focused type="int"
                                    value={form.acc4.codigoa}
                                />
                            </Grid>



                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label="Accesorio 5"
                                    focused type="int"
                                    value={form.acc5.nombre}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label="Código Accesorio 5"
                                    focused type="int"
                                    value={form.acc5.codigoa}
                                />
                            </Grid>




                            {/* <Grid item xs={12}>
                                <label>
                                    Accesorios:
                                </label>

                                <input
                                    className="form-control"
                                    readOnly
                                    type="text"
                                    value={form.accesorios}
                                />
                            </Grid> */}
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
                                    Visualizar Fotografía
                                </a>
                            </Grid >

                        </Grid>
                    </FormGroup>

                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="contained"
                        className="boton-modal2"
                        onClick={() => cerrarModalInformacion()}
                    >
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>



            <Modal isOpen={modalDEquipo}>
                <ModalHeader>
                    <div><h1>Agregar Equipo</h1></div>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <label>
                                    Tipo de Equipo:
                                </label>

                                <input
                                    className="form-control"
                                    type="text"
                                    value={newEquipo}
                                    onChange={(e) => setNewEquipo(e.target.value)}
                                />
                            </Grid>

                        </Grid>
                    </FormGroup>

                </ModalBody>
                <ModalFooter>

                    <Button
                        variant="outlined"
                        className="boton-modal2"
                        onClick={() => agregarEquipoFirebase()}
                    >
                        Agregar
                    </Button>

                    <Button
                        variant="contained"
                        className="boton-modal"
                        onClick={() => mostrarModalDEquipo(false)}
                    >
                        Cancelar
                    </Button>

                </ModalFooter>
            </Modal>

            <Modal isOpen={modalDDepartamento}>
                <ModalHeader>
                    <div><h1>Agregar Departamento</h1></div>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <label>
                                    Departamento:
                                </label>

                                <input
                                    className="form-control"
                                    type="text"
                                    value={newDepartamento}
                                    onChange={(e) => { setNewDepartamento(e.target.value) }}
                                />
                            </Grid>

                        </Grid>
                    </FormGroup>

                </ModalBody>
                <ModalFooter>

                    <Button
                        variant="outlined"
                        className="boton-modal2"
                        onClick={() => agregarDepartamentoFirebase()}
                    >
                        Agregar
                    </Button>

                    <Button
                        variant="contained"
                        className="boton-modal"
                        onClick={() => setModalDDepartamento(false)}
                    >
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>




            <Modal isOpen={modalActualizar}>
                <ModalHeader>
                    <div><h3>Editar Registro</h3></div>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <label>
                                    Código Equipo:
                                </label>

                                <input
                                    className="form-control"
                                    name="codigo"
                                    type="text"
                                    onChange={handleChange}
                                    value={form.codigo}
                                />

                            </Grid>
                            <Grid item xs={6}>
                                <label>
                                    Tipo Equipo:
                                </label>
                                <select onChange={selecTipo} className="form-select" aria-label="Default select tipo">
                                    <option selected>Tipo:</option>
                                    <option value="Medico" >Médico</option>
                                    <option value="Industrial">Industrial</option>
                                </select>
                            </Grid>
                            <Grid item xs={6}>
                                <label>
                                    Equipo:
                                </label>
                                <select onChange={selecEquipo} className="form-select" aria-label="Default select departamento">
                                    {equipos.map((equipo, index) => (
                                        <option key={index} value={equipo}>{equipo}</option>
                                    ))}
                                </select>
                            </Grid>
                            <Grid item xs={6}>
                                <label>
                                    Departamento:
                                </label>
                                <select onChange={selecDepartamento} className="form-select" aria-label="Default select departamento">
                                    <option selected>Departamentos:</option>
                                    <option value="Angiógrafo 1">Angiógrafo 1</option>
                                    <option value="Angiógrafo 2">Angiógrafo 2</option>
                                    <option value="Ambulancia">Ambulancia</option>
                                    <option value="Cedicardio">Cedicardio</option>
                                    <option value="Densitometría">Densitometría</option>
                                    <option value="Ecografía">Ecografía</option>
                                    <option value="Emergencia">Emergencia</option>
                                    <option value="Endoscopia">Endoscopia</option>
                                    <option value="Enfermería 2">Enfermería 2</option>
                                    <option value="Enfermería 3">Enfermería 3</option>
                                    <option value="Enfermería 4">Enfermería 4</option>
                                    <option value="Estación de Generadores y Transformadores">Estación de Generadores y Transformadores</option>
                                    <option value="Esterilización">Esterilización</option>
                                    <option value="Hemodinamia">Hemodinamia</option>
                                    <option value="Hospital del Día">Hospital del Día</option>
                                    <option value="Imágenes">Imágenes</option>
                                    <option value="Laboratorio Clínico">Laboratorio Clínico</option>
                                    <option value="Imágenes">Laboratorio Covid</option>
                                    <option value="Imágenes">Lavado Instrumental</option>
                                    <option value="Imágenes">Mamografía</option>
                                    <option value="Imágenes">Neurosi</option>
                                    <option value="Imágenes">Oftalmología</option>
                                    <option value="Imágenes">Quirófano</option>
                                    <option value="Imágenes">Rayos X</option>
                                    <option value="Imágenes">Recuperación</option>
                                    <option value="Imágenes">Resonancia Magnética</option>
                                    <option value="Imágenes">Tomografía</option>
                                    <option value="Imágenes">UCI Adultos</option>
                                    <option value="Imágenes">UCI Covid</option>
                                    <option value="Imágenes">UCI Neonatal</option>
                                    <option value="Imágenes">UCI Pedíatrica</option>
                                </select>
                            </Grid>
                            <Grid item xs={6}>
                                <label>
                                    Marca:
                                </label>

                                <input
                                    className="form-control"
                                    name="marca"
                                    type="text"
                                    onChange={handleChange}
                                    value={form.marca}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <label>
                                    Modelo:
                                </label>

                                <input
                                    className="form-control"
                                    name="modelo"
                                    type="text"
                                    onChange={handleChange}
                                    value={form.modelo}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <label>
                                    Serie:
                                </label>

                                <input
                                    className="form-control"
                                    name="serie"
                                    type="text"
                                    onChange={handleChange}
                                    value={form.serie}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <label>
                                    Propietario:
                                </label>

                                <input
                                    className="form-control"
                                    name="propietario"
                                    type="text"
                                    onChange={handleChange}
                                    value={form.propietario}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <label>
                                    Seguro:
                                </label>
                                <select onChange={selecSeguro} className="form-select" aria-label="Default select seguro">
                                    <option selected>Seguro:</option>
                                    <option value="Asegurado" >Asegurado</option>
                                    <option value="Sin seguro" >Sin seguro</option>
                                </select>
                            </Grid>
                            {/* <Grid item xs={12}>
                                <label>
                                    Accesorios:
                                </label>
                                <input
                                    className="form-control"
                                    name="accesorios"
                                    type="text"
                                    onChange={handleChange}
                                    value={form.accesorios}
                                />
                            </Grid> */}
                        </Grid>
                    </FormGroup>
                </ModalBody>

                <ModalFooter>
                    <Button
                        variant="outlined"
                        className="boton-modal2"
                        onClick={() => editar(form)}
                    >
                        Editar
                    </Button>

                    <Button
                        variant="contained"
                        className="boton-modal"
                        onClick={() => cerrarModalActualizar()}
                    >
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal className="{width:0px}" isOpen={modalInsertar}>
                <ModalHeader>
                    <div><h3>Insertar</h3></div>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField color={codigo !== '' ? "gris" : "oficial"} fullWidth label="Código Equipo" focused type="int" onChange={(e) => setCodigo(e.target.value)} />
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    options={tipoe}
                                    onChange={(event, newvalue) => setTipo(newvalue.label)}
                                    renderInput={(params) => <TextField {...params} fullWidth label="Tipo de equipo" color={tipo !== '' ? "gris" : "oficial"} type="text" focused />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    options={equipos}
                                    onChange={(event, newvalue) => setEquipo(newvalue)}
                                    renderInput={(params) => <TextField {...params} fullWidth label="Equipo" color={equipo !== '' ? "gris" : "oficial"} type="text" focused />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    options={departamentos}
                                    onChange={(event, newvalue) => setArea(newvalue)}
                                    renderInput={(params) => <TextField {...params} fullWidth label="Departamento solicitante" color={area !== '' ? "gris" : "oficial"} type="text" focused />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField color={marca !== '' ? "gris" : "oficial"} fullWidth label="Marca" focused type="int" onChange={(e) => setMarca(e.target.value)} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField color={modelo !== '' ? "gris" : "oficial"} fullWidth label="Modelo" focused type="int" onChange={(e) => setModelo(e.target.value)} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField color={serie !== '' ? "gris" : "oficial"} fullWidth label="Serie" focused type="int" onChange={(e) => setSerie(e.target.value)} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField color={propietario !== '' ? "gris" : "oficial"} fullWidth label="Propietario" focused type="int" onChange={(e) => setPropietario(e.target.value)} />
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    options={tseguro}
                                    onChange={(event, newvalue) => setSeguro(newvalue.label)}
                                    renderInput={(params) => <TextField {...params} fullWidth label="Seguro" color={seguro !== '' ? "gris" : "oficial"} type="text" focused />}
                                />
                            </Grid>

                            {/* <Grid item xs={12}>
                                <TextField color={accesorios !== '' ? "gris" : "oficial"} fullWidth label="Accesorios" focused type="int" onChange={(e) => setAccesorios(e.target.value)} />
                            </Grid> */}

                            <Grid item xs={12}>
                                <b>Importancia:    </b>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="Normal"
                                    onChange={(event, newValue) => { setEimportancia(newValue) }}
                                    value={eimportancia}
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value="Prioritario" control={<Radio />} label="Prioritario" />
                                    <FormControlLabel value="Normal" control={<Radio />} label="Normal" />
                                </RadioGroup>
                            </Grid>
                       
                            <Grid item xs={12}>
                                <div className="mb-3">
                                    <label className="form-label">Cargar Fotografía</label>
                                    <input className="form-control" onChange={buscarImagen} type="file" id="formFile" />
                                </div>
                            </Grid>
                        </Grid>
                    </FormGroup>
                    {/* aqui termina el grid */}


                </ModalBody>

                <ModalFooter>
                    <Button
                        variant="outlined"
                        className="boton-modal2"
                        onClick={() => insertar()}
                    >
                        Insertar
                    </Button>
                    <Button
                        variant="contained"
                        className="boton-modal"
                        onClick={() => cerrarModalInsertar()}
                    >
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>


            <Modal isOpen={modalAccesorios}>
                <ModalHeader>
                    <div><h3>Accesorios del Equipo</h3></div>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>

                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    options={acces}
                                    getOptionLabel={(option) => option.accesorioing}
                                    onChange={(event, newValue) => { codigocompleto(newValue) }}
                                    renderInput={(params) => <TextField {...params} focused fullWidth label="Accesorio 1" type="text" />}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label="Marca"
                                    focused type="int"
                                    value={acc1.codigoa}
                                />
                            </Grid>



                            <Grid item xs={6}>

                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    options={acces}
                                    getOptionLabel={(option) => option.accesorioing}
                                    onChange={(event, newValue) => { accesorio2(newValue) }}
                                    renderInput={(params) => <TextField {...params} focused fullWidth label="Accesorio 2" type="text" />}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label="Marca"
                                    focused type="int"
                                    value={acc2.codigoa}
                                />
                            </Grid>



                            <Grid item xs={6}>

                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    options={acces}
                                    getOptionLabel={(option) => option.accesorioing}
                                    onChange={(event, newValue) => { accesorio3(newValue) }}
                                    renderInput={(params) => <TextField {...params} focused fullWidth label="Accesorio 3" type="text" />}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label="Marca"
                                    focused type="int"
                                    value={acc3.codigoa}
                                />
                            </Grid>


                            <Grid item xs={6}>

                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    options={acces}
                                    getOptionLabel={(option) => option.accesorioing}
                                    onChange={(event, newValue) => { accesorio4(newValue) }}
                                    renderInput={(params) => <TextField {...params} focused fullWidth label="Accesorio 4" type="text" />}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label="Marca"
                                    focused type="int"
                                    value={acc4.codigoa}
                                />
                            </Grid>


                            <Grid item xs={6}>

                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    options={acces}
                                    getOptionLabel={(option) => option.accesorioing}
                                    onChange={(event, newValue) => { accesorio5(newValue) }}
                                    renderInput={(params) => <TextField {...params} focused fullWidth label="Accesorio 5" type="text" />}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label="Marca"
                                    focused type="int"
                                    value={acc5.codigoa}
                                />
                            </Grid>




                        </Grid>
                    </FormGroup>
                </ModalBody>

                <ModalFooter>
                    <Button
                        variant="outlined"
                        className="boton-modal2"
                        onClick={() => agregaracc(form)}
                    >
                        Agregar
                    </Button>

                    <Button
                        variant="contained"
                        className="boton-modal"
                        onClick={() => cerrarModalAccesorios()}
                    >
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>

        </>
    );

}

const tipoe = [
    { label: 'Médico' },
    { label: 'Industrial' },
]

const tseguro = [
    { label: 'Asegurado' },
    { label: 'Sin seguro' },
]
