import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import SetPriority from './SetPriority';
import ThemeContext from '../../context/ThemeContext';
import { useLocation } from 'react-router-dom';

const CreateTicket = ({ showModal, onClose }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const location = useLocation();
  const pageLink = window.location.origin + location.pathname + location.search;
  const { theme } = useContext(ThemeContext); 
  const [isCreating, setIsCreating] = useState(false);
  const [ticketData, setTicketData] = useState({
    summary: '',
    priority: '',
    templateTitle: '',
    link: pageLink,
  });

  const handleCreate = async () => {

    if (!ticketData.priority) {
      toast.error('Please select a priority.');
      return;
    }
    setIsCreating(true);
    try {
      await axios.post(`${BASE_URL}/api/jira/ticket`, ticketData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` || '',
        },
      });
      toast.success('Ticket created successfully.');
      onClose();
      setTicketData({});
    } catch (error) {
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <Modal show={showModal} onHide={onClose} centered className="text-center">
      <Modal.Header 
      closeButton
      className={`bg-${theme} ${getTextColorClass()}`}>

        <Modal.Title className='w-100'>Create Ticket</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`bg-${theme} ${getTextColorClass()}`}>
      <Form>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="title">
                <Form.Label>Template Title <span className='custom-label'>(Optional)</span></Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={ticketData.templateTitle}
                  className={`bg-${theme} ${getTextColorClass()}`}
                  onChange={(e) =>
                    setTicketData({ ...ticketData, templateTitle: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="summary">
                <Form.Label>Summary <span className='custom-label'>(Required)</span></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  name="summary"
                  value={ticketData.summary}
                  className={`bg-${theme} ${getTextColorClass()}`}
                  onChange={(e) =>
                    setTicketData({ ...ticketData, summary: e.target.value })
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="priority">
                <Form.Label>Priority <span className='custom-label'>(Required)</span></Form.Label>
                <SetPriority
                  onSetPriority={(priority) =>
                    setTicketData((prevData) => ({
                      ...prevData,
                      priority,
                    }))
                  }
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer className={`bg-${theme} ${getTextColorClass()}`}>
        <Button
          variant="success"
          onClick={handleCreate}
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

export default CreateTicket;