import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import EditTag from '../Tag/EditTag';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import EditTopic from '../Topic/EditTopic';

export default function EditTemplate() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { templateId } = useParams();

  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topicId: '',
    topicName: '',
    image: '',
    isPublic: true,
    tags: [],
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTemplate = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/template/${templateId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const templateData = response.data.template;
      setFormData({
        title: templateData.title || '',
        description: templateData.description || '',
        topicId: templateData.Topic?.id || '',
        topicName: templateData.Topic?.topicName || '',
        image: templateData.image || '',
        isPublic: templateData.isPublic || false,
        tags:
          templateData.Tags?.map((tag) => ({
            value: tag.id,
            label: tag.tagName,
          })) || [],
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching template:', error);
      setError(
        error.response?.data?.message || 'Failed to load template data.'
      );
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTemplate();
  }, [BASE_URL, templateId]);

  useEffect(() => {
    setShowPreview(false);
  }, [formData.description]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.topicId) {
      toast.error('Please fill in all required fields.');
      return;
    }
    try {
      await axios.put(`${BASE_URL}/api/template/${templateId}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log(formData);
      toast.success('Template updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Failed to update template. Please try again.');
    }
  };

  const togglePreview = () => {
    setShowPreview((prevState) => !prevState);
  };

  if (loading) {
    return <p>Loading template data...</p>;
  }

  return (
    <Container fluid className="py-4">
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <h2>Edit Template</h2>
        <Row className="mb-4">
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
        <Row className="mb-4">
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
        <Row className="mb-4">
          <Col>
            <Button
              variant="secondary"
              onClick={togglePreview}
              aria-label={showPreview ? 'Close Preview' : 'Show Preview'}
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
        {formData.topicName && (
          <Row className="mb-4">
            <Col>
              <Form.Group controlId="topicName">
                <Form.Label>Selected Topic:</Form.Label>
                <p>{formData.topicName}</p>
              </Form.Group>
            </Col>
          </Row>
        )}
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="topicId">
              <Form.Label>Topic</Form.Label>
              <EditTopic
                onTopicSelect={(topic) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    topicId: topic.id,
                    topicName: topic.name,
                  }))
                }
                initialSelectedTopics={
                  formData.topicId && formData.topicName
                    ? [{ id: formData.topicId, name: formData.topicName }]
                    : []
                }
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-4">
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
        <Row className="mb-4">
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
        {formData.tags.length > 0 && (
          <Row className="mb-4">
            <Col>
              <Form.Group controlId="selectedTags">
                <Form.Label>Selected Tags:</Form.Label>
                <p>
                  {formData.tags?.map((tag) => tag.label).join(', ')}
                </p>{' '}
                {/* Replace with tag names if available */}
              </Form.Group>
            </Col>
          </Row>
        )}
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <EditTag
                onTagsChange={(tags) => {
                  
                  setFormData({ ...formData, tags })}}
                initialTags={ formData.tags}
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
          Update Template
        </Button>
      </Form>
    </Container>
  );
}
