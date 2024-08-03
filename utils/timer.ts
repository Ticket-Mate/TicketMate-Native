export const calculateTimer = (startDate: string | Date): string => {
  const eventDate = new Date(startDate);
  const now = new Date();

  const timeDifference = eventDate.getTime() - now.getTime();

  // console.log("Event Date:", eventDate);
  // console.log("Current Date:", nowLocal);
  // console.log("Time Difference (ms):", timeDifference);

  if (timeDifference <= 0) {
    return "Event started";
  }

  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  if (timeDifference < 24 * 60 * 60 * 1000) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else {
    return `${Math.floor(timeDifference / (1000 * 60 * 60 * 24))} days`;
  }
};
