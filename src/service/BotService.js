const colors = require('colors');
const Snoowrap = require('snoowrap');
const requester = require('../config/snoo').actionRequester;
const User = require('./User/User');
const cmd = require('../common/Command').command;
const Markdown = require('../util/SnooMD').Markdown;
const md = new Markdown();

async function doSomething(item) {
    // First Check the item was saved.
    if (!item.saved) {
        console.log(`processing item: ${item.body}`.magenta);
        let command = cmd(item.body);

        // If the command was received with a backslash at index[0], remove it
        if (command.args.length && command.args[0].startsWith("\\")) {
            let newString = command.args[0].replace("\\", "");
            command.args[0] = newString;
        }

        // If the comment was a command, process.
        if (command) {
            await processCommand(command, item);
        }



        // Save the item after processing
        await saveItem(item);
        return console.log(`item  ${item.id} successfully processed!`.grey);
    } else { // Item already saved. Skipping.
        return console.log(`item ${item.id} saved already. Skipping...`.grey);
    }
}

// Process Commands
async function processCommand(command, item) {
    console.log("Processing this command: ".yellow, command);
    switch (command.directive) {
        case "rate": // Check that the required arguments are there, reply with error message if not
            if (command.args.length >= 2) {
                // Check username contains no special characters
                let pattern = new RegExp(/[`~!@#$%^&*()+=]/);
                if (pattern.test(command.args[0])) {
                    return errorMessage(item, "Username can't contain special characters!");
                } else { // If valid username:

                    try {
                        // Validate interaction type, default to "sale" if none exists
                        validateRatingNumber(command.args[1]);
                        validateInteractionType(command.args[3]);
                    } catch (err) {
                        if (err) {
                            return errorMessage(item, err);
                        }
                    }

                    // Finally, update the user in the database
                    await updateUser(command, item);
                    // And reply with a link to the wiki
                    console.log("Replying with success message...".green)
                    const link = md.link(`https://www.reddit.com/r/${process.env.MASTER_SUB}/wiki/userdirectory/${command.args[0][0].toLowerCase()}`, 'Wiki');
                    await requester.getComment(item.id).reply(`Your rating has been stored! Thanks for making this sub a better place to trade in. Go see your comment in our ${link}.`);
                }
            } else { // Command arguments were invalid (less than 2 args received)
                await errorMessage(item, "Check your command arguments!");
            }
            break;

        default: // Command directive not recognized
            console.log("Error processing command.".red);
            await errorMessage(item, "Oops!");
            break;
    }

}

const validateRatingNumber = function (number) {
    console.log("Validating rating number...".yellow, number);
    let testNumber = new RegExp(/[^0-5]/);
    if (number) {
        console.log("number exists. testing...")
        if (testNumber.test(parseInt(number))) {
            console.log("Test failed!".red);
            throw new Error("Rating be a number between 0 and 5.")
        } else {
            console.log("Test passed!".green);
        }
    }
    

}
const validateInteractionType = function (type) {
    console.log("Validating the interaction type...".magenta);
    if (type &&
        (type.toLowerCase() != "sale" &&
            type.toLowerCase() != "giveaway" &&
            type.toLowerCase() != "trade")) {
        // If interaction type is not = to "sale/giveaway/trade", return with an error message
        interactionType = type;
        throw new Error("Check your interaction type argument!");
    }

    // If command was not given with an interaction type, default it to "sale"
    if (!type) {
        type = "sale";
    } else {
        // Set to lower case before sending to the user service.
        type = type.toLowerCase();
    }
    console.log("Validated Interaction Type: ", type);
}

// Update the user
async function updateUser(command, item) {
    console.log("Updating user...".green);
    if (!command.args.length) {
        console.log("Command lacks arguments.".red);
        return errorMessage(item, "Your command must include arguments!");
    }
    await User.update(command, item.permalink);

}

// Reply with Error Message
async function errorMessage(item, message) {
    console.log("Replying with Error Message!".red);
    await requester.getComment(item.id).reply(
        `${message} You may refer to the ${md.link(`https://www.reddit.com/r/${process.env.MASTER_SUB}/wiki/userdirectory`,'wiki page')} on how to format your commands.`);
}

// Save already processed comments
const saveItem = function (item) {
    console.log("saving the comment...".grey);
    return requester.getComment(item.id).save();
}
module.exports = {
    doSomething: doSomething
}