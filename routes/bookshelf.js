const express = require('express');
const router = express.Router();
const bookshelf = require('../controllers/bookshelf');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateBookEntry } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const bookShelf = require('../models/bookentry');

router.route('/')
    .get(catchAsync(bookshelf.index))
    .post(isLoggedIn, upload.array('image'), validateBookEntry, catchAsync(bookshelf.createBookEntry))


router.get('/new', isLoggedIn, bookshelf.renderNewForm)

router.route('/:id')
    .get(catchAsync(bookshelf.showBookEntry))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateBookEntry, catchAsync(bookshelf.updateBookEntry))
    .delete(isLoggedIn, isAuthor, catchAsync(bookshelf.deleteBookEntry));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(bookshelf.renderEditForm))



module.exports = router;