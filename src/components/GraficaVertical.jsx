import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);




export default function BarChartV(props) {
    const options = {
        indexAxis: 'y' ,
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Chart.js Horizontal Bar Chart',
          },
        },
      };
    
    const data = {
        labels: props.labels,
        datasets: [
          {
            label: 'Tiempo Medio de Resolución',
            data: props.datos,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        
        ],
      };
  return <Bar options={options} data={data} />;
}