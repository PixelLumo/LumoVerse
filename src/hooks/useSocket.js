import { useEffect, useRef } from 'react';
import { socketService } from '../services/socket/socketService';

export function useSocket() {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = socketService.connect();
    return () => socketService.disconnect();
  }, []);

  return socketRef.current;
}
