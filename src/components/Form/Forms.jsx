import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Table, Button, Row, Col, Pagination, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
import DeleteForm from './DeleteForm';
import ViewTemplate from '../Template/ViewTemplate';
import CreateForm from './CreateForm';
import UseForm from './UseForm';
import { encryptData } from '../../utils/authUtils';
import ThemeContext from '../../context/ThemeContext';

export default function Forms() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [forms, setForms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    prevPage: null,
    nextPage: null,
  });
  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFormCreateModal, setShowFormCreateModal] = useState(false);
  const [showUseFormModal, setShowUseFormModal] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [reload, setReload] = useState(false);
  const { theme } = useContext(ThemeContext); 

  const encryptedUrl = (form) => {
    const encryptedText = encryptData(`${form.id}/${form.templateId}`);
    return encodeURIComponent(encryptedText);
  };

  const handleFormDeleted = (deletedFormId) => {
    setForms((prevForms) =>
      prevForms.filter((form) => form.id !== deletedFormId)
    );
  };
  const handleDeleteClick = (formId) => {
    setSelectedFormId(formId);
    setShowDeleteModal(true);
  };

  const handleUseFormClick = (form) => {
    setSelectedFormId(form);
    setShowUseFormModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setShowViewModal(false);
    setShowFormCreateModal(false);
    setShowUseFormModal(false);
    setSelectedFormId(null);
  };

  const fetchForms = async (page = 1, limit = 10, search = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/form/forms`, {
        params: { page, limit, search },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data) {
        setForms(response.data.forms || []);
        setPagination(response.data.pagination || {
          total: 0,
          page: 1,
          totalPages: 1,
          prevPage: null,
          nextPage: null,
        });
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchForms = useCallback(
    debounce((query) => {
      fetchForms(1, 10, query);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFetchForms(searchQuery);
  }, [searchQuery, reload]);

  const handlePageChange = (newPage) => {
    fetchForms(newPage, 10, searchQuery);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <>
      <Row className="mb-3">
        <Col>
          <Button variant="primary" onClick={() => navigate('/templates/create')}>
            Create Form
          </Button>
        </Col>
        <Col>
          <Button variant="success" onClick={() => setReload(!reload)}>
            Reload
          </Button>
        </Col>
        <Col xs="auto">
        <Form.Group controlId="searchInput">
            <Form.Label>Search Forms</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Enter form name..."
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
           <p>Loading forms...</p>
         </div>
       </div>
      ) : forms.length === 0 ? (
      <p className="text-center">No Forms</p>
      ) :(
        <>
          <Table striped bordered hover responsive className={`text-center table-${theme}`}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Form Id</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form, index) => (
                <tr key={form.id}>
                  <td>{(pagination.page - 1) * 10 + index + 1}</td>
                  <td>{form.name}</td>
                  <td>{form.id}</td>
                  <td>{new Date(form.createdAt).toLocaleDateString()} {new Date(form.createdAt).toLocaleTimeString()}</td>
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        const encryptedText = encryptedUrl(form);
                        console.log("Navigating to:", `/form/submit/${encryptedText}`);
                        navigate(`/form/submit/${encryptedText}`);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => navigate(`/form/edit/${form.templateId}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="me-2"
                      onClick={() => handleDeleteClick(form.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="primary"
                      className="me-2"
                      size="sm"
                      onClick={() => handleUseFormClick(form)}
                    >
                      Share
                    </Button>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => navigate(`/answers/${form.id}/${form.name}`)}
                    >
                      View Answers
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/form/access/${form.id}`)}
                    >
                      Access
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
        <DeleteForm
          formId={selectedFormId} 
          showModal={showDeleteModal} 
          onClose={handleCloseModal} 
          onFormDeleted={handleFormDeleted}
        />
      )}
      {showViewModal && (
        <ViewTemplate
          templateId={selectedFormId}
          showModal={showViewModal}
          onClose={handleCloseModal}
        />
      )}
       {showFormCreateModal && (
        <CreateForm
          templateId={selectedFormId}
          showModal={showFormCreateModal} 
          onClose={handleCloseModal} 
        />
      )}
      {showUseFormModal && (
        <UseForm
          form={selectedFormId}
          showModal={showUseFormModal} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
}
