import React, { useState, useContext } from 'react';
import Select from 'react-select';
import axios from 'axios';
import ThemeContext from '../../context/ThemeContext';

const TagAutoComplete = ({ onTagsChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { theme } = useContext(ThemeContext); 

  const loadOptions = async (input) => {
    if (!input || input.length < 2) return;
    try {
      const response = await axios.get(
        `${BASE_URL}/api/tag/suggest?q=${input}`
      );
      const tags = response.data?.tags?.map((tag) => ({
        value: tag.id,
        label: tag.tagName,
      }));
      setOptions(tags);
    } catch (error) {
      console.error('Error fetching tag suggestions:', error);
    }
  };

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
    if (newValue.length >= 2) {
      loadOptions(newValue);
    } else {
      setOptions([]);
    }
  };

  const handleChange = (selectedOptions) => {
    setSelectedTags(selectedOptions);
    onTagsChange(selectedOptions.map((option) => option.label));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      event.preventDefault();

      const isDuplicate = selectedTags.some(
        (tag) => tag.label.toLowerCase() === inputValue.toLowerCase()
      );

      if (!isDuplicate) {
        const newTag = { value: inputValue, label: inputValue };
        const updatedTags = [...selectedTags, newTag];
        setSelectedTags(updatedTags);
        onTagsChange(updatedTags.map((tag) => tag.label));
      }

      setInputValue('');
    }
  };

  return (
    <Select
      isMulti
      options={options}
      value={selectedTags}
      onInputChange={handleInputChange}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      inputValue={inputValue}
      placeholder="Type to search or create a new tag..."
      allowCreateWhileLoading
      formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
      classNamePrefix="select"
      className={`theme-${theme}`}
    />
  );
};

export default TagAutoComplete;
