import React  from 'react';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';


export default function DashboardE(){
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
         <ListItemButton onClick={() =>Changeview('dashboardE')}>
         {/* <ListItemButton target="_blank"  href="dashboardE" > */}
                        <ListItemIcon>
                        <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Mesa Trabajo Externos" />
                    </ListItemButton> 

                        

        </>
    )

}