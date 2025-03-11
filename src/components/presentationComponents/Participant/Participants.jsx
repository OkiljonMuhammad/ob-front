import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Row, Col, Pagination, Form, InputGroup, Container } from 'react-bootstrap';
import axios from 'axios';
import { debounce } from 'lodash';
import RemoveParticipant from './RemoveParticipant';
import ChangeParticipantRole from './ChangeParticipantRole'
import ThemeContext from '../../../context/ThemeContext';
import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Participants() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { presentationId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [participantRoles, setParticipantRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
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
  const [showRemoveModal, setShowRemoveModal] = useState(false); 
  const [showChangeRoleModal, setShowChangeRoleModal] = useState(false); 
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserRole, setSelectedUserRole] = useState(null);

  const handleParticipantRemove = (removedParticipantId) => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((participant) => participant.id !== removedParticipantId)
    );
  };

  const changeRole = (newRole) => {
    setParticipants((prevParticipants) =>
      prevParticipants.map((participant) =>
        participant.id === selectedUserId ? { ...participant, role: newRole } : participant
      )
    );
  };

  // Function to open the modal and set the template ID
  const handleRemoveClick = (userId) => {
    setSelectedUserId(userId);
    setShowRemoveModal(true);
  };
  
  const handleChangeRoleClick = (userId, userRole) => {
    setSelectedUserId(userId);
    setSelectedUserRole(userRole);
    setShowChangeRoleModal(true);
  }
  // Function to close the modal
  const handleCloseModal = () => {
    setShowRemoveModal(false);
    setShowChangeRoleModal(false);
    setSelectedUserId(null); 
    setSelectedUserRole(null);

  };

  const fetchParticipants = async (page = 1, limit = 10, role = '', search = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/participant/${presentationId}`, {
        params: { page, limit, role, search },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data) {
        setParticipants(response.data.participants || []);
        setPagination(response.data.pagination || {
          total: 0,
          page: 1,
          totalPages: 1,
          prevPage: null,
          nextPage: null,
        });
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/participant/roles`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });
      setParticipantRoles(response.data?.participantRoles || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const debouncedFetchParticipants = useCallback(
    debounce((query, role) => {
      fetchParticipants(1, 10, role, query);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFetchParticipants(searchQuery, selectedRole);
  }, [searchQuery, selectedRole]);

  const handlePageChange = (newPage) => {
    fetchParticipants(newPage, 10, selectedRole, searchQuery);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    debouncedFetchParticipants('', selectedRole);
  };
  const handleRoleChange = (e) => {
    const value = e.target.value;
    setSelectedRole(value);
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <Container className='min-vh-100'>
      <h2>Participants</h2>
      <Row className="mb-3">
        <Col>
          <Button variant="success" onClick={() => navigate('/admin/user/create')}>
            Add Participant
          </Button>
        </Col>
        <Col xs="auto">
        <Form.Group controlId="searchInput">
            <Form.Label>Search participants</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Enter user name..."
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
        <Col xs="auto">
          <Form.Group controlId="roleFilter">
            <Form.Label>Filter by Role</Form.Label>
            <Form.Select 
            value={selectedRole} 
            onChange={handleRoleChange}
            className={`bg-${theme} ${getTextColorClass()}`} >
              <option value="">{participantRoles.length === 0 ? "No role" : "All Roles"}</option>
              {participantRoles.map((role) => (
                <option key={role.id} value={role.roleName}>
                  {role.roleName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {loading ? (
         <div className="d-flex justify-content-center text-center">
         <div>
           <div className="spinner-grow text-primary"></div>
           <p>Loading participants...</p>
         </div>
       </div>
      ) : participants.length === 0 ? (
      <p className="text-center">No participants</p>
      ) :(
        <>
          <Table striped bordered hover responsive className={`text-center table-${theme}`}>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Role</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((user, index) => (
                <tr key={user.id}>
                  <td>{(pagination.page - 1) * 10 + index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td> 
                  <td>{new Date(user.createdAt).toLocaleDateString()} {new Date(user.createdAt).toLocaleTimeString()}</td>
                  <td>
                    <Button
                      variant="info"
                      className="me-2"
                      size="sm"
                      onClick={() => handleChangeRoleClick(user.id, user.role)}
                    >
                      Change Role
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveClick(user.id)}
                    >
                      Remove
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
       {showRemoveModal && (
        <RemoveParticipant
          presentationId={presentationId}
          userId={selectedUserId} 
          showModal={showRemoveModal} 
          onClose={handleCloseModal} 
          onParticipantRemoved={handleParticipantRemove}
        />
      )}
      {showChangeRoleModal && (
        <ChangeParticipantRole
          userId={selectedUserId}
          presentationId={presentationId}
          userRole={selectedUserRole}
          showModal={showChangeRoleModal} 
          onClose={handleCloseModal} 
          onRoleChanged={changeRole}
        />
      )}
    </Container>
  );
}
