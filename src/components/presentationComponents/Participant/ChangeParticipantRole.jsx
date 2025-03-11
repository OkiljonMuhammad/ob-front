import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import ThemeContext from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import UserRoleSelect from '../../Admin/Users/UserRoleSelect';

const ChangeParticipantRole = ({ presentationId, userId, userRole, showModal, onClose, onRoleChanged }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [isUpdating, setIsUpdating] = useState(false);
  const [participantRoles, setParticipantRoles] = useState([]);
  const [newRole, setNewRole] = useState(null);
  const { theme } = useContext(ThemeContext); 
  const { t } = useTranslation()

  const handleRoleChange = (updatedRole) => {
    setNewRole(updatedRole);
  };

  const handleRemoveCreatorRole = () => {
    setParticipantRoles((prevParticipantRoles) =>
      prevParticipantRoles.filter((participantRole) => participantRole.roleName !== 'Creator')
    );
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/participant/roles`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });
      setParticipantRoles(response.data?.participantRoles || []);
      handleRemoveCreatorRole();
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [presentationId, userId]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await axios.put(`${BASE_URL}/api/participant/role/change/${presentationId}/${userId}`, 
        { newRole },
        {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      toast.success('Role updated successfully.');
      onRoleChanged(newRole.roleName);
      onClose();
    } catch (error) {
      console.error('Error updating role', error);
      toast.error('Failed to update role. Please try again.');
    } finally {
      setIsUpdating(false);
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
        <Modal.Title className='w-100'>Update Participant Role</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`bg-${theme} ${getTextColorClass()}`}>
        <Row className='mb-5'>
          <Col>
            <Form.Group controlId="roleId">
              <Form.Label>Select Participant Role:</Form.Label>
              <UserRoleSelect onRoleSelect={handleRoleChange} roles={participantRoles} initialSelectedRole={userRole} />
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className={`bg-${theme} ${getTextColorClass()}`}>
        <Button
          variant="danger"
          onClick={handleUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating' : 'Update'}
        </Button>
        <Button variant="secondary" onClick={onClose}>
         {t('cancel')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeParticipantRole;