import { useState } from 'react';
import { ConnectionPanel } from './components/ConnectionPanel';
import { Tabs } from './components/Tabs';
import { TopicsList } from './components/TopicsList';
import { MessageViewer } from './components/MessageViewer';
import { ServicesList } from './components/ServicesList';
import { ServiceCaller } from './components/ServiceCaller';
import { SpotQuickActions } from './components/SpotQuickActions';
import { useRosConnection } from './hooks/useRosConnection';
import { useTopics } from './hooks/useTopics';
import { useServices } from './hooks/useServices';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('topics');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const {
    ros,
    connected,
    status,
    serverUrl,
    connect
  } = useRosConnection('ws://128.148.138.132:9090');

  const {
    topics,
    loading: topicsLoading,
    error: topicsError,
    refreshTopics
  } = useTopics(ros, connected);

  const {
    services,
    loading: servicesLoading,
    error: servicesError,
    refreshServices
  } = useServices(ros, connected);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };
  
  const spotConfigs = [
    {spotName: "spot", spotIntialLoc: [4, 1, -1.57], spotDockId: 549},
    {spotName: "spot2", spotIntialLoc: [2.5, 1, -1.57], spotDockId: 521}
  ]
  const fidualLoc = [1, -0.5, -1.57]; // Example fiducial location

  return (
    <div className="max-w-[1400px] mx-auto p-5 bg-gray-100 min-h-screen font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-5">ROS Topic Subscriber & Service Caller</h1>

      <ConnectionPanel
        serverUrl={serverUrl}
        status={status}
        connected={connected}
        onConnect={connect}
      />

      <div className="mb-5">
        <h3 className="text-xl font-bold mb-3">Spot Quick Control</h3>
        <div className="flex flex-col gap-3">
          {spotConfigs.map(spotConfig => (
            <SpotQuickActions
              key={spotConfig.spotName}
              spotConfig={spotConfig}
              ros={ros}
              connected={connected}
              fiducialLoc={fidualLoc}
            />
          ))}
        </div>
      </div>

      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'topics' && (
        <div className="flex gap-5">
          <TopicsList
            topics={topics}
            loading={topicsLoading}
            error={topicsError}
            onRefresh={refreshTopics}
            onTopicSelect={handleTopicSelect}
            selectedTopic={selectedTopic}
          />
          <MessageViewer
            ros={ros}
            selectedTopic={selectedTopic}
            connected={connected}
          />
        </div>
      )}

      {activeTab === 'services' && (
        <div className="flex gap-5">
          <ServicesList
            services={services}
            loading={servicesLoading}
            error={servicesError}
            onRefresh={refreshServices}
            onServiceSelect={handleServiceSelect}
            selectedService={selectedService}
          />
          <ServiceCaller
            ros={ros}
            selectedService={selectedService}
            connected={connected}
          />
        </div>
      )}
    </div>
  );
}

export default App;
