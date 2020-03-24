import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
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
        setState({ ...state, appointments, days: getSpots(state.days, appointments) });
        /*Try to validate the statement above with your database*/
      });
  };

  const destroyInterview = id => {
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
        setState({ ...state, appointments, days: getSpots(state.days, appointments)});
        
      });
  };

  const getNumberOfSpots = (day, appointments) => {
    let spots = day.appointments;
    let freeSpots = 0;
    for(const spot of spots){
      if(appointments[spot].interview === null){
        freeSpots++;
      }
    }
    console.log(freeSpots);
    return freeSpots;
  }

  const getSpots = (days, appointments) => {
    const updatedDays = days.map(day => ({
      ...day,
      spots: getNumberOfSpots(day, appointments)
    }));
    return updatedDays;
  }

  return {
      state,
      setDay,
      bookInterview,
      destroyInterview,
  };
}