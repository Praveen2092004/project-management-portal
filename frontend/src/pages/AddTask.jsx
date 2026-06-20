import React, { useState } from 'react';
import { createTask } from '../services/api';

export default function AddTask({ setPage, darkMode }) {
  const [formData, setFormData] = useState({ title: '', description: '', status: 'Pending' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) return setError('Task Title is required.');
    if (formData.description.trim().length < 20) return setError('Description must be at least 20 characters long.');

    setIsSubmitting(true);
    try {
      await createTask(formData);
      setPage('dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '4rem auto',
      padding: '2rem',
      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      border: '1px solid #ccc'
    }}>
      <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Add a New Project Task</h2>
      {error && <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.4rem' }}>Task Title *</label>
          <input type="text" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', backgroundColor: darkMode ? '#374151' : '#fff', color: darkMode ? '#fff' : '#000' }} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.4rem' }}>Description * (Min 20 chars)</label>
          <textarea style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc', height: '100px', boxSizing: 'border-box', backgroundColor: darkMode ? '#374151' : '#fff', color: darkMode ? '#fff' : '#000' }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{formData.description.length}/20 chars</span>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.4rem' }}>Status</label>
          <select style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', backgroundColor: darkMode ? '#374151' : '#fff', color: darkMode ? '#fff' : '#000' }} value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>
        <button type="submit" disabled={isSubmitting} style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.75rem', borderRadius: '4px', border: 'none', fontWeight: 'bold', cursor: 'pointer', opacity: isSubmitting ? 0.5 : 1 }}>
          {isSubmitting ? 'Saving Task...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
}