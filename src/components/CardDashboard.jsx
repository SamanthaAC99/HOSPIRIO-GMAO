import React from "react";
import { blue, red, pink, cyan, indigo, lightGreen, lightBlue, deepPurple, orange, yellow } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import '../css/EncargadoView.css'
export default function CardDashboard(props) {
    return ( 
        <>
        <div className="card-container">
<div className="card15" >
    {
        <div className="card-header18">
            <div className="row">
                <div className="col-sm-12">
                    <div className="row">
                        <div className="alinear1">
                            <h5 className="titui4">ACTIVAS</h5>
                            <Avatar sx={{ bgcolor: lightGreen[700] }} >
                                <PlayArrowIcon />
                            </Avatar>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    {
        <div className="card-body12 small">
            <h1 className='texticon3'>3 </h1>
        </div>
    }

</div>
</div>
        </>
     );
}


