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
    const AM_PM = 'AM';
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
