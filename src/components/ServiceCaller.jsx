import { useState } from 'react';
import ROSLIB from 'roslib';

const MAX_RESPONSES = 50;

export const ServiceCaller = ({ ros, selectedService, connected }) => {
  const [requestText, setRequestText] = useState('{}');
  const [responses, setResponses] = useState([]);
  const [calling, setCalling] = useState(false);

  const handleCallService = () => {
    if (!ros || !connected || !selectedService) {
      return;
    }

    let request;
    try {
      request = JSON.parse(requestText);
    } catch (e) {
      displayResponse({ error: 'Invalid JSON: ' + e.message }, true);
      return;
    }

    setCalling(true);

    // Show loading indicator
    const now = new Date();
    const timeString = now.toLocaleTimeString() + '.' + now.getMilliseconds();
    const loadingResponse = {
      time: timeString,
      data: { message: 'Calling service...' },
      isLoading: true
    };

    setResponses((prev) => [loadingResponse, ...prev].slice(0, MAX_RESPONSES));

    const service = new ROSLIB.Service({
      ros: ros,
      name: selectedService.name,
      serviceType: selectedService.type
    });

    const serviceRequest = new ROSLIB.ServiceRequest(request);

    service.callService(
      serviceRequest,
      (result) => {
        // Remove loading indicator and add actual response
        setResponses((prev) => {
          const filtered = prev.filter((r) => !r.isLoading);
          return [
            {
              time: timeString,
              data: result,
              isError: false
            },
            ...filtered
          ].slice(0, MAX_RESPONSES);
        });
        setCalling(false);
      },
      (error) => {
        // Remove loading indicator and add error
        setResponses((prev) => {
          const filtered = prev.filter((r) => !r.isLoading);
          return [
            {
              time: timeString,
              data: { error: 'Service call failed: ' + error },
              isError: true
            },
            ...filtered
          ].slice(0, MAX_RESPONSES);
        });
        setCalling(false);
      }
    );
  };

  const displayResponse = (data, isError) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString() + '.' + now.getMilliseconds();

    setResponses((prev) => [
      {
        time: timeString,
        data: data,
        isError: isError
      },
      ...prev
    ].slice(0, MAX_RESPONSES));
  };

  return (
    <div className="flex-1 bg-white">
      <h2 className="text-xl font-bold mb-4">Call Service</h2>
      <p className="mb-4">
        {selectedService
          ? `Service: ${selectedService.name} (${selectedService.type})`
          : 'Select a service to call'}
      </p>
      <div className="mt-5">
        <label htmlFor="service-request" className="block mb-1 font-bold">
          Request (JSON):
        </label>
        <textarea
          id="service-request"
          value={requestText}
          onChange={(e) => setRequestText(e.target.value)}
          placeholder={'{\n  "param1": "value1",\n  "param2": 123\n}'}
          className="w-full min-h-[200px] p-2.5 border border-gray-300 rounded font-mono text-sm box-border focus:outline-none focus:border-blue-500"
        />
        <button
          className="bg-blue-500 text-white px-5 py-2.5 rounded cursor-pointer mt-2.5 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          onClick={handleCallService}
          disabled={!selectedService || calling}
        >
          {calling ? 'Calling...' : 'Call Service'}
        </button>
      </div>
      <h3 className="text-lg font-bold mt-5 mb-2">Response:</h3>
      <div className="max-h-[500px] overflow-y-auto border border-gray-300 p-2.5 rounded bg-gray-50 font-mono text-sm">
        {responses.map((response, index) => (
          <div
            key={index}
            className={`mb-2.5 p-2 bg-white border-l-4 break-words ${
              response.isError
                ? 'border-red-500'
                : response.isLoading
                ? 'border-blue-500'
                : 'border-green-500'
            }`}
          >
            <div className="text-gray-600 text-xs mb-1">{response.time}</div>
            <pre className="whitespace-pre-wrap">
              {response.isLoading ? (
                <span className="text-gray-600 italic">
                  {response.data.message}
                  <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin ml-2 align-middle"></span>
                </span>
              ) : (
                JSON.stringify(response.data, null, 2)
              )}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};
