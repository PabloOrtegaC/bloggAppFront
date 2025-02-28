// src/hooks/useDeletePost.js
import { useState } from 'react';

const useDeletePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deletePost = async (postId) => {
    setLoading(true);
    setError(null);
    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      const response = await fetch(`http://127.0.0.1:8000/posts/${postId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error deleting post');
      }
      return true;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { deletePost, loading, error };
};

export default useDeletePost;
