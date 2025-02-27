import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Row, Col, Alert } from 'react-bootstrap';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import LikeTemplate from './LikeTemplate';
import ThemeContext from '../../context/ThemeContext';

export default function ViewTemplate({ showModal, onClose, templateId }) {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { isAuthenticated } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [templateData, setTemplateData] = useState({
    title: '',
    description: '',
    topicId: '',
    topicName: '',
    image: '',
    isPublic: true,
    tags: [],
  });
  const [questionData, setQuestionData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTemplate = async () => {
    try {
      const url = isAuthenticated
        ? `${BASE_URL}/api/template/${templateId}`
        : `${BASE_URL}/api/template/public/${templateId}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` || '',
        },
      });
      const fetchedTemplateData = response.data.template;

      setTemplateData({
        title: fetchedTemplateData.title || 'No Title',
        description: fetchedTemplateData.description || 'No Description',
        topicId: fetchedTemplateData.Topic?.id || '',
        topicName: fetchedTemplateData.Topic?.topicName || 'No Topic',
        image: fetchedTemplateData.image || '',
        isPublic: fetchedTemplateData.isPublic || false,
        tags: fetchedTemplateData.Tags?.map((tag) => ({
          id: tag.id,
          tagName: tag.tagName,
        })) || [],
      });

      setQuestionData(fetchedTemplateData.questions || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching template:', error);
      setError(error.response?.data?.message || 'Failed to load template data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showModal && templateId) {
      fetchTemplate();
    }
  }, [showModal, templateId]);

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  if (loading) {
    return (
      <Modal
        show={showModal}
        onHide={onClose}
        centered
        dialogClassName={`modal-dialog bg-${theme}`}
        className={`${getTextColorClass()} text-center`}
      >
        <Modal.Body className={`p-3 bg-${theme} ${getTextColorClass()}`}>
          Loading template data...
        </Modal.Body>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal
        show={showModal}
        onHide={onClose}
        centered
        dialogClassName={`modal-dialog bg-${theme}`}
        className={`${getTextColorClass()} text-center`}
      >
        <Modal.Body className={`p-3 bg-${theme} ${getTextColorClass()}`}>
          <Alert variant="danger">
            <p>{error}</p>
            <Button variant="warning" onClick={onClose}>
              Close
            </Button>
          </Alert>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal
      show={showModal}
      onHide={onClose}
      size="lg"
      centered
      dialogClassName={`modal-dialog bg-${theme}`}
      className={`${getTextColorClass()} text-center`}
    >
      <Modal.Header closeButton className={`bg-${theme} ${getTextColorClass()}`}>
        <Modal.Title className="w-100">Template Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`p-3 bg-${theme} ${getTextColorClass()}`}>
      {templateData.image.length > 0 && (
            <Row>
              <Col>
              <h5>Image:</h5>
              <img src={templateData.image} alt='image' className='img-fluid custom-img'></img>
              </Col>
            </Row>
          )}
        <Row className="mt-3 mb-3">
          <Col>
            <h5>Title:</h5>
            <p>{templateData.title}</p>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <h5>Description:</h5>
            <ReactMarkdown>
              {templateData.description.length > 0 ? templateData.description : 'No description'}
            </ReactMarkdown>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <h5>Topic:</h5>
            <p>{templateData.topicName}</p>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <h5>Visibility:</h5>
            <p>{templateData.isPublic ? 'Public' : 'Private'}</p>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <h5>Tags:</h5>
            <p>
              {templateData.tags.length > 0
                ? templateData.tags.map((tag) => tag.tagName).join(', ')
                : 'No Tags'}
            </p>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <h5>Questions:</h5>
            {questionData.length > 0 ? (
              <ul className="ps-0" style={{ listStyleType: "none" }}>
                {questionData.map((question, index) => (
                  <li key={question.id}>
                    <strong>{index + 1}. {question.text}</strong> ({question.type})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No questions available.</p>
            )}
          </Col>
        </Row>
        <Col>
          <h5>Likes:</h5>
          <LikeTemplate templateId={templateId} />
        </Col>
      </Modal.Body>
      <Modal.Footer className={`bg-${theme} ${getTextColorClass()}`}>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}