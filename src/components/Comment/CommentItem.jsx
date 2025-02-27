import React, { useContext, useState } from "react";
import { ListGroup, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import ThemeContext from "../../context/ThemeContext";

const CommentItem = ({ comment, onDelete, onUpdate }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [updating, setUpdating] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { isAdmin, userId } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const isOwnerOrAdmin = userId === comment.userId || isAdmin;

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      await axios.put(`${BASE_URL}/api/comment/${comment.id}`, 
        { content: editContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setShowEdit(false);
      onUpdate(comment.id, editContent);
    } catch (error) {
      console.error("Error updating comment", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/comment/${comment.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      onDelete(comment.id);
    } catch (error) {
      console.error("Error deleting comment", error);
    }
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <ListGroup.Item
    className={`d-flex justify-content-between align-items-center bg-${theme} ${getTextColorClass()}`}>
      <div>
        <strong>{comment.username}:</strong> {comment.content}
      </div>
      {isOwnerOrAdmin && (
        <div>
          <Button size="sm" variant="warning" onClick={() => setShowEdit(true)}>Edit</Button>
          <Button size="sm" variant="danger" className="ms-2" onClick={handleDelete}>Delete</Button>
        </div>
      )}

      <Modal 
      show={showEdit} 
      onHide={() => setShowEdit(false)} 
      className={`bg-${theme} ${getTextColorClass()}`}>
        <Modal.Header closeButton className={`bg-${theme} ${getTextColorClass()}`}>
          <Modal.Title>Edit Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`bg-${theme} ${getTextColorClass()}`}>
          <Form.Control 
          as="textarea" 
          value={editContent} 
          onChange={(e) => setEditContent(e.target.value)} 
          className={`bg-${theme} ${getTextColorClass()}`}/>
        </Modal.Body>
        <Modal.Footer className={`bg-${theme} ${getTextColorClass()}`}>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdate} disabled={updating}>{updating ? "Updating..." : "Save"}</Button>
        </Modal.Footer>
      </Modal>
    </ListGroup.Item>
  );
};

export default CommentItem;
