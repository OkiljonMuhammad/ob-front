import React, { useState, useEffect, useContext } from 'react';
import { Button, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import ViewTemplate from '../Template/ViewTemplate';
import ThemeContainer from '../Layout/ThemeContainer';
import ThemeContext from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const PopularTemplates = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const { t } = useTranslation();

  const handleViewClick = (templateId) => {
    setSelectedTemplateId(templateId);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setSelectedTemplateId(null);
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/template/templates/popular`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTemplates(response.data?.templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);


  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <>
    <ThemeContainer>
      <Row className="mb-3 justify-content-end">
      </Row>
      {loading ? (
        <>
        <div className="spinner-grow text-primary"></div>
        <p className="text-center">{t('loadingTemplate')}</p>
        </>
      ) : templates.length === 0 ? (
        <p className="text-center">{t('noTemplatesFound')}</p>
      ) : (
        <>
          <Row xs={1} md={3} className="g-4">
            {templates.map((template) => (
              <Col key={template.id}>
                <Card className={`bg-${theme} ${getTextColorClass()}`}>
                  <Card.Body>
                    <Card.Title>{t('title')}: {template.title}</Card.Title>
                    <Card.Text>{t('topic')}: {template.Topic?.topicName || 'No Topic'}</Card.Text>
                    <Card.Text>{t('author')}: {template.User?.username || 'No User'}</Card.Text>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleViewClick(template.id)}
                    >
                      {t('viewTemplate')}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"

                      onClick={() => navigate(`/comments/${template.id}`)}
                    >
                      Comments
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
      {showViewModal && (
        <ViewTemplate
          showModal={showViewModal}
          onClose={handleCloseModal}
          templateId={selectedTemplateId}
        />
      )}
    </ThemeContainer>
    </>
  );
};

export default PopularTemplates;