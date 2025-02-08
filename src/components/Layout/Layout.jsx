import { useContext } from 'react';
import Header from '../Header/Header';
import { Container } from 'react-bootstrap';
import ThemeContext from '../../context/ThemeContext';
import PropTypes from 'prop-types';

const Layout = ({ children }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <Header theme={theme} />
      <Container className="mt-4">{children}</Container>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
