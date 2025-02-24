import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import ThemeContext from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const DeleteTemplate = ({ templateId, showModal, onClose, onTemplateDeleted }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [isDeleting, setIsDeleting] = useState(false);
  const { theme } = useContext(ThemeContext); 
  const { t } = useTranslation()
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`${BASE_URL}/api/template/${templateId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Template deleted successfully.');
      onTemplateDeleted(templateId);
      onClose();
    } catch (error) {
      console.error('Error deleting template', error);
      toast.error('Failed to delete template. Please try again.');
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
        <Modal.Title className='w-100'>{t('deleteTemplate')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`bg-${theme} ${getTextColorClass()}`}>
        {t('deleteTemplateMessage')}
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

export default DeleteTemplate;