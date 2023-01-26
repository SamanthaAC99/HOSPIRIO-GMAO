import { createSlice  } from "@reduxjs/toolkit";



export const authSlice = createSlice({
    name: "user",
    initialState: {
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
        nivelEdu: '',
        uid: '',
        cargo: '',
        actividades: [],
        tareas:[],
        capacitacion: '',
        curriculum: '',
        codigo: '',
        otpendientes:0,
        otsolventadas:0,
        icontrato: 0,
        fincontrato: 0,
        tplay:false, 
        tpause:true,
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
          dashboardT:false,
          dashboardU:false,
          dashboardJM:false,
          dashboardJS:false,
          dashboardE:false,
        }
     
    },
    reducers:{
        setUserState: (state, action) => {
            state.auth = true
            state.name =  action.payload.name
            state.lastname =  action.payload.lastname
            state.secondlastname =  action.payload.secondlastname
            state.photo =  action.payload.photo
            state.indentification =  action.payload.indentification
            state.password =  action.payload.password
            state.birthday =  action.payload.birthday
            state.cellphone =  action.payload.cellphone
            state.email =  action.payload.email
            state.area =  action.payload.area
            state.titulacion =  action.payload.titulacion
            state.nivelEdu = action.payload.nivelEdu
            state.uid =  action.payload.uid
            state.cargo =  action.payload.cargo
            state.actividades =  action.payload.actividades
            state.capacitacion =  action.payload.capacitacion
            state.curriculum =  action.payload.curriculum
            state.codigo =  action.payload.codigo
            state.otpendientes =  0
            state.otsolventadas = 0
            state.icontrato =  0
            state.fincontrato =  0
            state.permisions =  action.payload.permisions
            state.tareas =  action.payload.tareas
            state.tplay = action.payload.tplay // valores iniciados por defecto
            state.tpause = action.payload.tpause // valores iniciados por defecto
          },
        resetUserState: (state) => {
          state.auth = false
          state.name =  ""
          state.lastname = ""
          state.secondlastname =  ""
          state.photo =  ""
          state.indentification =  ""
          state.password =  ""
          state.birthday = ""
          state.cellphone = ""
          state.email = ""
          state.area =  ""
          state.titulacion =  ""
          state.nivelEdu = ""
          state.uid = ""
          state.cargo =  ""
          state.actividades = ""
          state.capacitacion = ""
          state.curriculum =  ""
          state.codigo =  ""
          state.otpendientes =  ""
          state.otsolventadas = ""
          state.icontrato =  ""
          state.fincontrato =  ""
          state.permisions =  {
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
          }
          state.tareas =  []
          state.tplay = true
          state.tpause = false
        }
    }
})
export const {setUserState,resetUserState} = authSlice.actions
export default authSlice.reducer;