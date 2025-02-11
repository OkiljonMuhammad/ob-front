import React, { useState } from 'react';
import { Form, Button, Row, Col, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TagAutoComplete from '../Tag/TagAutoComplete';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import TopicSuggest from '../Topic/TopicSuggest'; // Import the TopicSuggest component
import AddQuestion from '../Question/AddQuestion'; // Import the AddQuestion component

export default function CreateTemplate() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topicId: '', // Default topicId is empty
    image: '',
    isPublic: true,
    tags: [],
  });
  const [templateId, setTemplateId] = useState(null); // Template ID after creation
  const [error, setError] = useState(null); // Error state for question saving

  // Handle form submission to create a template
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
      setTemplateId(createdTemplateId); // Store the template ID
      toast.success('Template created successfully!');
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template. Please try again.');
    }
  };

  // Handle saving questions
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
      navigate('/dashboard');
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error saving questions:', error);
      setError('Failed to save questions. Please try again.');
      toast.error('Failed to save questions. Please try again.');
    }
  };

  const togglePreview = () => {
    setShowPreview((prevState) => !prevState);
  };

  return (
    <Container fluid className="py-4">
      {/* Template Creation Form */}
      {!templateId && (
        <Form onSubmit={handleSubmit}>
          <h2>Create New Template</h2>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
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
                <Form.Label>Description (Markdown Supported)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  name="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Use Markdown syntax for formatting (e.g., **bold**, *italic*, - list)"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Button
                variant="secondary"
                onClick={togglePreview}
                style={{ marginBottom: '1rem' }}
              >
                {showPreview ? 'Close Preview' : 'Show Preview'}
              </Button>
              {showPreview && (
                <div>
                  <h5>Preview</h5>
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
                <Form.Label>Topic</Form.Label>
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
              <Form.Group controlId="image">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="isPublic">
                <Form.Check
                  type="checkbox"
                  label="Public Template"
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
                <Form.Label>Tags</Form.Label>
                <TagAutoComplete
                  onTagsChange={(tags) => setFormData({ ...formData, tags })}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button
            variant="warning"
            className="me-2"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Create Template
          </Button>
        </Form>
      )}

      {/* Add Questions Section */}
      {templateId && (
        <div>
          <Alert variant="success">
          Template created successfully! You can now add questions.
          </Alert>
          <AddQuestion templateId={templateId} onSaveQuestions={handleSaveQuestions} />
        </div>
      )}
    </Container>
  );
}