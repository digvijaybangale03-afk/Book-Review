const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');

// Add review
router.post('/', auth, async (req,res) => {
  try{
    const {bookId, rating, reviewText} = req.body;
    if(!bookId || !rating) return res.status(400).json({message:'Missing fields'});
    const existing = await Review.findOne({bookId, userId: req.user.id});
    if(existing) return res.status(400).json({message:'You already reviewed this book'});
    const review = new Review({bookId, userId: req.user.id, rating, reviewText});
    await review.save();
    res.json(review);
  }catch(err){console.error(err); res.status(500).json({message:'Server error'});}
});

// Edit review
router.put('/:id', auth, async (req,res) => {
  try{
    const review = await Review.findById(req.params.id);
    if(!review) return res.status(404).json({message:'Not found'});
    if(review.userId.toString() !== req.user.id) return res.status(403).json({message:'Forbidden'});
    if(req.body.rating) review.rating = req.body.rating;
    if(req.body.reviewText) review.reviewText = req.body.reviewText;
    await review.save();
    res.json(review);
  }catch(err){console.error(err); res.status(500).json({message:'Server error'});}
});

// Delete review
router.delete('/:id', auth, async (req,res) => {
  try{
    const review = await Review.findById(req.params.id);
    if(!review) return res.status(404).json({message:'Not found'});
    if(review.userId.toString() !== req.user.id) return res.status(403).json({message:'Forbidden'});
    await review.remove();
    res.json({message:'Deleted'});
  }catch(err){console.error(err); res.status(500).json({message:'Server error'});}
});

module.exports = router;
