import React, { useState } from 'react';
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
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
import SortableItem from './SortableItem'; // Custom component for sortable items
import { useNavigate } from 'react-router-dom';

const AddQuestion = ({ templateId, onSaveQuestions }) => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  // Track question counts for each type
  const [questionCounts, setQuestionCounts] = useState({
    'single-line': 0,
    'multi-line': 0,
    integer: 0,
    checkbox: 0,
  });

  // Handle adding a new question
  const handleAddQuestion = (type) => {
    if (questionCounts[type] >= 4) {
      return;
    }
    const newQuestion = {
      id: Date.now(),
      type,
      text: '',
      isVisibleInTable: true,
    };
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    setQuestionCounts((prevCounts) => ({
      ...prevCounts,
      [type]: prevCounts[type] + 1,
    }));
  };

  // Handle updating a question's text
  const handleQuestionChange = (id, field, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  // Handle removing a question
  const handleRemoveQuestion = (id, type) => {
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
    setQuestionCounts((prevCounts) => ({
      ...prevCounts,
      [type]: prevCounts[type] - 1,
    }));
  };

  // Handle drag-and-drop reordering
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

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

  // Handle saving questions
  const handleSaveQuestions = () => {
    const payload = questions.map((q, index) => ({
      type: q.type,
      text: q.text,
      isVisibleInTable: q.isVisibleInTable,
      order: index + 1, // Set order based on current position
    }));
    onSaveQuestions(templateId, payload);
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Add Questions</Card.Title>

        {/* Buttons to add questions */}
        <Row className="mb-3">
          <Col>
            <Button
              variant="primary"
              onClick={() => handleAddQuestion('single-line')}
              disabled={questionCounts['single-line'] >= 4}
            >
              Add Single-line Question ({4 - questionCounts['single-line']}{' '}
              left)
            </Button>
          </Col>
          <Col>
            <Button
              variant="secondary"
              onClick={() => handleAddQuestion('multi-line')}
              disabled={questionCounts['multi-line'] >= 4}
            >
              Add Multi-line Question ({4 - questionCounts['multi-line']} left)
            </Button>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Button
              variant="success"
              onClick={() => handleAddQuestion('integer')}
              disabled={questionCounts.integer >= 4}
            >
              Add Integer Question ({4 - questionCounts['integer']} left)
            </Button>
          </Col>
          <Col>
            <Button
              variant="warning"
              onClick={() => handleAddQuestion('checkbox')}
              disabled={questionCounts.checkbox >= 4}
            >
              Add Checkbox Question ({4 - questionCounts['checkbox']} left)
            </Button>
          </Col>
        </Row>

        {/* List of questions with drag-and-drop */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={questions.map((q) => q.id)} // Ensure IDs match
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
                  onDelete={() =>
                    handleRemoveQuestion(question.id, question.type)
                  }
                />
              ))}
            </ListGroup>
          </SortableContext>
        </DndContext>

        {/* Save button */}
        <Button
          variant="warning"
          className="me-2 mt-3"
          onClick={() => navigate('/dashboard')}
        >
          Cancel
        </Button>
        <Button
          variant="success"
          className="mt-3"
          onClick={handleSaveQuestions}
        >
          Save Questions
        </Button>
      </Card.Body>
    </Card>
  );
};

export default AddQuestion;
