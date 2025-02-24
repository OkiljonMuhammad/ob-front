import React, { useState, useEffect } from 'react';
import { Dropdown, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const TopicSuggest = ({ onTopicSelect }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const fetchTopics = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/topic/topics`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTopics(response.data?.topics);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleTopicSelect = (topic) => {
      setSelectedTopic(topic);
      onTopicSelect(topic.id); 
  };

  const handleRemoveTopic = () => {
    setSelectedTopic(null);
  };

  return (
    <div>
      <Row>
      <Col xs="auto">
         <Dropdown>
           <Dropdown.Toggle variant="primary" id="dropdown-basic">
             {selectedTopic ? selectedTopic.topicName : 'Select a topic'}
           </Dropdown.Toggle>
           <Dropdown.Menu>
             {topics.length > 0 ? (
               topics.map((topic) => (
                 <Dropdown.Item key={topic.id} onClick={() => handleTopicSelect(topic)}>
                   {topic.topicName}
                 </Dropdown.Item>
               ))
             ) : (
               <Dropdown.Item disabled>No topics available</Dropdown.Item>
             )}
           </Dropdown.Menu>
         </Dropdown>
      </Col>
      <Col xs="auto">
         {selectedTopic ? 
         <Button variant="danger" onClick={handleRemoveTopic}>
          Remove
          </Button> : null }
      </Col>
        </Row>
       </div>
  );
};

export default TopicSuggest;
