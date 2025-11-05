import { useState } from 'react';
import { SearchBox } from './SearchBox';

export const ServicesList = ({ services, loading, error, onRefresh, onServiceSelect, selectedService }) => {
  const [searchText, setSearchText] = useState('');

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchText.toLowerCase()) ||
      service.type.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex-1 bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Available Services</h2>
      <SearchBox
        value={searchText}
        onChange={setSearchText}
        placeholder="Search services..."
      />
      <button
        className="bg-green-500 text-white px-5 py-2.5 rounded cursor-pointer mb-2.5 hover:bg-green-600 transition-colors"
        onClick={onRefresh}
      >
        Refresh Services
      </button>
      <div className="max-h-[500px] overflow-y-auto border border-gray-300 rounded">
        {loading && <p className="p-2.5">Loading services...</p>}
        {error && <p className="p-2.5 text-red-500">{error}</p>}
        {!loading && !error && filteredServices.length === 0 && services.length === 0 && (
          <p className="p-2.5">Connect to rosbridge to see services</p>
        )}
        {!loading && !error && filteredServices.length === 0 && services.length > 0 && (
          <p className="p-2.5">No services match your search</p>
        )}
        {filteredServices.map((service) => (
          <div
            key={service.name}
            className={`p-2.5 border-b border-gray-200 cursor-pointer transition-colors ${
              selectedService?.name === service.name
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => onServiceSelect(service)}
          >
            <div className="font-bold">{service.name}</div>
            <div className={`text-sm mt-1 ${
              selectedService?.name === service.name ? 'text-gray-200' : 'text-gray-600'
            }`}>
              {service.type}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
