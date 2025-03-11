import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import ThemeContext from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const RemoveParticipant = ({ presentationId, userId, showModal, onClose, onParticipantRemoved }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [isRemoving, setIsRemoving] = useState(false);
  const { theme } = useContext(ThemeContext); 
  const { t } = useTranslation()
  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await axios.delete(`${BASE_URL}/api/participant/remove/${presentationId}/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Participant removed successfully.');
      onParticipantRemoved(userId);
      onClose();
    } catch (error) {
      console.error('Error removing participant', error);
      toast.error('Failed to remove articipant. Please try again.');
    } finally {
      setIsRemoving(false);
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
        <Modal.Title className='w-100'>Remove Participant</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`bg-${theme} ${getTextColorClass()}`}>
        Are you sure to remove this participant?
      </Modal.Body>
      <Modal.Footer className={`bg-${theme} ${getTextColorClass()}`}>
        <Button
          variant="danger"
          onClick={handleRemove}
          disabled={isRemoving}
        >
          {isRemoving ? 'Removing' : 'Remove'}
        </Button>
        <Button variant="secondary" onClick={onClose}>
         {t('cancel')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveParticipant;