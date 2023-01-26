import React  from "react";
import { Bar } from 'react-chartjs-2';
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
        display: false,
        labels: {
            color: 'black',
            font: {
              size: 16,
              style:'normal'
          }
        }
    },

    title: {
      display: true,
      text: 'Horas hombre/trabajo',
      color: 'black',
            font: {
              size: 16,
              style:'normal',
              weight: 'normal'
          }
  }
       
},scales: {
  y: {
      ticks: {
          color: 'black',
      }
  },
  x:{
    ticks: {
        color: 'black',
    }
}
}

};
export default function GraficaDisponibilidadTotal(props){
    const data = {
        // labels: [props.equipo],
        // label:'Tiempo Medio de Resolución O/T',
        labels: props.labels,

        datasets: [
          // {
          //   label: 'Dataset 1',
          //   data: props.datos,
          //   backgroundColor: [
          // 'rgba(201,187,207)',
          // // 'rgb(255, 206, 86)',
          // // 'rgb(228, 174, 197)',
          //   ],
          //   borderColor: [
          //     'rgba(201,187,207)',
          //     // 'rgb(255, 206, 86)',
          //     // 'rgb(228, 174, 197)',
          //   ],
          //   borderWidth: 1
          // },
          {
            label: 'Dataset 2',
            data: props.info,
            backgroundColor: [
              'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(255, 159, 64, 1)',
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(255, 159, 64, 1)',
              // 'rgb(173, 207, 159)',
              // 'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1
          },
        ],

      };
    return(
        <>

        <Bar className="titulo-card-g" options={options} data={data}/>
        </>
    )
}