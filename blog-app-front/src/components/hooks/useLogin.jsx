// src/hooks/useLogin.js
import { useState } from 'react';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // The endpoint expects x-www-form-urlencoded data.
      const body = new URLSearchParams();
      body.append('username', email);
      body.append('password', password);

      const response = await fetch('http://127.0.0.1:8000/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }
      const data = await response.json();
      return data; // contains { access_token, token_type }
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLogin;
