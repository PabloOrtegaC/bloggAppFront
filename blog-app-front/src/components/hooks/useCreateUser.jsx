// src/hooks/useCreateUser.js
import { useState } from 'react';

const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createUser = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/users/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'User creation failed');
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

  return { createUser, loading, error };
};

export default useCreateUser;
