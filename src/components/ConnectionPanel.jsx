import { useState } from 'react';

export const ConnectionPanel = ({ serverUrl, status, connected, onConnect }) => {
  const [url, setUrl] = useState(serverUrl);

  const handleConnect = () => {
    onConnect(url);
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md mb-5">
      <div className="flex gap-2.5 items-center mb-2.5">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="ws://128.148.138.233:9090"
          className="flex-1 p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
        />
        <button
          className="bg-blue-500 text-white px-8 py-2.5 rounded hover:bg-blue-600 transition-colors"
          onClick={handleConnect}
        >
          Connect
        </button>
      </div>
      <div className={`p-2.5 my-2.5 rounded font-bold ${
        connected
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}>
        {status}
      </div>
    </div>
  );
};
