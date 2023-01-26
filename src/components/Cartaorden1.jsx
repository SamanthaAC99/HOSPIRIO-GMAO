import React, { useEffect, useState } from "react";
import "../css/TestView.css"
import { blue, red } from '@mui/material/colors';
import styled from 'styled-components';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Avatar from '@mui/material/Avatar';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

export default function Cardo1(props) {
    const [prioridad,setPrioridad] = useState("ALL");

    const selecPrioridad = (e) => {
        console.log(e.target.value);
        setPrioridad(e.target.value);
    };


    return (
        <>
           
        </>
    );
}


