import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Row, Col, Container, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import UserRoleSelect from './UserRoleSelect';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import ThemeContext from '../../../context/ThemeContext';

export default function EditUser() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { userId } = useParams();
  const { theme } = useContext(ThemeContext);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    isBlocked: false,
  });

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const fetchedUserData = response.data.user;
      setUserData({
        username: fetchedUserData.username || '',
        email: fetchedUserData.email || '',
        password: '',
        role: fetchedUserData.role || '',
        isBlocked: fetchedUserData.isBlocked || false,
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      setError(error.response?.data?.message || 'Failed to load user data.');
    }
  };

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

  useEffect(() => {
    fetchUser();
    fetchRoles();
  }, [userId]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role) => {
    setUserData((prevData) => ({ ...prevData, role: role.roleName }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const updatedUserData = { ...userData };
    if (!updatedUserData.password) delete updatedUserData.password;

    try {
      setLoading(true);
      await axios.put(`${BASE_URL}/api/admin/update/${userId}`, updatedUserData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('User updated successfully!');
      navigate('/admin');
    } catch (error) {
      setError(error.response?.data?.message || 'Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');
  
  return (
    <Container fluid className="py-4">
      <Form onSubmit={handleSubmit}>
        <h2>Edit User</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control 
              type="text" 
              name="username" 
              value={userData.username} minLength={3} 
              onChange={handleChange} 
              className={`bg-${theme} ${getTextColorClass()} custom-placeholder`}
              required />
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
              value={userData.email} 
              onChange={handleChange} 
              className={`bg-${theme} ${getTextColorClass()} custom-placeholder`}
              required />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="password">
              <Form.Label>Password <span className='custom-label'>(leave blank to keep current password)</span></Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={userData.password}
                  minLength={6}
                  onChange={handleChange}
                  className={`bg-${theme} ${getTextColorClass()} custom-placeholder`}
                />
                <InputGroup.Text
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowPassword(!showPassword)}
                  className={`bg-${theme} ${getTextColorClass()}`}
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
              <UserRoleSelect onRoleSelect={handleRoleChange} roles={roles} initialSelectedRole={userData.role} />
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
                onChange={(e) => setUserData({ ...userData, isBlocked: e.target.checked })}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="warning" className="me-2" onClick={() => navigate('/admin')}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </Form>
    </Container>
  );
}
