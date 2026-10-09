import { useEffect, useState, useCallback } from 'react';

export function useRealTime() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<'connecting' | 'open' | 'closed'>('connecting');

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setStatus('open');
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
      setStatus('closed');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = useCallback((msg: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(msg));
    }
  }, [socket]);

  return { socket, status, sendMessage };
}
