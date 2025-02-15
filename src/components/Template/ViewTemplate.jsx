import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Container, Alert } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import LikeTemplate from './LikeTemplate';

export default function ViewTemplate() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { templateId } = useParams();
  const location = useLocation();
  const { apiUrl, goBackRoute } = location.state || {};

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
      const response = await axios.get(`${BASE_URL}/${apiUrl}/${templateId}`, {
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
    fetchTemplate();
  }, [BASE_URL, templateId]);

  // Loading state
  if (loading) {
    return <p>Loading template data...</p>;
  }

  // Error state
  if (error) {
    return (
      <Alert variant="danger">
        <p>{error}</p>
        <Button variant="warning" onClick={() => navigate(goBackRoute)}>
          Go Back
        </Button>
      </Alert>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Title */}
      <Row>
        <Col>
          <h2>Title:</h2>
          <h3>{templateData.title}</h3>
        </Col>
      </Row>

      {/* Description */}
      <Row>
        <Col>
          <h2>Description:</h2>
          <ReactMarkdown>{templateData.description.length > 0 ? 
          templateData.description : 'No description'}</ReactMarkdown>
        </Col>
      </Row>

      {/* Topic */}
      <Row>
        <Col>
          <h2>Topic:</h2>
          <h3>{templateData.topicName}</h3>
        </Col>
      </Row>

      {/* Image */}
      <Row>
        <Col>
          <h2>Image:</h2>
          {/* <img src={templateData.image} alt="Template" style={{ maxWidth: '100%' }} /> */}
        </Col>
      </Row>

      {/* Visibility */}
      <Row>
        <Col>
          <h2>Visibility:</h2>
          <h3>{templateData.isPublic ? 'Public' : 'Private'}</h3>
        </Col>
      </Row>

      {/* Tags */}
      <Row>
        <Col>
          <h2>Tags:</h2>
          <h3>
            {templateData.tags.length > 0
              ? templateData.tags.map((tag) => tag.tagName).join(', ')
              : 'No Tags'}
          </h3>
        </Col>
      </Row>

      {/* Questions */}
      <Row>
        <Col>
          <h2>Questions:</h2>
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

      {/* Close Button */}
      <Row>
        <Col>
          <Button variant="warning" onClick={() => navigate(goBackRoute)}>
            Close
          </Button>
        </Col>
        <Col>
        <LikeTemplate templateId={templateId} />
        </Col>
      </Row>
    </Container>
  );
}