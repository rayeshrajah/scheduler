import React from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error"
import useVisualMode from "hooks/useVisualMode";


  const SHOW = "SHOW";
  const EMPTY = "EMPTY";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM"
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";
  
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
        .catch(error => {transition(ERROR_SAVE, true)})
    }
    
    function destroyInterview(){
      transition(DELETING, true)
      props.destroyInterview(props.id)
           .then(response => {transition(EMPTY)})
           .catch(error => {transition(ERROR_DELETE, true)})
    }
    
  return(<article className="appointment">
          <Header time={props.time}/>
           {mode === EMPTY && (<Empty onAdd={() => { return transition(CREATE)}}/>)}
           {mode === SAVING && <Status message={SAVING}/>}
           {mode === DELETING && <Status message={DELETING}/>}
           {mode === CONFIRM && <Confirm message={"Are you sure you would like to delete?"} onCancel={back} onConfirm={destroyInterview}/>}
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
           {mode === CREATE && (<Form interviewers={props.interviewers} onSave={save} onCancel={back}/>) }
           {mode === ERROR_SAVE && (<Error message={"Error could not save!"} onClose={back}/>)}
           {mode === ERROR_DELETE && (<Error message={"Error could not delete!"} onClose={back}/>)}
          </article>);
}