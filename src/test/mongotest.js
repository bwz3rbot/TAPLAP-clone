const mongo = require('../config/mongo');
const model = mongo.UserReviewModel;
console.log("testing mongodb");

const instance = new model({
    username: "Bwz3r",
    reviews: [
        {
            rating: "5",
            type: "Trade",
            comments: "https://www.reddit.com/r/TakeaPlantLeaveagewagewgaewgafgads/g6j7nix?utm_source=share&utm_medium=web2x&context=3"
        }
    ]
});

instance.save();