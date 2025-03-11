import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import Templates from '../Template/Templates';
import Forms from '../Form/Forms';
import GetTickets from '../JiraTicket/GetTickets';
import { useParams, useNavigate } from 'react-router-dom';
import Presentations from '../presentationComponents/Presentation/Presentations';
export default function Dashboard() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(tab || 'templates');

  useEffect(() => {
    if (tab !== activeTab) {
      navigate(`/dashboard/${activeTab}`, { replace: true });
    }
  }, [activeTab, tab, navigate]);

  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Dashboard</h1>
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        id="personal-pages-tabs"
        className="mb-3"
      >
        <Tab eventKey="templates" title="Templates">
          <Templates />
        </Tab>
        <Tab eventKey="forms" title="Forms">
          <Forms />
        </Tab>
        <Tab eventKey="presentations" title="Presentations">
          <Presentations />
        </Tab>
        <Tab eventKey="tickets" title="Tickets">
          <GetTickets />
        </Tab>
      </Tabs>
    </Container>
  );
}
