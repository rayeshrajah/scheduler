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

export function getInterview(state, interview){
    if(!interview) 
        return null;
    const interviewObj = {
        student: interview.student
    }

    interviewObj.interviewer = state.interviewers[interview.interviewer];
    return interviewObj;
}

export function getInterviewersForDay(state, day){
    const filterInterviewersByDay = state.days.filter(
        selectedDay => selectedDay.name === day
      );
      if(filterInterviewersByDay.length === 0){
          return filterInterviewersByDay
        }
        let interviewerIds = filterInterviewersByDay[0]["interviewers"];
        
      let interviewers = [];
    
      if (interviewerIds) {
        for (let interviewerId of interviewerIds){
            interviewers.push(state.interviewers[interviewerId]);
        }
      }
      return interviewers;
}
