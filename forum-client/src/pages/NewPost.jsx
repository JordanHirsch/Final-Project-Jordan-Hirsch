import React, { useState, useEffect } from 'react';
import { useNavigate }                  from 'react-router-dom';
import axios                            from 'axios';

export default function NewPost() {
  const [title, setTitle]       = useState('');
  const [content, setContent]   = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login');
  }, [navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Title required');
      return;
    }
    try {
      await axios.post('/api/posts', { title, content, imageUrl });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Create failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>New Post</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Title</label>
        <input value={title} onChange={e=>setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Content</label>
        <textarea value={content} onChange={e=>setContent(e.target.value)} />
      </div>
      <div>
        <label>Image URL</label>
        <input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} />
      </div>
      <button type="submit">Post</button>
    </form>
  );
}
