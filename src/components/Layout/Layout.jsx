import React, { useContext } from 'react';
import Header from '../Header/Header';
import { Container } from 'react-bootstrap';
import ThemeContext from '../../context/ThemeContext';

const Layout = ({ children }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <Header theme={theme} /> 
      <Container className="mt-4">{children}</Container>
    </>
  );
};

export default Layout;
