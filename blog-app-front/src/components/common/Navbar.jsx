import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ user, onLoginClick, onLogout }) => {
  return (
    <header style={styles.header}>
      <div style={styles.leftSection}>
        <h1 style={styles.title}>My Blog</h1>
        <nav style={styles.nav}>
          <NavLink 
            to="/posts" 
            style={({ isActive }) => ({
              ...styles.navLink,
              color: 'black',
              fontWeight: isActive ? 'bold' : 'normal',
            })}
          >
            Posts
          </NavLink>
          <NavLink 
            to="/my-posts" 
            style={({ isActive }) => ({
              ...styles.navLink,
              color: 'black',
              fontWeight: isActive ? 'bold' : 'normal',
            })}
          >
            My Posts
          </NavLink>
        </nav>
      </div>
      <div>
        {user ? (
          <>
            <span>Welcome, {user.name}</span>
            <button style={styles.logoutButton} onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <button style={styles.loginButton} onClick={onLoginClick}>
            Login
          </button>
        )}
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#fff',
    borderBottom: '1px solid #ddd',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    margin: '0 1rem 0 0',
  },
  nav: {
    display: 'flex',
  },
  navLink: {
    textDecoration: 'none',
    marginRight: '1rem',
  },
  loginButton: {
    backgroundColor: '#007BFF',
    border: 'none',
    padding: '0.5rem 1rem',
    color: '#fff',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  logoutButton: {
    backgroundColor: '#DC3545',
    border: 'none',
    padding: '0.5rem 1rem',
    color: '#fff',
    borderRadius: '4px',
    marginLeft: '1rem',
    cursor: 'pointer',
  },
};

export default Navbar;
