import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay} from 'date-fns';
import { db } from "../firebase/firebase-config";
import esES  from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { collection, query, onSnapshot } from "firebase/firestore";


import "../css/Calendario.css"


export default function CalendarioView() {


    const [eventos,setEventos] = useState([]);
   
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



   const getData = () =>{
    const reference = query(collection(db, "ingreso"));
    onSnapshot(reference, (querySnapshot) => {
        var equipos = [];
        var newArray = []
        querySnapshot.forEach((doc) => {
            equipos.push(doc.data());
        });
        equipos.map( element => {
            return  element.mantenimientos.forEach((item) =>{
                newArray.push(item)
            }
            )
        })
        setEventos(
        newArray.map(item =>{
            var obj = item;
            obj['start'] = new Date(item.start)
            obj['end'] = new Date(item.end)
           
            return {
             ...obj
            }
        })
        );
    });

   }
    useEffect( () =>{
        getData();
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
        
      </div>
    );
}