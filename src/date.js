const pad = nr => nr.toString().padStart(2, '0');

const format = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const formatDM = (d, m) => `${new Date().getFullYear()}-${pad(m)}-${pad(d)}`;

export const today = () => format(new Date());
export const sunday = () => {
  const sundayDate = new Date();
  sundayDate.setDate(sundayDate.getDate() + (7 - (sundayDate.getDay() || 7)));
  return format(sundayDate);
};

export const getDate = (dateStr) => {
  const sundayDate = new Date();
  sundayDate.setDate(sundayDate.getDate() + (7 - (sundayDate.getDay() || 7)));

  switch (dateStr.toLowerCase()) {
    case 'l':
      return 'later';
    case 's':
      return 'someday';
    case 'today':
    case 't':
      return format(new Date());
    case 'tomorrow':
    case 'tm': {
      const d = new Date();
      d.setDate(new Date().getDate() + 1);
      return format(d);
    }
    case 'this week':
    case 'tw':
      return format(sundayDate);
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
