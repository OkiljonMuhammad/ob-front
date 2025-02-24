import React, { useState } from 'react';
import { Form, Button, Row, Col, Container, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import UserRoleSelect from './UserRoleSelect';
import { Eye, EyeSlash } from 'react-bootstrap-icons';

export default function CreateUser() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    isBlocked: false,
  });
  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/roles`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setRoles(response.data.roles);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  useState(() => {
    fetchRoles();
  },[]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role) => {
    setUserData((prevData) => ({ ...prevData, role: role.roleName }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
        await axios.post(
        `${BASE_URL}/api/admin/user/create`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('User created successfully!');
      navigate('/admin');
    } catch (error) {
      setError(
        error.response?.data?.message || 'User creation failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
        <Form onSubmit={handleSubmit}>
          <h2>Create New User</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="username">
                <Form.Label>username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={userData.username}
                  minLength={3}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="email">
                <Form.Label>email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
           <Row className="mb-3">
                    <Col>
                      <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={userData.password}
                            minLength={6}
                            onChange={handleChange}
                          />
                          <InputGroup.Text
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeSlash /> : <Eye />}
                          </InputGroup.Text>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
           <Row className="mb-3">
          <Col>
            <Form.Group controlId="roleId">
              <Form.Label>Role</Form.Label>
              <UserRoleSelect onRoleSelect={handleRoleChange} roles={roles} initialSelectedRole={null} />
            </Form.Group>
          </Col>
        </Row>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="isBlocked">
                <Form.Check
                  type="checkbox"
                  label="User Block Status"
                  name="isBlocked"
                  checked={userData.isBlocked}
                  onChange={(e) =>
                    setUserData({ ...userData, isBlocked: e.target.checked })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Button
            variant="warning"
            className="me-2"
            onClick={() => navigate('/admin')}
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
          </Button>
        </Form>
    </Container>
  );
}
