import React from 'react';

export default function Navbar({ darkMode, setDarkMode, setPage, page }) {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
      color: darkMode ? '#ffffff' : '#1f2937'
    }}>
      <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setPage('dashboard')}>
        ⚡ TaskPortal
      </h1>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button 
          onClick={() => setPage(page === 'dashboard' ? 'add-task' : 'dashboard')}
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {page === 'dashboard' ? '➕ Add New Task' : '📋 View Dashboard'}
        </button>
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', padding: '0.5rem' }}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}