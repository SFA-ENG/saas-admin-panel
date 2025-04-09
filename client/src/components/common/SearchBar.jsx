import { useState, useEffect } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

/**
 * Reusable search component that can be used across the application
 * 
 * @param {Object} props
 * @param {string} props.placeholder - Placeholder text for the search input
 * @param {function} props.onSearch - Function to call when search value changes
 * @param {string} props.value - Current search value (controlled component)
 * @param {function} props.onChange - Function to handle search value changes
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.debounce - Debounce delay in milliseconds (default: 300ms)
 */
const SearchBar = ({
  placeholder = "Search...",
  onSearch,
  value,
  onChange,
  className = "",
  debounce = 300
}) => {
  const [searchTerm, setSearchTerm] = useState(value || "");
  
  // Handle controlled component case
  useEffect(() => {
    if (value !== undefined && value !== searchTerm) {
      setSearchTerm(value);
    }
  }, [value]);

  // Debounce search to avoid excessive updates
  useEffect(() => {
    const handler = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm);
      }
    }, debounce);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, onSearch, debounce]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={`search-bar-container ${className}`}>
      <Input
        prefix={<SearchOutlined className="text-gray-400" />}
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        className="rounded border border-gray-300 hover:border-[#6366F1] focus:border-[#6366F1]"
        allowClear
      />
    </div>
  );
};

export default SearchBar;