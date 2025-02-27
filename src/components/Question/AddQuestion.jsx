import React, { useState, useContext } from 'react';
import ThemeContext from '../../context/ThemeContext';

import {
  Button,
  Row,
  Col,
  Card,
  ListGroup,
  Dropdown,
  DropdownButton
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
import { useNavigate } from 'react-router-dom';

const AddQuestion = ({ templateId, tabName, onSaveQuestions }) => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext); 
  const [questions, setQuestions] = useState([]);
  const [questionCounts, setQuestionCounts] = useState({
    'single-line': 0,
    'multi-line': 0,
    integer: 0,
    checkbox: 0,
  });
  const questionTypes = [
    { type: 'single-line', label: 'Single-line', variant: 'primary' },
    { type: 'multi-line', label: 'Multi-line', variant: 'secondary' },
    { type: 'integer', label: 'Integer', variant: 'success' },
    { type: 'checkbox', label: 'Checkbox', variant: 'warning' }
  ];

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

  const handleQuestionChange = (id, field, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleRemoveQuestion = (id, type) => {
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
    setQuestionCounts((prevCounts) => ({
      ...prevCounts,
      [type]: prevCounts[type] - 1,
    }));
  };

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

  const handleSaveQuestions = () => {
    const payload = questions.map((q, index) => ({
      type: q.type,
      text: q.text,
      isVisibleInTable: q.isVisibleInTable,
      order: index + 1,
    }));
    onSaveQuestions(templateId, payload);
    navigate(`/dashboard/${tabName}`);
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  const availableQuestions = questionTypes.filter(q => questionCounts[q.type] < 4);
  return (
    <Card className={`bg-${theme} ${getTextColorClass()}`}>
      <Card.Body>
        <Card.Title>Add Questions</Card.Title>
        <Row className="mb-3">
          <Col>
            <DropdownButton title="Add Question" variant="info">
              {availableQuestions.map(q => (
                <Dropdown.Item
                  key={q.type}
                  onClick={() => handleAddQuestion(q.type)}
                  disabled={questionCounts[q.type] >= 4}
                  className={`bg-${theme} ${getTextColorClass()}`}
                >
                  {q.label} ({4 - questionCounts[q.type]} left)
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>
        </Row>

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
                  onDelete={() =>
                    handleRemoveQuestion(question.id, question.type)
                  }
                />
              ))}
            </ListGroup>
          </SortableContext>
        </DndContext>
        <Row>
        <Col xs="auto">
        <Button
          variant="warning"
          className="me-2 mt-3"
          onClick={() => navigate(`/dashboard/${tabName}`)}
        >
          Cancel
        </Button>
        </Col>
        <Col xs="auto">
        <Button
          variant="success"
          className="mt-3"
          onClick={handleSaveQuestions}
        >
          Save Questions
        </Button>
        </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default AddQuestion;
