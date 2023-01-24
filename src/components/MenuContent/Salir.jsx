import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { setUserState } from '../../features/auth/authSlice';
import { useDispatch } from "react-redux";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';



export default function SalirMenu(){
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const Changeview = (referencia) => {

        const resetUser = {
            auth: false,
            name: null,
            email: null,
            uid: null,
            photo: null,
            permisions: {
                otrabajo: false,
                compras: false,
                gestiona:false,
                gestionm:false,
                gestioni:false,
                gestionr:false,
                gestiont:false,
                gestionp:false
            }
        }
        dispatch(setUserState(resetUser))

        navigate(referencia);
    }
    return(
        <>
            <ListItemButton onClick={() =>Changeview('/')}>
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary="Salir" />
            </ListItemButton>
        </>
    )


}