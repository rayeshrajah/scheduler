import React, { useState, useEffect } from "react";
import axios from 'axios';
import "components/Application.scss";
import DayList from "./DayList";
import "components/Appointment";
import Appointment from "components/Appointment";
import { getAppointmentsForDay } from "../helpers/selector";


export default function Application(props) {
  const [state, setState] = useState({
    day:"Monday",
    days: [],
    appointments: {}
  })
  const {day, days, appointments } = state
  const setDay = day => setState({ ...state, day });
  

  useEffect(() => {
    const promiseDays = axios.get("http://localhost:8001/api/days");
    const promiseAppointments = axios.get("http://localhost:8001/api/appointments");

    Promise.all([
      promiseDays,
      promiseAppointments
    ]).then((all) => {
      console.log(all);
      setState(prev => ({days: all[0].data, appointments:all[1].data}))
    });
  },[])

  const appointmentList = getAppointmentsForDay(state, day).map(appointment => {
    return <Appointment key={appointment.id} {...appointment} />
  })
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={days}
            day={day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentList}
      </section>
    </main>
  );
}
