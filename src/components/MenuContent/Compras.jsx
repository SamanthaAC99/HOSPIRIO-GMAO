import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { useNavigate } from 'react-router-dom';

export default function ComprasMenu(){
    const navigate = useNavigate();
    const Changeview = (referencia) => {
        navigate(referencia);
    }
    return(
        <>
         <ListItemButton  onClick={() =>Changeview('compras')}>
         {/* <ListItemButton target="_blank"  href="compras" > */}
                        <ListItemIcon>
                        <BusinessCenterIcon />
                        </ListItemIcon>
                        <ListItemText primary="Compras" />
                    </ListItemButton> 
        </>

    )

}
