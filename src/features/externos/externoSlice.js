import { createSlice  } from "@reduxjs/toolkit";



export const externoSlice = createSlice({
    name: "externo",
    initialState: {
        feinicio: '',
          fetermino: '',
          id:'',
          indice:0,
          codigo:'',
          empresaext:'',
          equipoter:'',
          nameImg:"https://firebasestorage.googleapis.com/v0/b/app-mantenimiento-91156.appspot.com/o/orden%2FSP.PNG?alt=media&token=a607ce4a-5a40-407c-ac03-9cd6a771e0d1",
          nivelalerta:'',
          numeroreportefisico:'',
          },

    reducers:{
        setExternoState: (state, action) => {
            state.feinicio = action.payload.feinicio
            state.fetermino = action.payload.fetermino
            state.id = action.payload.id
            state.indice = action.payload.indice
            state.codigo = action.payload.codigo
            state.empresaext = action.payload.empresaext
            state.cedulat = action.payload.cedulat
            state.equipoter = action.payload.equipoter
            state.nameImg = action.payload.nameImg
            state.nivelalerta = action.payload.nivelalerta 
            state.numeroreportefisico = action.payload.numeroreportefisico 
          },
    }
})
export const {setExternoState} = externoSlice.actions
export default externoSlice.reducer;