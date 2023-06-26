import React from "react";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { useNavigate } from 'react-router-dom';
import ShutterSpeedIcon from '@mui/icons-material/ShutterSpeed';
export default function CalibracionMenu() {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const handleClick = () => {
        setOpen(!open);
    };
    const Changeview = (referencia) => {
        navigate(referencia);
    }
    return (
        <>
            {/* Boton Gestion de Activos  */}
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    <ShutterSpeedIcon />
                </ListItemIcon>
                <ListItemText primary="Calibración" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>

                    <ListItemButton  onClick={() => Changeview('calibracion/equipos')} sx={{ pl: 4 }}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Equipos"  />
                    </ListItemButton>

                    <ListItemButton   onClick={() => Changeview('calibracion/planmantenimiento')} sx={{ pl: 4 }}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Plan Mantenimiento" />
                    </ListItemButton>
                </List>
            </Collapse>
        </>
    )

}