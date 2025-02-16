import React, { useState, useEffect, useCallback } from 'react';
import { Button, Row, Col, Pagination, Form, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';

const TemplateGallery = ({ selectedTagId: tagId }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [templates, setTemplates] = useState([]);
  const [topics, setTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    prevPage: null,
    nextPage: null,
  });

  const navigate = useNavigate();

  // Fetch templates from the API
  const fetchTemplates = async (page = 1, limit = 6, tagId = null, topic = '', search = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/template/templates/public`, {
        params: { page, limit, tagId, topic, search },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setTemplates(response.data?.templates || []);
      setPagination(response.data?.pagination || {
        total: 0,
        page: 1,
        totalPages: 1,
        prevPage: null,
        nextPage: null,
      });
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };  

  // Fetch topics
  const fetchTopics = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/topic/topics`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTopics(response.data?.topics || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };
  const debouncedFetchTemplates = useCallback(
    debounce((query, topic, tagId) => {
      fetchTemplates(1, 6, tagId, topic, query);
    }, 500),
    [tagId] 
  );

  useEffect(() => {
    debouncedFetchTemplates(searchQuery, selectedTopic, tagId);
    return () => debouncedFetchTemplates.cancel();
  }, [searchQuery, selectedTopic, tagId]);

  useEffect(() => {
    fetchTopics();
  }, []);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle topic change
  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchTemplates(newPage, 6, tagId, selectedTopic, searchQuery);
  };

  return (
    <>
      <Row className="mb-3">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Col>
        <Col>
          <Form.Select value={selectedTopic} onChange={handleTopicChange}>
            <option value="">All Topics</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.topicName}>
                {topic.topicName}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <p>Loading templates...</p>
      ) : (
        <>
          <Row xs={1} md={3} className="g-4">
            {templates.map((template) => (
              <Col key={template.id}>
                <Card>
                  <Card.Body>
                    <Card.Title>{template.title}</Card.Title>
                    <Card.Text>{template.Topic?.topicName || 'No Topic'}</Card.Text>
                    <Card.Text>{template.User?.username || 'No User'}</Card.Text>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() =>
                        navigate(`/templates/view/${template.id}`, {
                          state: { apiUrl: 'api/template/public', goBackRoute: '/' },
                        })
                      }
                    >
                      View Template
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination Controls */}
          <Pagination className="mt-3">
            {pagination.prevPage !== null && (
              <Pagination.Prev onClick={() => handlePageChange(pagination.page - 1)} />
            )}
            {[...Array(pagination.totalPages || 1)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === pagination.page}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            {pagination.nextPage !== null && (
              <Pagination.Next onClick={() => handlePageChange(pagination.page + 1)} />
            )}
          </Pagination>
        </>
      )}
    </>
  );
};

export default TemplateGallery;
