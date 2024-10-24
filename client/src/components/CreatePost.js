import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importing React icons for edit and delete
import { ToastContainer, toast } from 'react-toastify'; // React Toastify for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]); // To store posts
  const [editMode, setEditMode] = useState(false); // To toggle between create and edit mode
  const [editId, setEditId] = useState(null); // To store the ID of the post being edited

  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts');
      setPosts(res.data); // Set the posts data
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  useEffect(() => {
    fetchPosts(); // Fetch posts when the component mounts
  }, []);

  // Handle create or update submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      title,
      description,
      // Send image only if in edit mode and a new image is provided
      image: editMode && image ? image : null,
    };

    try {
      if (editMode) {
        // Update post
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (image) {
          formData.append('image', image); // Append the new image file if present
        }
        await axios.put(`http://localhost:5000/api/posts/${editId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Post updated successfully!');
        setEditMode(false);
        setEditId(null);
      } else {
        // Create post
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (image) {
          formData.append('image', image); // Append the image file
        }

        await axios.post('http://localhost:5000/api/posts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Post created successfully!');
      }

      fetchPosts(); // Refresh the posts list
      setTitle('');
      setDescription('');
      setImage(null);
      navigate('/');
      
    } catch (err) {
      console.error('Error saving post:', err);
      toast.error('Error saving post');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      fetchPosts(); // Refresh the posts list
      toast.success('Post deleted successfully!');
    } catch (err) {
      console.error('Error deleting post:', err);
      toast.error('Error deleting post');
    }
  };

  // Handle edit
  const handleEdit = (post) => {
    setEditMode(true);
    setEditId(post._id);
    setTitle(post.title);
    setDescription(post.description);
    setImage(null); // Clear the image state for new uploads
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {editMode ? 'Edit Post' : 'Create a New Post'}
      </h1>

      {/* Form to create or edit post */}
      <form onSubmit={handleSubmit} className="mb-8 bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Description"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <input
            type="file"
            className="w-full"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {/* Show preview of the new image */}
          {editMode && image && (
            <img src={URL.createObjectURL(image)} alt="Post" className="w-32 h-32 object-cover mt-2" />
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          {editMode ? 'Update Post' : 'Create Post'}
        </button>
      </form>

      {/* Table for displaying posts */}
      <h2 className="text-xl font-semibold mb-4">Posts</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Image</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id}>
                <td className="py-2 px-4 border-b">{post.title}</td>
                <td className="py-2 px-4 border-b">{post.description}</td>
                <td className="py-2 px-4 border-b">
                  <img src={post.image} alt={post.title} className="w-16 h-16 object-cover" />
                </td>
                <td className="py-2 px-4 border-b flex space-x-4">
                  {/* Edit Icon */}
                  <button onClick={() => handleEdit(post)}>
                    <FaEdit className="text-blue-500 hover:text-blue-700" />
                  </button>
                  {/* Delete Icon */}
                  <button onClick={() => handleDelete(post._id)}>
                    <FaTrash className="text-red-500 hover:text-red-700" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Toastify container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CreatePost;
