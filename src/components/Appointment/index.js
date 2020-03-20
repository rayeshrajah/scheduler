import React from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import useVisualMode from "hooks/useVisualMode";


  const SHOW = "SHOW";
  const EMPTY = "EMPTY";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM"
  const EDIT = "EDIT";
  
  export default function Appointment(props){
    
    const {mode, transition, back} = useVisualMode(props.interview ? SHOW : EMPTY);
    function save(name, interviewer){
      const interview ={
        student: name,
        interviewer
      }
      transition(SAVING);
      props
        .bookInterview(props.id, interview)
        .then(response => {transition(SHOW)})
        .catch(error => console.log(error))
    }
    
    function cancelInterview(){
      transition(DELETING)
      props.cancelInterview(props.id)
           .then(response => {transition(EMPTY)})
           .catch(error => console.log(error))
    }
    
  return(<article className="appointment">
          <Header time={props.time}/>
           {mode === EMPTY && (<Empty onAdd={() => { return transition(CREATE)}}/>)}
           {mode === SAVING && <Status message={SAVING}/>}
           {mode === DELETING && <Status message={DELETING}/>}
           {mode === CONFIRM && <Confirm message={"Are you sure you would like to delete?"} onCancel={back} onConfirm={cancelInterview}/>}
           {mode === SHOW && (<Show
                               student={props.interview.student}
                               interviewer={props.interview.interviewer}
                               onDelete={() => {return transition(CONFIRM)}}
                               onEdit={() => {return transition(EDIT)}}
                              />)}
           {mode === EDIT && (<Form
                               name={props.interview.student}
                               interviewer={props.interview.interviewer}
                               interviewers={props.interviewers}
                               onSave={save}
                               onCancel={back}
                             />)}
           {mode === CREATE && (<Form interviewers = {props.interviewers} onSave={save} onCancel={back}/>) }
          </article>);
}