const mongoose = require('mongoose');
const cities = require('./cities');
const books = require('./seedHelpers');
const bookShelf = require('../models/bookentry');

console.log(process.env.DB_URL)
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/bookSwap';
console.log(dbUrl)
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
console.log(db)
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await bookShelf.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 187);
        const price = Math.floor(Math.random() * 20) + 10;
        const book = new bookShelf({
            //YOUR USER ID
            author: '5f5c330c2cd79d538f2c66d9',
            location: `${cities[random1000].city}, ${cities[random1000].admin_name}`,
            title: `${sample(books).title}`,
            writer: `${sample(books).writer}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            social: "kali haveli, andheri gali, khatra nagar, samsan ke paas mein",
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].lng,
                    cities[random1000].lat,
                ]
            },
            images: [
                {
                    // url: 'https://res.cloudinary.com/sam-a-cloud/image/upload/v1621934734/Bookshelf/default_jvrdrv.png',
                    // filename: 'Bookshelf/default_jvrdrv.png'
                    // url: 'https://res.cloudinary.com/sam-a-cloud/image/upload/v1621874034/Bookshelf/sq6nflex71ptmgv7mya6.png',
                    // filename: 'Bookshelf/sq6nflex71ptmgv7mya6'
                    url: 'https://res.cloudinary.com/sam-a-cloud/image/upload/v1621937138/Bookshelf/unnamed_1_prfhyi.jpg',
                    filename: 'Bookshelf/unnamed_1_prfhyi.jpg'
                },
                
            ]
        })
        await book.save();
        // console.log(i + ' saved')
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})