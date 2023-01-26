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


export default function IndicadoresA(){
    const [open13, setOpen13] = React.useState(false);
    const navigate = useNavigate();
    const handleClick13 = () => {
        setOpen13(!open13);
    };
    const Changeview = (referencia) => {
        navigate(referencia);
    }
    return(
            <>

                 <ListItemButton onClick={handleClick13}>
                        <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary="Indicadores KPI´s" />
                        {open13 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open13} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                        <ListItemButton  onClick={() =>Changeview('indicadores/OT')} sx={{ pl: 4 }}>
                        {/* <ListItemButton  target="_blank"  href="indicadores/OT"   sx={{ pl: 4 }}> */}
                                <ListItemIcon>
                                    <StarBorder />
                                </ListItemIcon>
                                <ListItemText primary="Gestión Ordenes de Trabajo" />
                            </ListItemButton>
                            <ListItemButton  onClick={() =>Changeview('indicadores/disponibilidad')} sx={{ pl: 4 }}>
                            {/* <ListItemButton target="_blank"  href="indicadores/disponibilidad"  sx={{ pl: 4 }}> */}
                                <ListItemIcon>
                                    <StarBorder />
                                </ListItemIcon>
                                <ListItemText primary="Disponibilidad" />
                            </ListItemButton>
                            <ListItemButton onClick={() =>Changeview('indicadores/idisponibilidad')} sx={{ pl: 4 }}>
                            {/* <ListItemButton target="_blank"  href="indicadores/idisponibilidad" sx={{ pl: 4 }}> */}
                                <ListItemIcon>
                                    <StarBorder />
                                </ListItemIcon>
                                <ListItemText primary="Disponibilidad Total" />
                            </ListItemButton>
                        </List>
                    </Collapse>
            </>

    )


}