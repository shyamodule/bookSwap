const bookShelf = require('../models/bookentry');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const bookshelf = await bookShelf.find({}).populate('popupText');
    res.render('bookshelf/index', { bookshelf })
}

module.exports.renderNewForm = (req, res) => {
    res.render('bookshelf/new');
}

module.exports.createBookEntry = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.bookEntry.location,
        limit: 1
    }).send()
    const bookEntry = new bookShelf(req.body.bookEntry);
    bookEntry.geometry = geoData.body.features[0].geometry;
    bookEntry.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    // bookEntry.author = req.user._id;
    bookEntry.author = req.user;
    await bookEntry.save();
    console.log(bookEntry);
    // console.log(bookEntry.author.username);
    req.flash('success', 'Successfully made a new book entry!');
    res.redirect(`/bookshelf/${bookEntry._id}`)
}

module.exports.showBookEntry = async (req, res,) => {
    const bookEntry = await bookShelf.findById(req.params.id).populate('author');
    if (!bookEntry) {
        req.flash('error', 'Cannot find that book entry!');
        return res.redirect('/bookshelf');
    }
    // console.log(bookEntry);
    res.render('bookshelf/show', { bookEntry });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const bookEntry = await bookShelf.findById(id)
    if (!bookEntry) {
        req.flash('error', 'Cannot find that book entry!');
        return res.redirect('/bookshelf');
    }
    res.render('bookshelf/edit', { bookEntry });
}

module.exports.updateBookEntry = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const bookEntry = await bookShelf.findByIdAndUpdate(id, { ...req.body.bookEntry });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    bookEntry.images.push(...imgs);
    await bookEntry.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await bookEntry.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated book entry!');
    res.redirect(`/bookshelf/${bookEntry._id}`)
}

module.exports.deleteBookEntry = async (req, res) => {
    const { id } = req.params;
    await bookShelf.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted book entry.')
    res.redirect('/bookshelf');
}