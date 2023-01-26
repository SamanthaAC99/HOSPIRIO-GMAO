import { createSlice  } from "@reduxjs/toolkit";



export const ordenSlice = createSlice({
    name: "ordens",
    initialState: {
      fecha: "",
      indice: "",
      cedula: "",
      departamento: "",
      codigoe: "",
      descripcion: "",
      problematica: "",
      observaciones: "",
      verificacion:false,
      asunto:"",
      estado: "Pendiente", // valores iniciados por defecto
      prioridad: "Pendiente", // valores iniciados por defecto
      tipotrabajo: "Pendiente", // valores iniciados por defecto
      tecnicos:[],  // valores iniciados por defecto
      encargado:{}, // valores iniciados por defecto
      play:false, // valores iniciados por defecto
      pause:true,// valores iniciados por defecto
      nameImg: "",
      id: "",
      correo: "",
      mparada:[],  // valores iniciados por defecto
      tiempos: [],  // valores iniciados por defecto
      reporte:false,  // valores iniciados por defecto
      reporteId:[], // valores iniciados por defecto
      razonp:"", // valores iniciados por defecto
      horat:"",
      tiempot: "",
      tipo: "",
      
    },
    // los reducers nos permiten cambiar los valores 
    //de nuestro slice es decir cambiar los valores de las variables de arriba
    reducers:{
        setOrdenState: (state, action) => {
            state.fecha = action.payload.fecha
            state.indice = action.payload.indice
            state.cedula = action.payload.cedula
            state.departamento = action.payload.departamento
            state.codigoe = action.payload.codigoe
            state.descripcion = action.payload.descripcion
            state.problematica = action.payload.problematica
            state.observaciones = action.payload.observaciones
            state.verificacion = action.payload.verificacion
            state.estado = action.payload.estado
            state.prioridad = action.payload.prioridad
            state.tipotrabajo = action.payload.tipotrabajo
            state.tecnicos = action.payload.tecnicos
            state.encargado = action.payload.encargado
            state.play = action.payload.play
            state.pause = action.payload.pause
            state.nameImg = action.payload.nameImg
            state.id = action.payload.id
            state.correo = action.payload.correo
            state.mparada = action.payload.mparada
            state.tiempos = action.payload.tiempos
            state.reporte = action.payload.reporte
            state.reporteId = action.payload.reporteId
            state.razonp = action.payload.razonp
            state.horat = action.payload.horat
            state.tiempot = action.payload.tiempot
            state.tipo = action.payload.tipo
            state.asunto = action.payload.asunto
          },
    }
})
export const {setOrdenState} = ordenSlice.actions
export default ordenSlice.reducer;