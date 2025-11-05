import { useState, useEffect, useCallback } from 'react';
import ROSLIB from 'roslib';

export const useRosConnection = (initialUrl = 'ws://128.148.138.233:9090') => {
  const [ros, setRos] = useState(null);
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState('Not connected');
  const [serverUrl, setServerUrl] = useState(initialUrl);

  const connect = useCallback((url) => {
    if (ros) {
      ros.close();
    }

    setStatus('Connecting...');
    setConnected(false);

    const newRos = new ROSLIB.Ros({
      url: url || serverUrl
    });

    newRos.on('connection', () => {
      setStatus(`Connected to ${url || serverUrl}`);
      setConnected(true);
    });

    newRos.on('error', (error) => {
      setStatus(`Error: ${error}`);
      setConnected(false);
    });

    newRos.on('close', () => {
      setStatus('Connection closed');
      setConnected(false);
    });

    setRos(newRos);
  }, [ros, serverUrl]);

  const disconnect = useCallback(() => {
    if (ros) {
      ros.close();
      setRos(null);
      setConnected(false);
      setStatus('Not connected');
    }
  }, [ros]);

  useEffect(() => {
    return () => {
      if (ros) {
        ros.close();
      }
    };
  }, [ros]);

  return {
    ros,
    connected,
    status,
    serverUrl,
    setServerUrl,
    connect,
    disconnect
  };
};
