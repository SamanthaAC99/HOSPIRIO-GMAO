import React, { useEffect } from "react";
import ToolBar from "../components/AppBar";
import UsuariosMenu from "./Usuarios";
import Mantenimientoview from "./Mantenimientoview";
import Activosview from "./Activos";
import Inventarioview from "./Inventarioview";
import ReportesInternosView from "./ReportesInternosView";
import PersonalView from "./PersonalView"
import TercerizacionView from "./TercerizacionView"
import OrdenTrabajoView from "./OrdenTrabajoView";
import Comprasview from "./Compras";
import Informeview from "./Informeview";
import Contactosempresas from "./Empresacontactos";
import Cuestionario from "./Empresas";
import DaccesoriosView from "./DaccesoriosView";
import DeclararPropietario from "./DeclararPropietario";
//import ReportesExternosView from "./ReportesExternosView"; este modulo ya no se utiliza
import Contratosview from "./Contratos";
import PruebasView from "./PruebasView";
import { Routes, Route, Navigate } from "react-router-dom";
import Vistacontratos from "./Vistacontratos";
import EquiposInactivosView from "./EquiposInactivosView";
import Planmantenimiento from "./Planmantenimiento";
import Plan from "./Plan";
import Manual from "./Manual";
import HomeView from "./Presentacion";
import { useSelector } from "react-redux";
import GestionOtView from "./GestionOtVIew";
import DashboardTecnicos from "./DashboardTecnicos";
import DashboardUsuarios from "./DashboardUsuarios"
import DashboardJefeM from "./DashboardJefeM";
import DashboardJefeS from "./DashboardJefeS";
import DashboardExternos from "./DashboardExternos";
import DepartamentoView from "./DepartamentoView";
import EquipoView from "./EquipoView";
import ResponsableView from "./ResponsableView";

import IndicadoresOT from "./IndicadoresOT";
import DubicacionView from "./DubicacionView";
import DtipoEquipoView from "./DtipoEquipoView";
import EquiposReubicadosView from "./EquiposReubicadosView";
import IndicadoresExternos from "./IndicadoresExternos";
import HojaVidaView from "./HojaVidaView";
import DispEquipo from "./DisEquipo";
import DisGrupo from "./DisGrupo";
import CalendarioView from "./CalendarioView";
import Accesoriosview from "./Accesorios";
import HojaVidaInactivos from "./HojaVidaInactivos";
import { doc,onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { useRef } from "react";
import { resetUserState } from '../features/auth/authSlice';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import ReportesExternosNew from "./ReporteExternoNew";
import PruebasPdf from "./PruebasPdf";
import EquiposCalibracionview from "./EquiposCalibración";
import ParametrosView from "./DeclararParametros";
import HojaVidaCalibraciones from "./HojaVidaCalibraciones";
// import PlanCalibraciones from "./PlanCalibraciones"; importante eliminar esta vista
import ActividadesView from "./DeclararActividades";
import MantenimientoCalibraciones from "./PlanMantenimientoCalibraciones";

export default function MultiView() {
    const currentUser = useSelector(state => state.auths);
    const flagAuth = useRef(true)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const PrivateRoute = ({ auth, children }) => {
        return auth ? children : <Navigate to="/error" />;
    };
    const getUserFromFirebase = ()=>{
 
        onSnapshot(doc(db, "usuarios", currentUser.uid), (doc) => {
            flagAuth.current = doc.data()

            if(!flagAuth.current.situacion){
             navigate("/error")
             dispatch(resetUserState())
            }
        });
        
    }
    useEffect(() => {
        getUserFromFirebase();
        
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <ToolBar />
            <div style={{overflowY:"scroll",height:"90vh" }}>

            <Routes>

                <Route path="home"
                    element={
                        <PrivateRoute auth={currentUser.auth}>
                            <HomeView />
                        </PrivateRoute>
                    }
                />
                <Route path="dashboard"
                    element={
                        <PrivateRoute auth={currentUser.permisions.dashboardT}>
                            <DashboardTecnicos />
                        </PrivateRoute>
                    }
                />
                <Route path="pruebas"
                    element={
                        <PrivateRoute auth={true}>
                            <PruebasView />
                        </PrivateRoute>
                    }
                />
                  <Route path="pruebasPDF"
                    element={
                        <PrivateRoute auth={true}>
                            <PruebasPdf />
                        </PrivateRoute>
                    }
                />
                <Route path="dashboardu"
                    element={
                        <PrivateRoute auth={currentUser.permisions.dashboardU}>
                            <DashboardUsuarios />
                        </PrivateRoute>
                    }
                />
                <Route path="dashboardE"
                    element={
                        <PrivateRoute auth={currentUser.permisions.dashboardE}>

                            <DashboardExternos />
                        </PrivateRoute>
                    }
                />
                <Route path="dashboardjs"
                    element={
                        <PrivateRoute auth={currentUser.permisions.dashboardJS}>
                            <DashboardJefeS />
                        </PrivateRoute>
                    }
                />
                <Route path="dashboardjm"
                    element={
                        <PrivateRoute auth={currentUser.permisions.dashboardJM}>
                            <DashboardJefeM />
                        </PrivateRoute>
                    }
                />

                <Route path="calendario"
                    element={
                        <PrivateRoute auth={currentUser.permisions.dashboardJM}>
                            <CalendarioView />
                        </PrivateRoute>
                    }
                />
                <Route path="activos/equipos" element={
                    <PrivateRoute auth={currentUser.permisions.gestiona}>
                        <Activosview />
                    </PrivateRoute>

                } />
                <Route path="activos/contrato"
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestiona}>
                            <Vistacontratos />
                        </PrivateRoute>
                    } />
                <Route path="pruebas"
                    element={                
                            <PruebasView /> 
                    } />


                <Route path='indicadores/OT'
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestioni}>
                            <IndicadoresOT />
                        </PrivateRoute>
                    } />

                <Route path='indicadores/disponibilidad'
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestioni}>
                            <DispEquipo />
                        </PrivateRoute>
                    } />
                
                <Route path='indicadores/disponibilidad_externos'
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestioni}>
                            <IndicadoresExternos />
                        </PrivateRoute>
                    } />


                <Route path='indicadores/idisponibilidad'
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestioni}>
                            <DisGrupo />
                        </PrivateRoute>
                    } />

                <Route path="inventario/invequipos"
                    element={

                        <PrivateRoute auth={currentUser.permisions.gestioni}>
                            <Inventarioview />
                        </PrivateRoute>
                    }
                />

                <Route path="inventario/equipos_activos/"
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestioni}><Inventarioview /></PrivateRoute>
                    }/>
                    <Route path="inventario/equipos_inactivos/"
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestioni}><EquiposInactivosView/></PrivateRoute>
                    }/>   
                    <Route path="inventario/equipos_reubicados/"
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestioni}><EquiposReubicadosView/></PrivateRoute>
                    }/>   
                <Route path="inventario/invequipos/declarar_responsable"
                    element={<PrivateRoute auth={currentUser.permisions.gestioni}><ResponsableView /></PrivateRoute>}
                    />
                <Route path="inventario/invequipos/declarar_equipo"
                    element={<PrivateRoute auth={currentUser.permisions.gestioni}><EquipoView /></PrivateRoute>}
                    />
                <Route path="inventario/invequipos/declarar_area"
                    element={<PrivateRoute auth={currentUser.permisions.gestioni}><DepartamentoView /></PrivateRoute>}
                    />
                    <Route path="inventario/invequipos/declarar_ubicacion"
                    element={<PrivateRoute auth={currentUser.permisions.gestioni}><DubicacionView /></PrivateRoute>}
                    />
                    <Route path="inventario/invequipos/declarar_tipo_equipo"
                    element={<PrivateRoute auth={currentUser.permisions.gestioni}><DtipoEquipoView /></PrivateRoute>}
                    />
                      <Route path="inventario/invequipos/declarar_accesorios"
                    element={<PrivateRoute auth={currentUser.permisions.gestioni}><DaccesoriosView /></PrivateRoute>}
                    />
                      <Route path="inventario/invequipos/declarar_propietario"
                    element={<PrivateRoute auth={currentUser.permisions.gestioni}><DeclararPropietario /></PrivateRoute>}
                    />
                <Route path="inventario/equipos_activos/hojadevida"
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestioni}>
                            <HojaVidaView/>
                        </PrivateRoute>
                    }
                />
                <Route path="inventario/equipos_inactivos/hojadevida"
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestioni}>
                            <HojaVidaInactivos/>
                        </PrivateRoute>
                    }
                />
     <Route path="inventario/equipos_inactivos/hojadevida"
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestioni}>
                            <HojaVidaView />
                        </PrivateRoute>
                    }
                />
                <Route path="inventario/contratos" element={
                    <PrivateRoute auth={currentUser.permisions.gestioni}>
                        <Contratosview />
                    </PrivateRoute>
                } />


                <Route path="inventario/solicitudcompra"
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestioni}>
                            <Accesoriosview />
                        </PrivateRoute>
                    } />



                <Route path="mantenimiento/estatus" element={
                    <PrivateRoute auth={currentUser.permisions.gestionm}>
                        <Mantenimientoview />
                    </PrivateRoute>
                } />

                <Route path="mantenimiento/mantenimiento"
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestionm}>
                            <Planmantenimiento />
                        </PrivateRoute>
                    } />
                <Route path="mantenimiento/mantenimiento/plan" element={
                    <PrivateRoute auth={currentUser.permisions.gestionm}>
                        <Plan />
                    </PrivateRoute>
                } />
                <Route path="mantenimiento/mantenimiento/manuales" element={
                    <PrivateRoute auth={currentUser.permisions.gestionm}>
                        <Manual />
                    </PrivateRoute>
                } />
                <Route path="mantenimiento/contactos"
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestionm}>
                            <Contactosempresas />
                        </PrivateRoute>
                    }
                />

                <Route path="mantenimiento/estatus/gestionorden"
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestionm}>
                            <GestionOtView />
                        </PrivateRoute>
                    }
                />

                <Route path="mantenimiento/contactos/cuestionario"
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestionm}>
                            <Cuestionario />
                        </PrivateRoute>
                    }
                />
                <Route path="OTS"
                    element={
                        <PrivateRoute auth={currentUser.permisions.otrabajo}>
                            <OrdenTrabajoView />
                        </PrivateRoute>
                    }
                />
                <Route path="reportes/reportes"
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestionr}>
                            <ReportesInternosView />
                        </PrivateRoute>
                    }
                />
                <Route path="reportes/agregar"
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestionr}>
                            <Informeview />
                        </PrivateRoute>
                    }
                />
                <Route path="compras"
                    element={
                        <PrivateRoute auth={currentUser.permisions.compras}>
                            <Comprasview />
                        </PrivateRoute>
                    }
                />
                <Route path="tercerizacion"
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestiont}>
                            <TercerizacionView />
                        </PrivateRoute>
                    }
                />

                <Route path="personal/registrar"
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestionp}>
                            <UsuariosMenu />
                        </PrivateRoute>
                    }
                />
                <Route path="personal/datospersonal"
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestionp}>
                            <PersonalView />
                        </PrivateRoute>
                    }
                />
                <Route path="reportes/externos"
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestionr}>
                            <ReportesExternosNew />
                        </PrivateRoute>

                    }
                />
                <Route path="calibracion/equipos"
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestionr}>
                            <EquiposCalibracionview />
                        </PrivateRoute>

                    }
                />

<Route path="calibracion/equipos/declarar_parametros"
                    element={<PrivateRoute auth={currentUser.permisions.gestioni}><ParametrosView /></PrivateRoute>}
                    />

<Route path="calibracion/equipos/hojadevida"
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestioni}>
                            <HojaVidaCalibraciones />
                        </PrivateRoute>
                    }
                />
                <Route path="calibracion/planmantenimiento"
                    element={
                        <PrivateRoute auth={currentUser.permisions.gestionr}>
                            <MantenimientoCalibraciones />
                        </PrivateRoute>

                    }
                />
                <Route path="calibracion/planmantenimiento/declarar_actividades"
                    element={<PrivateRoute auth={currentUser.permisions.gestioni}><ActividadesView /></PrivateRoute>}
                    />
            </Routes>
            </div>
        </>
    );
}