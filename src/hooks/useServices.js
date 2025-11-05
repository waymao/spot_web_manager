import { useState, useEffect, useCallback } from 'react';

export const useServices = (ros, connected) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadServices = useCallback(() => {
    if (!ros || !connected) {
      setServices([]);
      return;
    }

    setLoading(true);
    setError(null);

    ros.getServices(
      (serviceNames) => {
        const servicePromises = serviceNames.map((name) => {
          return new Promise((resolve) => {
            ros.getServiceType(
              name,
              (type) => {
                resolve({ name, type });
              },
              (err) => {
                console.error(`Error getting service type for ${name}:`, err);
                resolve({ name, type: 'unknown' });
              }
            );
          });
        });

        Promise.all(servicePromises).then((serviceList) => {
          setServices(serviceList);
          setLoading(false);
        });
      },
      (err) => {
        console.error('Error getting services:', err);
        setError('Error loading services');
        setLoading(false);
      }
    );
  }, [ros, connected]);

  useEffect(() => {
    if (connected) {
      loadServices();
    }
  }, [connected, loadServices]);

  return {
    services,
    loading,
    error,
    refreshServices: loadServices
  };
};
