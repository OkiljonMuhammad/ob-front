import React, { useState, useEffect } from 'react';
import { Button, Modal, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';

export default function ViewUser({ showModal, onClose, userId }) {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // State variables
  const [userData, setUserData] = useState({
    id: '',
    username: '',
    email: '',
    role: '',
    isBlocked: '',
    createdAt: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` || '',
        },
      });
      const fetchedUserData = response.data.user;

      // Update user data state
      setUserData({
        id: fetchedUserData.id || '',
        username: fetchedUserData.username || '',
        email: fetchedUserData.email || '',
        role: fetchedUserData.role || '',
        isBlocked: fetchedUserData.isBlocked || '',
        createdAt: fetchedUserData.createdAt || '',
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching user:', error);
      setError(error.response?.data?.message || 'Failed to load user data.');
      setLoading(false);
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    if (showModal && userId) {
      fetchUser();
    }
  }, [showModal, userId]);

  // Loading state
  if (loading) {
    return (
      <Modal show={showModal} onHide={onClose} centered>
        <Modal.Body>Loading user data...</Modal.Body>
      </Modal>
    );
  }

  // Error state
  if (error) {
    return (
      <Modal show={showModal} onHide={onClose} centered className='text-center'>
        <Modal.Body>
          <Alert variant="danger">
            <p>{error}</p>
            <Button variant="warning" onClick={onClose}>
              Close
            </Button>
          </Alert>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={showModal} onHide={onClose} size="lg" centered className='text-center'>
      <Modal.Header closeButton>
        <Modal.Title className='w-100'>User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Title */}
        <Row className="mb-3">
          <Col>
            <h5>Id: {userData.id}</h5>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <h5>Username: {userData.username}</h5>
          </Col>
        </Row>

        {/* Description */}
        <Row className="mb-3">
          <Col>
            <h5>Email: {userData.email}</h5>
          </Col>
        </Row>

        {/* Topic */}
        <Row className="mb-3">
          <Col>
            <h5>Role: {userData.role}</h5>
          </Col>
        </Row>

        {/* Visibility */}
        <Row className="mb-3">
          <Col>
            <h5>Status: {userData.isBlocked ? 'Blocked' : 'Active'}</h5>
          </Col>
        </Row>

        {/* Tags */}
        <Row className="mb-3">
          <Col>
            <h5>Registration Date: {new Date(userData.createdAt).toLocaleDateString()}</h5>
          </Col>
        </Row>        
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}