import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface WebSocketContextType {
  isConnected: boolean;
  lastMessage: any;
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  lastMessage: null,
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    // In production, we'd grab the user ID from auth context. For now, we use a mock one.
    const userId = "00000000-0000-0000-0000-000000000000"; 
    
    // Connect to WebSocket using the current host, handling dev/prod environments
    const wsUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('http', 'ws') + `/ws/${userId}`
      : `ws://localhost:8000/api/v1/ws/${userId}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('WS Message:', message);
        setLastMessage(message);

        // Auto-invalidate TanStack Query caches based on events to enable true real-time UI
        switch (message.type) {
          case 'APPLICATION_CREATED':
          case 'APPLICATION_UPDATED':
          case 'APPLICATION_DELETED':
            // Instead of 60s polling, we invalidate immediately!
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            queryClient.invalidateQueries({ queryKey: ['applicationCounts'] });
            break;
          case 'RESUME_ANALYZED':
            queryClient.invalidateQueries({ queryKey: ['resumes'] });
            break;
          case 'JOB_DISCOVERED':
            queryClient.invalidateQueries({ queryKey: ['discoverJobs'] });
            break;
          default:
            break;
        }
      } catch (e) {
        console.error('Failed to parse WS message', e);
      }
    };

    return () => {
      ws.close();
    };
  }, [queryClient]);

  return (
    <WebSocketContext.Provider value={{ isConnected, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
