import React, { useState, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { encryptData } from '../../utils/authUtils';
import ThemeContext from '../../context/ThemeContext';

const UseForm = ({ form, showModal, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { theme } = useContext(ThemeContext); 

  const generateShareableLink = (form) => {
    const encryptedText = encryptData(`${form.id}/${form.templateId}`);
    const encodedText = encodeURIComponent(encryptedText);
    return `${window.location.origin}/form/submit/${encodedText}`;
  };

  const shareableLink = generateShareableLink(form);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink).then(() => setCopied(true));
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
        <Modal.Title className='w-100'>Share Form</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`bg-${theme} ${getTextColorClass()}`}>
        <p>Shareable Link: <a href={shareableLink} target="_blank" rel="noopener noreferrer">{shareableLink}</a></p>
        <Button onClick={copyToClipboard}>
          {copied ? "Copied!" : "Copy Link"}
        </Button>
      </Modal.Body>
      <Modal.Footer className={`bg-${theme} ${getTextColorClass()}`}>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UseForm;