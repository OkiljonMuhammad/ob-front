import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Table, Button, Row, Col, Pagination, Form, InputGroup, Container, Tabs, Tab } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
import ThemeContext from '../../context/ThemeContext';
import ViewAnswer from './ViewAnswer';
import DeleteAnswer from './DeleteAnswer';

export default function Answers() {
  const { formId, formName } = useParams();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [answers, setAnswers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    prevPage: null,
    nextPage: null,
  });
  
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFormCreateModal, setShowFormCreateModal] = useState(false);
  const [showUseFormModal, setShowUseFormModal] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedFormName, setSelectedFormName] = useState(null);
  const { theme } = useContext(ThemeContext); 

  const handleAnswerDeleted = (userId) => {
    setAnswers((prevAnswers) =>
      prevAnswers.filter((answer) => answer.userId !== userId)
    );
  };
  const handleDeleteClick = (userId, formId) => {
    setSelectedFormId(formId);
    setSelectedUserId(userId);
    setShowDeleteModal(true);
  };

  const handleViewClick = (formId, userId, FormName) => {
    setSelectedFormId(formId);
    setSelectedUserId(userId);
    setSelectedFormName(FormName);
    setShowViewModal(true);
  };
  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setShowViewModal(false);
    setShowFormCreateModal(false);
    setShowUseFormModal(false);
    setSelectedFormId(null);
  };

  const fetchAnswers = async (page = 1, limit = 10, search = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/answer/answers/${formId}`, {
        params: { page, limit, search },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data) {
        setAnswers(response.data.answers || []);
        setPagination(response.data.pagination || {
          total: 0,
          page: 1,
          totalPages: 1,
          prevPage: null,
          nextPage: null,
        });
      }
    } catch (error) {
      console.error('Error fetching answers:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchAnswers = useCallback(
    debounce((query) => {
      fetchAnswers(1, 10, query);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFetchAnswers(searchQuery);
  }, [searchQuery]);

  const handlePageChange = (newPage) => {
    fetchAnswers(newPage, 10, searchQuery);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Results</h1>
      <Tabs
        defaultActiveKey="answers"
        id="results"
        className="mb-3"
      >
        <Tab eventKey="answers" title="Answers">
        <>
          <Row className="mb-3">
            <Col>
              <h3>{formName}</h3>
            </Col>
            
            <Col xs="auto">
            <Form.Group controlId="searchInput">
                <Form.Label>Search Answers</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Enter user id..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className={`bg-${theme} ${getTextColorClass()}`}
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
              <div className="spinner-border"></div>
              <p>Loading answers...</p>
            </div>
          </div>
          ) : answers.length === 0 ? (
          <p className="display-5 text-center">No Answers</p>
          ) :(
            <>
              <Table striped bordered hover responsive className={`text-center table-${theme}`}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>User Id</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {answers.map((answer, index) => (
                    <tr key={answer.id ? `answer-${answer.id}` : `answer-index-${index}`}>
                      <td>{index + 1}</td>
                      <td>{answer.username}</td>
                      <td>{answer.userId}</td>
                      <td>
                      <Button
                          variant="success"
                          size="sm"
                          className="me-2"
                          onClick={() => handleViewClick(formId, answer.userId, formName)}
                        >
                          View
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="me-2"
                          onClick={() => handleDeleteClick(answer.userId, formId)}
                        >
                          Delete
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
            <DeleteAnswer
              formId={selectedFormId}
              userId={selectedUserId} 
              showModal={showDeleteModal} 
              onClose={handleCloseModal} 
              onAnswerDeleted={handleAnswerDeleted}
            />
          )}
          {showViewModal && (
            <ViewAnswer
              formId={selectedFormId}
              userId={selectedUserId}
              formName={selectedFormName}
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
        </Tab>
      </Tabs>
    </Container>
  );
}
