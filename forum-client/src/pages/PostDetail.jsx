// forum-client/src/pages/PostDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm    from 'remark-gfm';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [post, setPost]               = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const [hasUpvoted, setHasUpvoted]   = useState(false);

  // Fetch current user
  useEffect(() => {
    if (!token) return;
    axios.get('/api/me')
      .then(res => setCurrentUser(res.data))
      .catch(() => setCurrentUser(null));
  }, [token]);

  // Fetch post + comments
  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/posts/${id}`)
      .then(res => {
        setPost(res.data);
        setHasUpvoted(false);
      })
      .catch(() => setError('Failed to load post'))
      .finally(() => setLoading(false));
  }, [id]);

  const isAuthor = currentUser?.id === post?.userId;

  // Upvote handler
  const handleUpvote = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await axios.post(`/api/posts/${id}/upvote`);
      setPost(prev => ({ ...prev, upvotes: res.data.upvotes }));
      setHasUpvoted(prev => !prev);
    } catch (err) {
      setError(err.response?.data?.error || 'Upvote failed');
    }
  };

  // Post delete handler
  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await axios.delete(`/api/posts/${id}`);
      navigate('/');
    } catch {
      setError('Could not delete post');
    }
  };

  // New comment handler (updated to use relative URL)
  const handleComment = async e => {
    e.preventDefault();
    if (!commentText.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }
    try {
      const res = await axios.post(
        `/api/posts/${id}/comments`,
        { text: commentText }
      );
      setPost(prev => ({
        ...prev,
        Comments: [...prev.Comments, res.data]
      }));
      setCommentText('');
      setCommentError('');
    } catch (err) {
      setCommentError(err.response?.data?.error || 'Could not add comment');
    }
  };

  // Delete comment handler
  const handleDeleteComment = async commentId => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await axios.delete(`/api/comments/${commentId}`);
      setPost(prev => ({
        ...prev,
        Comments: prev.Comments.filter(c => c.id !== commentId)
      }));
    } catch {
      setError('Could not delete comment');
    }
  };

  if (loading) return <p className="p-4">Loading…</p>;
  if (error)   return <p className="p-4 text-red-600">{error}</p>;
  if (!post)   return <p className="p-4">Post not found</p>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        {new Date(post.createdAt).toLocaleString()} • {post.upvotes} upvotes
      </p>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full max-h-80 object-cover rounded mb-4"
        />
      )}

      {post.content && (
        <div className="prose mb-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      )}

      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={handleUpvote}
          disabled={hasUpvoted}
          className={`px-4 py-2 rounded ${
            hasUpvoted
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {hasUpvoted ? 'Upvoted' : 'Upvote'}
        </button>

        {isAuthor && (
          <>
            <Link
              to={`/posts/${id}/edit`}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Edit
            </Link>
            <button
              onClick={handleDeletePost}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </>
        )}
      </div>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      {post.Comments.length === 0 && (
        <p className="mb-4">No comments yet. Be the first to comment!</p>
      )}
      <ul className="space-y-4 mb-6">
        {post.Comments.map(c => (
          <li key={c.id} className="border rounded p-3 flex justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {new Date(c.createdAt).toLocaleString()}
              </p>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {c.text}
              </ReactMarkdown>
            </div>
            {isAuthor && (
              <button
                onClick={() => handleDeleteComment(c.id)}
                className="text-red-500 hover:underline ml-4"
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={handleComment} className="space-y-2">
        {commentError && <p className="text-red-600">{commentError}</p>}
        <textarea
          className="w-full border rounded p-2"
          rows="3"
          placeholder="Write a comment…"
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
}
