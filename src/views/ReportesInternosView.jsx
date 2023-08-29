import React, {  useState } from "react";
import { collection,query, doc,getDoc,getDocs,addDoc,setDoc } from "firebase/firestore";
import Paper from '@mui/material/Paper';
import Grid from "@mui/material/Grid";
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { db } from "../firebase/firebase-config";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import FormLabel from '@mui/material/FormLabel';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import InfoIcon from '@mui/icons-material/Info';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import '../css/Tabla.css';
import '../css/Presentacion.css';
import '../css/EncargadoView.css';
import DescriptionIcon from '@mui/icons-material/Description';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { generarPdf } from "../scripts/pdfReporte";
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import ClearIcon from '@mui/icons-material/Clear';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { v4 } from 'uuid';
import {
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    ModalFooter,
} from "reactstrap";
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useRef } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
export default function ReportesInternosView(){

    const [data, setData] = useState([]);
    const [nombresEquipos,setNombresEquipos] = useState([])
    const [modalReportes,setModalReportes] = useState(false);


    const [time1, setTime1] = useState(new Date('Sat Dec 31 2022 24:00:00 GMT-0500'));
    const [time2, setTime2] = useState(new Date('Sun Dec 31 2023 23:59:59 GMT-0500'));
    const reportes =  useRef([])
    const [codigo,setCodigo] = useState("");
    const [currentReporte, setCurrentReporte] = useState({});
    const [modalReportexistente, setModalReportexistente] = useState(false);
    const [reset,setReset] = useState(false);
    const meses = [{nombre:"TODOS",codigo:13},{nombre:"enero",codigo:0},{nombre:"febrero",codigo:1},
                        {nombre:"marzo",codigo:2},{nombre:"abril",codigo:3},{nombre:"mayo",codigo:4},
                        {nombre:"junio",codigo:5},{nombre:"julio",codigo:6},{nombre:"agosto",codigo:7},
                        {nombre:"octubre",codigo:8},{nombre:"septiembre",codigo:9},{nombre:"noviembre",codigo:10},{nombre:"diciembre",codigo:11}]
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
        //variables para reporte
    const [flagTipo,setFlagTipo] = useState(true);
    const [flagDepartamento,setFlagDepartamento] = useState(true);
    const [reporteTipo,setReporteTipo] = useState(1);
    const [tipoEquipo,setTipoEquipo] = useState(1);
    const [departamentos,setDepartamentos] = useState([]);
    const [desactivar,setDesactivar] = useState(true)

    const [mesFiltro,setMesFiltro] = useState();
    const [modalExterno,setModalExterno] = useState(false);
    const [empresas, setEmpresas] = useState([]);
    const [empresa, setEmpresa] = useState('');


    const [mantenimiento, setMantenimiento] = useState("");

    const [codigosEquipos,setCodigosEquipos] = useState([]);
    //parametros del reporte externo
    const [departamento,setDepartamento]  = useState({});
    const equipos = useRef([])
    const equipos_filtered = useRef([]) // aqui se almacenan los equipos que se han filtrado por departamento
    const [currentEquipo,setCurrentEquipo] = useState({});
    const [causas,setCausas] = useState({});
    const [costo,setCosto] = useState("");
    const [horas,setHoras] = useState("");
    const [minutos,setMinutos] = useState("");
    const [estado, setEstado] = useState('');
    const [falla,setFalla] = useState('');
    const [repuestos,setRepuestos] = useState('');
    const [actividades,setActividades] = useState('');
    const [observaciones,setObservaciones] = useState('');
    const [tipo,setTipo] = useState();


   
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };



    const handleTipoEquipo = (event) => {
        setTipoEquipo(parseInt(event.target.value));
    };


    const agruparPorCodigo =(datos)=> {
        const grupos = {};

        datos.forEach(obj => {
            const codigo = obj.codigo;

            if (!grupos[codigo]) {
            grupos[codigo] = [];
            }

            grupos[codigo].push(obj);
        });

        const resultado = [];

        for (const codigo in grupos) {
            resultado.push(grupos[codigo]);
        }

        return resultado;
      }
    const getData = async () => {
            try {
                let internos_aux = []
                let externos_aux = []
                let aux_equipos = []
                let aux_empresas = []
                const q = query(collection(db, "reportesint"));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                internos_aux.push(doc.data())
                });
                const q2 = query(collection(db, "reportesext"));
                const querySnapshot2 = await getDocs(q2);
                querySnapshot2.forEach((doc) => {
                externos_aux.push(doc.data())
                });
                const q3 = query(collection(db, "ingreso"));
                const querySnapshot3 = await getDocs(q3);
                querySnapshot3.forEach((doc) => {
                aux_equipos.push(doc.data())
                });

                const q4 = query(collection(db, "empresas"));
                const querySnapshot4 = await getDocs(q4);
                querySnapshot4.forEach((doc) => {
                aux_empresas.push(doc.data())
                });
                const docRef = doc(db, "informacion", "parametros");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                  setNombresEquipos(docSnap.data().equipos);
                  let aux_departamentos = docSnap.data().departamentos
                  aux_departamentos.unshift({codigo:1000,nombre:"TODOS"})
                  setDepartamentos(aux_departamentos);
                } else {
                  // docSnap.data() will be undefined in this case
                  console.log("No such document!");
                }
                equipos.current = aux_equipos
        
                setEmpresas(aux_empresas)
                setData(internos_aux.concat(externos_aux));
                reportes.current = internos_aux.concat(externos_aux)
                setDesactivar(false);
            } catch (error) {
                setDesactivar(true)
            }
           
           
 
    }

    const crearReporte = async () => {
        let horasAux= parseInt(horas)
        let minAux= parseInt(minutos)
        let tiempom=minAux/60
        let h=(horasAux+tiempom).toFixed(2);
        const new_repport = {
            empresa:empresa,
            actividades:actividades,
            causas:causas ,
            // cedula:currentUser.indentification,
            codigo_equipo:currentEquipo.codigo,
            costo:costo,
            departamento:currentEquipo.departamento.nombre,
            equipo:currentEquipo.equipo.nombre,
            equipo_id: currentEquipo.id,
            estado:estado,
            falla:falla,
            fecha:new Date().toLocaleString("es-EC"),
            horas:parseFloat(h),
            id:v4(),
            importancia:"Normal",
            indice:new Date().getTime(),
            mantenimiento:mantenimiento,
            marca:currentEquipo.marca,
            modelo:currentEquipo.modelo,
            nro_orden:"n/a",
            observaciones:observaciones,
            orden_id: "n/a",
            propietario: currentEquipo.propietario.nombre,
            repuestos:repuestos,
            responsable: currentEquipo.responsable.nombre,
            serie:currentEquipo.serie,
            // tecnico:currentUser.name + ' ' + currentUser.lastname + ' ' + currentUser.secondlastname,
            tiempo:`${horasAux}h${Math.round(minAux)}m`,
            tipo:"Externo",
            tipo_equipo:currentEquipo.tipo_equipo.nombre,
        }
    
        console.log(new_repport)
       try {
        await setDoc(doc(db, "reportesext",new_repport['id']), new_repport);
        setModalExterno(false)
       } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se agrego el reporte a la orden',
        })
       }
    }

    const seleccionarEquipo =(_data)=> {
        let aux = equipos.current.filter(item =>  item.equipo.nombre === _data).map(item => (item.codigo))
        setCodigosEquipos(aux)
    }
 

    const SelectFecha1 = (newValue) => {
        setTime1(newValue);
    };
    const SelectFecha2 = (newValue) => {
        setTime2(newValue);
    };



 
    const mostrarModalInformacion = (dato) => {
        setCurrentReporte(dato);
        setModalReportexistente(true);
    };

    const abrirModalReportes= ()=>{
        setModalReportes(true);
    }


    const downloadPdf = () => {
        var props_pdf = {
            nombre: currentReporte.equipo,
            area_responsable: currentReporte.departamento,
            tipo: currentReporte.tipo_equipo,
            nro_orden: currentReporte.orden_id,
            marca: currentReporte.marca,
            serie: currentReporte.serie,
            modelo: currentReporte.modelo,
            propietario: currentReporte.propietario,
            fecha: currentReporte.fecha,
            tipo_mantenimiento: currentReporte.mantenimiento,
            estado: currentReporte.estado,
            problema: currentReporte.falla,
            actividades: currentReporte.actividades,
            conclusiones: currentReporte.observaciones,
            causas: currentReporte.causas,
            responsable: currentReporte.tecnico,
        }
        generarPdf(props_pdf)

    }




    const filtrarReportes = () =>{
        console.log(codigo)
        let aux_data = JSON.parse(JSON.stringify(reportes.current))
        console.log(aux_data)
        let datos_filtrados = aux_data.filter(filteryByDateReportes).filter(filtrobyCodigo).filter(filteryByTipo)
        setData(datos_filtrados)
        setReset(!reset);
        setCodigo("")
        setTipo("")
       
    }
    const filteryByTipo = (_reporte) => {
       
        if(tipo !== ""){
            if (_reporte.tipo === tipo) {
                return _reporte;
            } 
            else {
                return null;
            }
        }else{
            return _reporte;
        }
    }


    const filteryByDateReportes = (_reporte) => {
        var aux1 = new Date(time1)
        var fechaInicio = aux1.getTime()
        var aux2 = new Date(time2)
        var fechaFinal = aux2.getTime()
        const [fechaPart, horaPart] = _reporte.fecha.split(', ');
        const [dia, mes, año] = fechaPart.split('/');
        const [hora, minutos, segundos] = horaPart.split(':');
        const fecha = new Date(año, mes - 1, dia, hora, minutos, segundos);
        const timestamp = fecha.getTime();
        if (timestamp >= fechaInicio && timestamp <= fechaFinal) {
            return _reporte
        } else {
            return null;
        }
    }

    const filtrobyCodigo =(_reporte)=>{
            if(codigo !== ""){
                if (_reporte.codigo_equipo === codigo) {
                    return _reporte;
                }
                else {
                    return null;
                }
            }else{
                return _reporte;
            }
           
           

    }
    const generarReporte =()=>{
        let aux_datos = JSON.parse(JSON.stringify(reportes.current))
        let datos_modify = agruparPorCodigo(aux_datos)
        console.log(datos_modify[0])
        let datos_formated = datos_modify[0].map(item=>{
            let aux = {
                tipo: "externo",
                codigo:item.codigo_equipo,
                equipo:item.equipo,
                departamento:item.departamento,
                fecha:item.fecha,
                tipo_mantenimiento:item.tipo,
                mantenimiento:item.mantenimiento,
                falla:item.falla,
                actividades:item.actividades
            }
            return aux
    })
        const myHeader = ["tipo", "codigo", "equipo","departamento","fecha","tipo_mantenimiento","mantenimiento","falla","actividades"];
        const worksheet = XLSX.utils.json_to_sheet(datos_formated, { header: myHeader });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.sheet_add_aoa(worksheet, [["TIPO", "COD", "EQUIPO","DEPARTAMENTO","FECHA","TIPO DE MANTENIMIENTO","MANTENIMIENTO","FALLA","ACTIVIDADES"]], { origin: "A1" });
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");
        worksheet["!cols"] = [{ wch: 50 }, { wch: 30 }, { wch: 30 }];
        XLSX.writeFile(workbook, "MantenimientosHospiRio.xlsx", { compression: true });
    }

    const abrirReporteExterno = ()=>{
        setModalExterno(true);
    }

    const handleReporte = (event) => {
        if(parseInt(event.target.value) === 2){
            setFlagTipo(false)
            setFlagDepartamento(false)
            setReporteTipo(2)
        }else if(parseInt(event.target.value) === 1){
            setFlagTipo(true)
            setFlagDepartamento(true)
            setReporteTipo(1)
        }
       
    };


   //FILTROS 


   const filterByDepartamento = (newValue) =>{

    let aux_equipos = JSON.parse(JSON.stringify(equipos.current))
    let filtered = aux_equipos.filter(item=> item.departamento.nombre === newValue.nombre)
    equipos_filtered.current = filtered

   }
    return (
        <>
            <Container>
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography component="div" variant="h3" className="princi3" >
                GESTIÓN DE REPORTES INTERNOS Y EXTERNOS
                </Typography>
                </Grid >
                <Grid item xs={4} >
                <Button  variant="contained" onClick={getData}  endIcon={<CloudDownloadIcon />}>
                        LEER DATOS
                    </Button>
                </Grid >
                 <Grid item xs={4}>
                <Button disabled={desactivar} variant="contained"  onClick={abrirReporteExterno}  endIcon={<DescriptionIcon />}>
                        Crear Reporte externo
                    </Button>
                </Grid >
                <Grid item xs={4}>
                <Button  variant="contained"  disabled={desactivar}  onClick={abrirModalReportes}  endIcon={<DescriptionIcon />}>
                        Generar Informe de los Reportes
                    </Button>
                </Grid >
                <Grid item xs={2}>
                <Autocomplete
                            disableClearable
                            key={reset}
      
                            options={['Externo','Interno']}
                            disabled={desactivar}
                   
                            onChange={(event, newvalue) => setTipo(newvalue)}
                            renderInput={(params) => <TextField {...params} fullWidth label="TIPO"  type="text" />}
                        />
                </Grid >
                <Grid item xs={2}>
                <Autocomplete
                            disableClearable
                            key={reset}
                 
                            options={nombresEquipos}
                            disabled={desactivar}
                            getOptionLabel={(option) => {
                                return option.nombre;
                              }}
                            onChange={(event, newvalue) => seleccionarEquipo(newvalue.nombre)}
                            renderInput={(params) => <TextField {...params} fullWidth label="EQUIPO"  type="text" />}
                        />
                </Grid >
                <Grid item xs={2}>
                <Autocomplete
                            disableClearable
                            key={reset}

                            options={codigosEquipos}
                            disabled={desactivar}
                            onChange={(event, newvalue) => setCodigo(newvalue)}
                            renderInput={(params) => <TextField {...params} fullWidth label="CÓDIGO"  type="text" />}
                        />
                </Grid >
                <Grid item xs={12} sm={12} md={2}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                label={"Desde"}
                                inputFormat="MM/dd/yyyy"
                                disabled={desactivar}
                                value={time1}
                                onChange={SelectFecha1}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                label={"Hasta"}
                                inputFormat="MM/dd/yyyy"
                                value={time2}
                                disabled={desactivar}
                                onChange={SelectFecha2}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                    </Grid>
          
                <Grid item xs={2}>
                <Button  variant="contained" disabled={desactivar} fullWidth sx={{height:"100%"}} onClick={filtrarReportes}  endIcon={<FilterAltIcon />}>
                        Filtrar
                    </Button>
                </Grid >
         
                <Grid item xs={12}>

                 <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 360 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            align={"left"}
                                            style={{ minWidth: 190 }}
                                        >
                                            Fecha
                                        </TableCell>
                                        <TableCell
                                            align={"left"}
                                            style={{ minWidth: 200 }}
                                        >
                                            Duración
                                        </TableCell>
                                        <TableCell
                                            align={"left"}
                                            style={{ minWidth: 200 }}
                                        >
                                            Tipo
                                        </TableCell>
                                        <TableCell
                                            align={"left"}
                                            style={{ minWidth: 100 }}
                                        >
                                            Equipo
                                        </TableCell>
                                        <TableCell
                                            align={"left"}
                                            style={{ minWidth: 100 }}
                                        >
                                            Código
                                        </TableCell>
                                        <TableCell
                                            align={"center"}
                                            style={{ minWidth: 70 }}
                                        >
                                            Información
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.sort((a, b) => (a.indice - b.indice)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                    <TableCell align="left">{row.fecha}</TableCell>
                                                    <TableCell align="left">{row.tiempo}</TableCell>
                                                    <TableCell align="left">{row.tipo}</TableCell>
                                                    <TableCell align="left">{row.equipo}</TableCell>
                                                    <TableCell align="left">{row.codigo_equipo}</TableCell>
                                                    <TableCell align="center">
                                                       <IconButton aria-label="delete" color="gris" onClick={() => mostrarModalInformacion(row)}><InfoIcon /></IconButton>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                 
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                </Paper>
                </Grid >
                </Grid >
            </Container>

            <Modal isOpen={modalReportexistente}>
                <ModalHeader>
                    <div><h4>Visualizar Reporte</h4></div>
                </ModalHeader>
                <ModalBody style={{ height: 500, overflowY: "scroll" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <div className="name-outlined">{currentReporte.id}</div>
                        </Grid >
                        <Grid item xs={6}>
                            <label>
                                <b>Estado:  </b>
                                {currentReporte.estado}
                            </label>
                        </Grid >
                        <Grid item xs={6}>
                            <label>
                                <b>Id Orden:  </b>
                                {currentReporte.orden_id}
                            </label>
                        </Grid >
                        <Grid item xs={6}>
                            <label>
                                <b>Técnico: </b>
                                {currentReporte.tecnico}
                            </label>
                        </Grid >
                        <Grid item xs={6}>
                            <label>
                                <b>Equipo:  </b>
                                {currentReporte.equipo}
                            </label>
                        </Grid >
                        <Grid item xs={6}>
                            <label>
                                <b>Código:</b>
                                {currentReporte.codigo_equipo}
                            </label>
                        </Grid >
                        <Grid item xs={6}>
                            <label>
                                <b>Mantenimiento:  </b>
                                {currentReporte.mantenimiento}
                            </label>

                        </Grid >
                        <Grid item xs={6}>
                            <label>
                                <b>Tiempo:  </b>
                                {currentReporte.tiempo}
                            </label>

                        </Grid >
                        <Grid item xs={6}>
                            <label>
                                <b>Costo:  </b>
                                {currentReporte.costo}
                            </label>

                        </Grid >
                        <Grid item xs={12}>
                            <FormLabel id="demo-radio-buttons-group-label">Falla:</FormLabel>
                            <TextareaAutosize
                                style={{ textTransform: "uppercase" }}
                                aria-label="minimum height"
                                minRows={1}
                                placeholder="Falla"
                                className="text-area-encargado"
                                name="falla"
                                readOnly
                                value={currentReporte.falla} />

                        </Grid >
                        <Grid item xs={12}>
                            <FormLabel id="demo-radio-buttons-group-label">Causas:</FormLabel>
                            <TextareaAutosize
                                style={{ textTransform: "uppercase" }}
                                aria-label="minimum height"
                                minRows={1}
                                placeholder="Causa"
                                className="text-area-encargado"
                                name="causa"
                                readOnly
                                value={currentReporte.causas} />
                        </Grid >
                        <Grid item xs={12}>
                            <FormLabel id="demo-radio-buttons-group-label">Actividades:</FormLabel>
                            <TextareaAutosize
                                style={{ textTransform: "uppercase" }}
                                aria-label="minimum height"
                                minRows={1}
                                placeholder="Actividades"
                                className="text-area-encargado"
                                name="actividadesR"
                                readOnly
                                value={currentReporte.actividades} />
                        </Grid >
                        <Grid item xs={12}>
                            <FormLabel id="demo-radio-buttons-group-label">Repuestos:</FormLabel>
                            <TextareaAutosize
                                style={{ textTransform: "uppercase" }}
                                aria-label="minimum height"
                                minRows={1}
                                placeholder="Repuestos"
                                className="text-area-encargado"
                                name="repuestos"
                                readOnly
                                value={currentReporte.repuestos} />
                        </Grid >

                        <Grid item xs={12}>
                            <FormLabel id="demo-radio-buttons-group-label">Observaciones:</FormLabel>
                            <TextareaAutosize
                                style={{ textTransform: "uppercase" }}
                                aria-label="minimum height"
                                minRows={1}
                                placeholder="Observaciones"
                                className="text-area-encargado"
                                name="observaciones"
                                readOnly
                                value={currentReporte.observaciones} />
                        </Grid >
                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="contained"
                        className="boton-modal-pdf"
                        startIcon={<LocalPrintshopIcon />}
                        onClick={downloadPdf} >
                        Imprimir
                    </Button>
                    <Button
                        variant="outlined"
                        className="boton-modal-d"
                        onClick={() => { setModalReportexistente(false) }}
                    >
                        Cerrar
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal className="{width:0px}" isOpen={modalReportes}>
                <ModalHeader>
                    <div><h3>Generar Reporte de Mantenimiento</h3></div>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                            <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Generar reporte por</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={reporteTipo}
                                        label="Generar reporte por"
                                        onChange={handleReporte}
                                    >
                                        <MenuItem value={1}>Todos</MenuItem>
                                        <MenuItem value={2}>Específico</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    disabled = {flagDepartamento}
                                    options={["Interno","Externo"]}
                                    renderInput={(params) => <TextField {...params} fullWidth label="Tipo" type="text" />}
                                    onChange={(event, newvalue) => setTipo(newvalue)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    disabled = {flagDepartamento}
                                    options={departamentos}
                                    getOptionLabel={(option) => {
                                        return option.nombre;
                                    }}
                                    isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
                                    renderInput={(params) => <TextField {...params} fullWidth label="Departamentos" type="text" />}
                                    onChange={(event, newvalue) => setDepartamento(newvalue)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Tipo de Equipo</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={tipoEquipo}
                                        label="Tipo de Equipo"
                                        disabled = {flagTipo}
                                        onChange={handleTipoEquipo}
                                    >
                                        <MenuItem value={0}>TODOS</MenuItem>
                                        <MenuItem value={1}>Equipo Médico</MenuItem>
                                        <MenuItem value={2}>Equipo de Computo</MenuItem>
                                        <MenuItem value={3}>Equipo de Oficina</MenuItem>
                                        <MenuItem value={4}>Mobilario</MenuItem>
                                        <MenuItem value={5}>Maquinaria</MenuItem>
                                        <MenuItem value={6}>Equipo de Seguridad</MenuItem>
                                        <MenuItem value={7}>Equipo de Medición</MenuItem>
                                        <MenuItem value={8}>Equipo de Operación</MenuItem>
                                    </Select>
                                </FormControl>

                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    disabled = {flagDepartamento}
                                    options={meses}
                                    getOptionLabel={(option) => {
                                        return option.nombre;
                                    }}
                                    isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
                                    renderInput={(params) => <TextField {...params} fullWidth label="Mes" type="text" />}
                                    onChange={(event, newvalue) => setMesFiltro(newvalue)}
                                />
                            </Grid>
                        </Grid>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Button
                      
                                onClick={generarReporte}
                                variant="outlined"
                                size="large"
                                className="boton-plan"
                
                            >
                                Generar Reporte
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                onClick={() => setModalReportes(false)}
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

            <Modal className="{width:0px}" isOpen={modalExterno}>
                <ModalHeader>
                    <div><h3>Crear Reporte Externo</h3></div>
                </ModalHeader>

                <ModalBody>
                    <FormGroup  style={{overflowY:"scroll",height:"450px"}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Autocomplete
                                    disableClearable
                                    
                                    id="combo-box-demo"
                                    options={empresas}
                                    getOptionLabel={(option) => {
                                        return option.empresa;
                                    }}
                                    
                                    onChange={(event, newvalue) => setEmpresa(newvalue.empresa)}
                                    renderInput={(params) => <TextField {...params} fullWidth label="EMPRESA" type="text" />}
                                />
                            </Grid>
                            <Grid item xs={12}>

                            <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    options={departamentos}
                                    getOptionLabel={(option) => {
                                        return option.nombre;
                                    }}
                                    isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
                                    renderInput={(params) => <TextField {...params} fullWidth label="Departamento" type="text" />}
                                    onChange={(event, newvalue) => filterByDepartamento(newvalue)}
                                />
                            </Grid>
                        
                            <Grid item xs={6}>
                            <Autocomplete
                                disableClearable
                                id="combo-box-demo"
                                options={equipos_filtered.current}
                                getOptionLabel={(option) => {
                                    return option.codigo;
                                }}
     
                                isOptionEqualToValue={(option, value) => option.codigo === value.codigo}
                                onChange={(event, newValue) => {
                                    setCurrentEquipo(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} fullWidth label="Codigo" type="text" />}
                            />
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    className='seleccionadortabla'
                              
                                    options={["PREVENTIVO", "CORRECTIVO"]}
                                    onChange={(event, newValue) => {
                                        setMantenimiento(newValue);
                                    }}
                                    renderInput={(params) => <TextField   {...params} fullWidth label="T.MANTENIMIENTO" type="text" />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic" name="costo"   onChange={(event)=>{setCosto(event.target.value)}}  label="COSTO" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic" name="horasi"   onChange={(event)=>{setHoras(event.target.value)}}  label="HORAS" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic" name="min"    onChange={(event)=>{setMinutos(event.target.value)}}  label="MINUTOS" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    disableClearable
                                    id="combo-box-demo"
                                    className='seleccionadortabla'
                                    options={["ARREGLADO", "REPARADO"]}
                                    onChange={(event, newValue) => {
                                        setEstado(newValue);
                                    }}
                                    renderInput={(params) => <TextField  {...params} fullWidth label="ESTADO" type="text" />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField  id="outlined-multiline-static" name="falla" multiline  onChange={(event)=>{setFalla(event.target.value)}}  rows={3}  label="FALLA" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField  id="outlined-multiline-static" name="causas" multiline  onChange={(event)=>{setCausas(event.target.value)}}  rows={3}  label="CAUSAS" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                 <TextField  id="outlined-multiline-static" name="actividades" multiline onChange={(event)=>{setActividades(event.target.value)}}    rows={3}  label="ACTIVIDADES" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                  <TextField  id="outlined-multiline-static" name="repuestos" multiline    onChange={(event)=>{setRepuestos(event.target.value)}}  rows={3}  label="REPUESTOS" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                 <TextField  id="outlined-multiline-static" name="observaciones" multiline onChange={(event)=>{setObservaciones(event.target.value)}}   rows={3}  label="OBSERVACIONES" variant="outlined" fullWidth />
                            </Grid>
                           
                        </Grid>
                    </FormGroup>
                </ModalBody>

        
                <ModalFooter>
                    <Button     variant="outlined"
                          className="boton-modal-d2"
                        onClick={crearReporte}>Añadir</Button>
                    <Button
                               variant="contained"
                               className="boton-modal-d"
                        onClick={() => setModalExterno(false)}
                    >
                        Cancelar
                    </Button>

                </ModalFooter>
            </Modal>

          
        </>
    );

}

