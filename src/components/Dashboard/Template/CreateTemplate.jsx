import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateTemplate() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topic: '',
    image: '',
    isPublic: true,
    tags: [],
  });

  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to the backend API
      const response = await axios.post('/api/template/create', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
        },
      });

      // Redirect to the Templates page after successful creation
      if (response.status === 201) {
        alert('Template created successfully!');
        navigate('/templates'); // Redirect to the Templates page
      }
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Failed to create template. Please try again.');
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
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Group controlId="topic">
            <Form.Label>Topic</Form.Label>
            <Form.Control
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
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
            <Form.Label>Tags (comma-separated)</Form.Label>
            <Form.Control
              type="text"
              name="tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tags: e.target.value.split(',').map((tag) => tag.trim()),
                })
              }
            />
          </Form.Group>
        </Col>
      </Row>
      <Button variant="warning" className="me-2" onClick={() => navigate('/dashboard')}>
                  Cancel
      </Button>
      <Button variant="primary" type="submit">
        Create
      </Button>
    </Form>
    </Container>
  );
}