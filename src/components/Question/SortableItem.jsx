import { useContext } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Form, Row, Col, ListGroup, Button } from 'react-bootstrap';
import ThemeContext from '../../context/ThemeContext';

const SortableItem = ({ id, question, onChange, onDelete }) => {
  const { theme } = useContext(ThemeContext); 
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, 
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <ListGroup.Item
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`isDragging ? 'dragging' : '' bg-${theme} ${getTextColorClass()}`}
    >
        <Row>
        <Col>
          <Form.Group controlId={`text-${id}`}>
            <Form.Label>Question <span className='custom-label'>({question.type})</span></Form.Label>
            <Form.Control
              type="text"
              value={question.text}
              onChange={(e) => onChange('text', e.target.value)}
              placeholder="Type question"
              className={`bg-${theme} ${getTextColorClass()} custom-placeholder`}
            />
          </Form.Group>
        </Col>
        </Row>
        <Row>

        <Col xs="auto" className='mt-2'>
          <Form.Group controlId={`visible-${id}`}>
            <Form.Check
              type="switch"
              label="Visible in Table"
              checked={question.isVisibleInTable}
              className='custom-label'
              onChange={(e) => onChange('isVisibleInTable', e.target.checked)}
            />
          </Form.Group>
        </Col>
        <Col xs="auto">
      <div {...listeners}>
        <Button size="sm" className='mt-2' style={{cursor: 'grab'}}>
        Drag Question
        </Button>
      </div>
        </Col>
        <Col xs="auto">
      <Button
        variant="danger"
        size="sm"
        className="mt-2"
        onClick={onDelete}
      >
      Remove
      </Button>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

export default SortableItem;
