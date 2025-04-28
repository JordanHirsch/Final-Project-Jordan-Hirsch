// src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [posts, setPosts]           = useState([]);
  const [sortBy, setSortBy]         = useState('createdAt');
  const [search, setSearch]         = useState('');
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  const limit = 10;

  const fetchPosts = async (pageNum = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:4000/api/posts', {
        params: { sortBy, search, page: pageNum, limit }
      });
      const { posts: newPosts, page: returnedPage, totalPages } = res.data;

      setPosts(pageNum === 1 ? newPosts : prev => [...prev, ...newPosts]);
      setPage(returnedPage);
      setTotalPages(totalPages);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, [sortBy, search]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by title…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-grow p-2 border rounded bg-white"
        />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="p-2 border rounded bg-white"
        >
          <option value="createdAt">Newest</option>
          <option value="upvotes">Top Upvoted</option>
        </select>
        <Link
          to="/posts/new"
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
        >
          New Post
        </Link>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <Link
              to={`/posts/${post.id}`}
              className="text-xl font-semibold hover:underline"
            >
              {post.title}
            </Link>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(post.createdAt).toLocaleString()} • {post.upvotes} upvotes
            </p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="mt-4 w-full h-32 object-cover rounded"
              />
            )}
          </div>
        ))}
      </div>

      {loading && <p className="mt-6">Loading posts…</p>}

      {!loading && page < totalPages && (
        <div className="text-center mt-6">
          <button
            onClick={() => fetchPosts(page + 1)}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            Load More
          </button>
        </div>
      )}

      {!loading && page >= totalPages && posts.length > 0 && (
        <p className="mt-6 text-center text-gray-500">No more posts.</p>
      )}
    </div>
  );
}
