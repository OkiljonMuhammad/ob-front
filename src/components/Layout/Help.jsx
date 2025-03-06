import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";
import CreateTicket from "../../components/JiraTicket/CreateTicket"

const Help = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <footer>
      <Container fluid className="text-center py-4">
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Create Support Ticket
        </Button>
        <CreateTicket showModal={showModal} onClose={() => setShowModal(false)} />
      <p className="mt-5 mb-0">
          &copy; {new Date().getFullYear()} by Okiljon Muhammad. All rights reserved.
      </p>
      </Container>
    </footer>
  );
};

export default Help;

