import { Badge, Container } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
const TagCloud = ({ onTagSelect, selectedTagId }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [tags, setTags] = useState([]);

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/tag/tags`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTags(response.data.tags); 
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div >
      <Container className="d-flex justify-content-center">
      {tags.length === 0 ? (
        <p className="display-6">No tags available</p>
      ) : (tags.map((tag) => (
        <Badge
          className='me-2 mb-2'  
          key={tag.id}
          bg= {selectedTagId === tag.id ? "primary" : "secondary"}
          style={{ fontSize: '1.5rem', cursor: 'pointer' }}
          onClick={() => onTagSelect(tag.id)}
        >
          {tag.tagName}
        </Badge>
      )))}
      </Container>
    </div>
  );
};

export default TagCloud;
