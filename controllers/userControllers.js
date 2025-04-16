const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const signup =  async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const avatar = req.file ? `/uploads/avatars/${req.file.filename}` : null;
    const user = await User.create({ username, email, password, avatar });
    user.activityLogs.push({ action: 'User signed up' });
    await user.save();
    const token = user.generateJWT();
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    user.activityLogs.push({ action: 'User logged in' });
    await user.save();
    req.user = user
    const token = user.generateJWT();
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getProfile = async (req, res) => {
  try {
   
    const user = await User.findById(req.user.id).select('-password');
    user.activityLogs.push({ action: 'Viewed profile' });
    await user.save();
    req.user = user;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const resetPassword  = async (req, res) => {
  try {
    const { email, newPassword, oldPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Old password is incorrect' });
    }
    user.password = newPassword; 
    await user.save(); 
    user.activityLogs.push({ action: 'Password reset' });
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


const logActivities = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = User.verifyJWT(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await User.findById(decoded.id);
    user.activityLogs.push({ action: 'Viewed activity logs' });
    await user.save();
    res.status(200).json(user.activityLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const logout  = async (req, res) => {
  try {
    const user = User.verifyJWT(req.headers.authorization.split(' ')[1]);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const foundUser = await User.findById(user.id);
    if (!foundUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    foundUser.activityLogs.push({ action: 'User logged out' });
    await foundUser.save();
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


const notifications =  async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the user's notifications
    const user = await User.findById(userId).select('notifications');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ notifications: user.notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const readNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Find the user and update the notification
    const user = await User.findOneAndUpdate(
      { _id: userId, 'notifications._id': id },
      { $set: { 'notifications.$.read': true } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification marked as read', notifications: user.notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {signup,login,getProfile,resetPassword,logActivities,logout,notifications,readNotification};