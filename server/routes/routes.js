const express = require('express');
const Post = require('../models/Post');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../middelware/cloudinaryConfig');
const router = express.Router();

// Configure Multer storage with Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'post', // Folder in Cloudinary where the images will be stored
      allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed image formats
    },
});
  
const upload = multer({ storage });

// Create a new post with image upload to Cloudinary
router.post('/', upload.single('image'), async (req, res) => {
    const { title, description } = req.body;
    const newPost = new Post({
        title,
        description,
        image: req.file.path, // Cloudinary provides the image URL in req.file.path
    });
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Update a post
router.put('/:id', upload.single('image'), async (req, res) => {
    const { title, description } = req.body;
    const updateData = {
        title,
        description,
    };

    if (req.file) {
        updateData.image = req.file.path; // Update with the new image URL
    }

    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Failed to update post' });
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Delete a post
router.delete('/:id', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});


module.exports = router;
