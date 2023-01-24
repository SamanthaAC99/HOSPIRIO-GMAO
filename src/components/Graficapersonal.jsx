import React  from "react";
import { Bar } from 'react-chartjs-2';
import '../css/Presentacion.css';
import '../css/Ordentrabajo.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const options = {
  responsive: true,
  plugins: {
    legend: {
        display: true,
        labels: {
            color: 'black',
        }
    },
       
},scales: {
  y: {
  stacked: true,
      ticks: {
  display: true,
          color: 'black',
      }
  },
  x:{
    ticks: {
      display: true,
        color: 'black',
    }
}
}

};

export default function BarChart2(props){
    const data = {
        labels: ['1','2','3','4','5','6','7','8','9','10','11','12'],
        datasets: [{
          label: 'Horas Hombre/Trabajo',
          data: props.datos,
          // backgroundColor: [
          //   'rgba(75, 192, 192, 0.2)',
          // ],
          // borderColor: [
          //   'rgba(75, 192, 192, 1)',
          // ],
          // borderWidth: 2
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 2,
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
        }]
      };
    return(
        <>
        <Bar options={options} data={data}/>
        </>
    )
}