import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import ThemeContext from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const DeletePresentation = ({ presentationId, showModal, onClose, onPresentationDeleted }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [isDeleting, setIsDeleting] = useState(false);
  const { theme } = useContext(ThemeContext); 
  const { t } = useTranslation()
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`${BASE_URL}/api/presentation/${presentationId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Presentation deleted successfully.');
      onPresentationDeleted(presentationId);
      onClose();
    } catch (error) {
      console.error('Error deleting presentation', error);
      toast.error('Failed to delete presentation. Please try again.');
    } finally {
      setIsDeleting(false);
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
        <Modal.Title className='w-100'>{t('deletePresentation')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`bg-${theme} ${getTextColorClass()}`}>
        {t('deletePresentationMessage')}
      </Modal.Body>
      <Modal.Footer className={`bg-${theme} ${getTextColorClass()}`}>
        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? t('deleting') : t('delete')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
         {t('cancel')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeletePresentation;