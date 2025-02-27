import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Alert } from 'react-bootstrap';
import axios from 'axios';

const FormAccessManagement = ({ formId }) => {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchUsersWithAccess();
  }, []);

  const fetchUsersWithAccess = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/form/access/${formId}`, 
        {
          headers: { Authorization: `Bearer ${token}` },
        });
      setUsers(response.data.users);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching users');
    }
  };

  const grantAccess = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/form/access/${formId}`, { userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        });
      setMessage(response.data.message);
      fetchUsersWithAccess();
    } catch (error) {
      setError(error.response?.data?.message || 'Error granting access');
    }
  };

  const revokeAccess = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/form/access/${formId}`, { userId: id }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('Access revoked successfully');
      fetchUsersWithAccess();
    } catch (error) {
      setError(error.response?.data?.message || 'Error revoking access');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Form Access</h2>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form className="mb-3">
        <Form.Group>
          <Form.Label>User ID</Form.Label>
          <Form.Control
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter User ID"
          />
        </Form.Group>
        <Button variant="primary" className="mt-2" onClick={grantAccess}>
          Grant Access
        </Button>
      </Form>

      <h3>Users with Access</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => revokeAccess(user.id)}>
                  Revoke
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default FormAccessManagement;
