const pad = nr => nr.toString().padStart(2, '0');

export const format = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const formatDM = (d, m) => `${new Date().getFullYear()}-${pad(m)}-${pad(d)}`;

const todayDate = new Date();
const sundayDate = new Date();
sundayDate.setDate(sundayDate.getDate() + (7 - (sundayDate.getDay() || 7)));

export const today = format(todayDate);
export const sunday = format(sundayDate);

export const getDate = (dateStr) => {
  switch (dateStr.toLowerCase()) {
    case 'l':
      return 'later';
    case 's':
      return 'someday';
    case 'today':
    case 't':
      return today;
    case 'tomorrow':
    case 'tm': {
      const d = new Date();
      d.setDate(todayDate.getDate() + 1);
      return format(d);
    }
    case 'this week':
    case 'tw':
      return sunday;
    case 'next week':
    case 'nw': {
      const d = new Date();
      d.setDate(sundayDate.getDate() + 7);
      return format(d);
    }
    default: {
      const date = /^(\d{1,2})\.(\d{1,2})/;
      const match = dateStr.match(date);
      if (match) {
        const [, day, month] = match;
        return formatDM(day, month);
      }
      return dateStr;
    }
  }
};
