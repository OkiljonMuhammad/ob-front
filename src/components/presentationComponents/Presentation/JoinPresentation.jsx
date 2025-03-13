import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import ThemeContext from '../../../context/ThemeContext';
import { encryptData } from '../../../utils/authUtils';
import { useNavigate } from 'react-router-dom';
const DeletePresentation = ({ presentationId, showModal, onClose }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [isJoining, setIsJoining] = useState(false);
  const { theme } = useContext(ThemeContext); 
  const navigate = useNavigate();
  
  const encryptedUrl = (presentationId) => {
    const encryptedText = encryptData(`${presentationId}`);
    return encodeURIComponent(encryptedText);
  };

  const handleJoin = async () => {
    setIsJoining(true);
    try {
        await axios.post(`${BASE_URL}/api/presentation/join/${presentationId}`, 
        {},
        {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const encryptedText = encryptedUrl(presentationId);
      navigate(`/presentation/update/${encryptedText}`);
      onClose();
    } catch (error) {
      console.error('Error joining presentation', error);
      toast.error('Failed to join presentation. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <Modal 
    show={showModal} 
    onHide={onClose} 
    centered 
    className={`text-center bg-${theme} ${getTextColorClass()}`}>
      <Modal.Header 
      closeButton 
      className={`bg-${theme} ${getTextColorClass()}`}>
        <Modal.Title className='w-100'>Join Presentation</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`bg-${theme} ${getTextColorClass()}`}>
        Do you want to join?
      </Modal.Body>
      <Modal.Footer className={`bg-${theme} ${getTextColorClass()}`}>
        <Button
          variant="danger"
          onClick={handleJoin}
          disabled={isJoining}
        >
          {isJoining ? 'joining...' : 'join'}
        </Button>
        <Button variant="secondary" onClick={onClose}>
         Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeletePresentation;