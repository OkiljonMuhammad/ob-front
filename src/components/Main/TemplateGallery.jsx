import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Button, Row, Col, Pagination, Form, Card, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { debounce } from 'lodash';
import ViewTemplate from '../Template/ViewTemplate';
import ThemeContainer from '../Layout/ThemeContainer';
import ThemeContext from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
const TemplateGallery = ({ selectedTagId: tagId }) => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
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
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const { t } = useTranslation();

  const handleViewClick = (templateId) => {
    setSelectedTemplateId(templateId);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setSelectedTemplateId(null);
  };

  const fetchTemplates = async (page = 1, limit = 6, tagId = null, topic = '', search = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/template/templates/public`, {
        params: { page, limit, tagId, topic, search },
        headers: { Authorization: `Bearer ${token}` },
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

  const fetchTopics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/topic/topics`, {
        headers: { Authorization: `Bearer ${token}` },
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
    []
  );

  useEffect(() => {
    debouncedFetchTemplates(searchQuery, selectedTopic, tagId);
    return () => debouncedFetchTemplates.cancel();
  }, [searchQuery, selectedTopic, tagId, debouncedFetchTemplates]);

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchTemplates(1, 6, tagId, selectedTopic, '');
  };

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
  };

  const handlePageChange = (newPage) => {
    fetchTemplates(newPage, 6, tagId, selectedTopic, searchQuery);
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <>
    <ThemeContainer>
      <Row className="mb-3 justify-content-center text-center">
        <Col xs={12} md={4} lg={3}>
          <Form.Group controlId="searchInput">
            <Form.Label>{t('searchTemplates')}</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                className={`bg-${theme} ${getTextColorClass()} custom-placeholder`}
                placeholder={t('EnterTemplateTitle')}
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
        <Col xs={12} md={4} lg={3}>
          <Form.Group controlId="topicFilter">
            <Form.Label>{t('FilterByTopic')}</Form.Label>
            <Form.Select 
            value={selectedTopic} 
            onChange={handleTopicChange}
            className={`bg-${theme} ${getTextColorClass()}`}>
              <option value="">{topics.length === 0 ? t('noTopic') : t('allTopics') }</option>
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
        <>
        <div className="spinner-grow text-primary"></div>
        <p className="text-center">{t('loadingTemplate')}</p>
        </>
      ) : templates.length === 0 ? (
        <p className="text-center">{t('noTemplatesFound')}</p>
      ) : (
        <>
          <Row xs={1} md={3} className="g-4">
            {templates.map((template) => (
              <Col key={template.id}>
                <Card className={`bg-${theme} ${getTextColorClass()}`}>
                  <Card.Body>
                    <Card.Title>{t('title')}: {template.title}</Card.Title>
                    <Card.Text>{t('topic')}: {template.Topic?.topicName || 'No Topic'}</Card.Text>
                    <Card.Text>{t('author')}: {template.User?.username || 'No User'}</Card.Text>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleViewClick(template.id)}
                    >
                      {t('viewTemplate')}
                    </Button>
                     <Button
                      variant="primary"
                      size="sm"
                      className="me-2"

                      onClick={() => navigate(`/comments/${template.id}`)}
                    >
                      Comments
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          {pagination.totalPages > 0 && (
        <div className="d-flex justify-content-center">
          <Pagination className="mt-3">
            {pagination.prevPage !== null && (
              <Pagination.Prev
                onClick={() => handlePageChange(pagination.page - 1)}
              >
              </Pagination.Prev>
            )}
            {[...Array(pagination.totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === pagination.page}
                onClick={() => handlePageChange(index + 1)}
                className={`bg-${theme} ${getTextColorClass()} ${
                  index + 1 === pagination.page ? 'active' : ''
                }`}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            {pagination.nextPage !== null && (
              <Pagination.Next
                onClick={() => handlePageChange(pagination.page + 1)}
                className={`bg-${theme} ${getTextColorClass()}`}
              >
              </Pagination.Next>
            )}
          </Pagination>
        </div>
      )}
        </>
      )}
      {showViewModal && (
        <ViewTemplate
          showModal={showViewModal}
          onClose={handleCloseModal}
          templateId={selectedTemplateId}
        />
      )}
    </ThemeContainer>
    </>
  );
};

export default TemplateGallery;