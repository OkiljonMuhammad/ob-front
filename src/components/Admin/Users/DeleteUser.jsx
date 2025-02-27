import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import ThemeContext from '../../../context/ThemeContext';

const DeleteUser = ({ userId, showModal, onClose, onUserDeleted }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [isDeleting, setIsDeleting] = useState(false);
  const { theme } = useContext(ThemeContext); 

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`${BASE_URL}/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` || '',
        },
      });
      toast.success('User deleted successfully.');
      onUserDeleted(userId);
      onClose();
    } catch (error) {
      toast.error('Failed to delete user. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <Modal show={showModal} onHide={onClose} centered className="text-center">
      <Modal.Header 
      closeButton
      className={`bg-${theme} ${getTextColorClass()}`}>

        <Modal.Title className='w-100'>Delete User</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`bg-${theme} ${getTextColorClass()}`}>
        Are you sure you want to delete this user?
      </Modal.Body>
      <Modal.Footer className={`bg-${theme} ${getTextColorClass()}`}>
        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteUser;