const pad = nr => nr.toString().padStart(2, '0');

export const format = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const todayDate = new Date();
const sundayDate = new Date();
sundayDate.setDate(sundayDate.getDate() + (7 - sundayDate.getDay()));

export const today = format(todayDate);
export const sunday = format(sundayDate);

export const getDate = (dateStr) => {
  switch (dateStr) {
    case 't':
      return today;
    case 'l':
      return 'later';
    case 's':
      return 'someday';
    case 'tm': {
      const d = new Date();
      d.setDate(todayDate.getDate() + 1);
      return format(d);
    }
    case 'tw':
      return sunday;
    case 'nw': {
      const d = new Date();
      d.setDate(sundayDate.getDate() + 1);
      return format(d);
    }
    default:
      return dateStr;
  }
};
