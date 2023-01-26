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
export default function ActivosMenu() {
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
                    <CurrencyExchangeIcon />
                </ListItemIcon>
                <ListItemText primary="Gestión de Activos" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>

                    <ListItemButton  onClick={() => Changeview('activos/equipos')} sx={{ pl: 4 }}>
                        
                    {/* <ListItemButton  href="activos/equipos" onClick={() => Changeview('activos/equipos')} sx={{ pl: 4 }}></ListItemButton> */}
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Equipos"  />
                    </ListItemButton>

                    <ListItemButton   onClick={() => Changeview('activos/contrato')} sx={{ pl: 4 }}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Contratos" />
                    </ListItemButton>

                    {/* <ListItemButton onClick={() => Changeview('activos/indicadores')} sx={{ pl: 4 }}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Indicadores" />
                    </ListItemButton> */}
                    
                    {/* <ListItemButton onClick={() => Changeview('activos/indicadores2')} sx={{ pl: 4 }}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Indicadores2" />
                    </ListItemButton> */}
                </List>
            </Collapse>
        </>
    )

}