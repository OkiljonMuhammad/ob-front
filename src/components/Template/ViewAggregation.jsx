import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';
import ThemeContext from '../../context/ThemeContext';

export default function ViewAggregation({ showModal, onClose, templateId }) {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { theme } = useContext(ThemeContext);

  const [aggregationData, setAggregationData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchAggregations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/template/aggregation/${templateId}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setAggregationData(response.data.aggregationResults);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load aggregation data.');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (showModal && templateId) {
      fetchAggregations();
      setLoading(false);
    }
  }, [showModal, templateId]);

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  if (loading) {
    return (
    <Modal show={showModal} onHide={onClose} centered>
      <Modal.Body className={`p-3 bg-${theme} ${getTextColorClass()}`}>Loading...</Modal.Body>
    </Modal>
    );
  }

  return (
    <Modal show={showModal} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton className={`p-3 bg-${theme} ${getTextColorClass()}`} >
        <Modal.Title className='w-100 text-center'>Template Aggregations</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`p-3 bg-${theme} ${getTextColorClass()}`}>
        <Row>
        <Col>
          {aggregationData ? (
            <>
              <h4>Most Frequent Answers</h4>
              <ul>
                {Object.entries(aggregationData).map(([question, result]) => (
                  <li key={question}>
                    <strong>{question}:</strong>{" "}
                    {result.mostFrequentAnswer 
                      ? result.mostFrequentAnswer 
                      : result.average !== undefined 
                      ? `Average: ${result.average}` 
                      : "N/A"}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className='text-center'>No aggregation data available.</p>
          )}
        </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className={`p-3 bg-${theme} ${getTextColorClass()}`}>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
