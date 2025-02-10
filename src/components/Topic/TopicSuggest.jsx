import React, { useState, useEffect } from 'react';
import { Dropdown, Badge, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const TopicSuggest = ({ onTopicSelect }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [topics, setTopics] = useState([]); // State to hold all topics
  const [selectedTopic, setSelectedTopic] = useState([]); // State to hold selected topics

  // Fetch topics from the database
  const fetchTopics = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/topic/topics`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTopics(response.data.topics); // Extract topics from the response
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Failed to load topics. Please try again.');
    }
  };

  // Fetch topics when the component mounts
  useEffect(() => {
    fetchTopics();
  }, []);

  // Handle topic selection
  const handleTopicSelect = (topicId, topicName) => {
    if (!selectedTopic.some((topic) => topic.id === topicId)) {
      // Add the topic to the selected list
      setSelectedTopic((prevSelected) => [
        ...prevSelected,
        { id: topicId, name: topicName },
      ]);
      onTopicSelect(topicId); // Notify the parent component
    }
  };

  // Handle removing a selected topic
  const handleRemoveTopic = (topicId) => {
    setSelectedTopic((prevSelected) =>
      prevSelected.filter((topic) => topic.id !== topicId)
    );
  };

  return (
    <div>
      {/* Dropdown to select topics */}
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          Select a Topic
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {topics.length > 0 ? (
            topics.map((topic) => (
              <Dropdown.Item
                key={topic.id}
                onClick={() => handleTopicSelect(topic.id, topic.topicName)}
              >
                {topic.topicName}
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item disabled>No topics available</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>

      {/* Display selected topics using React-Bootstrap */}
      <Row className="mt-3">
        <Col>
          {selectedTopic.length > 0 ? (
            <Card>
              <Card.Body>
                <Card.Title>Selected Topics</Card.Title>
                <Row>
                  {selectedTopic.map((topic) => (
                    <Col key={topic.id} xs="auto" className="mb-2">
                      <Badge
                        bg="info"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRemoveTopic(topic.id)}
                      >
                        {topic.name} <span>&times;</span>
                      </Badge>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          ) : (
            <p>No topics selected.</p>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default TopicSuggest;