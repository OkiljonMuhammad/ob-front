import { Table } from 'react-bootstrap';

const PopularTemplatesTable = () => {
  const popularTemplates = [
    { id: 1, name: 'Template A', usageCount: 150 },
    { id: 2, name: 'Template B', usageCount: 120 },
    { id: 3, name: 'Template C', usageCount: 90 },
  ];

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Template Name</th>
          <th>Usage Count</th>
        </tr>
      </thead>
      <tbody>
        {popularTemplates.map((template) => (
          <tr key={template.id}>
            <td>{template.id}</td>
            <td>{template.name}</td>
            <td>{template.usageCount}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default PopularTemplatesTable;
