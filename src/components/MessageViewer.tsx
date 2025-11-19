import { useState, useEffect, useRef } from 'react';
import ROSLIB from 'roslib';
import { RosType, Topic } from '../types/ros';

const MAX_MESSAGES = 50;

interface Message {
  time: string;
  data: any;
}

interface MessageViewerProps {
  ros: RosType;
  selectedTopic: Topic | null;
  connected: boolean;
}

export const MessageViewer = ({ ros, selectedTopic, connected }: MessageViewerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [subscription, setSubscription] = useState<ROSLIB.Topic | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ros || !connected || !selectedTopic) {
      if (subscription) {
        subscription.unsubscribe();
        setSubscription(null);
      }
      setMessages([]);
      return;
    }

    // Unsubscribe from previous topic
    if (subscription) {
      subscription.unsubscribe();
    }

    // Clear messages
    setMessages([]);

    // Create new subscription
    const topic = new ROSLIB.Topic({
      ros: ros,
      name: selectedTopic.name,
      messageType: selectedTopic.type
    });

    topic.subscribe((message) => {
      const now = new Date();
      const timeString = now.toLocaleTimeString() + '.' + now.getMilliseconds();

      setMessages((prevMessages) => {
        const newMessages = [
          {
            time: timeString,
            data: message
          },
          ...prevMessages
        ];
        return newMessages.slice(0, MAX_MESSAGES);
      });
    });

    setSubscription(topic);

    return () => {
      if (topic) {
        topic.unsubscribe();
      }
    };
  }, [ros, selectedTopic, connected]);

  const handleUnsubscribe = () => {
    if (subscription) {
      subscription.unsubscribe();
      setSubscription(null);
    }
    setMessages([]);
  };

  return (
    <div className="flex-1 bg-white">
      <h2 className="text-xl font-bold mb-4">Messages</h2>
      <p id="subscription-info" className="mb-2">
        {selectedTopic ? `Subscribed to: ${selectedTopic.name}` : 'Select a topic to subscribe'}
      </p>
      <button
        onClick={handleUnsubscribe}
        disabled={!subscription}
        className="bg-red-500 text-white px-5 py-2.5 rounded cursor-pointer mb-2.5 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Unsubscribe
      </button>
      <div className="max-h-[500px] overflow-y-auto border border-gray-300 p-2.5 rounded bg-gray-50 font-mono text-sm" ref={messagesRef}>
        {messages.map((msg, index) => (
          <div key={index} className="mb-2.5 p-2 bg-white border-l-4 border-blue-500 break-words">
            <div className="text-gray-600 text-xs mb-1">{msg.time}</div>
            <pre className="whitespace-pre-wrap">{JSON.stringify(msg.data, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
};
