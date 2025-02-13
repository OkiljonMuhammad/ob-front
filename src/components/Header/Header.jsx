import { useContext } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AuthContext from '../../context/AuthContext';

const Header = ({ theme }) => {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <Navbar bg={theme} variant={theme} expand="sm" sticky="top">
      <Container fluid className="px-4">
        <Navbar.Brand href="/" className="me-5">
          Oltinbosh
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center gap-3">
            <LanguageSwitcher />
            <ThemeSwitcher />
            {!isAuthenticated ? (
              <>
                <Nav.Link href="/login">{t('login')}</Nav.Link>
                <Nav.Link href="/register">{t('register')}</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                <Nav.Link onClick={logout} href="/">
                  Logout
                </Nav.Link>
              </>
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
