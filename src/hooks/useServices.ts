import { useState, useEffect, useCallback } from 'react';
import type { RosType, Service } from '../types/ros';

export const useServices = (ros: RosType, connected: boolean) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadServices = useCallback(() => {
    if (!ros || !connected) {
      setServices([]);
      return;
    }

    setLoading(true);
    setError(null);

    ros.getServices(
      (serviceNames: string[]) => {
        const servicePromises = serviceNames.map((name: string) => {
          return new Promise<Service>((resolve) => {
            ros.getServiceType(
              name,
              (type: string) => {
                resolve({ name, type });
              },
              (err: unknown) => {
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
      (err: unknown) => {
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
