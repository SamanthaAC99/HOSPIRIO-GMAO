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
      text: 'Tiempo Medio de Resolución O/T',
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
export default function BarChart(props){
    const data = {
        // labels: [props.equipo],
        // label:'Tiempo Medio de Resolución O/T',
        labels: props.labels,
        datasets: [{
          data: props.datos,
          backgroundColor: [
            // 'rgba(255, 99, 132, 0.2)',
        // 'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(255, 159, 64, 1)',
        // 'rgba(255, 206, 86, 1)',
        // 'rgba(75, 192, 192, 0.2)',
        // 'rgba(153, 102, 255, 0.2)',
     
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 159, 64, 1)',
           //   'rgba(255, 99, 132, 1)',
      // 'rgba(54, 162, 235, 1)',
      // 'rgba(255, 206, 86, 1)',
    //   'rgba(75, 192, 192, 1)',
    //   'rgba(153, 102, 255, 1)',

          ],
          borderWidth: 1
        }]
      };
    return(
        <>

        <Bar className="titulo-card-g" options={options} data={data}/>
        </>
    )
}