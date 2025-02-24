import { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import ThemeContext from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
const Register = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useContext(ThemeContext)
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = () => {
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const passwordError = validatePassword();
    if (passwordError) return setError(passwordError);

    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/api/auth/register`,
        formData
      );
      login(response.data.token);
      axios.defaults.headers.common['Authorization'] =
        `Bearer ${response.data.token}`;
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
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
          <div
          >
            <h2 className="text-center mb-4">{t('register')}</h2>
            {error && <Alert variant="danger" className='text-center'>{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>{t('username')}</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  minLength={3}
                  required
                  onChange={handleChange}
                  className={`bg-${theme} ${getTextColorClass()}`}
                />
              </Form.Group>

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
                  minLength="6"
                  onChange={handleChange}
                  className={`bg-${theme} ${getTextColorClass()}`}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>{t('confirmPassword')}</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
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
                {loading ? t('registeringMessage') : t('register')}
              </Button>
            </Form>

            <div className="mt-3 text-center">
              {t('haveAnAccount')} <Link to="/login">{t('loginHere')}</Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
