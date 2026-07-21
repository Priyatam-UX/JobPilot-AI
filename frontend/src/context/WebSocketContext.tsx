import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';

interface WebSocketContextType {
  isConnected: boolean;
  lastMessage: any;
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  lastMessage: null,
});

export const useWebSocket = () => useContext(WebSocketContext);

// Base URL handling for WebSocket connection (derive from API URL to prevent mismatch)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const normalizedApiUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
let WS_BASE_URL = '';
if (normalizedApiUrl.startsWith('/')) {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  WS_BASE_URL = `${protocol}//${window.location.host}${normalizedApiUrl}/ws`;
} else {
  WS_BASE_URL = normalizedApiUrl.replace('http://', 'ws://').replace('https://', 'wss://') + '/ws';
}

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
      return;
    }

    let reconnectTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      if (ws.current?.readyState === WebSocket.OPEN) return;

      const wsUrl = `${WS_BASE_URL}/${user.id}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('WebSocket Connected');
        setIsConnected(true);
      };

      ws.current.onclose = () => {
        console.log('WebSocket Disconnected');
        setIsConnected(false);
        ws.current = null;
        // Exponential backoff reconnect could be added here
        reconnectTimeout = setTimeout(connect, 3000);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket Error:', error);
        ws.current?.close();
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('WS Message:', message);
          setLastMessage(message);

          // Auto-invalidate TanStack Query caches based on events to enable true real-time UI
          switch (message.type) {
            case 'APPLICATION_CREATED':
            case 'APPLICATION_UPDATED':
            case 'APPLICATION_DELETED':
              queryClient.invalidateQueries({ queryKey: ['applications'] });
              queryClient.invalidateQueries({ queryKey: ['applicationCounts'] });
              queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
              queryClient.invalidateQueries({ queryKey: ['discoverJobs'] });
              break;
            case 'RESUME_ANALYZED':
            case 'RESUME_DELETED':
              queryClient.invalidateQueries({ queryKey: ['resumes'] });
              queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
              break;
            case 'JOB_DISCOVERED':
              queryClient.invalidateQueries({ queryKey: ['discoverJobs'] });
              queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
              break;
            case 'DASHBOARD_UPDATE':
              queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
              break;
            default:
              break;
          }
        } catch (e) {
          console.error('Failed to parse WS message', e);
        }
      };
    };

    connect();

    // Heartbeat to prevent Render from closing idle connections (55s limit)
    const heartbeatInterval = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);

    return () => {
      clearTimeout(reconnectTimeout);
      clearInterval(heartbeatInterval);
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [user?.id, isAuthenticated, queryClient]);

  return (
    <WebSocketContext.Provider value={{ isConnected, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
