import React, { useEffect, useState } from "react";
import axios from 'axios';
import { gapi } from "gapi-script";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import {addHours, format, parse, startOfWeek, getDay} from 'date-fns';
import esES  from 'date-fns/locale/es';
import TextField from '@mui/material/TextField';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    ModalFooter,
} from "reactstrap";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import "../css/Calendario.css"
const eventos = [{
    title: "Prueba1",
    notes:"Ninguna",
    start: "Sun Aug 28 2022 11:00:00 GMT-0500 (Ecuador Time)",
    end: "Sun Aug 28 2022 19:00:00 GMT-0500 (Ecuador Time)"
},
{
    title: "Prueba2",
    notes:"Ninguna",
    start: "Sun Oct 22 2022 11:00:00 GMT-0500 (Ecuador Time)",
    end: "Sun Oct 22 2022 19:00:00 GMT-0500 (Ecuador Time)"
},
{
    title: "Prueba3",
    notes:"Ninguna",
    start: "Sun Oct 23 2022 11:00:00 GMT-0500 (Ecuador Time)",
    end: "Sun Oct 23 2022 19:00:00 GMT-0500 (Ecuador Time)"
},
{
    title: "Prueba4",
    notes:"Ninguna",
    start: "Sun Oct 24 2022 11:00:00 GMT-0500 (Ecuador Time)",
    end: "Sun Oct 24 2022 19:00:00 GMT-0500 (Ecuador Time)"
}
]
export default function Calendario() {
    const calendarID = process.env.REACT_APP_CALENDAR_ID;
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    const accessToken = process.env.REACT_APP_GOOGLE_ACCESS_TOKEN;
    const [eventsGoogleCalendar, setEventsGoogleCalendar] = useState([]);
    const [modalEvento,setModalEvento] = useState(false);
    const [eventsCalendar, setEventsCalendar] = useState([]);
    const [time1, setTime1] = useState(new Date());
    const [time2, setTime2] = useState(new Date());
    const [titulo,setTitulo] = useState("");
    const [events, setEvents] = useState({
        titulo:     '',
        nota:       '',
        dateStart:  time1,
        dateEnd:    time2
    });
   
    const locales = {
        'es': esES ,
      }
    const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales,
      })
  
    const messages = {
        allDay: 'Todo el día',
        previous: '<',
        next: '>',
        today: 'Hoy',
        month: 'Mes',
        week: 'Semana',
        day: 'Día',
        agenda: 'Agenda',
        date: 'Fecha',
        time: 'Hora',
        event: 'Evento',
        noEventsInRange: 'No hay eventos en este rango',
        showMore: total => `+ Ver más (${total})`
    };

    const eventss = [{
        title:      "prueba",
        notes:      "prueba",
        start:      new Date(),
        end:        addHours(new Date(), 2),
        titbgColor: '#fafafa',
        user:{
            _id:'123',
            name:'rosa'
        }

    }]
    const agregarTarea = async () =>{
        var NewEvent = {
            "summary":      events.titulo,
            "description":  events.nota,
            "start": {
              "dateTime":   events.dateStart,
            },
            "end": {
              "dateTime":   events.dateEnd,
            }
          };
        console.log(NewEvent)
          const response = await AddEventgoogleApi(NewEvent)
          console.log(response)
          await fetchData()
    }
    const setNewEventCalendar = (event) => {
        setEvents({
          ...events,
          [event.target.name]: event.target.value,
        });
      };

    const AddEventgoogleApi = async (event) =>{
        var res = await axios.post(
            `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
            JSON.stringify(event),
            {headers: {authorization: `Bearer ${accessToken}`, "Content-Type": "application/json"}}
          ).catch(console.error);
          return res.data
    }
    const googleApi = async () =>{
        var res = await axios.get(
            `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
            {headers: {authorization: `Bearer ${accessToken}`, "Content-Type": "application/json"}}
          ).catch(console.error);
          return res.data.items
    }

    const SelectFecha1 = (newValue) => {
        events.dateStart =  new Date(newValue)
        setTime1(newValue);
    };
    const SelectFecha2 = (newValue) => {
        events.dateEnd =  new Date(newValue)
        setTime2(newValue);
    };

    const fetchData = async () => {
        const data = await googleApi();
        const eventos = data.map(x => ({ title:  x.summary === undefined ? 'no tiene titulo':x.summary,
                                         notes:  x.description === undefined ? 'no tiene notas':x.description,
                                         start:  new Date(x.start.dateTime),
                                         end:    new Date(x.end.dateTime)}))
        setEventsCalendar(eventos)
        console.log(eventos)
      }
    useEffect( () =>{
          fetchData().catch(console.error);
    }, [])
 
    return(
        <div className="container-test-2">
        <Calendar
          culture='es'
          localizer={localizer}
          events={eventos}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          messages={messages}
        />
         <Button variant="contained" className="boton-calendario" onClick={()=>{setModalEvento(true)}} >
                            Agregar Tarea</Button>
    
                            <Modal isOpen={modalEvento}>
                                            <ModalHeader>
                                                <div><h2>Agregar Evento</h2></div>
                                            </ModalHeader>
                                            <ModalBody>
                                                <FormGroup>
                                                    <Grid container spacing={4}>
                                                        <Grid item xs={12}>
                                                            <TextField 
                                                                name='titulo'
                                                                id="standard-basic" 
                                                                label="Título" 
                                                                variant="standard" 
                                                                onChange={setNewEventCalendar} />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField 
                                                                name='nota'
                                                                id="standard-basic" 
                                                                label="Descripción" 
                                                                variant="standard" 
                                                                onChange={setNewEventCalendar} />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <DateTimePicker
                                                                label={"Desde"}
                                                                inputFormat="MM/dd/yyyy hh:mm:ss"
                                                                value={time2}
                                                                onChange={SelectFecha2}
                                                                renderInput={(params) => <TextField {...params}  fullWidth />}
                                                                />
                                                            </LocalizationProvider>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                         <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                label={"Hasta"}
                                inputFormat="MM/dd/yyyy hh:mm:ss"
                                value={time2}
                                onChange={SelectFecha2}
                                renderInput={(params) => <TextField {...params} fullWidth/>}
                            />
                        </LocalizationProvider>
                                                        </Grid>
                                                    </Grid>
                                                </FormGroup>

                                            </ModalBody>
                                            <ModalFooter>
                                                <Button
                                                    variant="outlined"
                                                    className="boton-cancelar"
                                                    onClick={() => setModalEvento(false)}
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button
                                                variant="contained"
                                                    className="boton-agregar"
                                                    onClick={() => {agregarTarea()}}
                                                >
                                                    Agregar
                                                </Button>
                                            </ModalFooter>
                                        </Modal>
      </div>
    );
}