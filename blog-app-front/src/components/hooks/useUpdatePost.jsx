// src/hooks/useUpdatePost.js
import { useState } from 'react';

const useUpdatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updatePost = async (postId, postData) => {
    setLoading(true);
    setError(null);
    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      const response = await fetch(`http://127.0.0.1:8000/posts/${postId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error updating post');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updatePost, loading, error };
};

export default useUpdatePost;
