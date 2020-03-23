import React, { useState } from 'react';
import InterviewerList from "../InterviewerList";
import Button from "../Button";

export default function Form(props){
  let [name, setName] = useState(props.name || "");
  let [interviewer, setInterviewer] = useState(props.interviewer || null);
  let [error, setError] = useState("");

    const reset = function(){
      setName("");
      setError("");
      setInterviewer(null);
    }
    const cancel = function(){
      reset();
      props.onCancel();
    }
    const save = function(){
      props.onSave(name, interviewer)
    }
    const validate = function(){
      if(name === ""){
        setError("Student name cannot be blank");
        return;
      }
      setError("");
      save();
    }

  return(
    <main className="appointment__card appointment__card--create">
    <section className="appointment__card-left">
      <form autoComplete="off" onSubmit={(event) => event.preventDefault()}>
        <input 
          data-testid = "student-name-input"
          className="appointment__create-input text--semi-bold"
          name="name"
          value={name}
          type="text"
          placeholder="Enter Student Name"
          onChange = {(event) => setName(event.target.value)}
        />
      </form>
      <section className = "appointment__validation">{error}</section>
      <InterviewerList interviewers={props.interviewers} interviewer={interviewer} setInterviewer={setInterviewer} />
    </section>
    <section className="appointment__card-right">
      <section className="appointment__actions">
        <Button danger onClick={cancel}>Cancel</Button>
        <Button confirm onClick={validate}>Save</Button>
      </section>
    </section>
  </main> 
  )
}