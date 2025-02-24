import { useContext } from 'react';
import { Container } from 'react-bootstrap';
import ThemeContext from '../../context/ThemeContext';
import PropTypes from 'prop-types';

const ThemeContainer = ({ children }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <Container className={`bg-${theme} text-${theme === 'light' ? 'dark' : 'white'}`}>
        {children}
      </Container>
    </>
  );
};

ThemeContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeContainer;
