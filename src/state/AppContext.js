import React from 'react';

export const AppContext = React.createContext({
  notifications: [],
  unreadCount: 0,
});
