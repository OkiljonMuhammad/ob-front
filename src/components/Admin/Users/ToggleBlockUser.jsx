import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import ThemeContext from '../../../context/ThemeContext';

const ToggleBlockUser = ({ userId, isBlocked, showModal, onClose, onToggleBlockUser }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [isProcessing, setIsProcessing] = useState(false);
  const { theme } = useContext(ThemeContext); 

  const handleToggleBlock = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.patch(
        `${BASE_URL}/api/admin/user/block/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` || '',
          },
        }
      );

      const newStatus = response.data?.user?.isBlocked;
      toast.success(newStatus ? 'User blocked successfully.' : 'User unblocked successfully.');

      onToggleBlockUser(userId, newStatus);
      onClose();
    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
      toast.error('Failed to update user status. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <Modal show={showModal} onHide={onClose} centered className="text-center">
      <Modal.Header 
      closeButton
      className={`bg-${theme} ${getTextColorClass()}`}>
        <Modal.Title className="w-100">
          {isBlocked ? 'Unblock User' : 'Block User'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={`bg-${theme} ${getTextColorClass()}`}>
        {isBlocked
          ? 'Are you sure you want to unblock this user?'
          : 'Are you sure you want to block this user?'}
      </Modal.Body>
      <Modal.Footer className={`bg-${theme} ${getTextColorClass()}`}>
        <Button
          variant={isBlocked ? 'success' : 'danger'}
          onClick={handleToggleBlock}
          disabled={isProcessing}
        >
          {isProcessing ? (isBlocked ? 'Unblocking...' : 'Blocking...') : isBlocked ? 'Unblock' : 'Block'}
        </Button>
        <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ToggleBlockUser;
