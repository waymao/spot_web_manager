import { useState, useEffect, useCallback } from 'react';

export const useTopics = (ros, connected) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTopics = useCallback(() => {
    if (!ros || !connected) {
      setTopics([]);
      return;
    }

    setLoading(true);
    setError(null);

    ros.getTopics(
      (result) => {
        const topicList = result.topics.map((name, index) => ({
          name,
          type: result.types[index]
        }));
        setTopics(topicList);
        setLoading(false);
      },
      (err) => {
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
