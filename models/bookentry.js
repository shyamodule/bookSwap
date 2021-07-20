const mongoose = require('mongoose');
// const Review = require('./review')
const Schema = mongoose.Schema;

// const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/bookSwap';

// mongoose.connect(dbUrl, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// });

// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const BookSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    writer: String,
    social: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    
}, opts);


// BookSchema.virtual('properties.popUpMarkup').get(function () {
//     return `
//     <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
//     <p>${this.description.substring(0, 20)}...</p>`
// });

BookSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/bookshelf/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});


// BookSchema.post('findOneAndDelete', async function (doc) {
//     if (doc) {
//         await Review.deleteMany({
//             _id: {
//                 $in: doc.reviews
//             }
//         })
//     }
// })

module.exports = mongoose.model('bookEntry', BookSchema);