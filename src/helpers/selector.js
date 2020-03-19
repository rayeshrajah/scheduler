export function getAppointmentsForDay(state, day) {
  const filterAppointmentsByDay = state.days.filter(
    selectedDay => selectedDay.name === day
  );
  if(filterAppointmentsByDay.length === 0){
      return filterAppointmentsByDay
    }
    let results = filterAppointmentsByDay[0]["appointments"];

  let finalResults = [];

  if (results) {
    for (let i = 0; i < results.length; i++) {
      let tempVar = state.appointments[results[i].toString()];
      if (tempVar) {
        finalResults.push(tempVar);
      }
    }
  }
  return finalResults;
}
