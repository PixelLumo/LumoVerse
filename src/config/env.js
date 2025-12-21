const ENV = {
  dev: {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    socketUrl: process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000',
  },
  prod: {
    apiUrl: 'https://api.lumoverse.com/api',
    socketUrl: 'https://api.lumoverse.com',
  },
};

export default __DEV__ ? ENV.dev : ENV.prod;
