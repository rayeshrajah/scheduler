import React, { useState, useEffect } from "react";
import axios from "axios";
//Custom Hook function which has all
// the functionality to run the Application.js file
export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  const setDay = day => setState({ ...state, day });
//Axios request to get days, appointments and interviewers and sets the state accordingly
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
//BookInterview function which will get the information needed and sets and interview
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
//Deleting an interview function
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
    return freeSpots;
  }
//Updates the number of spots directly if the appointment is booked or deleted
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
