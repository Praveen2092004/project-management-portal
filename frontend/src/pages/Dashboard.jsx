import React, { useState, useEffect } from 'react';
import { fetchTasks, updateTask, deleteTask } from '../services/api';

export default function Dashboard({ darkMode }) {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    fetchTasks(search, filterStatus, page, sortBy)
      .then((res) => {
        setTasks(res.data.tasks || []);
        setStats(res.data.stats || { total: 0, pending: 0, inProgress: 0, completed: 0 });
        setPagination(res.data.pagination || { currentPage: 1, totalPages: 1 });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [search, filterStatus, page, sortBy]);

  const handleComplete = (id) => {
    updateTask(id, { status: 'Completed' }).then(() => loadData());
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this task?")) {
      deleteTask(id).then(() => loadData());
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: darkMode ? '#fff' : '#000' }}>Loading your dashboard...</div>;

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto', color: darkMode ? '#fff' : '#000' }}>
      
      {/* 📊 Statistics Dashboard Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', borderRadius: '10px', backgroundColor: '#2563eb', color: 'white' }}>
          <h4 style={{ margin: 0, opacity: 0.9 }}>Total Tasks</h4>
          <h1 style={{ margin: '0.5rem 0 0 0', fontSize: '2.5rem' }}>{stats.total}</h1>
        </div>
        <div style={{ padding: '1.5rem', borderRadius: '10px', backgroundColor: '#d97706', color: 'white' }}>
          <h4 style={{ margin: 0, opacity: 0.9 }}>Pending Tasks</h4>
          <h1 style={{ margin: '0.5rem 0 0 0', fontSize: '2.5rem' }}>
            {/* 🔑 FIXED: Summing pending and inProgress counts together safely */}
            {(stats.pending || 0) + (stats.inProgress || 0)}
          </h1>
        </div>
        <div style={{ padding: '1.5rem', borderRadius: '10px', backgroundColor: '#059669', color: 'white' }}>
          <h4 style={{ margin: 0, opacity: 0.9 }}>Completed Tasks</h4>
          <h1 style={{ margin: '0.5rem 0 0 0', fontSize: '2.5rem' }}>{stats.completed}</h1>
        </div>
      </div>

      {/* 🔍 Search & Filtering Row Grid Layout */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="🔍 Search tasks by title..." 
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ flex: 2, padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: darkMode ? '#374151' : '#fff', color: darkMode ? '#fff' : '#000' }}
        />
        <select 
          value={filterStatus} 
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', backgroundColor: darkMode ? '#374151' : '#fff', color: darkMode ? '#fff' : '#000' }}
        >
          <option value="All Statuses">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', backgroundColor: darkMode ? '#374151' : '#fff', color: darkMode ? '#fff' : '#000' }}
        >
          {/* 🔑 FIXED: Updated UI option text to display "Sort by Created Date" explicitly */}
          <option value="createdAt">Sort by Created Date</option>
          <option value="title">Sort by: Alphabetical</option>
        </select>
      </div>

      {/* 📋 Task Cards Content Display Grid Loop */}
      {tasks.length === 0 ? (
        <div style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '4rem', textAlign: 'center', color: '#64748b' }}>
          No tasks found matching your search parameters.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {tasks.map((task) => (
            <div key={task._id} style={{ padding: '1.5rem', borderRadius: '10px', border: '1px solid #e5e7eb', backgroundColor: darkMode ? '#1f2937' : '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 0.75rem 0' }}>{task.title}</h3>
                <p style={{ color: darkMode ? '#9ca3af' : '#4b5563', fontSize: '0.95rem' }}>{task.description}</p>
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', backgroundColor: task.status === 'Completed' ? '#d1fae5' : '#f3f4f6', color: task.status === 'Completed' ? '#065f46' : '#374151' }}>{task.status}</span>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  {task.status !== 'Completed' && <button onClick={() => handleComplete(task._id)} style={{ flex: 1, background: '#059669', color: 'white', border: 'none', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer' }}>✓ Complete</button>}
                  <button onClick={() => handleDelete(task._id)} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>🗑 Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🎚️ Pagination Controls Layout Footer */}
      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginTop: '2rem' }}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>◀ Previous</button>
          <span>Page <strong>{pagination.currentPage}</strong> of {pagination.totalPages}</span>
          <button disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Next ▶</button>
        </div>
      )}

    </div>
  );
}