const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/User');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const {name,email,password} = req.body;
    if(!name||!email||!password) return res.status(400).json({message:'Missing fields'});
    let user = await User.findOne({email});
    if(user) return res.status(400).json({message:'User already exists'});
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    user = new User({name, email, password:hashed});
    await user.save();
    res.json({message:'User created'});
  } catch (err) {
    console.error(err);
    res.status(500).json({message:'Server error'});
  }
});

// Login
router.post('/login', async (req,res) => {
  try{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({message:'Invalid credentials'});
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({message:'Invalid credentials'});
    const payload = {id:user._id, name:user.name, email:user.email};
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:'7d'});
    res.json({token, user: payload});
  }catch(err){
    console.error(err);
    res.status(500).json({message:'Server error'});
  }
});

module.exports = router;
