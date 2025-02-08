import { Row, Col, Card } from 'react-bootstrap';

const TemplateGallery = () => {
  const templates = [
    { id: 1, title: 'Template 1', description: 'Description for Template 1' },
    { id: 2, title: 'Template 2', description: 'Description for Template 2' },
    { id: 3, title: 'Template 3', description: 'Description for Template 3' },
  ];

  return (
    <Row xs={1} md={3} className="g-4">
      {templates.map((template) => (
        <Col key={template.id}>
          <Card>
            <Card.Body>
              <Card.Title>{template.title}</Card.Title>
              <Card.Text>{template.description}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default TemplateGallery;
