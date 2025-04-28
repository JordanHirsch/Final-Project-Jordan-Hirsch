// src/pages/EditPost.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate }       from 'react-router-dom';
import axios                             from 'axios';

export default function EditPost() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [title, setTitle]       = useState('');
  const [content, setContent]   = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login');
  }, [navigate]);

  useEffect(() => {
    axios
      .get(`/api/posts/${id}`)
      .then(res => {
        setTitle(res.data.title);
        setContent(res.data.content || '');
        setImageUrl(res.data.imageUrl || '');
      })
      .catch(() => setError('Failed to load post'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    const payload = { title: title.trim() };
    if (content.trim())  payload.content   = content.trim();
    if (imageUrl.trim()) payload.imageUrl = imageUrl.trim();
    else payload.imageUrl = null;

    try {
      await axios.put(
        `/api/posts/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  if (loading) return <p className="p-4">Loading post…</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
        {error && <p className="mb-4 text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Title *</label>
            <input
              className="w-full border rounded p-2"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Content</label>
            <textarea
              className="w-full border rounded p-2"
              rows="4"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium">Image URL</label>
            <input
              className="w-full border rounded p-2"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
