import React, { useState, useContext } from 'react';
import { Form, Button, Row, Col, Container, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ThemeContext from '../../../context/ThemeContext';

export default function CreateUserInSalesforce() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    accountName: '',
    contactFirstName: '',
    contactLastName: '',
    email: '',
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/admin/salesforce/create`,
        userData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      
      toast.success('User created successfully in SalesForce!');
      navigate('/admin');
    } catch (error) {
      console.error("Salesforce API Error:", error.response?.data || error.message);
      setError(error.response?.data?.error || 'User creation failed in SalesForce. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <Container fluid className="py-4">
      <Form onSubmit={handleSubmit}>
        <h2>Create New User</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="accountName">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                name="accountName"
                placeholder="Enter company name"
                value={userData.accountName}
                onChange={handleChange}
                className={`bg-${theme} ${getTextColorClass()} custom-placeholder`}
                required
                disabled={loading}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="contactFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="contactFirstName"
                placeholder="Enter first name"
                value={userData.contactFirstName}
                onChange={handleChange}
                className={`bg-${theme} ${getTextColorClass()} custom-placeholder`}
                required
                disabled={loading}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="contactLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="contactLastName"
                placeholder="Enter last name"
                value={userData.contactLastName}
                onChange={handleChange}
                className={`bg-${theme} ${getTextColorClass()} custom-placeholder`}
                required
                disabled={loading}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={userData.email}
                onChange={handleChange}
                className={`bg-${theme} ${getTextColorClass()} custom-placeholder`}
                required
                disabled={loading}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button
          variant="warning"
          className="me-2"
          onClick={() => navigate('/admin')}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Create'}
        </Button>
      </Form>
    </Container>
  );
}