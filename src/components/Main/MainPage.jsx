import { Container } from 'react-bootstrap';
import TemplateGallery from './TemplateGallery';
import PopularTemplatesTable from './PopularTemplatesTable';
import TagCloud from './TagCloud';

export default function TemplateDashboard() {
  return (
    <Container className="py-4">
      {/* Page Header */}
      <h1 className="mb-4">Template Dashboard</h1>

      {/* Recent Templates Section */}
      <section className="mb-5">
        <h2>Newest Form Templates</h2>
        <TemplateGallery />
      </section>

      {/* Popular Templates Section */}
      <section className="mb-5">
        <h2>Most Used Templates</h2>
        <PopularTemplatesTable />
      </section>

      {/* Tag Cloud Section */}
      <section>
        <h2>Explore by Category</h2>
        <TagCloud />
      </section>
    </Container>
  );
}
