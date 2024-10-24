// src/components/PostDetail.js

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PostDetail = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setPost(res.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="text-center">Loading...</div>; // Loading indicator
  }

  if (!post) {
    return <div className="text-center">Post not found.</div>; // Handle post not found
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      {post.image && (
        <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded-md mb-4" />
      )}
      <p className="text-gray-700">{post.description}</p>
    </div>
  );
};

export default PostDetail;
