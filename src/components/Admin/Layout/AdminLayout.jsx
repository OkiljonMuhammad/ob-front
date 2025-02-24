import React from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import UserList from '../Users/UserList.jsx'
const AdminLayout = () => {
  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Admin Panel</h1>
      <Tabs
        defaultActiveKey="users"
        id="personal-pages-tabs"
        className="mb-3"
      >
        <Tab eventKey="users" title="Users">
          <UserList />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminLayout;
