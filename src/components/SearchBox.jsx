export const SearchBox = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <input
      type="text"
      className="w-full p-2.5 mb-2.5 border border-gray-300 rounded text-sm box-border focus:outline-none focus:border-blue-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};
