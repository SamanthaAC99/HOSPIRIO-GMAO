import { createSlice  } from "@reduxjs/toolkit";



export const inventarioSlice = createSlice({
    name: "equipo",
    initialState: {
        ubicacion: "",
        departamento: "",
        responsable: "",
        tipo_equipo:"",
        equipo: "",
        modelo: "",
        marca: "",
        serie: "",
        propietario: "",
        seguro: "",
        importancia: "",
        codigo: "",
        id: "",
        indice:"",
        situacion:"",
        //valores que cambiaran en el futuro
        mantenimientos: [],
        mtbf: "",
        mttr: "",
        img: "",
        numero_fallos: "",
        disponibilidad: "",
        accesorios: [],
    },

    reducers:{
        setEquipoState: (state, action) => {
            state.ubicacion = action.payload.ubicacion
            state.departamento = action.payload.departamento
            state.responsable = action.payload.responsable
            state.tipo_equipo = action.payload.tipo_equipo
            state.equipo = action.payload.equipo
            state.modelo = action.payload.modelo
            state.marca = action.payload.marca
            state.serie = action.payload.serie
            state.propietario = action.payload.propietario
            state.seguro = action.payload.seguro
            state.importancia = action.payload.importancia
            state.codigo = action.payload.codigo
            state.id = action.payload.id
            state.indice = action.payload.indice
            state.situacion = action.payload.situacion
            //valores que cambian en el futuro
            state.mantenimientos = action.payload.mantenimientos
            state.mtbf = action.payload.mtbf
            state.mttr = action.payload.mttr
            state.img = action.payload.img
            state.numero_fallos= action.payload.numero_fallos
            state.disponibilidad= action.payload.disponibilidad
            state.accesorios= action.payload.accesorios
          },
    }
})
export const {setEquipoState} = inventarioSlice.actions
export default inventarioSlice.reducer;