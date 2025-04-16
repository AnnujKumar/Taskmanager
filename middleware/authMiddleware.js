const User = require("../models/userModel");

const isAuthenticated = (req, res, next) => {  

  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token)
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    } 
    const user = User.verifyJWT(token);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    } 
    req.user = user;
    console.log(user)
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
module.exports = isAuthenticated;