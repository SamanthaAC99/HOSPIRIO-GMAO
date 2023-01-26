import React  from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate } from 'react-router-dom';


export default function TercerizadosMenu(){
    const navigate = useNavigate();
    const [open3, setOpen3] = React.useState(false);

    const handleClick3 = () => {
        setOpen3(!open3);
    };
    const Changeview = (referencia) => {
        navigate(referencia);
    }
    return(
        <>
          <ListItemButton onClick={handleClick3}>
                        <ListItemIcon>
                            <GroupIcon />
                        </ListItemIcon>
                        <ListItemText primary="Gestión de Tercerizados" /> 
                        {open3 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open3} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {/* <ListItemButton target="_blank"  href="tercerizacion" onClick={() =>Changeview('tercerizacion')} sx={{ pl: 4 }}> */}
                            <ListItemButton target="_blank"  href="tercerizacion"  sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <StarBorder />
                                </ListItemIcon>
                                <ListItemText primary="Reporte de Mantenimiento" />
                            </ListItemButton>

                            {/* <ListItemButton  target="_blank"  href="tercerizados" onClick={() =>Changeview('tercerizados')} sx={{ pl: 4 }}> */}
                            <ListItemButton  target="_blank"  href="tercerizados"  sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <StarBorder />
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItemButton>


                        </List>
                    </Collapse>
        </>
    )

}