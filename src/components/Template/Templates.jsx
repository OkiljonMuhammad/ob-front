import React, { useState } from 'react';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Sample data for templates
const initialTemplates = [
  { id: 1, title: 'Template 1', createdAt: '2023-10-01' },
  { id: 2, title: 'Template 2', createdAt: '2023-10-02' },
];

export default function Templates() {
  const [templates, setTemplates] = useState(initialTemplates);
  const navigate = useNavigate();

  // Handler for deleting a template
  const handleDeleteTemplate = (id) => {
    setTemplates(templates.filter((template) => template.id !== id));
  };

  return (
    <>
      <Row className="mb-3">
        <Col>
          {/* Button to navigate to CreateTemplate */}
          <Button
            variant="primary"
            onClick={() => navigate('/templates/create')}
          >
            Create Template
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template) => (
            <tr key={template.id}>
              <td>{template.id}</td>
              <td>{template.title}</td>
              <td>{template.createdAt}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2">
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteTemplate(template.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
