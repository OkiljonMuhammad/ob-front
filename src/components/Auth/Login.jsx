import { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import ThemeContext from '../../context/ThemeContext'
import { useTranslation } from 'react-i18next';

const Login = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext)
  const { t } = useTranslation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/api/auth/login`, formData);
      login(response.data.token);
      axios.defaults.headers.common['Authorization'] =
        `Bearer ${response.data.token}`;
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <Container
      style={{ minHeight: '80vh' }}
      className={`d-flex align-items-center justify-content-center`}
    >
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <div>
            <h2 className="text-center mb-4">{t('login')}</h2>
            {error && <Alert variant="danger" className='text-center'>{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>{t('emailAddress')}</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                  className={`bg-${theme} ${getTextColorClass()}`}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>{t('password')}</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  required
                  onChange={handleChange}
                  className={`bg-${theme} ${getTextColorClass()}`}
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? t('loggingMessage') : t('login')}
              </Button>
            </Form>

            <div className="mt-3 text-center">
              {t('haveAnAccount')} <Link to="/register">{t('registerHere')}</Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
