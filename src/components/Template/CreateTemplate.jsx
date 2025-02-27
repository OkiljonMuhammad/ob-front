import React, { useContext, useState } from 'react';
import { Form, Button, Row, Col, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TagAutoComplete from '../Tag/TagAutoComplete';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import TopicSuggest from '../Topic/TopicSuggest';
import AddQuestion from '../Question/AddQuestion';
import UploadImage from "../Image/UploadImage";
import ThemeContext from '../../context/ThemeContext';

export default function CreateTemplate() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const tabName = 'templates';
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topicId: '',
    image: '',
    isPublic: true,
    tags: [],
  });
  const [templateId, setTemplateId] = useState(null);
  const { theme } = useContext(ThemeContext); 
  const [error, setError] = useState(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BASE_URL}/api/template/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const createdTemplateId = response.data.template.id;
      setTemplateId(createdTemplateId);
      toast.success('Template created successfully!');
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template. Please try again.');
    }
  };

  const handleImageUpload = (imageUrl) => {
    setFormData((prevData) => ({ ...prevData, image: imageUrl }));
  };

  const handleSaveQuestions = async (templateId, questions) => {
    if (!templateId) {
      setError('Template ID is missing. Please create a template first.');
      return;
    }
    try {
      await axios.post(
        `${BASE_URL}/api/question/${templateId}`,
        { questions },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Questions saved successfully!');
      navigate(`/dashboard/${tabName}`);
      setError(null);
    } catch (error) {
      console.error('Error saving questions:', error);
      setError('Failed to save questions. Please try again.');
      toast.error('Failed to save questions. Please try again.');
    }
  };

  const togglePreview = () => {
    setShowPreview((prevState) => !prevState);
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <Container fluid className="py-4">
      {!templateId && (
        <Form onSubmit={handleSubmit}>
          <h2>Create New Template</h2>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="title">
                <Form.Label>Title <span className='custom-label'>(Required)</span></Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  className={`bg-${theme} ${getTextColorClass()}`}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="description">
                <Form.Label>Description <span className='custom-label'>(Optional)</span></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  name="description"
                  value={formData.description}
                  className={`bg-${theme} ${getTextColorClass()}`}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Button
                variant="primary"
                onClick={togglePreview}
                className='mb-3'
              >
                {showPreview ? 'Close Preview' : 'Show Preview'}
              </Button>
              {showPreview && (
                <div>
                  <ReactMarkdown className="markdown-preview">
                    {formData.description || 'No description provided.'}
                  </ReactMarkdown>
                </div>
              )}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="topicId">
                <Form.Label>Topic <span className='custom-label'>(Required)</span></Form.Label>
                <TopicSuggest
                  onTopicSelect={(topicId) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      topicId,
                    }))
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <UploadImage onUpload={handleImageUpload} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="isPublic">
                <Form.Check
                  type="checkbox"
                  label="Public"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublic: e.target.checked })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="tags">
                <Form.Label>Tags (Optional)</Form.Label>
                <TagAutoComplete
                  onTagsChange={(tags) => setFormData({ ...formData, tags })}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs="auto">
          <Button
            variant="warning"
            className="me-2"
            onClick={() => navigate(`/dashboard/${tabName}`)}
          >
            Cancel
          </Button>
            </Col>
            <Col xs="auto">
          <Button variant="primary" type="submit">
            Create Template
          </Button>
            </Col>
          </Row>
        </Form>
      )}

      {templateId && (
        <div>
          <Alert variant="success" className='text-center'>
            Template created successfully! You can now add questions.
          </Alert>
          <AddQuestion
            templateId={templateId}
            tabName={tabName}
            onSaveQuestions={handleSaveQuestions}
          />
        </div>
      )}
    </Container>
  );
}
