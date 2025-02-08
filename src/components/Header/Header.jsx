import { Container, Navbar, Nav } from 'react-bootstrap';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import PropTypes from 'prop-types';

const Header = ({ theme }) => {
  const user = localStorage.getItem('user');

  return (
    <Navbar bg={theme} variant={theme} expand="lg">
      <Container>
        <Navbar.Brand href="/">Oltinbosh</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            <LanguageSwitcher />
            <ThemeSwitcher />
            {!user ? (
              <>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
              </>
            ) : (
              <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

Header.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default Header;
