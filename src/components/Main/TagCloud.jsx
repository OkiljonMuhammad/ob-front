import { Badge } from 'react-bootstrap';

const TagCloud = () => {
  const tags = ['Category 1', 'Category 2', 'Category 3', 'Category 4'];

  return (
    <div>
      {tags.map((tag, index) => (
        <Badge
          key={index}
          bg="secondary"
          className="me-2 mb-2"
          style={{ cursor: 'pointer' }}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
};

export default TagCloud;
