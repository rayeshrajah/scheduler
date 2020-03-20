import React, { useState } from 'react';
import InterviewerList from "../InterviewerList";
import Button from "../Button";

export default function Form(props){
  let [name, setName] = useState(props.name || "");
  let [interviewer, setInterviewer] = useState(props.interviewer || null);

    const reset = function(){
      setName("");
      setInterviewer(null);
    }
    const cancel = function(){
      reset();
      props.onCancel();
    }
    const save = function(){
      if(interviewer){
      props.onSave(name, interviewer)
      }else{
      console.log("put interviewer");
      }
    }
  return(
    <main className="appointment__card appointment__card--create">
    <section className="appointment__card-left">
      <form autoComplete="off" onSubmit={(event) => event.preventDefault()}>
        <input
          className="appointment__create-input text--semi-bold"
          name="name"
          value={name}
          type="text"
          placeholder="Enter Student Name"
          onChange = {(event) => setName(event.target.value)}
          /*
            This must be a controlled component
          */
        />
      </form>
      <InterviewerList interviewers={props.interviewers} interviewer={interviewer} setInterviewer={setInterviewer} />
    </section>
    <section className="appointment__card-right">
      <section className="appointment__actions">
        <Button danger onClick={cancel}>Cancel</Button>
        <Button confirm onClick={save}>Save</Button>
      </section>
    </section>
  </main> 
  )
}