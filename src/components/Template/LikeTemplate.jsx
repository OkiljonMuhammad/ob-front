import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LikeTemplate = ({ templateId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Function to check if the user has already liked the template
  const checkIfLiked = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/like/${templateId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setIsLiked(!!response.data.message);
    } catch (err) {
      console.error('Error checking like status:', err);
    }
  };
  
  const getLikeCount = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/like/count/${templateId}`);
      const likeCount = response?.data?.likeCount;
      if(likeCount >= 0){
        setLikeCount(likeCount);
      }
    } catch(err) {
      setError(err.response?.data?.message || 'Failed to get like count');
    }
  };

  // Function to like the template
  const handleLike = async () => {
    try {
      setLoading(true);
        await axios.post(`${BASE_URL}/api/like/${templateId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setIsLiked(true);
      getLikeCount();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to like the template');
    } finally {
      setLoading(false);
    }
  };

  // Function to remove the like
  const handleUnlike = async () => {
    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/api/like/${templateId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setIsLiked(false);
      getLikeCount();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove the like');
    } finally {
      setLoading(false);
    }
  };

  // Check like status when the component mounts
  useEffect(() => {
    checkIfLiked();
    getLikeCount();
  }, [templateId]);

  return (
    <div>
      <button
        className="btn btn-link p-0"
        onClick={isLiked? handleUnlike : handleLike}
        disabled={loading}
        style={{ color: isLiked ? 'red' : 'gray' }}
      >
        {isLiked ? (
          <i className="bi bi-heart-fill" title="Unlike"></i>
        ) : (
          <i className="bi bi-heart" title="Like"></i>
        )}
      </button>
      <p>{likeCount}</p>
      {error && <p className="text-danger text-center">{error}</p>}
    </div>
  );
};

export default LikeTemplate;
