import React from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import Templates from '../Template/Templates';
import Forms from '../Form/Forms';

export default function Dashboard() {

  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Dashboard</h1>
      {/* Tabs for Templates and Filled Forms */}
      <Tabs defaultActiveKey="templates" id="personal-pages-tabs" className="mb-3">
        {/* Templates Tab */}
        <Tab eventKey="templates" title="Templates">
          <Templates />
        </Tab>
        {/* Filled Forms Tab */}
        <Tab eventKey="filled-forms" title="Filled Forms">
          <Forms />
        </Tab>
      </Tabs>
    </Container>
  );
}