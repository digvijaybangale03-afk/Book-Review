const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Book = require('../models/Book');
const Review = require('../models/Review');

// Create book
router.post('/', auth, async (req,res) => {
  try{
    const {title,author,description,genre,year} = req.body;
    const book = new Book({title,author,description,genre,year, addedBy: req.user.id});
    await book.save();
    res.json(book);
  }catch(err){console.error(err); res.status(500).json({message:'Server error'});}
});

// Get books with pagination and optional search/filter
router.get('/', async (req,res) => {
  try{
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const filter = {};
    if(req.query.genre) filter.genre = req.query.genre;
    if(req.query.q) filter.title = new RegExp(req.query.q, 'i');
    const total = await Book.countDocuments(filter);
    const books = await Book.find(filter).sort({createdAt:-1}).skip((page-1)*limit).limit(limit).lean();
    // attach average rating
    const ids = books.map(b=>b._id);
    const ratings = await Review.aggregate([
      { $match: { bookId: { $in: ids } } },
      { $group: { _id: "$bookId", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]);
    const rmap = {};
    ratings.forEach(r=> rmap[r._id.toString()] = r);
    books.forEach(b=>{
      const rr = rmap[b._id.toString()];
      b.avgRating = rr ? Number(rr.avgRating.toFixed(2)) : null;
      b.reviewsCount = rr ? rr.count : 0;
    });
    res.json({books, total, page, pages: Math.ceil(total/limit)});
  }catch(err){console.error(err); res.status(500).json({message:'Server error'});}
});

// Get single book with reviews
router.get('/:id', async (req,res) => {
  try{
    const book = await Book.findById(req.params.id).populate('addedBy','name email').lean();
    if(!book) return res.status(404).json({message:'Book not found'});
    const reviews = await Review.find({bookId:book._id}).populate('userId','name').sort({createdAt:-1}).lean();
    const avg = reviews.length ? (reviews.reduce((s,r)=>s+r.rating,0) / reviews.length) : null;
    book.reviews = reviews;
    book.avgRating = avg ? Number(avg.toFixed(2)) : null;
    res.json(book);
  }catch(err){console.error(err); res.status(500).json({message:'Server error'});}
});

// Edit book (only creator)
router.put('/:id', auth, async (req,res) => {
  try{
    const book = await Book.findById(req.params.id);
    if(!book) return res.status(404).json({message:'Not found'});
    if(book.addedBy.toString() !== req.user.id) return res.status(403).json({message:'Forbidden'});
    const fields = ['title','author','description','genre','year'];
    fields.forEach(f => { if(req.body[f] !== undefined) book[f] = req.body[f]; });
    await book.save();
    res.json(book);
  }catch(err){console.error(err); res.status(500).json({message:'Server error'});}
});

// Delete book
router.delete('/:id', auth, async (req,res) => {
  try{
    const book = await Book.findById(req.params.id);
    if(!book) return res.status(404).json({message:'Not found'});
    if(book.addedBy.toString() !== req.user.id) return res.status(403).json({message:'Forbidden'});
    await book.remove();
    res.json({message:'Deleted'});
  }catch(err){console.error(err); res.status(500).json({message:'Server error'});}
});

module.exports = router;
