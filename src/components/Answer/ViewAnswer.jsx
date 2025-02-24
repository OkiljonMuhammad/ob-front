import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Table, Alert } from 'react-bootstrap';
import axios from 'axios';
import ThemeContext from '../../context/ThemeContext';

export default function ViewAnswer({ showModal, onClose, formId, userId }) {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { theme } = useContext(ThemeContext);

  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserResponses = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/answer/user/${formId}/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` || '',
          },
        });

        if (response.data && Array.isArray(response.data.responses)) {
          setResponses(response.data.responses);
        } else {
          console.error('Unexpected response format:', response.data);
          setResponses([]);
        }
      } catch (error) {
        console.error('Error fetching user responses:', error);
        setError(error.response?.data?.message || 'Failed to load responses.');
      } finally {
        setLoading(false);
      }
    };

    if (showModal && formId && userId) {
      fetchUserResponses();
    }
  }, [showModal, formId, userId]);

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  if (loading) {
    return (
      <Modal show={showModal} onHide={onClose} centered>
        <Modal.Body className={`text-center bg-${theme} p-3 ${getTextColorClass()}`}>Loading responses...</Modal.Body>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal show={showModal} onHide={onClose} centered>
        <Modal.Body className={`p-3 text-center bg-${theme} ${getTextColorClass()}`}>
          <Alert variant="danger">{error}</Alert>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={showModal} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton className={`p-3 bg-${theme} ${getTextColorClass()}`}>
        <Modal.Title className="w-100 text-center">User Answer</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`p-3 bg-${theme} ${getTextColorClass()}`}>
        {responses.length === 0 ? (
          <p>No responses found.</p>
        ) : (
          responses.map((userResponse, index) => (
            <Table key={index} bordered responsive className={`text-center table-${theme}`}>
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Response</th>
                  <th>Filled Date</th>
                </tr>
              </thead>
              <tbody>
                {(userResponse.answers ? Object.entries(userResponse.answers) : []).map(([questionText, answers]) =>
                  (Array.isArray(answers) ? answers : []).map((answer, idx) => (
                    <tr key={`${userResponse.userId}-${questionText}-${idx}`}>
                      <td>{questionText}</td>
                      <td>
                        {answer.response === true ? 'Yes' : answer.response === false ? 'No' : answer.response}
                      </td>
                      <td>{new Date(answer.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          ))
        )}
      </Modal.Body>
      <Modal.Footer className={`p-3 bg-${theme} ${getTextColorClass()}`}>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
