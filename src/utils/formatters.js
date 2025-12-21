import moment from 'moment';

export const formatters = {
  formatDate: (date) => moment(date).format('YYYY-MM-DD'),
  formatTime: (date) => moment(date).format('HH:mm:ss'),
  formatRelativeTime: (date) => moment(date).fromNow(),
  truncateText: (text, length = 50) => text.length > length ? text.substring(0, length) + '...' : text,
};
