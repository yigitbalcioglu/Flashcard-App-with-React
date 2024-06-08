import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./indexxeddb";

export function GetAllCards () {
  const words = useLiveQuery(async () => {
    //
    // Query the DB using our promise based API.
    // The end result will magically become
    // observable.
    //
    return await db.words;
  });

  return <>
    <h2>words</h2>
    <ul>
      {
        words?.map(word =>
          <li key={word.id}>
            {word.name}, {word.meaning}
          </li>
        )
      }
    </ul>
  </>;
}

/*
  function checkTime(){

    const card = db.cards.get(currentCardId)
    const firstDate = new Date();
    const secondDate = card.time;
    const firstYear = firstDate.getFullYear();
    const firstMonth = firstDate.getMonth();
    const firstDay = firstDate.getDate();
    const secondYear = secondDate.getFullYear();
    const secondMonth = secondDate.getMonth();
    const secondDay = secondDate.getDate();
    const firstHour= firstDate.get(); // returns a number representing the day of the week, starting with 0 for Sunday
    const secondHour = secondDate.getHours();
    const firstMinute = firstDate.getMinutes();
    const secondMinute = secondDate.getMinutes

    //cardın gösterilme zamanı gelmediyse cardın timesi geç yani firstDate < second ise else senaryosunda card gösterilir
    if(firstYear < secondYear || (firstYear === secondYear && firstMonth < secondMonth) || (firstYear === secondYear && firstMonth === secondMonth && firstDay < secondDay) || (firstYear === secondYear && firstMonth === secondMonth && firstDay < secondDay && firstHour < secondHour) || (firstYear === secondYear && firstMonth === secondMonth && firstDay < secondDay && firstHour < secondHour && firstMinute < secondMinute)){
        setValid("false")
    }
    else{
        setValid("true")
    }
  }*/