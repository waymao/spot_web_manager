import { useState } from 'react';
import { SearchBox } from './SearchBox';

export const TopicsList = ({ topics, loading, error, onRefresh, onTopicSelect, selectedTopic }) => {
  const [searchText, setSearchText] = useState('');

  const filteredTopics = topics.filter(
    (topic) =>
      topic.name.toLowerCase().includes(searchText.toLowerCase()) ||
      topic.type.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex-1 bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Available Topics</h2>
      <SearchBox
        value={searchText}
        onChange={setSearchText}
        placeholder="Search topics..."
      />
      <button
        className="bg-green-500 text-white px-5 py-2.5 rounded cursor-pointer mb-2.5 hover:bg-green-600 transition-colors"
        onClick={onRefresh}
      >
        Refresh Topics
      </button>
      <div className="max-h-[500px] overflow-y-auto border border-gray-300 rounded">
        {loading && <p className="p-2.5">Loading topics...</p>}
        {error && <p className="p-2.5 text-red-500">{error}</p>}
        {!loading && !error && filteredTopics.length === 0 && topics.length === 0 && (
          <p className="p-2.5">Connect to rosbridge to see topics</p>
        )}
        {!loading && !error && filteredTopics.length === 0 && topics.length > 0 && (
          <p className="p-2.5">No topics match your search</p>
        )}
        {filteredTopics.map((topic) => (
          <div
            key={topic.name}
            className={`p-2.5 border-b border-gray-200 cursor-pointer transition-colors ${
              selectedTopic?.name === topic.name
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => onTopicSelect(topic)}
          >
            <div className="font-bold">{topic.name}</div>
            <div className={`text-sm mt-1 ${
              selectedTopic?.name === topic.name ? 'text-gray-200' : 'text-gray-600'
            }`}>
              {topic.type}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
