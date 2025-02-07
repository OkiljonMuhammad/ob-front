import React from 'react';
import Header from '../Header/Header';
import { Container } from 'react-bootstrap';

const Layout = ({ children, theme }) => {
  return (
    <>
      <Header theme={theme} />
      <Container className="mt-4">{children}</Container>
    </>
  );
};

export default Layout;
