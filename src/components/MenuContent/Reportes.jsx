import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { useNavigate } from 'react-router-dom';


export default function ReportesMenu(){
    const navigate = useNavigate();


    const Changeview = (referencia) => {
        navigate(referencia);
    }
    return(
        <>
          <ListItemButton  onClick={() =>Changeview('reportes/reportes')}>
                        <ListItemIcon>
                        <SummarizeIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Gestion de Reportes"/>
                    </ListItemButton> 
        </>
    )

}