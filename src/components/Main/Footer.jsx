import React from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer>
      <Container>
        <p>
          &copy; {new Date().getFullYear()} by Okiljon Muhammad. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
