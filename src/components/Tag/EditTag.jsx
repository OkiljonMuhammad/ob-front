import React, { useState, useEffect, useCallback, useContext } from 'react';
import CreatableSelect from 'react-select/creatable';
import axios from 'axios';
import { debounce } from 'lodash';
import ThemeContext from '../../context/ThemeContext';

const EditTag = ({ onTagsChange, initialTags }) => {
  const { theme } = useContext(ThemeContext); 
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState(initialTags || []);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    setSelectedTags(initialTags || []);
  }, [initialTags]);

  const loadOptions = useCallback(
    debounce(async (input) => {
      if (input.length < 2) return;
      try {
        const response = await axios.get(`${BASE_URL}/api/tag/suggest?q=${input}`);
        const tags = response.data.tags
          .map((tag) => ({ value: tag.id, label: tag.tagName }))
          .filter((tag) => !selectedTags.some((selected) => selected.value === tag.value));
        setOptions(tags);
      } catch (error) {
        console.error('Error fetching tag suggestions:', error);
      }
    }, 300),
    [selectedTags]
  );

  const handleInputChange = (newValue, { action }) => {
    if (action === 'input-change') {
      setInputValue(newValue);
      if (newValue.length >= 2) {
        loadOptions(newValue);
      } else {
        setOptions([]);
      }
    }
  };

  const handleChange = (selectedOptions) => {
    setSelectedTags(selectedOptions);
    setInputValue('');
    onTagsChange(selectedOptions);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      event.preventDefault();
      const normalizedInput = inputValue.toLowerCase();
      const isDuplicate = selectedTags.some((tag) => tag.label.toLowerCase() === normalizedInput);

      if (!isDuplicate) {
        const newTag = { value: normalizedInput, label: inputValue };
        setSelectedTags([...selectedTags, newTag]);
        onTagsChange([...selectedTags, newTag]);
      }      

      setInputValue('');
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
      classNamePrefix="select"
      className={`theme-${theme}`}
    />
  );
};

export default EditTag;
