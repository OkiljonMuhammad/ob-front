import React from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import Participants from './Participants';
const ParticipantLayout = () => {
  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Participants</h1>
      <Tabs
        defaultActiveKey="participants"
        id="personal-pages-tabs"
        className="mb-3"
      >
        <Tab eventKey="participants" title="Participants">
          <Participants />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default ParticipantLayout;
