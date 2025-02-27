import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Row, Col, Pagination, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
import DeleteUser from './DeleteUser';
import ViewUser from './ViewUser';
import ToggleBlockUser from './ToggleBlockUser';
import ThemeContext from '../../../context/ThemeContext';
import { useContext } from 'react';
// import EditUser from './EditUser';

export default function Users() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
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
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [showViewModal, setShowViewModal] = useState(false); 
  const [showToggleBlockModal, setShowToggleBlockModal] = useState(false); 
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserIsBlocked, setselectedUserIsBlocked] = useState(false);

  const handleUserDeleted = (deletedUserId) => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== deletedUserId)
    );
  };
  const toggleBlockStatus = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isBlocked: !user.isBlocked } : user
      )
    );
  };
  // Function to open the modal and set the template ID
  const handleDeleteClick = (userId) => {
    setSelectedUserId(userId);
    setShowDeleteModal(true);
  };
  
  const handleViewClick = (userId) => {
    setSelectedUserId(userId);
    setShowViewModal(true);
  };

  const handleToggleBlockClick = (userId) => {
    setSelectedUserId(userId);
      const user = users.find((user) => user.id === userId);
      const status = user.isBlocked ? true : false;
      setselectedUserIsBlocked(status);
      setShowToggleBlockModal(true);
    
  }
  // Function to close the modal
  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setShowViewModal(false);
    setShowToggleBlockModal(false);
    setSelectedUserId(null); 
  };

  const fetchTemplates = async (page = 1, limit = 10, role = '', search = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/admin/users`, {
        params: { page, limit, role, search },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data) {
        setUsers(response.data.users || []);
        setPagination(response.data.pagination || {
          total: 0,
          page: 1,
          totalPages: 1,
          prevPage: null,
          nextPage: null,
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/roles`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRoles(response.data.roles || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const debouncedFetchTemplates = useCallback(
    debounce((query, role) => {
      fetchTemplates(1, 10, role, query);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFetchTemplates(searchQuery, selectedRole);
  }, [searchQuery, selectedRole]);

  const handlePageChange = (newPage) => {
    fetchTemplates(newPage, 10, selectedRole, searchQuery);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    debouncedFetchTemplates('', selectedRole);
  };
  const handleRoleChange = (e) => {
    const value = e.target.value;
    setSelectedRole(value);
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <>
      <Row className="mb-3">
        <Col>
          <Button variant="primary" onClick={() => navigate('/admin/user/create')}>
            Create User
          </Button>
        </Col>
        <Col xs="auto">
        <Form.Group controlId="searchInput">
            <Form.Label>Search Users</Form.Label>
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
              <option value="">{roles.length === 0 ? "No role" : "All Roles"}</option>
              {roles.map((role) => (
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
           <p>Loading users...</p>
         </div>
       </div>
      ) : users.length === 0 ? (
      <p className="text-center">No Users</p>
      ) :(
        <>
          <Table striped bordered hover responsive className={`text-center table-${theme}`}>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
                <th>Role</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{(pagination.page - 1) * 10 + index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.isBlocked ? "Blocked" : "Active"}</td>
                  <td>{user.role}</td> 
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleViewClick(user.id)}
                    >
                      View
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => navigate(`/admin/user/edit/${user.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant={user.isBlocked ? 'success' : 'secondary'}
                      className="me-2"
                      size="sm"
                      onClick={() => handleToggleBlockClick(user.id)}
                    >
                     { user.isBlocked ? "Unblock" : "Block"}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(user.id)}
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
        <DeleteUser
          userId={selectedUserId} 
          showModal={showDeleteModal} 
          onClose={handleCloseModal} 
          onUserDeleted={handleUserDeleted}
        />
      )}
      {showViewModal && (
        <ViewUser
          showModal={showViewModal}
          onClose={handleCloseModal}
          userId={selectedUserId}
        />
      )}
      {showToggleBlockModal && (
        <ToggleBlockUser
          userId={selectedUserId} 
          isBlocked={selectedUserIsBlocked}
          showModal={showToggleBlockModal} 
          onClose={handleCloseModal} 
          onToggleBlockUser={toggleBlockStatus}
        />
      )}
    </>
  );
}
