import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { toast } from 'react-toastify';

interface ContentUpdate {
  key: string;
  value: any;
  type: string;
  section: string;
  updatedAt: string;
}

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  content: Record<string, any>;
  getContent: (key: string, defaultValue?: any) => any;
  refreshContent: () => Promise<void>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [content, setContent] = useState<Record<string, any>>({});

  useEffect(() => {
    const newSocket = io('http://localhost:5001', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
      
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          newSocket.emit('register', { userId: userData.id, role: userData.role || 'user' });
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    // Listen for content updates
    newSocket.on('content-updated', (updatedContent: ContentUpdate) => {
      setContent(prev => ({
        ...prev,
        [updatedContent.key]: updatedContent
      }));
      toast.info('Content updated', { autoClose: 2000 });
    });

    // Listen for content deletions
    newSocket.on('content-deleted', (data: { key: string }) => {
      setContent(prev => {
        const newContent = { ...prev };
        delete newContent[data.key];
        return newContent;
      });
      toast.info('Content deleted', { autoClose: 2000 });
    });

    // Listen for companion request updates (for users who submitted)
    newSocket.on('request-status-updated', (request: any) => {
      toast.success(`Your companion request has been ${request.status}`, {
        autoClose: 5000
      });
    });

    // Listen for new companion requests (for admins)
    newSocket.on('new-companion-request', (request: any) => {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          if (userData.role === 'admin') {
            toast.info(`New companion request from ${request.fullName}`, {
              autoClose: 5000
            });
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const fetchContent = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5001/api/content');
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  }, []);

  useEffect(() => {
    if (connected) {
      fetchContent();
    }
  }, [connected, fetchContent]);

  const getContent = useCallback((key: string, defaultValue: any = '') => {
    return content[key]?.value ?? defaultValue;
  }, [content]);

  const refreshContent = useCallback(async () => {
    await fetchContent();
  }, [fetchContent]);

  return (
    <SocketContext.Provider value={{
      socket,
      connected,
      content,
      getContent,
      refreshContent
    }}>
      {children}
    </SocketContext.Provider>
  );
};
