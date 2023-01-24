import React  from 'react';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';


export default function PersonalMenu(){
    const [open4, setOpen4] = React.useState(false);
    const navigate = useNavigate();
    const handleClick4 = () => {
        setOpen4(!open4);
    };
    const Changeview = (referencia) => {
        navigate(referencia);
    }
    return(
            <>
                 {/* Boton Gestion de Personal */}
                 <ListItemButton onClick={handleClick4}>
                        <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary="Gestión de Personal" />
                        {open4 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open4} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                        <ListItemButton  onClick={() =>Changeview('personal/registrar')} sx={{ pl: 4 }}>
                        {/* <ListItemButton target="_blank"  href="personal/registrar"  sx={{ pl: 4 }}> */}
                                <ListItemIcon>
                                    <StarBorder />
                                </ListItemIcon>
                                <ListItemText primary="Registrar Usuario" />
                            </ListItemButton>
                            <ListItemButton  onClick={() =>Changeview('personal/datospersonal')} sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <StarBorder />
                                </ListItemIcon>
                                <ListItemText primary="Datos Personales" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                    {/* Fin Boton Gestion de Personal  */}
            </>

    )


}