import React, { useState, useEffect, useContext } from 'react';
import {Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import UpdateQuestion from '../Question/UpdateQuestion';
import axios from 'axios';
import { toast } from 'react-toastify';
import ThemeContext from '../../context/ThemeContext';
import AddQuestion from '../Question/AddQuestion';

export default function EditForm() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext); 
  const { templateId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const tabName = 'forms';

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const questionsResponse = await axios.get(
      `${BASE_URL}/api/question/questions/${templateId}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );
      setQuestions(questionsResponse.data.questions || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError(
        error.response?.data?.message || 'Failed to load questions data.'
      );
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchQuestions();
  }, [BASE_URL, templateId]);

  if (loading) {
    return <p>Loading questions...</p>;
  }

  const handleUpdateQuestions = async (templateId, updatedQuestions) => {
    if (!templateId) {
      setError('Template ID is missing. Please create a template first.');
      return;
    }

    if (!updatedQuestions || !Array.isArray(updatedQuestions) || updatedQuestions.length === 0) {
      setError('No questions to update.');
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/question/questions/${templateId}`,
       { questions: updatedQuestions },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Questions updated successfully!');
      navigate(`/dashboard/${tabName}`);
      setError(null);
    } catch (error) {
      console.error('Error updating questions:', error);
      setError('Failed to update questions. Please try again.');
      toast.error('Failed to update questions. Please try again.');
    }
  };

  const handleSaveQuestions = async (templateId, questions) => {
    if (!templateId) {
      setError('Template ID is missing. Please create a template first.');
      return;
    }
    try {
      await axios.post(
        `${BASE_URL}/api/question/${templateId}`,
        { questions },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Questions saved successfully!');
      navigate(`/dashboard/${tabName}`);
      setError(null);
    } catch (error) {
      console.error('Error saving questions:', error);
      setError('Failed to save questions. Please try again.');
      toast.error('Failed to save questions. Please try again.');
    }
  };

  return (
    <Container fluid className="py-4">
      {error && <Alert variant="danger">{error}</Alert>}
        {questions.length > 0 && (
        <div className='mt-3'>
          <AddQuestion
            templateId={templateId}
            tabName={tabName}
            onSaveQuestions={handleSaveQuestions}
          />
          <UpdateQuestion
            templateId={templateId}
            tabName={tabName}
            onSaveQuestions={handleUpdateQuestions}
          />
        </div>
        
      )}
     {questions.length == 0 && (
        <div className='mt-3'>
          <Alert variant="success" className='text-center'>
            There is no questions. You can now create.
          </Alert>
          <AddQuestion
            templateId={templateId}
            tabName={tabName}
            onSaveQuestions={handleSaveQuestions}
          />
        </div>
      )}
    </Container>
  );
}
