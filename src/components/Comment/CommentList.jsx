import React, { useEffect, useState } from "react";
import { Container, ListGroup, Pagination, Alert, Button } from "react-bootstrap";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CommentList = () => {
  const navigate = useNavigate();
  const { templateId} = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    fetchComments(pagination.page);
  }, [pagination.page, templateId]);

  const fetchComments = async (page) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/comment/comments/${templateId}?page=${page}&limit=5`);
      setComments(data.comments);
      setPagination({ page: data.pagination.page, totalPages: data.pagination.totalPages });
    } catch (err) {
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (commentId) => {
    setComments((prevComments) => 
      prevComments.filter((comment) => comment.id !== commentId)); 
  }

  const handleUpdate = (commentId, updatedText) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, content: updatedText }
          : comment
      )
    );
  };

  return (
    <Container className="my-4">
      <h4>Comments</h4>
      <CommentForm templateId={templateId} onCommentAdded={() => fetchComments(1)} />

      {loading && <div className="d-flex justify-content-center text-center">
         <div>
           <div className="spinner-grow text-primary"></div>
           <p>Loading comments...</p>
         </div>
       </div>}
      {error && <Alert variant="danger">{error}</Alert>}
      
      <ListGroup>
        {comments?.map((comment) => (
          <CommentItem 
          key={comment.id} 
          comment={comment} 
          onUpdate={handleUpdate} 
          onDelete={handleDelete} 
          />          
        ))}
      </ListGroup>

      <Pagination className="mt-3 mb-3">
        <Pagination.Prev disabled={pagination.page <= 1} onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })} />
        <Pagination.Item active>{pagination.page}</Pagination.Item>
        <Pagination.Next disabled={pagination.page >= pagination.totalPages} onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })} />
      </Pagination>

      <Button
      variant="warning"
      size="sm"
      className="me-2"

      onClick={() => navigate(-1)}
    >
      Back
    </Button>
    </Container>
  );
};

export default CommentList;
