import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';

const DeleteTemplate = ({ templateId, showModal, onClose, onTemplateDeleted }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`${BASE_URL}/api/template/${templateId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Template deleted successfully.');
      onTemplateDeleted(templateId);
      onClose(); // Close the modal after successful deletion
    } catch (error) {
      console.error('Error deleting template', error);
      toast.error('Failed to delete template. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal show={showModal} onHide={onClose} centered className="text-center">
      <Modal.Header closeButton>
        <Modal.Title className='w-100'>Delete Template</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete this template?
      </Modal.Body>
      <Modal.Footer>
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

export default DeleteTemplate;