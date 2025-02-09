import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';

// Sample data for filled forms
const initialFilledForms = [
  { id: 1, formName: 'Form 1', submittedAt: '2023-10-03' },
  { id: 2, formName: 'Form 2', submittedAt: '2023-10-04' },
];

export default function Forms() {
  const [filledForms, setFilledForms] = useState(initialFilledForms);

  // Handler for viewing a form (you can implement navigation here)
  const handleViewForm = (id) => {
    console.log(`Viewing form with ID: ${id}`);
    // You can use React Router to navigate to a detailed view of the form
  };

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Form Name</th>
          <th>Submitted At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filledForms.map((form) => (
          <tr key={form.id}>
            <td>{form.id}</td>
            <td>{form.formName}</td>
            <td>{form.submittedAt}</td>
            <td>
              <Button variant="info" size="sm" onClick={() => handleViewForm(form.id)}>
                View Form
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}