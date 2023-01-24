import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BallotIcon from '@mui/icons-material/Ballot';
import { useNavigate } from 'react-router-dom';

export default function UsuariosMenu(){
    const navigate = useNavigate();
    const Changeview = (referencia) => {
        navigate(referencia);
    }
    return(
        <>
         {/* <ListItemButton target="_blank"  href="usuarios" onClick={() =>Changeview('usuarios')}> */}
         <ListItemButton target="_blank"  href="usuarios" >
                        <ListItemIcon>
                            <BallotIcon />
                        </ListItemIcon>
                        <ListItemText primary="Usuarios" />
                    </ListItemButton> 
        </>

    )

}