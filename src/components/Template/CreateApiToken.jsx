import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ThemeContext from '../../context/ThemeContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateApiToken = ({ showModal, onClose }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [copied, setCopied] = useState(false);
  const [apiToken, setApiToken] = useState(null);
  const { theme } = useContext(ThemeContext); 

  const createApiToken = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/apitoken`, 
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const createdApiToken = response.data?.api_token;
      setApiToken(createdApiToken);
      toast.success('API Token created successfully!');
    } catch (error) {
      console.error('Error creating API token:', error);
      toast.error('Failed to create API Token. Please try again.');
    }
  };

  useEffect(() => {
    if (showModal) {
      createApiToken();
    }
  }, [showModal]);

  const copyToClipboard = () => {
    if (apiToken) {
      navigator.clipboard.writeText(apiToken).then(() => setCopied(true));
    }
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <Modal  
      show={showModal} 
      onHide={onClose} 
      centered 
      size="lg"
      className={`text-center bg-${theme} ${getTextColorClass()}`}>
      <Modal.Header closeButton className={`bg-${theme} ${getTextColorClass()}`}>
        <Modal.Title className='w-100'>Copy API Token</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`bg-${theme} ${getTextColorClass()}`}>
        {apiToken ? (
          <>
            <p>API Token: <strong>{apiToken}</strong></p>
            <Button onClick={copyToClipboard}>
              {copied ? "Copied!" : "Copy Token"}
            </Button>
          </>
        ) : (
          <p>Generating API Token...</p>
        )}
      </Modal.Body>
      <Modal.Footer className={`bg-${theme} ${getTextColorClass()}`}>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateApiToken;
