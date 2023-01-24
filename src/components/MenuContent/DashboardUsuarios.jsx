import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListItemText from '@mui/material/ListItemText';

import { useNavigate } from 'react-router-dom';

export default function DashboardU(){
    const navigate = useNavigate();
    const Changeview = (referencia) => {
        navigate(referencia);
    }
    return(
        <>
         <ListItemButton  onClick={() =>Changeview('dashboardu')}>
         {/* <ListItemButton target="_blank"  href="dashboardu"> */}
                        <ListItemIcon>
                        <DashboardIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Mesa Trabajo Usuarios"/>
                    </ListItemButton> 
        </>

    )

}
