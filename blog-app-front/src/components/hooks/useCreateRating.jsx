import { useState } from 'react';

const useCreateRating = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createRating = async (postId, score) => {
    setLoading(true);
    setError(null);
    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      const response = await fetch('http://127.0.0.1:8000/ratings/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ post_id: postId, score }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error creating rating');
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

  return { createRating, loading, error };
};

export default useCreateRating;
