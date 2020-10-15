const mongoose = require('mongoose');
const {
    WikiPages
} = require('./wikipages');
const pages = new WikiPages();
const __ = require('colors');

const connect = function () {
    mongoose.connect('mongodb://localhost/userdata', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
}


let db = mongoose.connection
db.on('error', function (err) {
    console.log('connection error:', err);
    console.log("I don't think the database is running!".red);
    process.exit();
});


const Schema = mongoose.Schema;

const UserReviewTable = new Schema({
    username: String,
    reviews: Array,
    reviewCount: Number
});
UserReviewTable.methods.addReview = function (rating, type, comments) {
    this.reviews.push({
        rating,
        type,
        comments
    })
    this.reviewCount++;
}
const AlphabetizedModels = [];
const initAlphabetizedModelsList = function () {
    console.log("Initializing the Alphabetized models list...".magenta)
    for (let i = 0; i < pages.list.length; i++) {
        const UserReviewModel = mongoose.model(pages.list[i], UserReviewTable);
        AlphabetizedModels.push({
            category: pages.list[i].toLowerCase(),
            model: UserReviewModel
        })
    }
}
initAlphabetizedModelsList();

async function findUsersByFirstLetter(username) {
    let firstLetter = username[0].toLowerCase();
    console.log("Finding user by username... first letter: ", firstLetter);
    let match = false;
    for (const category of pages.list) {
        if (category.toLowerCase() == firstLetter.toLowerCase()) {
            match = true;
        }
    }
    match == false ? firstLetter = "etc" : false;
    const users = await getUsersAsync(firstLetter);
    return users;

}

async function getUsersAsync(firstLetter) {
    const model = mongoose.model(firstLetter, UserReviewTable);
    return new Promise(function (resolve, reject) {
        model.find({}, function (err, user) {
            if (err !== null) reject(err);
            else resolve(user);
        });
    });
}




module.exports = {
    connect,
    AlphabetizedModels,
    findUsersByFirstLetter,
    db
}