import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Table, Button, Row, Col, Pagination, Form, InputGroup, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
import ThemeContext from '../../../context/ThemeContext';
import DeletePresentation from './deletePresentation';
import SharePresentation from './SharePresentation';
import { encryptData } from '../../../utils/authUtils';

export default function Presentations() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [presentations, setPresentations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    prevPage: null,
    nextPage: null,
  });
  
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedPresentationId, setSelectPresentationateId] = useState(null);

  const encryptedUrl = (presentationId) => {
      const encryptedText = encryptData(`${presentationId}`);
      return encodeURIComponent(encryptedText);
  };

  const handlePresentationDeleted = (deletedPresentationId) => {
    setPresentations((prevPresentations) =>
      prevPresentations.filter((presentation) => presentation.id !== deletedPresentationId)
    );
  };
  
  const handleDeleteClick = (presentationId) => {
    setSelectPresentationateId(presentationId);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setShowShareModal(false);
    setSelectPresentationateId(null);
  };

  const handleShareClick = (presentationId) => {
    setSelectPresentationateId(presentationId);
    setShowShareModal(true);
  };
  const fetchPresentations = async (page = 1, limit = 10, search = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/presentation/presentations`, {
        params: { page, limit, search },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data) {
        setPresentations(response.data?.presentations || []);
        setPagination(response.data?.pagination || {
          total: 0,
          page: 1,
          totalPages: 1,
          prevPage: null,
          nextPage: null,
        });
      }
    } catch (error) {
      console.error('Error fetching presentations:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchPresentations = useCallback(
    debounce((query) => {
      fetchPresentations(1, 10, query);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFetchPresentations(searchQuery);
  }, [searchQuery]);

  const handlePageChange = (newPage) => {
    fetchPresentations(newPage, 10, searchQuery);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    debouncedFetchPresentations('');
  };
  
  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <Container className='min-vh-100'>
      <Row className="mb-3">
        <Col>
          <Button variant="success" onClick={() => navigate('/presentation/create')}>
            Create Presentation
          </Button>
        </Col>
        <Col xs="auto">
        <Form.Group controlId="searchInput">
            <Form.Label>Search Presentations</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Enter template title..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={`bg-${theme} ${getTextColorClass()} custom-placeholder`}
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
         <div className="d-flex justify-content-center text-center">
         <div>
           <div className="spinner-grow text-primary"></div>
           <p>Loading presentations...</p>
         </div>
       </div>
      ) : presentations.length === 0 ? (
      <p className="text-center">No Presentation</p>
      ) :(
        <>
          <Table striped bordered hover responsive className={`text-center table-${theme}`} >
            <thead >
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {presentations.map((presentation, index) => (
                <tr key={presentation.id}>
                 <td>{(pagination.page - 1) * 10 + index + 1}</td>
                  <td>{presentation.title}</td>
                  <td>{new Date(presentation.createdAt).toLocaleDateString()} {new Date(presentation.createdAt).toLocaleTimeString()}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        const encryptedText = encryptedUrl(presentation.id);
                        navigate(`/presentation/view/${encryptedText}`);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                      const encryptedText = encryptedUrl(presentation.id);
                      navigate(`/presentation/update/${encryptedText}`);
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="me-2"
                      onClick={() => handleDeleteClick(presentation.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShareClick(presentation.id)}
                    >
                      Share
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => navigate(`/presentation/participants/${presentation.id}`)}
                    >
                      Participants
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          <div className="d-flex justify-content-center">
          <Pagination>
            {pagination.prevPage && (
              <Pagination.Prev onClick={() => handlePageChange(pagination.page - 1)} />
            )}
            {[...Array(pagination.totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === pagination.page}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            {pagination.nextPage && (
              <Pagination.Next onClick={() => handlePageChange(pagination.page + 1)} />
            )}
          </Pagination>
          </div>
        </>
      )}
       {showDeleteModal && (
        <DeletePresentation
          presentationId={selectedPresentationId} 
          showModal={showDeleteModal} 
          onClose={handleCloseModal} 
          onPresentationDeleted={handlePresentationDeleted}
        />
      )}
        {showShareModal && (
        <SharePresentation
          presentationId={selectedPresentationId} 
          showModal={showShareModal} 
          onClose={handleCloseModal} 
        />
      )}
    </Container>
  );
}
