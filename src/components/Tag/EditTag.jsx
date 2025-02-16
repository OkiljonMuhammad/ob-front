import React, { useState, useEffect, useCallback } from 'react';
import CreatableSelect from 'react-select/creatable';
import axios from 'axios';
import { debounce } from 'lodash';

const EditTag = ({ onTagsChange, initialTags }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState(initialTags || []);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    setSelectedTags(initialTags || []);
  }, [initialTags]);

  // Fetch tag suggestions with debouncing
  const loadOptions = useCallback(
    debounce(async (input) => {
      if (input.length < 2) return; // Only fetch when input has 2+ characters
      try {
        const response = await axios.get(`${BASE_URL}/api/tag/suggest?q=${input}`);
        const tags = response.data.tags
          .map((tag) => ({ value: tag.id, label: tag.tagName }))
          .filter((tag) => !selectedTags.some((selected) => selected.value === tag.value));
        setOptions(tags);
      } catch (error) {
        console.error('Error fetching tag suggestions:', error);
      }
    }, 300), // Debounce API calls to prevent excessive requests
    [selectedTags]
  );

  // Handle input changes for searching/creating
  const handleInputChange = (newValue, { action }) => {
    if (action === 'input-change') {
      setInputValue(newValue);
      if (newValue.length >= 2) {
        loadOptions(newValue);
      } else {
        setOptions([]); // Clear options if input is too short
      }
    }
  };

  // Handle tag selection
  const handleChange = (selectedOptions) => {
    setSelectedTags(selectedOptions);
    setInputValue('');
    onTagsChange(selectedOptions.map((option) => option.label));
  };

  // Handle adding new custom tag
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      event.preventDefault(); // Prevent form submission
      const normalizedInput = inputValue.toLowerCase();
      const isDuplicate = selectedTags.some((tag) => tag.label.toLowerCase() === normalizedInput);

      if (!isDuplicate) {
        const newTag = { value: inputValue, label: inputValue };
        setSelectedTags([...selectedTags, newTag]);
        onTagsChange([...selectedTags, newTag].map((tag) => tag.label));
      }

      setInputValue(''); // Clear input
    }
  };

  return (
    <CreatableSelect
      isMulti
      options={options}
      value={selectedTags}
      onInputChange={handleInputChange}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      inputValue={inputValue}
      placeholder="Type to search or create a new tag..."
      formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
    />
  );
};

export default EditTag;
