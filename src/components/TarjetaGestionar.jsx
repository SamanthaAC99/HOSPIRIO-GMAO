import '../css/TarjetaDashBoard.css'
import { Avatar } from "@mui/material"
export default function TarjetaGestionar({icon,title,avatarColor,headerColor,value}){


    return(
        <>
         <div className="card12" >
                                    {
                                        <div className="header-tarjeta-d" style={{backgroundColor:headerColor}} >
                                           
                                                            <h5 className="titui-ges">{title}</h5>
                                                            <Avatar sx={{ backgroundColor: avatarColor }}>
                                                                {icon}
                                                            </Avatar>
                                        </div>
                                    }

                                    {
                                        <div className="card-body12 small">
                                            <h1 className='texticon-texto'>{value}</h1>
                                        </div>
                                    }

                                </div>
        </>
    )


}