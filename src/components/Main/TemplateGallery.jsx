import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Row, Col, Pagination, Form, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
const TemplateGallery = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [templates, setTemplates] = useState([]);
  const [topics, setTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [selectedTopic, setSelectedTopic] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    prevPage: null,
    nextPage: null,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch templates from the API
  const fetchTemplates = async (page = 1, limit = 6, topic = '', search = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/template/templates/public`, {
        params: { page, limit, topic, search },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const { templates: fetchedTemplates, pagination: fetchedPagination } =
        response.data;
      setTemplates(fetchedTemplates);
      setPagination(fetchedPagination);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

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

  // Initial fetch when the component mounts
  useEffect(() => {
    fetchTemplates(pagination.page, 6, selectedTopic, searchQuery);
    fetchTopics();
  }, [pagination.page, searchQuery, selectedTopic]);

  // Debounced fetch function
  const debouncedFetchTemplates = useCallback(
    debounce((query, topic) => {
      fetchTemplates(1, 6, topic, query);
    }),
    []
  );

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchTemplates(newPage, 6, selectedTopic, searchQuery);
  };
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedFetchTemplates(value, selectedTopic);
  };
  
  // Handle topic filter change
  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value); // Update selectedTopic state
    fetchTemplates(1, 6, e.target.value, searchQuery); // Reset to page 1 and fetch with new topic
  };


  return (
    <>
          <Row className="mb-3">
            <Col>
              {/* Search Input */}
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
    
          {/* Loading State */}
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
                        <Card.Text> <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() =>
                        navigate(`/templates/view/${template.id}`,{
                          state: {apiUrl: 'api/template/public', goBackRoute: '/' },
                        })
                      }
                    >
                      View Template
                    </Button></Card.Text>                       
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
    
              {/* Pagination Controls */}
              <Pagination className='mt-3'>
                {pagination.prevPage && (
                  <Pagination.Prev
                    onClick={() => handlePageChange(pagination.page - 1)}
                  />
                )}
                {[...Array(pagination.totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === pagination.page}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                {pagination.nextPage && (
                  <Pagination.Next
                    onClick={() => handlePageChange(pagination.page + 1)}
                  />
                )}
              </Pagination>
            </>
          )}
        </>
  );
};

export default TemplateGallery;
