import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const DeleteTemplate = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`${BASE_URL}/api/template/${templateId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Template deleted successfully.');
      navigate('/dashboard'); // Redirect back to the templates list after deletion
    } catch (error) {
      console.error('Error deleting template', error);
      toast.error('Failed to delete template. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard'); // Redirect back to the templates list if canceled
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title as="h2" className="text-center">
                Delete Template
              </Card.Title>
              <Card.Text className="text-center">
                Are you sure you want to delete this template?
              </Card.Text>
              <div className="d-flex justify-content-center">
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="me-2"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DeleteTemplate;
