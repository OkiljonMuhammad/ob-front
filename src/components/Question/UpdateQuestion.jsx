import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
  Row,
  Col,
  Card,
  ListGroup,
  Alert,
} from 'react-bootstrap';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import axios from 'axios';
import { toast } from 'react-toastify';
import ThemeContext from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UpdateQuestion = ({ templateId, tabName, onSaveQuestions }) => {
  const { theme } = useContext(ThemeContext); 
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchQuestions();
  }, [templateId]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/question/questions/${templateId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions. Please try again.');
    }
  };

  const handleQuestionChange = (id, field, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleRemoveQuestion = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/question/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
      toast.success('Question deleted successfully!');
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question. Please try again.');
    }
  };

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSaveQuestions = async () => {
    try {
      const updatedQuestions = questions?.map((q, index) => ({
        id: q.id,
        type: q.type,
        text: q.text,
        isVisibleInTable: q.isVisibleInTable,
        order: index + 1,
      }));
      await onSaveQuestions(templateId, updatedQuestions);
      navigate(`/dashboard/${tabName}`);
    } catch (error) {
      console.error('Error saving questions:', error);
      setError('Failed to save questions. Please try again.');
      toast.error('Failed to save questions. Please try again.');
    }
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <Card className={`bg-${theme} ${getTextColorClass()}`}>
      <Card.Body>
        <Card.Title>Manage Questions</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={questions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            <ListGroup>
              {questions.map((question) => (
                <SortableItem
                  key={question.id}
                  id={question.id}
                  question={question}
                  onChange={(field, value) =>
                    handleQuestionChange(question.id, field, value)
                  }
                  onDelete={() => handleRemoveQuestion(question.id)}
                />
              ))}
            </ListGroup>
          </SortableContext>
        </DndContext>
        <Row className="mt-3">
          <Col xs="auto">
            <Button variant="warning" onClick={() => navigate(`/dashboard/${tabName}`)}>
              Cancel
            </Button>
          </Col>
          <Col xs="auto">
            <Button variant="success" onClick={handleSaveQuestions}>
              Save Changes
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default UpdateQuestion;