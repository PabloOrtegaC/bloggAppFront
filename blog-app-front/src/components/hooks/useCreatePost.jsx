import { useState } from 'react';

const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const createPost = async (postData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;

      const response = await fetch('http://127.0.0.1:8000/posts/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(postData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error creating post');
      }
      const data = await response.json();
      setSuccess(data);
      return data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createPost, loading, error, success };
};

export default useCreatePost;
