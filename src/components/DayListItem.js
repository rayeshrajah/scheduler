import React from 'react';
import classnames from 'classnames';
import "components/DayListItem.scss";


  export default function DayListItem(props) {
    function formatSpots(){
      let remainingSpotMessage = "";
      if(props.spots === 0){
        remainingSpotMessage = "no spots remaining";
      }
      if(props.spots > 1){
        remainingSpotMessage = props.spots + " spots remaining";
      }
      if(props.spots === 1){
        remainingSpotMessage = props.spots + " spot remaining";
      }
      return remainingSpotMessage;
    };

    let dayClass = classnames('day-list__item', {
      'day-list__item--selected': props.selected,
      'day-list__item--full': props.spots === 0
  });
    return (
      <li onClick={() => props.setDay(props.name)} className={dayClass} data-testid="day">
        <h2 className="text--regular">{props.name}</h2>
        <h3 className="text--light">{formatSpots()}</h3> 
      </li>
    );
  }