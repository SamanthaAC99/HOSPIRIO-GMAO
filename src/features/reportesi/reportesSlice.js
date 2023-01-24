import { createSlice  } from "@reduxjs/toolkit";



export const reporteSlice = createSlice({
    name: "internos",
    initialState: {
        feinicio: '',
          fetermino: '',
          horasT:0,
          id:'',
          indice:0,
          nombre:'',
          codigoot: '',
          cedulat: '',
          equipo:'',
          codigo: '',
          tipomant:'',
          nivelalerta:'',
          costo:'',
          falla:'',
          causas:'',
          actividades:'',
          repuestos:'',
          observaciones1:'',
          verificador:'',
          mesFinal:0,
          },

    reducers:{
        setReporteState: (state, action) => {
            state.feinicio = action.payload.feinicio
            state.fetermino = action.payload.fetermino
            state.horasT = action.payload.horasT
            state.id = action.payload.id
            state.indice = action.payload.indice
            state.nombre = action.payload.nombre
            state.codigoot = action.payload.codigoot
            state.cedulat = action.payload.cedulat
            state.equipo = action.payload.equipo
            state.codigo = action.payload.codigo
            state.tipomant = action.payload.tipomant
            state.nivelalerta = action.payload.nivelalerta 
            state.costo = action.payload.costo 
            state.falla = action.payload.falla 
            state.causas = action.payload.causas 
            state.actividades = action.payload.actividades
            state.repuestos = action.payload.repuestos
            state.observaciones1 = action.payload.observaciones1
            state.verificador = action.payload.verificador 
            state.mesFinal = action.payload.mesFinal 
          },
    }
})
export const {setReporteState} = reporteSlice.actions
export default reporteSlice.reducer;