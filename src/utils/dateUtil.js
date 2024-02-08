function getFormattedDate(value, type, inMS, timeZone) {
  if (!type) return value;

  if (!inMS) {
    value = value * 1000;
  }

  const date = new Date(value);

  // Adjust the date according to the timezone offset
  date.setSeconds(date.getSeconds() + timeZone - 21600);

  let options;

  if (type === "date") {
    options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
  } else {
    options = {
      hour: "numeric",
      minute: "numeric",
    };
  }
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export { getFormattedDate };
