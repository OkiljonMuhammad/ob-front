import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Button, Row, Col, Pagination, Form, Card, InputGroup, Container } from 'react-bootstrap';
import axios from 'axios';
import { debounce } from 'lodash';
import ThemeContainer from '../Layout/ThemeContainer';
import ThemeContext from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import JoinPresentation from '../../components/presentationComponents/Presentation/JoinPresentation';
import { encryptData } from '../../utils/authUtils';

const PresentationGallery = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [presentations, setPresentations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedPresentationId, setSelectPresentationateId] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    prevPage: null,
    nextPage: null,
  });
  const { t } = useTranslation();

  const fetchPresentations = async (page = 1, limit = 6, search = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/presentation/presentations/public`, {
        params: { page, limit, search },
        headers: { Authorization: `Bearer ${token}` },
      });
      setPresentations(response.data?.presentations || []);
      setPagination(response.data?.pagination || {
        total: 0,
        page: 1,
        totalPages: 1,
        prevPage: null,
        nextPage: null,
      });
    } catch (error) {
      console.error('Error fetching presentations:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchPresentations = useCallback(
    debounce((query) => {
      fetchPresentations(1, 6, query);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedFetchPresentations(searchQuery);
    return () => debouncedFetchPresentations.cancel();
  }, [searchQuery, debouncedFetchPresentations]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const encryptedUrl = (presentationId) => {
    const encryptedText = encryptData(`${presentationId}`);
    return encodeURIComponent(encryptedText);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchPresentations(1, 6, '');
  };

  const handlePageChange = (newPage) => {
    fetchPresentations(newPage, 6, searchQuery);
  };

  const handleJoinClick = (presentationId) => {
    setSelectPresentationateId(presentationId);
    setShowJoinModal(true);
  };

  const handleCloseModal = () => {
    setShowJoinModal(false);
    setSelectPresentationateId(null);
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <>
    <Container className='min-vh-100'>
      <Row className="mb-3 justify-content-center text-center">
        <Col xs={12} md={4} lg={3}>
          <Form.Group controlId="searchInput">
            <Form.Label>{t('searchPresentations')}</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                className={`bg-${theme} ${getTextColorClass()} custom-placeholder`}
                placeholder={t('EnterPresentationTitle')}
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <InputGroup.Text style={{ cursor: 'pointer' }} onClick={handleClearSearch}>
                  <i className="bi bi-x-lg"></i>
                </InputGroup.Text>
              )}
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>
      {loading ? (
        <>
        <div className="spinner-grow text-primary"></div>
        <p className="text-center">{t('loadingPresentation')}</p>
        </>
      ) : presentations.length === 0 ? (
        <p className="text-center">{t('noPresentationsFound')}</p>
      ) : (
        <>
          <Row xs={1} md={3} className="g-4">
            {presentations.map((presentation) => (
              <Col key={presentation.id}>
                <Card className={`bg-${theme} ${getTextColorClass()}`}>
                  <Card.Body>
                    <Card.Title>{t('title')}: {presentation.title}</Card.Title>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        const encryptedText = encryptedUrl(presentation.id);
                        navigate(`/presentation/view/${encryptedText}`);
                      }}>
                      {t('view')}
                    </Button>
                     <Button
                      variant="primary"
                      size="sm"
                      className="me-2"

                      onClick={() => handleJoinClick(presentation.id)}
                    >
                      Join
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          {pagination.totalPages > 0 && (
        <div className="d-flex justify-content-center">
          <Pagination className="mt-3">
            {pagination.prevPage !== null && (
              <Pagination.Prev
                onClick={() => handlePageChange(pagination.page - 1)}
              >
              </Pagination.Prev>
            )}
            {[...Array(pagination.totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === pagination.page}
                onClick={() => handlePageChange(index + 1)}
                className={`bg-${theme} ${getTextColorClass()} ${
                  index + 1 === pagination.page ? 'active' : ''
                }`}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            {pagination.nextPage !== null && (
              <Pagination.Next
                onClick={() => handlePageChange(pagination.page + 1)}
                className={`bg-${theme} ${getTextColorClass()}`}
              >
              </Pagination.Next>
            )}
          </Pagination>
        </div>
      )}
        </>
      )}
       {showJoinModal && (
        <JoinPresentation
          presentationId={selectedPresentationId} 
          showModal={showJoinModal} 
          onClose={handleCloseModal} 
        />
      )}
    </Container>
    </>
  );
};

export default PresentationGallery;