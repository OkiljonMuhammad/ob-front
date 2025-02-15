import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Row, Col, Pagination, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';

export default function Templates() {
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
  const fetchTemplates = async (page = 1, limit = 10, topic = '', search = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/template/templates`, {
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
    fetchTemplates(pagination.page, 10, selectedTopic, searchQuery);
    fetchTopics();
  }, [pagination.page, searchQuery, selectedTopic]);

  // Debounced fetch function
  const debouncedFetchTemplates = useCallback(
    debounce((query, topic) => {
      fetchTemplates(1, 10, topic, query);
    }),
    []
  );

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchTemplates(newPage, 10, selectedTopic, searchQuery);
  };
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedFetchTemplates(value, selectedTopic);
  };
  
  // Handle topic filter change
  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value); // Update selectedTopic state
    fetchTemplates(1, 10, e.target.value, searchQuery); // Reset to page 1 and fetch with new topic
  };

  return (
    <>
      <Row className="mb-3">
        <Col>
          {/* Button to navigate to CreateTemplate */}
          <Button
            variant="primary"
            onClick={() => navigate('/templates/create')}
          >
            Create Template
          </Button>
        </Col>
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
          {/* Table to display templates */}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Topic</th>
                <th>Users</th>
                {/* <th>Likes</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.id}>
                  <td>{template.title}</td>
                  <td>{new Date(template.createdAt).toLocaleDateString()}</td>
                  <td>{template.Topic?.topicName || 'No Topic'}</td>
                  <td>{template.User?.username || 'No User'}</td>
                  {/* <td>
                    {' '}
                    <LikeTemplate templateId={template.id} />
                  </td> */}
                  <td>
                  <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() =>
                        navigate(`/templates/view/${template.id}`,{
                          state: {apiUrl: 'api/template', goBackRoute: '/dashboard' },
                        })
                      }
                    >
                      View Template
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => navigate(`/templates/edit/${template.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        navigate(`/templates/delete/${template.id}`)
                      }
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination Controls */}
          <Pagination>
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
}
