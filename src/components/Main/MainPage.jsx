import { Container } from 'react-bootstrap';
import TemplateGallery from './TemplateGallery';
import PopularTemplatesTable from './PopularTemplatesTable';
import TagCloud from './TagCloud';
import { useState } from 'react';
export default function MainPage() {
  const [selectedTagId, setSelectedTagId] = useState(null);
  const handleTagSelect = (tagId) => {
    if (selectedTagId === tagId) {
      setSelectedTagId(null);
    } else {
      setSelectedTagId(tagId);
    }
  };
  return (
    <Container fluid className="py-4">
      {/* Page Header */}
      <h1 className="mb-4">Form Templates</h1>

       {/* Tag Cloud Section */}
       <section>
        <h2>Explore by Tags</h2>
        <TagCloud onTagSelect={handleTagSelect} selectedTagId={selectedTagId}/>
      </section>
      

      {/* Recent Templates Section */}
      <section className="mb-5">
        <h2>Newest Form Templates</h2>
        <TemplateGallery selectedTagId={selectedTagId}/>
      </section>

      {/* Popular Templates Section */}
      <section className="mb-5">
        <h2>Most Used Templates</h2>
        <PopularTemplatesTable />
      </section>
    </Container>
  );
}
