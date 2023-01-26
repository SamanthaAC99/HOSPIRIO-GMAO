import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListItemText from '@mui/material/ListItemText';

import { useNavigate } from 'react-router-dom';

export default function CalendarioM(){
    const navigate = useNavigate();
    const Changeview = (referencia) => {
        navigate(referencia);
    }
    return(
        <>
         {/* <ListItemButton target="_blank"  href="calendario" onClick={() =>Changeview('calendario')}> */}
        <ListItemButton onClick={() =>Changeview('calendario')}>
         {/* <ListItemButton target="_blank"  href="calendario" > */}
                        <ListItemIcon>
                        <DashboardIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Calendario Mantenimientos"/>
                    </ListItemButton> 
        </>

    )

}
