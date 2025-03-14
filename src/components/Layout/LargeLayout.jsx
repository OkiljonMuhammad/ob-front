import { useContext } from 'react';
import Header from '../Header/Header';
import { Container } from 'react-bootstrap';
import ThemeContext from '../../context/ThemeContext';
import Help from './Help';
import PropTypes from 'prop-types';

const LargeLayout = ({ children }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <Header theme={theme} />
      <Container fluid className={`w-100 mt-4 bg-${theme} text-${theme === 'light' ? 'dark' : 'white'}`}>
        {children}
      </Container>
    </>
  );
};

LargeLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LargeLayout;
