import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Row, Col, Pagination, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
import DeleteTemplate from './DeleteTemplate';
import ViewTemplate from './ViewTemplate';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Controls modal visibility
  const [showViewModal, setShowViewModal] = useState(false); // Controls modal visibility
  const [selectedTemplateId, setSelectedTemplateId] = useState(null); // Stores the ID of the template to delete

  const handleTemplateDeleted = (deletedTemplateId) => {
    setTemplates((prevTemplates) =>
      prevTemplates.filter((template) => template.id !== deletedTemplateId)
    );
  };
  // Function to open the modal and set the template ID
  const handleDeleteClick = (templateId) => {
    setSelectedTemplateId(templateId);
    setShowDeleteModal(true);
  };

  const handleViewClick = (templateId) => {
    setSelectedTemplateId(templateId);
    setShowViewModal(true);
  };
  // Function to close the modal
  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setShowViewModal(false);
    setSelectedTemplateId(null); // Reset the selected template ID
  };

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

      if (response.data) {
        setTemplates(response.data.templates || []);
        setPagination(response.data.pagination || {
          total: 0,
          page: 1,
          totalPages: 1,
          prevPage: null,
          nextPage: null,
        });
      }
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
      setTopics(response.data.topics || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const debouncedFetchTemplates = useCallback(
    debounce((query, topic) => {
      fetchTemplates(1, 10, topic, query);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFetchTemplates(searchQuery, selectedTopic);
  }, [searchQuery, selectedTopic]);

  const handlePageChange = (newPage) => {
    fetchTemplates(newPage, 10, selectedTopic, searchQuery);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    debouncedFetchTemplates('', selectedTopic);
  };
  const handleTopicChange = (e) => {
    const value = e.target.value;
    setSelectedTopic(value);
  };

  return (
    <>
      <Row className="mb-3">
        <Col>
          <Button variant="primary" onClick={() => navigate('/templates/create')}>
            Create Template
          </Button>
        </Col>
        <Col xs="auto">
        <Form.Group controlId="searchInput">
            <Form.Label>Search Templates</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Enter template title..."
                value={searchQuery}
                onChange={handleSearchChange}
                />
                {searchQuery && (
                  <InputGroup.Text style={{ cursor: 'pointer' }} onClick={handleClearSearch}>
                  <i className="bi bi-x-lg"></i>
                  </InputGroup.Text>
                )}
              </InputGroup>
          </Form.Group>
        </Col>
        <Col xs="auto">
          <Form.Group controlId="topicFilter">
            <Form.Label>Filter by Topic</Form.Label>
            <Form.Select value={selectedTopic} onChange={handleTopicChange}>
              <option value="">{topics.length === 0 ? "No topic" : "All Topics"}</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.topicName}>
                  {topic.topicName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {loading ? (
         <div className="d-flex justify-content-center text-center">
         <div>
           <div className="spinner-border"></div>
           <p>Loading templates...</p>
         </div>
       </div>
      ) : templates.length === 0 ? (
      <p className="display-5 text-center">No Templates</p>
      ) :(
        <>
          <Table striped bordered hover responsive className="text-center">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Topic</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.id}>
                  <td>{template.title}</td>
                  <td>{new Date(template.createdAt).toLocaleDateString()}</td>
                  <td>{template.Topic?.topicName || 'No Topic'}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleViewClick(template.id)}
                    >
                      View
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
                      onClick={() => handleDeleteClick(template.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center">

          <Pagination>
            {pagination.prevPage && (
              <Pagination.Prev onClick={() => handlePageChange(pagination.page - 1)} />
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
              <Pagination.Next onClick={() => handlePageChange(pagination.page + 1)} />
            )}
          </Pagination>
          </div>
        </>
      )}
       {/* Conditionally render the DeleteTemplate modal */}
       {showDeleteModal && (
        <DeleteTemplate
          templateId={selectedTemplateId} // Pass the selected template ID
          showModal={showDeleteModal} // Pass the modal visibility state
          onClose={handleCloseModal} // Pass the function to close the modal
          onTemplateDeleted={handleTemplateDeleted}
        />
      )}
      {showViewModal && (
        <ViewTemplate
          showModal={showViewModal}
          onClose={handleCloseModal}
          templateId={selectedTemplateId}
        />
      )}
    </>
  );
}
