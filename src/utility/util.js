export const isValidDate = (date) => {
  if (Object.prototype.toString.call(date) === "[object Date]") {
    // it is a date
    if (isNaN(date.getTime())) {  // d.valueOf() could also work
      // date is not valid
      return false;
    } else {
      // date is valid
      return true;
    }
  } else {
    // not a date
    return false;
  }
};

const SECONDS_IN_DAY = 86400;
const DAYS_OF_WEEK = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export const getDateDisplayString = (date) => {

  const dateNow = new Date();
  const diffInSeconds = (dateNow.getTime() - date.getTime()) / 1000;
  const diffInDays = diffInSeconds / SECONDS_IN_DAY;

  if (diffInDays < 1 && date.getDay() === dateNow.getDay()) {
    // within the same day

    // TODO: would ideally use date.toLocaleTimeString('en-US', options), but proper formatting doesn't seem to work
    // instead have to manually format, which won't support timestamp formats in other regions/countries
    let AM_PM = 'AM';
    let hour = date.getHours();
    if (hour === 0) {
      hour = 12;
    }
    if (hour > 12) {
      hour -= 12;
      AM_PM = 'PM';
    }
    let minute = date.getMinutes();
    if (minute < 10) {
      minute = `0${minute}`;
    }

    return `${hour}:${minute} ${AM_PM}`;

  }
  if (diffInDays < 7 && date.getDay() !== dateNow.getDay()) {
    // within same week
    return DAYS_OF_WEEK[date.getDay()];
  }

  // TODO: would ideally use date.toLocaleDateString('en-US', options), but proper formatting doesn't seem to work
  // instead have to manually format, which won't support timestamp formats in other regions/countries
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1; // getMonth() is 0 indexed
  const year = date.getFullYear().toString().substr(-2);
  return `${month}/${dayOfMonth}/${year}`
  
};


export const  debounce = (func, wait, immediate) => {
  // 'private' variable for instance
  // The returned function will be able to reference this due to closure.
  // Each call to the returned function will share this common timer.
  let timeout;

  // Calling debounce returns a new anonymous function
  return async () => {
    // reference the context and args for the setTimeout function
    const context = this, args = arguments;

    // Should the function be called now? If immediate is true
    //   and not already in a timeout then the answer is: Yes
    const callNow = immediate && !timeout;

    // This is the basic debounce behaviour where you can call this 
    //   function several times, but it will only execute once 
    //   [before or after imposing a delay]. 
    //   Each time the returned function is called, the timer starts over.
    clearTimeout(timeout);

    // Set the new timeout
    timeout = setTimeout(async () => {

      // Inside the timeout function, clear the timeout variable
      // which will let the next execution run when in 'immediate' mode
      timeout = null;

      // Check if the function already ran with the immediate flag
      if (!immediate) {
        // Call the original function with apply
        // apply lets you define the 'this' object as well as the arguments 
        //    (both captured before setTimeout)
        await func.apply(context, args);
      }
    }, wait);

    // Immediate mode and no wait timer? Execute the function..
    if (callNow) await func.apply(context, args);
  }
}
