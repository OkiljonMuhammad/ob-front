import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Form, Row, Col, ListGroup, Badge, Button } from 'react-bootstrap';

const SortableItem = ({ id, question, onChange, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, // Indicates if the item is being dragged
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // Reduce opacity while dragging
  };

  return (
    <ListGroup.Item
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={isDragging ? 'dragging' : ''}
    >
      <Row>
        <Col xs={8}>
          <Form.Group controlId={`text-${id}`}>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={question.text}
              onChange={(e) => onChange('text', e.target.value)}
              placeholder="Enter question title"
            />
          </Form.Group>
        </Col>
        <Col xs={4}>
          <Form.Group controlId={`visible-${id}`}>
            <Form.Check
              type="switch"
              label="Visible in Table"
              checked={question.isVisibleInTable}
              onChange={(e) =>
                onChange('isVisibleInTable', e.target.checked)
              }
            />
          </Form.Group>
        </Col>
      </Row>
      <Badge bg="info">{question.type}</Badge>
      <Button
        variant="danger"
        size="sm"
        className="float-end mt-2"
        onClick={onDelete}
      >
        X
      </Button>
      {/* Apply drag listeners to this div */}
      <div {...listeners} style={{ cursor: 'grab', marginTop: '0.5rem' }}>
        Drag Handle
      </div>
    </ListGroup.Item>
  );
};

export default SortableItem;