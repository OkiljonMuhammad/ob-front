import { Container } from 'react-bootstrap';
import PresentationGallery from './PresentationGallery';
import { useTranslation } from 'react-i18next';

export default function MainPresentationPage() {
  const { t } = useTranslation();

  return (
    <Container fluid className="py-4  text-center min-vh-100">
      <h1 className="mb-5">{t('presentations')}</h1>
    
      <section className="mb-5 mt-5">
        <PresentationGallery />
      </section>
    </Container>
  );
}
