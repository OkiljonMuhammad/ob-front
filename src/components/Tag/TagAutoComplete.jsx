import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

const TagAutoComplete = ({ onTagsChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch tag suggestions from the backend
  const loadOptions = async (input) => {
    if (!input || input.length < 2) return; // Only fetch suggestions for inputs with at least 2 characters
    try {
      const response = await axios.get(
        `${BASE_URL}/api/tag/suggest?q=${input}`
      );
      const tags = response.data.tags.map((tag) => ({
        value: tag.id,
        label: tag.tagName,
      }));
      setOptions(tags);
    } catch (error) {
      console.error('Error fetching tag suggestions:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (newValue) => {
    setInputValue(newValue);
    if (newValue.length >= 2) {
      loadOptions(newValue);
    } else {
      setOptions([]); // Clear options if input is too short
    }
  };

  // Handle tag selection, including new custom tags
  const handleChange = (selectedOptions) => {
    setSelectedTags(selectedOptions);
    onTagsChange(selectedOptions.map((option) => option.label)); // Pass selected tags to parent
  };

  // Handle adding a new custom tag when the user presses Enter
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      event.preventDefault(); // Prevent form submission

      // Check if tag already exists (case-insensitive)
      const isDuplicate = selectedTags.some(
        (tag) => tag.label.toLowerCase() === inputValue.toLowerCase()
      );

      if (!isDuplicate) {
        const newTag = { value: inputValue, label: inputValue };
        const updatedTags = [...selectedTags, newTag];
        setSelectedTags(updatedTags);
        onTagsChange(updatedTags.map((tag) => tag.label)); // Notify parent of updated tags
      }

      setInputValue(''); // Clear input after adding tag
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
    />
  );
};

export default TagAutoComplete;
