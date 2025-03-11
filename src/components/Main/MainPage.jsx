import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiLayout, FiSliders } from 'react-icons/fi';

export default function MainPage() {
  const { t } = useTranslation();
  
  return (
    <Container fluid className="main-page-container d-flex flex-column justify-content-center align-items-center min-vh-100">
      <div className="animated-content">
        <h1 className="display-4 fw-bold mb-4 gradient-text">
          {t('Create and Share')}
        </h1>
        
        <div className="d-flex justify-content-center gap-3 mt-5">
          <Link to="/main/templates" className="text-decoration-none">
            <Button 
              variant="primary" 
              className="modern-btn px-5 py-3 rounded-pill shadow-hover template-btn"
            >
              <FiLayout className="me-2" />
              {t('Templates')}
            </Button>
          </Link>
          
          <Link to="/main/presentations" className="text-decoration-none">
            <Button 
              variant="success" 
              className="modern-btn px-5 py-3 rounded-pill shadow-hover slide-btn"
            >
              <FiSliders className="me-2" />
              {t('Presentations')}
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}