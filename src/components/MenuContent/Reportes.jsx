import React  from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { useNavigate } from 'react-router-dom';


export default function ReportesMenu(){
    const navigate = useNavigate();
    const [open2, setOpen2] = React.useState(false);
    const handleClick2 = () => {
        setOpen2(!open2);
    };

    const Changeview = (referencia) => {
        navigate(referencia);
    }
    return(
        <>
          <ListItemButton onClick={handleClick2}>
                        <ListItemIcon>
                            <SummarizeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Gestión de Reportes" />
                        {open2 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open2} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>

                            <ListItemButton  onClick={() =>Changeview('reportes/reportes')} sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <StarBorder />
                                </ListItemIcon>
                                <ListItemText primary="R. Internos" />
                            </ListItemButton>

                            <ListItemButton onClick={() =>Changeview('reportes/externos')} sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <StarBorder />
                                </ListItemIcon>
                                <ListItemText primary="R. Externos" />
                            </ListItemButton>
                        </List>
                    </Collapse>
        </>
    )

}