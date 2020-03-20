import React, { useState, useEffect } from "react";
import axios from "axios";
import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay
} from "../helpers/selector";

export default function Application() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  const { day, days } = state;
  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    const promiseDays = axios.get("http://localhost:8001/api/days");
    const promiseAppointments = axios.get(
      "http://localhost:8001/api/appointments"
    );
    const promiseInterviews = axios.get(
      "http://localhost:8001/api/interviewers"
    );

    Promise.all([promiseDays, promiseAppointments, promiseInterviews]).then(
      all => {
        setState(prev => ({
          ...prev,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data
        }));
      }
    );
  }, []);

  const bookInterview = (id, interview) => {
    console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(() => {
        setState({ ...state, appointments });
      });
  };

  const cancelInterview = id => {
    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() => {
        const deleteAppointment = {
          ...state.appointments[id],
          interview: null
        };
        const appointments = {
          ...state.appointments,
          [id]: deleteAppointment
        };
        setState({ ...state, appointments });
      });
  };

  const appointments = getAppointmentsForDay(state, day);
  const scheduler = appointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);
    const interviewers = getInterviewersForDay(state, state.day);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });
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
          <DayList days={days} day={day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">{scheduler}</section>
    </main>
  );
}
