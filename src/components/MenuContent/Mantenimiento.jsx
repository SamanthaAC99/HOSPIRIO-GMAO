import React  from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CircleIcon from '@mui/icons-material/Circle';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { useNavigate } from 'react-router-dom';


export default function MantenimientoMenu(){
    const navigate = useNavigate();
    const [open5, setOpen5] = React.useState(false);

    const Changeview = (referencia) => {
        navigate(referencia);
    }
    const handleClick5 = () => {
        setOpen5(!open5);
    };

    return(
        <>
                    {/* Boton Gestion de Mantenimiento */}
                    <ListItemButton onClick={handleClick5}>
                        <ListItemIcon>
                            <EngineeringIcon />
                        </ListItemIcon>
                        <ListItemText primary="Gestión de Mantenimiento" />
                        {open5 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open5} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>

                            <ListItemButton onClick={() =>Changeview('mantenimiento/estatus')} sx={{ pl: 4 }}>
                            {/* <ListItemButton target="_blank"  href="mantenimiento/estatus" sx={{ pl: 4 }}> */}
                                <ListItemIcon>
                                    <KeyboardArrowRightIcon />
                                </ListItemIcon>
                                <ListItemText primary="Ordenes de Trabajo" />
                            </ListItemButton>

                            {/* <ListItemButton onClick={() =>Changeview('mantenimiento/cards')} sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <StarBorder />
                                </ListItemIcon>
                                <ListItemText primary="OT" />
                            </ListItemButton> */}

                            <ListItemButton   onClick={() =>Changeview('mantenimiento/mantenimiento')} sx={{ pl: 4 }}>
                            {/* <ListItemButton target="_blank"  href="mantenimiento/mantenimiento"   sx={{ pl: 4 }}> */}
                                <ListItemIcon>
                                    <KeyboardArrowRightIcon />
                                </ListItemIcon>
                                <ListItemText primary="Plan de Mantenimiento" />
                            </ListItemButton>

                    
                            <ListItemButton  onClick={() =>Changeview('mantenimiento/contactos')} sx={{ pl: 4 }}>
                            {/* <ListItemButton target="_blank"  href="mantenimiento/contactos" sx={{ pl: 4 }}> */}
                                <ListItemIcon>
                                    <KeyboardArrowRightIcon />
                                </ListItemIcon>
                                <ListItemText primary="Contactos Empresas" />
                            </ListItemButton>

                        </List>
                    </Collapse>
        </>
    )

    
}