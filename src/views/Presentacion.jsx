import React from "react";
import imagen2 from '../components/imagenes/NEO-01.jpg';
import 'bootstrap/dist/css/bootstrap.css';
import Carousel from 'react-bootstrap/Carousel';
import { Box } from "@mui/material";
import '../css/Presentacion.css';

import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';





export default function HomeView() {
  return (
    <>

      <Box sx={{ position: "initial" }}>
        <br />
        <Typography component="div" variant="h3" className="princi3" >
          SOFTWARE DE MANTENIMIENTO
        </Typography>
        <Typography className="textt" component="legend">¡Bienvenidas y bienvenidos! </Typography>
        <Typography className="textt" component="legend">El departamento de Ingeniería Clínica agradece su colaboración </Typography>
        <br />
        <Carousel>
          <Carousel.Item interval={200}>
            <img
              className="d-block w-20"
              src={imagen2}
              alt="First slide"
            />
          </Carousel.Item>
          <Carousel.Item interval={200}>
            <img
              className="d-block"
              src={imagen2}
              alt="Second slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block"
              src={imagen2}
              alt="Third slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block"
              src={imagen2}
              alt="Cuarta slide"
            />
          </Carousel.Item>
        </Carousel>
      </Box>
      <br />
      <Box
        sx={{
          '& > legend': { mt: 2 },
        }}
      >
        <Rating name="customized-10" defaultValue={2} max={5} size="large" />
      </Box>
    </>
  );
}