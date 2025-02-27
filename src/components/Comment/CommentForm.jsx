import React, { useState, useContext } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import ThemeContext from "../../context/ThemeContext";

const CommentForm = ({ templateId, onCommentAdded }) => {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { theme } = useContext(ThemeContext);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setSubmitting(true);
      await axios.post(`${BASE_URL}/api/comment/${templateId}`, 
        { content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setContent("");
      onCommentAdded();
    } catch (err) {
      setError("Failed to add comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group>
        <Form.Control 
        as="textarea" 
        rows={2} 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        placeholder="Write a comment..." 
        className={`bg-${theme} ${getTextColorClass()} custom-placeholder`}
        required 
        />

      </Form.Group>
      <Button type="submit" variant="primary" disabled={submitting} className="mt-2">{submitting ? "Posting..." : "Add Comment"}</Button>
    </Form>
  );
};

export default CommentForm;
