import React, { useState, useEffect } from 'react';
import { Button, Modal, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import LikeTemplate from './LikeTemplate';

export default function ViewTemplate({ showModal, onClose, templateId }) {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // State variables
  const [templateData, setTemplateData] = useState({
    title: '',
    description: '',
    topicId: '',
    topicName: '',
    image: '',
    isPublic: true,
    tags: [],
  });
  const [questionData, setQuestionData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch template data
  const fetchTemplate = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/template/${templateId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` || '',
        },
      });
      const fetchedTemplateData = response.data.template;

      // Update template data state
      setTemplateData({
        title: fetchedTemplateData.title || 'No Title',
        description: fetchedTemplateData.description || 'No Description',
        topicId: fetchedTemplateData.Topic?.id || '',
        topicName: fetchedTemplateData.Topic?.topicName || 'No Topic',
        image: fetchedTemplateData.image || 'No Image URL',
        isPublic: fetchedTemplateData.isPublic || false,
        tags: fetchedTemplateData.Tags?.map((tag) => ({
          id: tag.id,
          tagName: tag.tagName,
        })) || [],
      });

      // Update question data state
      setQuestionData(fetchedTemplateData.questions || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching template:', error);
      setError(error.response?.data?.message || 'Failed to load template data.');
      setLoading(false);
    }
  };

  // Fetch template data on component mount
  useEffect(() => {
    if (showModal && templateId) {
      fetchTemplate();
    }
  }, [showModal, templateId]);

  // Loading state
  if (loading) {
    return (
      <Modal show={showModal} onHide={onClose} centered>
        <Modal.Body>Loading template data...</Modal.Body>
      </Modal>
    );
  }

  // Error state
  if (error) {
    return (
      <Modal show={showModal} onHide={onClose} centered className='text-center'>
        <Modal.Body>
          <Alert variant="danger">
            <p>{error}</p>
            <Button variant="warning" onClick={onClose}>
              Close
            </Button>
          </Alert>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={showModal} onHide={onClose} size="lg" centered className='text-center'>
      <Modal.Header closeButton>
        <Modal.Title className='w-100'>Template Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Title */}
        <Row className="mb-3">
          <Col>
            <h5>Title:</h5>
            <p>{templateData.title}</p>
          </Col>
        </Row>

        {/* Description */}
        <Row className="mb-3">
          <Col>
            <h5>Description:</h5>
            <ReactMarkdown>
              {templateData.description.length > 0 ? templateData.description : 'No description'}
            </ReactMarkdown>
          </Col>
        </Row>

        {/* Topic */}
        <Row className="mb-3">
          <Col>
            <h5>Topic:</h5>
            <p>{templateData.topicName}</p>
          </Col>
        </Row>

        {/* Visibility */}
        <Row className="mb-3">
          <Col>
            <h5>Visibility:</h5>
            <p>{templateData.isPublic ? 'Public' : 'Private'}</p>
          </Col>
        </Row>

        {/* Tags */}
        <Row className="mb-3">
          <Col>
            <h5>Tags:</h5>
            <p>
              {templateData.tags.length > 0
                ? templateData.tags.map((tag) => tag.tagName).join(', ')
                : 'No Tags'}
            </p>
          </Col>
        </Row>

        {/* Questions */}
        <Row className="mb-3">
          <Col>
            <h5>Questions:</h5>
            {questionData.length > 0 ? (
              <ul>
                {questionData.map((question, index) => (
                  <li key={question.id}>
                    <strong>{index + 1}. {question.text}</strong> ({question.type})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No questions available.</p>
            )}
          </Col>
        </Row>
        <Col>
        <h5>Likes:</h5>
        <LikeTemplate templateId={templateId} />
        </Col>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}