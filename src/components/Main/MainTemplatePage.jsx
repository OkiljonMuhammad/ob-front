import { Container } from 'react-bootstrap';
import TemplateGallery from './TemplateGallery';
import PopularTemplatesTable from './PopularTemplatesTable';
import TagCloud from './TagCloud';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function MainTemplatePage() {
  const [selectedTagId, setSelectedTagId] = useState(null);
  const { t } = useTranslation();
  const handleTagSelect = (tagId) => {
    if (selectedTagId === tagId) {
      setSelectedTagId(null);
    } else {
      setSelectedTagId(tagId);
    }
  };
  return (
    <Container fluid className="py-4  text-center min-vh-100">
      <h1 className="mb-5">{t('formTemplates')}</h1>

       <section>
        <h2 className="mb-3">{t('exploreByTags')}</h2>
        <TagCloud onTagSelect={handleTagSelect} selectedTagId={selectedTagId}/>
      </section>
      

      <section className="mb-5 mt-5">
        <h2>{t('newsFormTemplates')}</h2>
        <TemplateGallery selectedTagId={selectedTagId}/>
      </section>

      <section className="mb-5 mt-5">
        <h2>{t('mostUsedTemplates')}</h2>
        <PopularTemplatesTable />
      </section>
    </Container>
  );
}
