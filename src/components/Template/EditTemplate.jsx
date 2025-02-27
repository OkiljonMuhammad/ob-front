import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Row, Col, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import UpdateQuestion from '../Question/UpdateQuestion';
import EditTag from '../Tag/EditTag';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import EditTopic from '../Topic/EditTopic';
import ThemeContext from '../../context/ThemeContext';
import AddQuestion from '../Question/AddQuestion';
import UploadImage from '../Image/UploadImage';

export default function EditTemplate() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext); 
  const tabName = 'templates';
  const { templateId } = useParams();

  const [showPreview, setShowPreview] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [templateIsUpdated, setTemplateIsUpdated] = useState(false);
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

    const questionsResponse = await axios.get(
      `${BASE_URL}/api/question/questions/${templateId}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );
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
      setQuestions(questionsResponse.data.questions || []);
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
      const updatedTags = formData.tags.map(tag => ({
        id: tag.value,
        tagName: tag.label,
      }));
  
      const updatedFormData = {
        ...formData,
        tags: updatedTags,
      };
  
  
      await axios.put(`${BASE_URL}/api/template/${templateId}`, updatedFormData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Template updated successfully!');
      setTemplateIsUpdated(true);
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

  const handleUpdateQuestions = async (templateId, updatedQuestions) => {
    if (!templateId) {
      setError('Template ID is missing. Please create a template first.');
      return;
    }

    if (!updatedQuestions || !Array.isArray(updatedQuestions) || updatedQuestions.length === 0) {
      setError('No questions to update.');
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/question/questions/${templateId}`,
       { questions: updatedQuestions },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Questions updated successfully!');
      navigate(`/dashboard/${tabName}`);

      setError(null);
    } catch (error) {
      console.error('Error updating questions:', error);
      setError('Failed to update questions. Please try again.');
      toast.error('Failed to update questions. Please try again.');
    }
  };

  const handleImageUpload = (imageUrl) => {
    setFormData((prevData) => ({ ...prevData, image: imageUrl }));
  };

  const handleSaveQuestions = async (templateId, questions) => {
    if (!templateId) {
      setError('Template ID is missing. Please create a template first.');
      return;
    }
    try {
      await axios.post(
        `${BASE_URL}/api/question/${templateId}`,
        { questions },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Questions saved successfully!');
      navigate(`/dashboard/${tabName}`);
      setError(null);
    } catch (error) {
      console.error('Error saving questions:', error);
      setError('Failed to save questions. Please try again.');
      toast.error('Failed to save questions. Please try again.');
    }
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');


  return (
    <Container fluid className="py-4">
      {error && <Alert variant="danger">{error}</Alert>}
      { !templateIsUpdated && (
        <Form onSubmit={handleSubmit}>
        <h2>Edit Template</h2>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title <span className='custom-label'>(Required)</span></Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                className={`bg-${theme} ${getTextColorClass()}`}
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
              <Form.Label>Description <span className='custom-label'>(Optional)</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                name="description"
                value={formData.description}
                className={`bg-${theme} ${getTextColorClass()}`}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
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
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="topicId">
              <Form.Label>Topic <span className='custom-label'>(Required)</span></Form.Label>
              <EditTopic
                onTopicSelect={(topic) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    topicId: topic.id,
                    topicName: topic.topicName,
                  }))
                }
                initialSelectedTopic={
                  formData.topicId && formData.topicName
                    ? { id: formData.topicId, topicName: formData.topicName }
                    : null
                }
              />
            </Form.Group>
          </Col>
        </Row>
        {formData.image.length > 0 && (
            <Row>
              <Col>
              <img src={formData.image} alt='image' className='img-fluid custom-img'></img>
              </Col>
            </Row>
          )}
        <Row className="mb-4">
            <Col>
              <UploadImage onUpload={handleImageUpload} />
            </Col>
          </Row>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="isPublic">
              <Form.Check
                type="checkbox"
                label="Public"
                name="isPublic"
                checked={formData.isPublic}
                onChange={(e) =>
                  setFormData({ ...formData, isPublic: e.target.checked })
                }
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags <span className='custom-label'>(Optional)</span></Form.Label>
              <EditTag
                onTagsChange={(tags) => {
                  setFormData({ ...formData, tags });
                }}
                initialTags={formData.tags}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button
          variant="warning"
          className="me-2"
          onClick={() => navigate(`/dashboard/${tabName}`)}
        >
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Update Template
        </Button>
      </Form>
      )}
        {templateIsUpdated && questions.length > 0 && (
        <div className='mt-3'>
          <AddQuestion
            templateId={templateId}
            tabName={tabName}
            onSaveQuestions={handleSaveQuestions}
          />
          <UpdateQuestion
            templateId={templateId}
            tabName={tabName}
            onSaveQuestions={handleUpdateQuestions}
          />
        </div>
        
      )}
     {templateIsUpdated && questions.length == 0 && (
        <div className='mt-3'>
          <Alert variant="success" className='text-center'>
            There is no questions. You can now create.
          </Alert>
          <AddQuestion
            templateId={templateId}
            tabName={tabName}
            onSaveQuestions={handleSaveQuestions}
          />
        </div>
      )}
    </Container>
  );
}
