const dotenv = require('dotenv').config({
    path: "./pw.env"
});
const mongo = require('../config/mongo');
(async () => {
    await mongo.connect();
})();
const User = require('../service/User/User');

(async () => {
    console.log("RUNNING TEST!");
    let command = {
        directive: "rate",
        args: [
            "AAron_carter",
            5,
            "giveaway",
            "I'm rating you very highly because this thing works. And if it doesn't then well nevermind."

        ]
    }
    let interactionType;


    console.log("Length of args: ", command.args.length);
    // Validate Interaction Type

    // If command includes interaction type
    if (command.args[2] &&
        (command.args[2].toLowerCase() != "sale" &&
            command.args[2].toLowerCase() != "giveaway" &&
            command.args[2].toLowerCase() != "trade")) {
        // If interaction type is not = to "sale/giveaway/trade", return with an error message
        interactionType = command.args[2];
        return console.log("Test Failed!".red);
    }

    // If command was not given with an interaction type, default it to "sale"
    if (!command.args[2]) {
        command.args[2] = "sale";
    } else {
        // Set to lower case before sending to the user service.
        command.args[2] = command.args[2].toLowerCase();
    }
    console.log("Test passed.".green);
    console.log(command)
    await User.update(command);
})();