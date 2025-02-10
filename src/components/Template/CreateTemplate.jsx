import React, { useState } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TagAutoComplete from '../Tag/TagAutoComplete';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import TopicSuggest from '../Topic/TopicSuggest'; // Import the AddTopic component

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTagsChange = (tags) => {
    setFormData((prevData) => ({
      ...prevData,
      tags,
    }));
  };

  const togglePreview = () => {
    setShowPreview((prevState) => !prevState);
  };

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
      toast.success('Template created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template. Please try again.');
    }
  };

  return (
    <Container fluid className="py-4">
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
                onChange={handleChange}
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
                onChange={handleChange}
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
              {/* Use the AddTopic component */}
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
                onChange={handleChange}
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
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <TagAutoComplete onTagsChange={handleTagsChange} />
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
          Create
        </Button>
      </Form>
    </Container>
  );
}