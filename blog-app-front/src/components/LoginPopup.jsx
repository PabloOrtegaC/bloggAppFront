import React, { useState } from 'react';
import useLogin from './hooks/useLogin';
import useCreateUser from './hooks/useCreateUser';

const LoginPopup = ({ onClose, onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  const { login, loading: loginLoading, error: loginError } = useLogin();
  const { createUser, loading: regLoading, error: regError } = useCreateUser();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(loginEmail, loginPassword);
    if (result) {
      onLoginSuccess({ 
        token: result.access_token, 
        name: loginEmail,
        id: result.user_id 
      });
      onClose();
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await createUser(regName, regEmail, regPassword);
    if (result) {
      setIsRegistering(false);
      setLoginEmail(regEmail);
      alert('Registration successful. Please log in.');
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        {isRegistering ? (
          <>
            <h2>Create Account</h2>
            <form onSubmit={handleRegister}>
              <div style={formGroupStyle}>
                <label htmlFor="regName">Name:</label>
                <input
                  id="regName"
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label htmlFor="regEmail">Email:</label>
                <input
                  id="regEmail"
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label htmlFor="regPassword">Password:</label>
                <input
                  id="regPassword"
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
              </div>
              {regError && <p style={{ color: 'red' }}>{regError.message}</p>}
              <div style={buttonContainerStyle}>
                <button type="submit" disabled={regLoading}>
                  {regLoading ? 'Creating...' : 'Create Account'}
                </button>
                <button type="button" onClick={() => setIsRegistering(false)} disabled={regLoading}>
                  Back to Login
                </button>
                <button type="button" onClick={onClose} disabled={regLoading}>
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <div style={formGroupStyle}>
                <label htmlFor="loginEmail">Email:</label>
                <input
                  id="loginEmail"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label htmlFor="loginPassword">Password:</label>
                <input
                  id="loginPassword"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              {loginError && <p style={{ color: 'red' }}>{loginError.message}</p>}
              <div style={buttonContainerStyle}>
                <button type="submit" disabled={loginLoading}>
                  {loginLoading ? 'Logging in...' : 'Login'}
                </button>
                <button type="button" onClick={() => setIsRegistering(true)} disabled={loginLoading}>
                  Create Account
                </button>
                <button type="button" onClick={onClose} disabled={loginLoading}>
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const modalStyle = {
  backgroundColor: '#fff',
  padding: '1.5rem',
  borderRadius: '8px',
  width: '400px',
  maxWidth: '90%',
};

const formGroupStyle = {
  marginBottom: '1rem',
  display: 'flex',
  flexDirection: 'column',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
};

export default LoginPopup;
