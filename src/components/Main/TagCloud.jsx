import { Badge, Container } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import ThemeContext from '../../context/ThemeContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const TagCloud = ({ onTagSelect, selectedTagId }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [tags, setTags] = useState([]);
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/tag/tags`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTags(response.data?.tags ?? []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <Container 
      className={`d-flex flex-wrap justify-content-center bg-${theme} text-${theme === 'light' ? 'dark' : 'white'}`}
      style={{ padding: '1rem' }}
    >
      {tags.length === 0 ? (
        <p className="display-6">{t('noTagsFound')}</p>
      ) : (
        tags.map((tag) => (
          <Badge
            className={`me-2 mb-2 text-dark`}
            key={tag.id}
            bg={selectedTagId === tag.id ? "primary" : "info"}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.5rem)',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              whiteSpace: 'nowrap'
            }}
            onClick={() => onTagSelect(tag.id)}
          >
            {tag.tagName}
          </Badge>
        ))
      )}
    </Container>
  );
};

export default TagCloud;