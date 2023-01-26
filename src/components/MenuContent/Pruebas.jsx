import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BugReportIcon from '@mui/icons-material/BugReport';
import { useNavigate } from 'react-router-dom';

export default function Pruebas(){
    const navigate = useNavigate();
    const Changeview = (referencia) => {
        navigate(referencia);
    }
    return(
        <>
         <ListItemButton  onClick={() =>Changeview('pruebas')}>
                        <ListItemIcon>
                        <BugReportIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Pruebas"/>
                    </ListItemButton> 
        </>

    )

}
