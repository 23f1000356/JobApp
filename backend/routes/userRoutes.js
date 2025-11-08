import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import Post from '../models/Post.js';

const router = express.Router();

// Get user profile
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('connections', 'name username profilePicture');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find({ userId: user._id })
      .populate('userId', 'name username profilePicture')
      .populate('comments.userId', 'name username profilePicture')
      .sort({ createdAt: -1 });

    res.json({ user, posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send connection request
router.post('/:id/connect', auth, async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'You cannot connect with yourself' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.connections.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already connected' });
    }

    if (user.pendingConnections.includes(req.user.id)) {
      return res.status(400).json({ message: 'Connection request already sent' });
    }

    user.pendingConnections.push(req.user.id);
    await user.save();

    res.json({ message: 'Connection request sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accept connection request
router.put('/:id/accept', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.pendingConnections.includes(req.params.id)) {
      return res.status(400).json({ message: 'No pending request from this user' });
    }

    // Remove from pending and add to connections for both users
    user.pendingConnections = user.pendingConnections.filter(
      id => id.toString() !== req.params.id
    );
    user.connections.push(req.params.id);
    await user.save();

    const otherUser = await User.findById(req.params.id);
    otherUser.connections.push(req.user.id);
    await otherUser.save();

    res.json({ message: 'Connection accepted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user connections
router.get('/:id/connections', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('connections', 'name username profilePicture')
      .select('connections');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.connections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;