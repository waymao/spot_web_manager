import { useState, useEffect, useCallback } from 'react';
import type { RosType, Topic } from '../types/ros';

export const useTopics = (ros: RosType, connected: boolean) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadTopics = useCallback(() => {
    if (!ros || !connected) {
      setTopics([]);
      return;
    }

    setLoading(true);
    setError(null);

    ros.getTopics(
      (result: { topics: string[]; types: string[] }) => {
        const topicList = result.topics.map((name: string, index: number) => ({
          name,
          type: result.types[index]
        }));
        setTopics(topicList);
        setLoading(false);
      },
      (err: unknown) => {
        console.error('Error getting topics:', err);
        setError('Error loading topics');
        setLoading(false);
      }
    );
  }, [ros, connected]);

  useEffect(() => {
    if (connected) {
      loadTopics();
    }
  }, [connected, loadTopics]);

  return {
    topics,
    loading,
    error,
    refreshTopics: loadTopics
  };
};
