import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BallotIcon from '@mui/icons-material/Ballot';

import { useNavigate } from 'react-router-dom';

export default function OdtMenu(){
    const navigate = useNavigate();
    const Changeview = (referencia) => {
        navigate(referencia);
    }
    return(
        <>
         <ListItemButton  onClick={() =>Changeview('OTS')}>
         {/* <ListItemButton target="_blank"  href="OTS" > */}
                        <ListItemIcon>
                            <BallotIcon />
                        </ListItemIcon>
                        <ListItemText primary="Solicitud Orden de Trabajo" />
                    </ListItemButton>
        </>

    )

}
