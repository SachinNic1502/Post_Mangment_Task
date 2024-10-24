import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/posts');
        setPosts(res.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>; // Loading indicator
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Posts</h1>

      {posts.length === 0 ? ( // Check if there are no posts
        <div className="text-center">
          <p className="text-lg mb-4">No posts available.</p>
          <Link to="/posts" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Add Post
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post._id} className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96">
              <div className="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
                {post.image && (
                  <img
                    src={post.image}
                    alt="card-image"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h6 className="mb-2 text-slate-800 text-xl font-semibold">
                  {post.title}
                </h6>
                <p className="text-slate-600 leading-normal font-light">
                  {post.description}
                </p>
              </div>
              <div className="px-4 pb-4 pt-0 mt-2">
                <Link to={`/posts/${post._id}`} className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                  Read more
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
