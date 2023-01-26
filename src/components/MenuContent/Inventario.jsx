import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useNavigate } from 'react-router-dom';

export default function InventarioMenu(){
    const navigate = useNavigate();
    const [open1, setOpen1] = React.useState(false);
    const handleClick1 = () => {
        setOpen1(!open1);
    };

    const Changeview = (referencia) => {
        navigate(referencia);
    }
    return(
        <>
         <ListItemButton onClick={handleClick1}>
                        <ListItemIcon>
                            <InventoryIcon />
                        </ListItemIcon>
                        <ListItemText primary="Gestión de Inventario" />
                        {open1 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open1} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>

                            <ListItemButton onClick={() =>Changeview('inventario/equipos_activos')} sx={{ pl: 4 }}>
                            {/* <ListItemButton target="_blank"  href="inventario/equipos_activos"  sx={{ pl: 4 }}> */}
                                <ListItemIcon>
                                    <StarBorder />
                                </ListItemIcon>
                                <ListItemText primary="Equipos Activos" />
                            </ListItemButton>

                            <ListItemButton  onClick={() =>Changeview('inventario/equipos_inactivos')} sx={{ pl: 4 }}>
                            {/* <ListItemButton target="_blank"  href="inventario/equipos_inactivos"  sx={{ pl: 4 }}> */}
                                <ListItemIcon>
                                    <StarBorder />
                                </ListItemIcon>
                                <ListItemText primary="Equipos Inactivos" />
                            </ListItemButton>
                            
                            {/* <ListItemButton onClick={() =>Changeview('inventario/solicitudcompra')} sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <StarBorder />
                                </ListItemIcon>
                                <ListItemText primary="Inventario Accesorios" />
                            </ListItemButton> */}

                            <ListItemButton onClick={() =>Changeview('inventario/contratos')} sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <StarBorder />
                                </ListItemIcon>
                                <ListItemText primary="Contratos de Equipos" />
                            </ListItemButton>

                           
                        </List>
                    </Collapse>
        </>
    )

}