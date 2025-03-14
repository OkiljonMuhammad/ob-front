import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Container, Table, Button, Row, Col, Pagination, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
import DeleteTemplate from './DeleteTemplate';
import ViewTemplate from './ViewTemplate';
import CreateForm from '../Form/CreateForm';
import ViewAggregation from './ViewAggregation';
import ThemeContext from '../../context/ThemeContext';
import CreateApiToken from './CreateApiToken';

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
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFormCreateModal, setShowFormCreateModal] = useState(false);
  const [showAggregationModal, setShowAggregationModal] = useState(false);
  const [showCreateApiTokenModal, setShowCreateApiTokenModal] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  const handleTemplateDeleted = (deletedTemplateId) => {
    setTemplates((prevTemplates) =>
      prevTemplates.filter((template) => template.id !== deletedTemplateId)
    );
  };
  
  const handleDeleteClick = (templateId) => {
    setSelectedTemplateId(templateId);
    setShowDeleteModal(true);
  };

  const handleFormCreateClick = (templateId) => {
    setSelectedTemplateId(templateId);
    setShowFormCreateModal(true);
  };

  const handleCreateApiTokenClick = () => {
    setShowCreateApiTokenModal(true);
  };

  const handleAggregationClick = (templateId) => {
    setSelectedTemplateId(templateId);
    setShowAggregationModal(true);
  };

  const handleViewClick = (templateId) => {
    setSelectedTemplateId(templateId);
    setShowViewModal(true);
  };
  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setShowViewModal(false);
    setShowFormCreateModal(false);
    setShowAggregationModal(false);
    setShowCreateApiTokenModal(false);
    setSelectedTemplateId(null);
  };

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
        setTemplates(response.data?.templates || []);
        setPagination(response.data?.pagination || {
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
      setTopics(response.data?.topics || []);
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
  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <Container className='min-vh-100'>

      <Row className="mb-3">
        <Col>
          <Button variant="success" onClick={() => navigate('/templates/create')}>
            Create Template
          </Button>
        </Col>
        <Col>
          <Button variant="primary" onClick={handleCreateApiTokenClick}>
            Create Api Token
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
                className={`bg-${theme} ${getTextColorClass()} custom-placeholder`}
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
            <Form.Select 
            value={selectedTopic} 
            onChange={handleTopicChange} 
            className={`bg-${theme} ${getTextColorClass()}`}>
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
           <div className="spinner-grow text-primary"></div>
           <p>Loading templates...</p>
         </div>
       </div>
      ) : templates.length === 0 ? (
      <p className="text-center">No Templates</p>
      ) :(
        <>
          <Table striped bordered hover responsive className={`text-center table-${theme}`} >
            <thead >
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Topic</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template, index) => (
                <tr key={template.id}>
                 <td>{(pagination.page - 1) * 10 + index + 1}</td>
                  <td>{template.title}</td>
                  <td>{template.Topic?.topicName || 'No Topic'}</td>
                  <td>{new Date(template.createdAt).toLocaleDateString()} {new Date(template.createdAt).toLocaleTimeString()}</td>
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
                      className="me-2"
                      onClick={() => handleDeleteClick(template.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"

                      onClick={() => handleFormCreateClick(template.id)}
                    >
                      Create Form
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"

                      onClick={() => navigate(`/comments/${template.id}`)}
                    >
                      Comments
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAggregationClick(template.id)}
                    >
                      Aggregations
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
       {showDeleteModal && (
        <DeleteTemplate
          templateId={selectedTemplateId} 
          showModal={showDeleteModal} 
          onClose={handleCloseModal} 
          onTemplateDeleted={handleTemplateDeleted}
        />
      )}
      {showViewModal && (
        <ViewTemplate
          templateId={selectedTemplateId}
          showModal={showViewModal}
          onClose={handleCloseModal}
        />
      )}
       {showFormCreateModal && (
        <CreateForm
          templateId={selectedTemplateId}
          showModal={showFormCreateModal} 
          onClose={handleCloseModal} 
        />
      )}
      {showAggregationModal && (
        <ViewAggregation
          templateId={selectedTemplateId}
          showModal={showAggregationModal}
          onClose={handleCloseModal}
        />
      )}
       {showCreateApiTokenModal && (
        <CreateApiToken
          showModal={showCreateApiTokenModal} 
          onClose={handleCloseModal} 
        />
      )}
    </Container>
  );
}
