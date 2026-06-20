import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddTask from './pages/AddTask';

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: darkMode ? '#111827' : '#f9fafb',
      color: darkMode ? '#f9fafb' : '#111827',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      transition: 'background-color 0.2s, color 0.2s'
    }}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} setPage={setPage} page={page} />
      <main style={{ padding: '1rem' }}>
        {page === 'dashboard' ? (
          <Dashboard darkMode={darkMode} />
        ) : (
          <AddTask setPage={setPage} darkMode={darkMode} />
        )}
      </main>
    </div>
  );
}