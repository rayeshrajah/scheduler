import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
//trasition function which takes in the parameter of which mode 
//its on and sets the mode accordingly
  const transition = function(mode, replace = false) {
    if (replace) {
      setMode(mode);
    } else {
      setMode(mode);
      setHistory(prev => ([...prev, mode]));
    }
  };
//back function which goes back to the previous mode.
  const back = function() {
    if (history.length === 1) {
      setMode(initial);
    } else {
      setMode(history[history.length - 2]);
      setHistory(prev => ([...prev.slice(0, history.length - 1)]));
    }
  };

  return { mode, transition, back };
}
