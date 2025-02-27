import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import ThemeContext from '../../context/ThemeContext';

const CreateForm = ({ templateId, showModal, onClose }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [isCreating, setIsCreating] = useState(false);
  const { theme } = useContext(ThemeContext); 

  const handleFormSubmit = async () => {
    setIsCreating(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/form/create`,
        { templateId }, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Form created successfully.');
      onClose();
    } catch (error) {
      console.error('Error creating form', error);
      toast.error('Failed to create form. Please try again.');
    } finally {
      setIsCreating(false);
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
        <Modal.Title className='w-100'>Create Form</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`bg-${theme} ${getTextColorClass()}`}>
        Are you sure you want to create a new form?
      </Modal.Body>
      <Modal.Footer className={`bg-${theme} ${getTextColorClass()}`}>
        <Button
          variant="success"
          onClick={handleFormSubmit}
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Create'}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateForm; 