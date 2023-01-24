import '../css/TarjetaDashBoard.css'
import { Avatar } from "@mui/material"
export default function TarjetaDashboard({icon,title,avatarColor,headerColor,value}){


    return(
        <>
         <div className="card15" >
                                    {
                                        <div className="header-tarjeta-d" style={{backgroundColor:headerColor}} >
                                           
                                                            <h5 className="titulo-tarjeta-d">{title}</h5>
                                                            <Avatar sx={{ backgroundColor: avatarColor }}>
                                                                {icon}
                                                            </Avatar>
                                        </div>
                                    }

                                    {
                                        <div className="card-body12 small">
                                            <h1 className='texticon3'>{value}</h1>
                                        </div>
                                    }

                                </div>
        </>
    )


}