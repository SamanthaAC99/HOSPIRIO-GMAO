import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import CloudIcon from '@mui/icons-material/Cloud';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';

import GraficadeBarras from "../components/GraficadeBarras";
import "../css/PruebasView.css"
import "../css/Grupo.css"
import "react-circular-progressbar/dist/styles.css";

export default function IndicadoresExternos() {


    const empresas_data = useRef([{nombre:'none',value:0}])
    const nombres_empresas = useRef(['none', 'none', 'none', 'none'])
    const empresa_data = useRef(meses_reporte)
    const [currentEmpresa,setCurrentEmpresa] = useState("Escoga Alguna");
    const [empresaSelect,setEmpresaSelect] = useState("Escoga Alguna")
    const [externos ,setExternos] = useState([]);
    const obtenerHistoricosEmpresa = ()=>{
        let aux_db = JSON.parse(JSON.stringify(externos))
        let reportes_filtrados = aux_db.filter(item => item.empresa === empresaSelect)
        setCurrentEmpresa(empresaSelect)
        let aux = JSON.parse(JSON.stringify(meses_reporte))
        reportes_filtrados.forEach(item =>{
            let time = new Date(item.indice).toLocaleString('es-CO',{month:'long'})
            aux.map(mes =>{
                if(mes.nombre === time){
                    mes.value = mes.value +  item.horas
                }
                return mes;
        })
        })
         
        empresa_data.current = aux
    }

    const getData = async () => {

      
        const ref_empresas = await getDocs(collection(db, "empresas"));
        let aux_empresas = ref_empresas.docs.map((doc) => ({ ...doc.data() }))
        const ref_reportes = await getDocs(collection(db, "reportesext"));
        let aux_reportes = ref_reportes.docs.map((doc) => ({ ...doc.data() }))
        nombres_empresas.current = aux_empresas.map(item => (item.empresa))
        setExternos(aux_reportes)
    

        let empresa_horas = aux_reportes.map(item=> {
            let new_value = {
                nombre: item.empresa,
                value: item.horas,
            }
            return new_value
        })
        empresas_data.current = sumarValoresPorNombre(empresa_horas)
        

    }

    function sumarValoresPorNombre(arreglo) {
        const sumaPorNombre = {};
        arreglo.forEach(objeto => {
          const nombre = objeto.nombre;
          const valor = objeto.value;
          if (sumaPorNombre[nombre]) {
            sumaPorNombre[nombre] += valor;
          } else {
            sumaPorNombre[nombre] = valor;
          }
        });
        const arregloResultado = [];
        for (const nombre in sumaPorNombre) {
          arregloResultado.push({nombre: nombre, value: sumaPorNombre[nombre]});
        }
        return arregloResultado;
      }
      
    useEffect(() => {

    }, [])
    return (
        <>
            <div className="contenedor-indicadores-dispi">
                <Grid container spacing={{ xs: 4 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={12} sm={12} md={9}>
                        <div className="card12" >
                            <div className="card-body12 small ">
                                <GraficadeBarras titulo={"Ctd Horas Anuales/Empresas"} data={empresas_data.current} />
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3}>
                        <Button variant="outlined" startIcon={<CloudIcon />} className="filtrar" onClick={getData} >
                            Cargar Indicadores
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <div className="card12" >
                            <div className="card-body12 small ">
                                <GraficadeBarras titulo={`Ctd Horas Mensuales/Empresa ${currentEmpresa}`} data={empresa_data.current} />
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>
                        <Grid container spacing={{ xs: 2 }}>
                           
                            <Grid item xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={nombres_empresas.current}
                                    onChange={(event, newvalue) => setEmpresaSelect(newvalue)}
                                    renderInput={(params) => <TextField {...params} label="Codigo" type="text" />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="outlined" fullWidth startIcon={<CloudIcon />} onClick={obtenerHistoricosEmpresa} >
                                    Filtrar
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <Table className='table table-light table-hover'>
                            <Thead>
                                <Tr>
                                    <Th>#</Th>
                                    <Th className="t-encargados">Nombre</Th>
                                    <Th className="t-encargados">Horas Anuales</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {empresas_data.current.map((dato, index) => (
                                    <Tr key={index}  >
                                        <Td>
                                            {index + 1}
                                        </Td>
                                        <Td className="t-encargados">
                                            {dato.nombre}
                                        </Td>
                                        <Td className="t-encargados">
                                            {dato.value}
                                        </Td>


                                    </Tr>

                                ))}
                            </Tbody>
                        </Table>
                    </Grid>
                </Grid>
            </div>
        </>
    );

}

let meses_reporte = [
    {
        nombre:'enero',
        value:0
    },
    {
        nombre:'febrero',
        value:0
    },
    {
        nombre:'marzo',
        value:0
    },
    {
        nombre:'abril',
        value:0
    },
    {
        nombre:'mayo',
        value:0
    },
    {
        nombre:'junio',
        value:0
    },
    {
        nombre:'julio',
        value:0
    },
    {
        nombre:'agosto',
        value:0
    },
    {
        nombre:'septiembre',
        value:0
    },
    {
        nombre:'octubre',
        value:0
    },
    {
        nombre:'noviembre',
        value:0
    },
    {
        nombre:'diciembre',
        value:0
    },

]