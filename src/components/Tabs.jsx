export const Tabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-2.5 mb-5">
      <button
        className={`px-5 py-2.5 border-none rounded cursor-pointer transition-colors ${
          activeTab === 'topics'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-500 text-white hover:bg-gray-600'
        }`}
        onClick={() => onTabChange('topics')}
      >
        Topics
      </button>
      <button
        className={`px-5 py-2.5 border-none rounded cursor-pointer transition-colors ${
          activeTab === 'services'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-500 text-white hover:bg-gray-600'
        }`}
        onClick={() => onTabChange('services')}
      >
        Services
      </button>
    </div>
  );
};
