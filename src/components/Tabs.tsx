interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const Tabs = ({ activeTab, onTabChange }: TabsProps) => {
  const tabs: Tab[] = [
    { id: 'quick-control', label: 'Spot Quick Control' },
    { id: 'directional', label: 'Directional Control' },
    { id: 'topics', label: 'Topics' },
    { id: 'services', label: 'Services' }
  ];

  return (
    <div className="border-b border-gray-300">
      <div className="flex gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`px-6 py-3 font-medium cursor-pointer transition-all relative ${
              activeTab === tab.id
                ? 'text-blue-600 bg-white border-t-2 border-l border-r border-blue-500 rounded-t-lg -mb-px'
                : 'text-gray-600 bg-gray-100 border-t border-l border-r border-transparent rounded-t-lg hover:text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
