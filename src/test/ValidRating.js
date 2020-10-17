const RatingsToTest = ["-2", "-1", "0", "1", "2", "3", "4", "5", "6", "7"]
const colors = require('colors');

const validateRatingNumber = function (number) {
    if (number[0] == '-') {
        return console.log("TEST FAILED!".red);
    }
    console.log("Testing this number:".yellow, number);
    const validRating = new RegExp(/[0-5]/);
    if (number) {
        if (!validRating.test(number)) {
            console.log("FAILED TEST!".red);
        } else {
            console.log("TEST PASSED!".green);
        }
    }
    console.log("Finished testing number!");
}




console.log("Running test...");
for (rating of RatingsToTest) {
    console.log("Testing rating: ", rating);
    validateRatingNumber(rating);
}