import { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ThemeContext from '../../context/ThemeContext';

const Login = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { theme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/api/auth/login`, formData);

      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] =
        `Bearer ${response.data.token}`;

      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      style={{ minHeight: '80vh' }}
      className={`d-flex align-items-center justify-content-center bg-${theme} text-${theme === 'light' ? 'dark' : 'light'}`}
    >
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <div
            className={`p-4 shadow rounded bg-${theme === 'light' ? 'white' : 'dark'}`}
          >
            <h2 className="text-center mb-4">Login</h2>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  required
                  onChange={handleChange}
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Form>

            <div className="mt-3 text-center">
              Do not have an account? <Link to="/register">Register here</Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
