const { AlphabetizedModels } = require('../config/mongo');
const mongo = require('../config/mongo');
(async () => {
    await mongo.connect();
})();

// const model = mongo.UserReviewModel;

// console.log("Creating and saving a new model in mongodb");
// const instance = new model({
//     username: "Bwz3r",
//     reviews: [{
//         rating: "5",
//         type: "Trade",
//         comments: "https://www.reddit.com/r/TakeaPlantLeaveagewagewgaewgafgads/g6j7nix?utm_source=share&utm_medium=web2x&context=3"
//     }]
// });

// instance.save();
(async () => {
    
    console.log(mongo.AlphabetizedModels)
    const instance = new mongo.AlphabetizedModels[1].model({
        username: "Bwz3r",
        reviews: [{
            rating: "5",
            type: "Trade",
            comments: "https://www.reddit.com/r/TakeaPlantLeaveagewagewgaewgafgads/g6j7nix?utm_source=share&utm_medium=web2x&context=3"
        }]
    });
    instance.save();

    AlphabetizedModels[1].model.find({}, function (err, user) {
        // docs.forEach
        console.log("Found this user: ", user)
      });

    const user = await AlphabetizedModels[1].model.findOne({
        username: "Bwz3r"
    }).exec();
    console.log(user)
})();