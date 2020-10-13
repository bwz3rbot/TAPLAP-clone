console.log("Requireing the model...")
const mongo = require('../../config/mongo');
const AlphebetizedModels = mongo.AlphabetizedModels;
class User {
    constructor(username) {
        this.username = username
        this.reviews = [];
        this.reviewCount = 0;
    }
    addReview = function (rating, type, comments) {
        console.log("adding a new review: ", {
            rating,
            type,
            comments
        })
        const review = new Review(rating, type, comments);
        console.log("Pushing the review into list...")
        this.reviews.push(review)
        console.log("Reviews: ", this.reviews)
        console.log("incremeing review count...")
        this.reviewCount++;
    }
}

class Review {
    constructor(rating, type, comments) {
        this.rating = rating
        this.type = type
        this.comments = comments
    }
}



async function runTest() {

    // const TestUser = new User("AUser");
    // TestUser.addReview(5, "trade", "https://www.discord.com");

    // console.log("creating a new instance of :", mongo.AlphabetizedModels[0].model);
    // const instance = new mongo.AlphabetizedModels[0].model({
    //     username: TestUser.username,
    //     reviews: TestUser.reviews,
    //     reviewCount: TestUser.reviewCount
    // });
    // console.log("saving this instance:", instance)

    // await instance.save();


    // mongo.AlphabetizedModels[0].model.find({}, function (err, user) {
    //     console.log("Found this user: ", user)
    // });
    // mongo.AlphabetizedModels[1].model.find({}, function (err, user) {
    //     console.log("Found this user: ", user)
    // });

    // console.log("Finding user Auser...")
    // const user = await mongo.AlphabetizedModels[0].model.findOne({
    //     username: "AUser"
    // }).exec();
    // console.log("Found user: ", user)

    console.log("Running User.js Test...")
    const user = await mongo.findUsersByFirstLetter("A");
    console.log(user)
    anotherReview = new Review(1, "sale", "http://google.com");
    user[0].reviews.push(anotherReview);
    user[0].reviewCount++;
    user[0].save();
}
module.exports = {
    runTest
}