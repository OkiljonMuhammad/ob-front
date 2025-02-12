import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Templates() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [templates, setTemplates] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    prevPage: null,
    nextPage: null,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch templates from the API
  const fetchTemplates = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/template/templates`, {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const { templates: fetchedTemplates, pagination: fetchedPagination } =
        response.data;
      console.log(response.data);
      setTemplates(fetchedTemplates);
      setPagination(fetchedPagination);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when the component mounts
  useEffect(() => {
    fetchTemplates(pagination.page);
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchTemplates(newPage);
  };

  return (
    <>
      <Row className="mb-3">
        <Col>
          {/* Button to navigate to CreateTemplate */}
          <Button
            variant="primary"
            onClick={() => navigate('/templates/create')}
          >
            Create Template
          </Button>
        </Col>
      </Row>

      {/* Loading State */}
      {loading ? (
        <p>Loading templates...</p>
      ) : (
        <>
          {/* Table to display templates */}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Topic</th>
                <th>Users</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.id}>
                  <td>{template.title}</td>
                  <td>{new Date(template.createdAt).toLocaleDateString()}</td>
                  <td>{template.Topic?.topicName || 'No Topic'}</td>
                  <td>{template.User?.username|| 'No User'}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() =>
                        navigate(`/templates/edit/${template.id}`)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => console.log('Delete template:', template.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination Controls */}
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
        </>
      )}
    </>
  );
}