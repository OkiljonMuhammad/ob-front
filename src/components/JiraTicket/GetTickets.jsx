import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Row, Col, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ThemeContext from '../../context/ThemeContext';

export default function GetTickets() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState({
    totalTickets: 0,
    page: 1,
    totalPages: 1,
    limit: 10,
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [reload, setReload] = useState(false);
  const { theme } = useContext(ThemeContext);

  const fetchTickets = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/jira/tickets`, {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data) {
        setTickets(response.data.tickets || []);
        setPagination({
          totalTickets: response.data.totalTickets || 0,
          page: response.data.page || 1,
          totalPages: response.data.totalPages || 1,
          limit: limit,
        });
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(pagination.page, pagination.limit);
  }, [reload, pagination.page]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <>
      <Row className="mb-3">
        <Col>
          <Button variant="primary" onClick={() => navigate('/ticket/create')}>
            Create Ticket
          </Button>
        </Col>
        <Col>
          <Button variant="success" onClick={() => setReload(!reload)}>
            Reload
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="d-flex justify-content-center text-center">
          <div>
            <div className="spinner-grow text-primary"></div>
            <p>Loading tickets...</p>
          </div>
        </div>
      ) : tickets.length === 0 ? (
        <p className="text-center">No Tickets</p>
      ) : (
        <>
          <Table striped bordered hover responsive className={`text-center table-${theme}`}>
            <thead>
              <tr>
                <th>#</th>
                <th>Key</th>
                <th>Template Title</th>
                <th>Summary</th>
                <th>Status</th>
                <th>Date</th>
                <th>Priority</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket, index) => (
                <tr key={ticket.key}>
                  <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                  <td>{ticket.key}</td>
                  <td>{ticket.templateTitle}</td>
                  <td>{ticket.summary}</td>
                  <td>{ticket.status}</td>
                  <td>{ticket.priority.name}</td>
                  <td>{new Date(ticket.created).toLocaleDateString()} {new Date(ticket.created).toLocaleTimeString()}</td>

                  <td>
                    <a href={ticket.ticketUrl} target="_blank" rel="noopener noreferrer">
                      View Ticket
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-center">
            <Pagination>
              {pagination.page > 1 && (
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
              {pagination.page < pagination.totalPages && (
                <Pagination.Next onClick={() => handlePageChange(pagination.page + 1)} />
              )}
            </Pagination>
          </div>
        </>
      )}
    </>
  );
}
