import React, { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { setUserState } from '../features/auth/authSlice';
import '../css/Menu.css';
import OdtMenu from './MenuContent/SolicitudOt';
import ActivosMenu from './MenuContent/Activos';
import ComprasMenu from './MenuContent/Compras';
import InventarioMenu from './MenuContent/Inventario';
import Dashboard from './MenuContent/Dashboard';
import DashboardU from './MenuContent/DashboardUsuarios';
import MantenimientoMenu from './MenuContent/Mantenimiento';
import ReportesMenu from './MenuContent/Reportes';
import TercerizadosMenu from './MenuContent/Tercerizados';
import PersonalMenu from './MenuContent/Personal';
import SalirMenu from './MenuContent/Salir';
import { db } from '../firebase/firebase-config';
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import DashboardJS from './MenuContent/DashboardJefeSistemas';
import DashboardJM from './MenuContent/DashboardJefeMantenimiento';
import Pruebas from './MenuContent/Pruebas';
import IndicadoresA from './MenuContent/Indicadores';
import DashboardE from './MenuContent/DashboardE';
import CalendarioM from './MenuContent/Calendario';
import CalibracionMenu from './MenuContent/Calibracion';
export default function ToolBar() {
    let params = useParams();
    const currentUser = useSelector(state => state.auths);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [state, setState] = React.useState({
        left: false,
    });
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const menuData = [
        // {
        //     child: <Pruebas/>,
        //     visibility: true,
        //     key: 1
        // },
        {
            child: <OdtMenu />,
            visibility: currentUser.permisions.otrabajo,
            key: 1
        },
        {
            child: <MantenimientoMenu />,
            visibility: currentUser.permisions.gestionm,
            key: 5
        },
        {
            child: <InventarioMenu />,
            visibility: currentUser.permisions.gestioni,
            key: 4
        },
        {
            child: <CalibracionMenu />,
            visibility: currentUser.permisions.gestioni,
            key: 4
        },
        {
            child: <ReportesMenu />,
            visibility: currentUser.permisions.gestionr,
            key: 6
        },
        {
            child: <IndicadoresA />,
            visibility: currentUser.permisions.gestioni,
            key: 3
        },
        {
            child: <PersonalMenu />,
            visibility: currentUser.permisions.gestionp,
            key: 8
        },
        {
            child: <ActivosMenu />,
            visibility: currentUser.permisions.gestiona,
            key: 3
        },
        {
            child: <Dashboard/>,
            visibility: currentUser.permisions.dashboardT,
            key: 1
        },
        // {
        //     child: <DashboardE/>,
        //     visibility: currentUser.permisions.dashboardE,
        //     key: 1
        // },
        {
            child: <DashboardU/>,
            visibility: currentUser.permisions.dashboardU,

            key: 1
        },
        {
            child: <DashboardJM/>,
            visibility: currentUser.permisions.dashboardJM,
            key: 1
        },
        {
            child: <DashboardJS/>,
            visibility: currentUser.permisions.dashboardJS,
            key: 1
        },
        {
            child: <CalendarioM/>,
            visibility: currentUser.permisions.dashboardJM,
            key: 1
        },
     
    
        // {
        //     child: <ComprasMenu />,
        //     visibility: currentUser.permisions.compras,
        //     key: 2
        // },
        
       
        // {
        //     child: <TercerizadosMenu />,
        //     visibility: currentUser.permisions.gestiont,
        //     key: 7
        // },
      
        {
            child: <SalirMenu />,
            visibility: true,
            key: 9

        },
    ]


    const Changeview = (referencia) => {
        navigate(referencia);
    }


    // funcion para hacer funcionar el drawer
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };
    //menu
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    //drawer a mostrar
    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Divider />
        </Box>
    );
    // actualizar navigation
    // const updateNavigationUser = async () => {
    //     const docRef = doc(db, "usuarios", `${params.uid}`);
    //     const docSnap = await getDoc(docRef);
    //     if (docSnap.exists()) {

    //         const usuarioConectado = docSnap.data()
    //         dispatch(setUserState(usuarioConectado))

    //     } else {
    //         console.log("No such document!");
    //     }

    // }

    // useEffect(() => {
    //     updateNavigationUser();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    return (
        <>
            <AppBar className="bts" position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={toggleDrawer('left', true)}
                    >
                        
                        <MenuIcon />
                      
                    </IconButton>
                    
                    <Typography align='right' variant="h7" component="div" sx={{ flexGrow: 1 }}>
                        {currentUser.name}   {currentUser.lastname}  {currentUser.secondlastname}
                    </Typography>
                    <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                             <Avatar  alt="Remy Sharp" src={currentUser.photo} />
                        </IconButton>
                        <Menu
                            className="salir"
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => Changeview('/')}  >Salir</MenuItem>
                        </Menu>
                    </div>

                </Toolbar>
            </AppBar>
            <Drawer
                anchor={'left'}
                open={state['left']}
                onClose={toggleDrawer('left', false)}
            >
                {list('left')}
                <List
                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            SOFTWARE DE MANTENIMIENTO HOSPITAL DEL RIO
                        </ListSubheader>
                    }
                >
                    {menuData.filter(item => item.visibility).map((item, index) => (

                        <div key={index}>
                            {item.child}
                        </div>




                    ))
                    }
                </List>
            </Drawer>
        </>
    );
}
