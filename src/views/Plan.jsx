import React, { useEffect, useState, useRef } from "react";
import { jsPDF } from "jspdf";
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import Swal from 'sweetalert2';
import Grid from "@mui/material/Grid";
import { v4 as uuidv4, v4 } from 'uuid';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { db, storage } from "../firebase/firebase-config";
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import * as XLSX from 'xlsx';
import ClearIcon from '@mui/icons-material/Clear';
import '../css/Plan.css'
import { collection, setDoc, query, doc, deleteDoc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import {
    Table,
    Container,
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    ModalFooter,
} from "reactstrap";
import Stack from '@mui/material/Stack';

import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// configuracion de los reloges
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import DownloadIcon from '@mui/icons-material/Download';


export default function Plan() {

    const [modalEditar, setModalEditar] = useState(false);
    const [equipos, setEquipos] = useState([]);
    const [modalInsertar, setModalinsertar] = useState(false);
    const [modalArchivo, setModalarchivo] = useState(false);
    const [equipo, setEquipo] = useState({

    });
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState("");
    const [currentform, setCurrentform] = useState({});
    //variables de mantenimiento
    const [time1, setTime1] = useState(new Date());
    const [finicio, setFinicio] = useState();
    const [ftermina, setFtermina] = useState();
    const periodicidad = ['mensual', 'trimestral', '4 meses', '6 meses', 'anual']
    const [empresas, setEmpresas] = useState([]);
    const [validados, setValidados] = useState("");
    const [deshabilitar,setDeshabilitar] = useState(false);
    const [currentPlan ,setCurrentPlan] = useState({})
    const [eventos, setEventos] = useState([{
        start: '',
        end: '',
        title: '',
        id: '',
        verificacion: '',
    }]);
    // variables para editar la fecha
    const [currentMan, setCurrentMan] = useState({});
    const [equipoEmpresa, setEquipoEmpresa] = useState('');
    const [equipoPeriodicidad, setEquipoPeriodicidad] = useState('');
    const [nombresEquipo, setNombresEquipo] = useState([]);
    const [nombresActivos, setNombresActivos] = useState([]);
    const aux_equipos = useRef([])
    const codigo_seleccionado = useRef("")
    const [codigo,setCodigo] = useState("")
    const [codigos, setCodigos] = useState([]);
    const [crearplan, setCrearplan] = useState(true);
    const [reset, setReset] = useState(false);
    const [nombre, setNombre] = useState("");
    const SelectFecha1 = (newValue) => {
        const dateStart = new Date(newValue)
        console.log(dateStart);
        setTime1(newValue);
    };


    // Funciones modal Editar
    const abrirModalEditar = (data) => {
        setModalEditar(true);
        setCurrentMan(data)
        setFinicio(new Date(data.start))
        setFtermina(new Date(data.end))
    }
    const cerrrarModalEditar = () => {
        setModalEditar(false);
        limpiarCampos()
    }
    const SelectFechaInicio = (newValue) => {
        setFinicio(newValue);
    };

    const SelectFechaFinal = (newValue) => {
        setFtermina(newValue);
    };

    function actualizarMantenimiento() {
        let temp = aux_equipos.current.filter(item=> currentMan.id_equipo === item.id)[0]
        let aux3 = temp.mantenimientos
        var mantenimientoActualizado = aux3.map(item2 => {
            if (item2.id === currentMan.id) {
                item2.start = finicio.toLocaleString()
                item2.end = ftermina.toLocaleString()
            }
            return (item2)
        })
        console.log('mantenimientos actualizados', temp)
        if (finicio.getTime() < ftermina.getTime()) {

            console.log('se puede actualizar')
            Swal.fire({
                title: '¿Deseas Continuar?',
                // text: "¡Se eliminará el reporte generado anteriormente!",
                text: "¡Se cambiara la fecha de Mantenimiento!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, actualizar!'
            }).then((result) => {
                if (result.isConfirmed) {

                    const ref = doc(db, "ingreso", `${currentMan.id}`);
                    updateDoc(ref, {
                        mantenimientos: mantenimientoActualizado
                    })

                    Swal.fire(
                        "¡Dato Guardado!",
                        '',
                        'success'
                    )
                    setModalEditar(false)

                } else {
                    setModalEditar(false)
                }

            })

        } else {
            console.log('no se puede actualizar')
            setModalEditar(false)
        }

        //setModalEditar(false);
    }
    const eliminarMantenimiento = (_plan) => {
        let aux3 = eventos
        var temp2 = aux3.filter(item => item.id !== _plan.id)
        Swal.fire({
            title: '¿Deseas Continuar?',
            text: "¡Se eliminara el mantenimiento!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, Eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                setEventos(temp2);
                const ref = doc(db, "ingreso", `${_plan.id_equipo}`);
                updateDoc(ref, {
                    mantenimientos: temp2
                })
            }
        })
    }
    const handleVerificacion = (event, param) => {
        Swal.fire({
            title: '¿Deseas Continuar?',
            text: "¡Se verificará el mantenimiento!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, actualizar!'
        }).then((result) => {
            if (result.isConfirmed) {
                let flag = false
                let event_data = eventos.map(item => {
                    if (item.id === param.id) {
                        item.verificacion = !event.target.checked
                        console.log(event.target.checked)
                    }
                    return item
                })
                console.log(event_data);
                setEventos(event_data)
                const ref = doc(db, "ingreso", `${param.id_equipo}`);
                updateDoc(ref, {
                    mantenimientos: event_data
                })
                for (let i = 0; i < event_data.length; i++) {
                    console.log(event_data.length)
                    if (event_data[i].verificacion === true && i === event_data.length - 1) {
                        flag = true
                    }
                }
                if (flag) {
                    Swal.fire({
                        title: '¿Quiere Agregar Mas mantenimientos?',
                        text: "¡Se ha completado el plan de mantenimiento!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, actualizar!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            let period = event_data[event_data.length - 1]

                            console.log(period.periodicidad)
                            crearPlan2(time1, period.periodicidad,param)
                            Swal.fire(
                                "Mantenimientos Agregados!",
                                '',
                                'success'
                            )
                        }
                    })
                } else {
                    Swal.fire(
                        "¡Dato Actualizado!",
                        '',
                        'success'
                    )
                }
            }
        })
    };

    const crearPlanMantenimiento = (_date, _periodicidad) => {
        const añoSelec = _date.getFullYear()
        const diaselec = _date.getDate()
        const mesSelect = _date.getMonth()
        const equipo_seleccionado = aux_equipos.current.filter(filterbyNombre).filter(filterbycodigo)[0]
        console.log(equipo_seleccionado)
        const meses = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        const options = {
            month: "2-digit",
        }
        var mantenimientos = []
        var mesesPeriodo = [mesSelect]
        var dia = diaselec
        var newAño = añoSelec
        if (_periodicidad === "trimestral") {
            for (var i = mesSelect + 3; i < 24; i += 3) {
                if (meses[i] === mesSelect) {
                    mesesPeriodo.push(meses[i]);
                    break
                } else {
                    mesesPeriodo.push(meses[i]);
                }
            }
            console.log(mesesPeriodo)
            const dimension = mesesPeriodo.length
            for (i = 0; i < dimension; i++) {
                if (mesesPeriodo[i] <= mesesPeriodo[i - 1]) {
                    newAño = newAño + 1
                }
                if (dia >= 28) {
                    dia = dia - 3;
                }
                const start = new Date(newAño, mesesPeriodo[i], dia, 14, 0, 0).toLocaleString()
                const end = new Date(newAño, mesesPeriodo[i], dia, 15, 0, 0).toLocaleString()
                const mant = {
                    start: start,
                    end: end,
                    periodicidad: "trimestral",
                    codigo_equipo: codigo,
                    id_equipo: equipo_seleccionado.id,
                    verificacion: false,
                    title: nombre,
                    id: v4(),

                }
                mantenimientos.push(mant);
                console.log(mantenimientos);
            }
        }
        else if (_periodicidad === "mensual") {

            for (i = mesSelect + 1; i < 24; i++) {
                if (meses[i] === mesSelect) {
                    console.log(i)
                    mesesPeriodo.push(meses[i]);
                    break
                } else {
                    mesesPeriodo.push(meses[i]);
                }
            }
            const dimension = mesesPeriodo.length
            console.log("dimension", mesesPeriodo)
            console.log("mes select", mesSelect)
            for (i = 0; i < dimension; i++) {
                if (i > 0) {
                    if (mesesPeriodo[i] < mesesPeriodo[i - 1]) {
                        newAño = newAño + 1
                    }
                }
                if (dia >= 28) {
                    dia = dia - 3;
                }
                const start = new Date(newAño, mesesPeriodo[i], dia, 14, 0, 0).toLocaleString(options)
                const end = new Date(newAño, mesesPeriodo[i], dia, 15, 0, 0).toLocaleString(options)
                const mant = {
                    start: start,
                    end: end,
                    periodicidad: "mensual",
                    codigo_equipo: codigo,
                    id_equipo: equipo_seleccionado.id,
                    title: nombre,
                    verificacion: false,
                    id: v4(),


                }
                mantenimientos.push(mant);
            }
        } else if (_periodicidad === "4 meses") {
            for (i = mesSelect + 4; i < 24; i += 4) {
                if (meses[i] === mesSelect) {
                    mesesPeriodo.push(meses[i]);
                    break
                } else {
                    mesesPeriodo.push(meses[i]);
                }
            }
            const dimension = mesesPeriodo.length
            for (i = 0; i < dimension; i++) {
                if (mesesPeriodo[i] <= mesesPeriodo[i - 1]) {
                    newAño = newAño + 1
                }
                if (dia >= 28) {
                    dia = dia - 3;
                }
                const start = new Date(newAño, mesesPeriodo[i], dia, 14, 0, 0).toLocaleString()
                const end = new Date(newAño, mesesPeriodo[i], dia, 15, 0, 0).toLocaleString()
                const mant = {
                    start: start,
                    end: end,
                    title: nombre,
                    periodicidad: "4 meses",
                    codigo_equipo: codigo,
                    id_equipo: equipo_seleccionado.id,
                    verificacion: false,
                    id: v4(),
                }
                mantenimientos.push(mant);
                console.log(mantenimientos);
            }
        }
        else if (_periodicidad === "6 meses") {
            for (i = mesSelect + 6; i < 24; i += 6) {
                if (meses[i] === mesSelect) {
                    mesesPeriodo.push(meses[i]);
                    break
                } else {
                    mesesPeriodo.push(meses[i]);
                }
            }
            const dimension = mesesPeriodo.length
            console.log(mesesPeriodo)
            for (i = 0; i < dimension; i++) {
                if (mesesPeriodo[i] <= mesesPeriodo[i - 1]) {
                    newAño = newAño + 1
                }
                if (dia >= 28) {
                    dia = dia - 3;
                }
                //const fecha1 = `${dia}/${mesesPeriodo[i]}/${newAño}`; 

                const start = new Date(newAño, mesesPeriodo[i], dia, 14, 0, 0).toLocaleString()
                const end = new Date(newAño, mesesPeriodo[i], dia, 15, 0, 0).toLocaleString()
                const mant = {
                    start: start,
                    end: end,
                    periodicidad: "6 meses",
                    codigo_equipo: codigo,
                    id_equipo: equipo_seleccionado.id,
                    title: nombre,
                    verificacion: false,
                    id: v4(),

                }

                mantenimientos.push(mant);

            }
        }
        else {
            const start = new Date(añoSelec, mesSelect, diaselec, 14, 0, 0).toLocaleString()
            const end = new Date(añoSelec, mesSelect, diaselec, 15, 0, 0).toLocaleString()
            const mant = {
                start: start,
                end: end,
                title: nombre,
                periodicidad: "anual",
                codigo_equipo: codigo,
                id_equipo: equipo_seleccionado.id,
                verificacion: false,
                id: v4(),


            }
            const start2 = new Date(añoSelec + 1, mesSelect, diaselec, 14, 0, 0).toLocaleString()
            const end2 = new Date(añoSelec + 1, mesSelect, diaselec, 15, 0, 0).toLocaleString()
            const mant2 = {
                start: start2,
                end: end2,
                periodicidad: "anual",
                codigo_equipo: codigo,
                id_equipo: equipo_seleccionado.id,
                title: nombre,
                verificacion: false,
                id: v4(),


            }
            mantenimientos.push(mant)
            mantenimientos.push(mant2)
            console.log(mantenimientos);
        }

        const washingtonRef = doc(db, "ingreso", `${equipo_seleccionado.id}`);
        console.log(mantenimientos);
        updateDoc(washingtonRef, {
            mantenimientos: mantenimientos,
        });
        setModalinsertar(false);
        Swal.fire({
            icon: 'success',
            title: '¡Plan Agregado!',
            showConfirmButton: false,
            timer: 1500
        })

    }
    const crearPlan2 = (_date, _periodicidad,_plan) => {
        const añoSelec = _date.getFullYear()
        const diaselec = _date.getDate()
        const mesSelect = _date.getMonth()
        const codigo_plan = _plan.codigo_equipo
        const nombre_equipo = _plan.title
        const id_eq = _plan.id_equipo
        const meses = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        const options = {
            month: "2-digit",
        }
        var mantenimientos = []
        var mesesPeriodo = [mesSelect]
        var dia = diaselec
        var newAño = añoSelec
        if (_periodicidad === "trimestral") {
            for (var i = mesSelect + 3; i < 24; i += 3) {
                if (meses[i] === mesSelect) {
                    mesesPeriodo.push(meses[i]);
                    break
                } else {
                    mesesPeriodo.push(meses[i]);
                }
            }
            console.log(mesesPeriodo)
            const dimension = mesesPeriodo.length
            for (i = 0; i < dimension; i++) {
                if (mesesPeriodo[i] <= mesesPeriodo[i - 1]) {
                    newAño = newAño + 1
                }
                if (dia >= 28) {
                    dia = dia - 3;
                }
                const start = new Date(newAño, mesesPeriodo[i], dia, 14, 0, 0).toLocaleString()
                const end = new Date(newAño, mesesPeriodo[i], dia, 15, 0, 0).toLocaleString()
                const mant = {
                    start: start,
                    end: end,
                    periodicidad: "trimestral",
                    codigo_equipo: codigo_plan,
                    id_equipo: id_eq,
                    verificacion: false,
                    title: nombre_equipo,
                    id: v4(),
                }
                mantenimientos.push(mant);
                console.log(mantenimientos);
            }
        }
        else if (_periodicidad === "mensual") {

            for (i = mesSelect + 1; i < 24; i++) {
                if (meses[i] === mesSelect) {
                    console.log(i)
                    mesesPeriodo.push(meses[i]);
                    break
                } else {
                    mesesPeriodo.push(meses[i]);
                }
            }
            const dimension = mesesPeriodo.length
            console.log("dimension", mesesPeriodo)
            console.log("mes select", mesSelect)
            for (i = 0; i < dimension; i++) {
                if (i > 0) {
                    if (mesesPeriodo[i] < mesesPeriodo[i - 1]) {
                        newAño = newAño + 1
                    }
                }
                if (dia >= 28) {
                    dia = dia - 3;
                }
                const start = new Date(newAño, mesesPeriodo[i], dia, 14, 0, 0).toLocaleString(options)
                const end = new Date(newAño, mesesPeriodo[i], dia, 15, 0, 0).toLocaleString(options)
                const mant = {
                    start: start,
                    end: end,
                    periodicidad: "mensual",
                    codigo_equipo: codigo_plan,
                    id_equipo: id_eq,
                    title: nombre_equipo,
                    verificacion: false,
                    id: v4(),
                }
                mantenimientos.push(mant);
            }
        } else if (_periodicidad === "4 meses") {
            for (i = mesSelect + 4; i < 24; i += 4) {
                if (meses[i] === mesSelect) {
                    mesesPeriodo.push(meses[i]);
                    break
                } else {
                    mesesPeriodo.push(meses[i]);
                }
            }
            const dimension = mesesPeriodo.length
            for (i = 0; i < dimension; i++) {
                if (mesesPeriodo[i] <= mesesPeriodo[i - 1]) {
                    newAño = newAño + 1
                }
                if (dia >= 28) {
                    dia = dia - 3;
                }
                const start = new Date(newAño, mesesPeriodo[i], dia, 14, 0, 0).toLocaleString()
                const end = new Date(newAño, mesesPeriodo[i], dia, 15, 0, 0).toLocaleString()
                const mant = {
                    start: start,
                    end: end,
                    title: nombre_equipo,
                    periodicidad: "4 meses",
                    codigo_equipo: codigo_plan,
                    id_equipo: id_eq,
                    verificacion: false,
                    id: v4(),
                }
                mantenimientos.push(mant);
                console.log(mantenimientos);
            }
        }
        else if (_periodicidad === "6 meses") {
            for (i = mesSelect + 6; i < 24; i += 6) {
                if (meses[i] === mesSelect) {
                    mesesPeriodo.push(meses[i]);
                    break
                } else {
                    mesesPeriodo.push(meses[i]);
                }
            }
            const dimension = mesesPeriodo.length
            console.log(mesesPeriodo)
            for (i = 0; i < dimension; i++) {
                if (mesesPeriodo[i] <= mesesPeriodo[i - 1]) {
                    newAño = newAño + 1
                }
                if (dia >= 28) {
                    dia = dia - 3;
                }
                //const fecha1 = `${dia}/${mesesPeriodo[i]}/${newAño}`; 

                const start = new Date(newAño, mesesPeriodo[i], dia, 14, 0, 0).toLocaleString()
                const end = new Date(newAño, mesesPeriodo[i], dia, 15, 0, 0).toLocaleString()
                const mant = {
                    start: start,
                    end: end,
                    periodicidad: "6 meses",
                    codigo_equipo: codigo_plan,
                    id_equipo: id_eq,
                    title: nombre_equipo,
                    verificacion: false,
                    id: v4(),

                }

                mantenimientos.push(mant);

            }
        }
        else {
            const start = new Date(añoSelec, mesSelect, diaselec, 14, 0, 0).toLocaleString()
            const end = new Date(añoSelec, mesSelect, diaselec, 15, 0, 0).toLocaleString()
            const mant = {
                start: start,
                end: end,
                title: nombre_equipo,
                periodicidad: "anual",
                codigo_equipo: codigo_plan,
                    id_equipo: id_eq,
                verificacion: false,
                id: v4(),
            }
            const start2 = new Date(añoSelec + 1, mesSelect, diaselec, 14, 0, 0).toLocaleString()
            const end2 = new Date(añoSelec + 1, mesSelect, diaselec, 15, 0, 0).toLocaleString()
            const mant2 = {
                start: start2,
                end: end2,
                periodicidad: "anual",
                codigo_equipo: codigo_plan,
                    id_equipo: id_eq,
                    title: nombre_equipo,
                verificacion: false,
                id: v4(),


            }
            mantenimientos.push(mant)
            mantenimientos.push(mant2)
            console.log(mantenimientos);
        }

        const washingtonRef = doc(db, "ingreso", `${id_eq}`);
        let man2 = eventos
        console.log(man2)
        let man3 = man2.concat(mantenimientos)
        console.log(mantenimientos);
        
        updateDoc(washingtonRef, {
            mantenimientos: man3,
        });
        setEventos(man3)
        setModalinsertar(false);


    }
    //limpiar campos 
    const limpiarCampos = () => {
        setNombre("")
        setCodigos([])
        setValidados("Todos")
        setCodigo("")
        codigo_seleccionado.current = ""
       setEquipo(null)
    }
    const getData = async () => {
        // const reference = query(collection(db, "planes"));
        // onSnapshot(reference, (querySnapshot) => {
        //     console.log(querySnapshot.docs)
        //     setData(
        //         querySnapshot.docs.map((doc) => ({ ...doc.data() }))
        //     );
        // });
        const reference2 = query(collection(db, "ingreso"));
        onSnapshot(reference2, (querySnapshot) => {

            let dataR = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
            aux_equipos.current = dataR.filter(filterbysituacion);
            setEquipos(dataR);
            setNombresActivos(equipos.filter(filterbysituacion))

        });
        const reference3 = query(collection(db, "empresas"));
        onSnapshot(reference3, (querySnapshot) => {
            setEmpresas(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
        });
        const docRef = doc(db, "informacion", "parametros");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setNombresEquipo(docSnap.data().equipos);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    };


 

    const mostrarModalInsertar = () => {
        setModalinsertar(true);
    };

    const cerrarModalInsertar = () => {
        setModalinsertar(false);
        limpiarCampos();
    };



    const cerrarModalArchivo = () => {
        setModalarchivo(false);
    };


    const filterbysituacion = (_equipo) => {
        if (_equipo.situacion === "Activo") {
            return _equipo
        } else {
            return null;
        }
    }
    const filterbyNombre = (_equipo) => {
        if (nombre !== "") {
            if (_equipo.equipo === nombre) {
                return _equipo
            }else{
                return null;
            }
        }else{
            setDeshabilitar(true)
            return _equipo
        }
    }

const filterbycodigo = (_equipo) => {
    if (codigo !== "") {
        setDeshabilitar(false)
    if (_equipo.codigo === codigo) {
        return _equipo
    }else {
        return null;
    }
    }else{
        return _equipo
    }
}
const filterByValidados = (_item) => {
    if (validados === 'Realizados') {
        if (_item.verificacion === true) {
            return _item
        } else {
            return null
        }
    } else if (validados === "Pendientes") {
        if (_item.verificacion === false) {
            return _item
        } else {
            return null
        }
    } else {
        return _item
    }
}
const buscarMantenimiento = () => {
    let newArray = []
    let aux_1 = JSON.parse(JSON.stringify(aux_equipos.current))
    let aux = aux_1.filter(filterbyNombre).filter(filterbycodigo)
    console.log(aux)

        for (let i = 0; i < aux.length; i++) {
            let aux1 = aux[i].mantenimientos
            for (let j = 0; j < aux1.length; j++) {
                newArray.push(aux1[j])
            }
        }
        let filter = newArray.filter(filterByValidados)
        console.log(filter)
        setEventos(filter);
        limpiarCampos();
        setReset(!reset);

    //console.log(equipos)
   

}

const nombreSeleccionado = (_nombre) => {
    setNombre(_nombre)
    const codigos_obtenidos = equipos.filter(item => item.equipo === _nombre)
    const codigos_finales = codigos_obtenidos.filter(item => item.situacion === "Activo").map(item => (item.codigo))
    setCodigos(codigos_finales);
}
const equipoSeleccionado = (dato) => {
    console.log("equipo", dato);
    setEquipo(dato);
    setCrearplan(false);
}
const descargarPDF = () => {
    var crono = []
    const doc = new jsPDF({
        orientation: "landscape"
    });
    doc.text("Hospital del Río ", 130, 10);
    doc.text("Cronograma de Mantenimiento ", 110, 20);
    doc.setFontSize(9)
    equipos.map((item) => {
        item.mantenimientos.forEach((item) => {
            crono.push(item)
        }
        )
    })
    let aux1 = crono.map(item => item.title)

    let result = aux1.filter((item, index) => {
        return aux1.indexOf(item) === index;
    })
    let arreglosfinales = []
    for (let i = 0; i < result.length; i++) {
        let aux3 = crono.filter(item => {
            if (item.title === result[i]) {
                return item.start
            } else {
                return null
            }
        })
        let aux4 = aux3.map(item => item.start)
        let newObjectM = {
            name: result[i],
            mtn: aux4
        }
        arreglosfinales.push(newObjectM)
    }
    console.log(arreglosfinales)
    let aux = 30
    for (let i = 0; i < arreglosfinales.length; i++) {
        doc.text(`${arreglosfinales[i].name}`, 20, aux)
        let aux5 = 20
        for (let j = 0; j < arreglosfinales[i].mtn.length; j++) {
            doc.text(`${arreglosfinales[i].mtn[j]}`, aux5, aux + 10)
            aux5 = aux5 + 40
            if (aux5 >= 280) {
                aux = aux + 10
                aux5 = 20
            }
        }
        aux = aux + 30

    }

    doc.save("cronograma_mantenimiento.pdf");
}
const descargarExcel = () => {
    var crono = []
    equipos.map((item) => {
        item.mantenimientos.forEach((item) => {
            crono.push(item)
        }
        )
    })
    console.log(crono)
    const myHeader = ["title", "codigo", "start", "end"];
    const worksheet = XLSX.utils.json_to_sheet(crono, { header: myHeader });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(worksheet, [["Equipo", "Código", "Inicio del Mantenimiento", "Final del Mantenimiento"]], { origin: "A1" });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");
    worksheet["!cols"] = [{ wch: 50 }, { wch: 30 }, { wch: 30 }];
    XLSX.writeFile(workbook, "MantenimientosHospiRio.xlsx", { compression: true });

}



useEffect(() => {
    getData();
}, [])
return (
    <>
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <Autocomplete
                        disableClearable
                        id="combo-box-demo"
                        key={reset}
                        options={nombresEquipo}
                        getOptionLabel={(option) => {
                            return option.nombre;
                        }}
                        onChange={(event, newValue) => { nombreSeleccionado(newValue.nombre) }}
                        renderInput={(params) => <TextField {...params} focused fullWidth label="EQUIPO" type="text" />}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Autocomplete
                        disableClearable
                        key={reset}
                        id="combo-box-demo"
                        options={codigos}
                 
                        onChange={(event, newValue) => { setCodigo(newValue) }}
                        renderInput={(params) => <TextField {...params} focused fullWidth label="CÓDIGO" type="text" />}
                    />
                </Grid>

                <Grid item xs={2}>
                    <Autocomplete
                        key={reset}
                        disableClearable
                        id="combo-box-demo"
                        options={validarOptions}
                        onChange={(event, newValue) => { setValidados(newValue) }}
                        renderInput={(params) => <TextField {...params} focused fullWidth label="MANTENIMIENTO" type="text" />}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button variant="outlined" onClick={buscarMantenimiento} fullWidth size="large" className="boton-plan" startIcon={<SearchIcon />}>
                        Buscar
                    </Button>
                </Grid>
                <Grid item xs={2}>
                    <Button variant="outlined" size="large" className="boton-plan" fullWidth startIcon={<AddIcon />} onClick={() => mostrarModalInsertar()} >
                        Crear Plan
                    </Button>
                </Grid>

                <Grid item xs={1}>
                    <Button variant="outlined" size="large" className="boton-plan" fullWidth startIcon={<DownloadIcon />} onClick={descargarPDF} >
                        PDF
                    </Button>
                </Grid>
                <Grid item xs={1}>
                    <Button variant="outlined" size="large" className="boton-plan" fullWidth startIcon={<DownloadIcon />} onClick={descargarExcel} >
                        EXCEL
                    </Button>
                </Grid>

            </Grid>
            <br />
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Inicio Mantenimiento</th>
                        <th>Finaliza Mantenimiento</th>
                        <th>Equipo</th>
                        <th>Acciones</th>
                        <th>Validar</th>
                    </tr>
                </thead>

                <tbody>
                    {eventos.map((plan, index) => (
                        <tr key={index} >
                            <td>{index + 1}</td>
                            <td>{plan.start}</td>
                            <td>{plan.end}</td>
                            <td>{plan.title}</td>
                            <td>
                                <Stack direction="row" spacing={2} alignitems="center" justifyContent="center" >
                                    <button className="btn btn-outline-danger" onClick={() => { eliminarMantenimiento(plan) }}>Eliminar</button>
                                    <button className="btn btn-outline-warning" onClick={() => abrirModalEditar(plan)}>Editar</button>
                                </Stack>
                            </td>
                            <td>
                                <Checkbox
                                    disabled={deshabilitar}
                                    checked={plan.verificacion}
                                    onChange={(event) => { handleVerificacion(event, plan) }}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
        <Modal className="{width:0px}" isOpen={modalInsertar}>
            <ModalHeader>
                <div><h3>Crear Plan de Mantenimiento Anual</h3></div>
            </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Grid container spacing={4}>
                    <Grid item xs={12}>
                    <Autocomplete
                        disableClearable
                        id="combo-box-demo"
                        key={reset}
                        options={nombresEquipo}
                        getOptionLabel={(option) => {
                            return option.nombre;
                        }}
                        onChange={(event, newValue) => { nombreSeleccionado(newValue.nombre) }}
                        renderInput={(params) => <TextField {...params} focused fullWidth label="EQUIPO" type="text" />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        disableClearable
                        key={reset}
                        id="combo-box-demo"
                        options={codigos}
                 
                        onChange={(event, newValue) => { setCodigo(newValue) }}
                        renderInput={(params) => <TextField {...params} focused fullWidth label="CÓDIGO" type="text" />}
                    />
                </Grid>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                    label={"Fecha Mantenimiento"}
                                    inputFormat="MM/dd/yyyy"
                                    value={time1}
                                    onChange={SelectFecha1}
                                    renderInput={(params) => <TextField focused fullWidth {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                disableClearable
                                id="combo-box-demo"
                                options={empresas.map(item => item.empresa)}
                                renderInput={(params) => <TextField {...params} fullWidth label="Empresas" type="text" focused />}
                                onChange={(event, newvalue) => setEquipoEmpresa(newvalue)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                disableClearable
                                id="combo-box-demo"
                                options={periodicidad}
                                renderInput={(params) => <TextField {...params} fullWidth label="Periodicidad" type="text" focused />}
                                onChange={(event, newvalue) => setEquipoPeriodicidad(newvalue)}
                            />
                        </Grid>
                    </Grid>
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Button
                            onClick={() => crearPlanMantenimiento(time1, equipoPeriodicidad)}
                            disabled={codigo !== "" ? false:true}
                            variant="outlined"
                            size="large"
                            className="boton-plan"
                            fullWidth startIcon={<AddIcon />}
                        >
                            Crear Plan
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            onClick={() => cerrarModalInsertar()}
                            variant="outlined"
                            size="large"
                            className="boton-plan"
                            fullWidth startIcon={<ClearIcon />}
                        >
                            Cancelar
                        </Button>
                    </Grid>
                </Grid>

            </ModalFooter>
        </Modal>

        <Modal isOpen={modalArchivo}>
            <ModalHeader>
                <div><h1>Información Plan</h1></div>
            </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <label>
                                Empresa:
                            </label>
                            <input
                                className="form-control"
                                readOnly
                                type="text"
                                value={currentform.empresa}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <label>
                                Código Equipo:
                            </label>
                            <input
                                className="form-control"
                                readOnly
                                type="text"
                                value={currentform.cequipo}
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
                                Visualizar Plan
                            </a>
                        </Grid >
                    </Grid>
                </FormGroup>

            </ModalBody>
            <ModalFooter>
                <Button
                    // color="danger"
                    className="editar"
                    onClick={() => cerrarModalArchivo()}
                >
                    Cancelar
                </Button>
            </ModalFooter>
        </Modal>
        <Modal isOpen={modalEditar}>
            <ModalHeader>
                <div><h1>Editar Plan Mantenimiento</h1></div>
                SelectFecha1                </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Grid container spacing={4}>

                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    renderInput={(props) => <TextField fullWidth {...props} />}
                                    label="Fecha Inicial del Mantenimiento"
                                    value={finicio}
                                    onChange={SelectFechaInicio}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>

                                <DateTimePicker
                                    renderInput={(props) => <TextField fullWidth {...props} />}
                                    label="Fecha Final del Mantenimiento"
                                    value={ftermina}
                                    onChange={SelectFechaFinal}
                                />

                            </LocalizationProvider>

                        </Grid>
                    </Grid>
                </FormGroup>

            </ModalBody>
            <ModalFooter>
                <Button
                    color="azul1"
                    variant="contained"
                    onClick={() => cerrrarModalEditar()}
                    sx={{ marginRight: 5 }}
                >
                    Cancelar
                </Button>
                <Button
                    color="warning"
                    variant="contained"
                    onClick={() => actualizarMantenimiento()}
                >
                    Guardar
                </Button>
            </ModalFooter>
        </Modal>
    </>
);
}
const validarOptions = ["Realizados", "Pendientes", "Todos"]

