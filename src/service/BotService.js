const colors = require('colors');
const Snoowrap = require('snoowrap');
const requester = require('../config/snoo').actionRequester;
const User = require('./User/User');
const cmd = require('../common/Command').command;
const Markdown = require('../util/SnooMD').Markdown;
const md = new Markdown();
const wikiLink = md.link(`https://www.reddit.com/r/${process.env.MASTER_SUB}/wiki/userdirectory`, 'Wiki');

async function doSomething(item) {
    // First Check the item was saved.
    if (!item.saved) {
        console.log(`processing item: ${item.body}`.magenta);
        let command = cmd(item.body);
        if (command) {

            // If the command was received with a backslash at index[0], remove it
            if (command.args.length && command.args[0].startsWith("\\")) {
                let newString = command.args[0].replace("\\", "");
                command.args[0] = newString;
            }

            // If the comment was a command, process.
            if (command) {
                await processCommand(command, item);
            }

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
                        validateUserNotRatingSelf(command.args[0], item);
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
                    await replyWithLink(command, item);

                }
            } else { // Command arguments were invalid (less than 2 args received)
                await errorMessage(item, "Check your command arguments!");
            }
            break;

        case "help":
            await requester.getComment(item.id).reply(`Check out our ${wikiLink} for more information on how to use this bot!`);
            return;


        default: // Command directive not recognized
            console.log(`Error processing command. Replying with error message 'oops'.`.red);
            await errorMessage(item, "Oops!");
            break;
    }

}

async function replyWithLink(command, item) {
    console.log("Replying with success message...".green);
    let userCategory = command.args[0][0].toLowerCase();
    let dashes = new RegExp(/[\-\_]/);
    if (dashes.test(userCategory)) {
        userCategory = "etc";
    }
    const link = md.link(`https://www.reddit.com/r/${process.env.MASTER_SUB}/wiki/userdirectory/${userCategory}`, 'Wiki');
    await requester.getComment(item.id).reply(`Your rating has been stored! Thanks for making this sub a better place to trade in. Go see your comment in our ${link}.`);
}
const validateRatingNumber = function (number) {
    console.log("Validating rating number...".yellow, number);
    let testNumber = new RegExp(/[^0-5]/);
    if (number) {
        if (testNumber.test(parseInt(number))) {
            throw new Error("Rating be a number between 0 and 5.")
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
}

const validateUserNotRatingSelf = function (username, item) {
    console.log("Validating user not rating self...".magenta);
    if (username === item.author.name) {
        throw new Error("Nice try, but you can't rate yourself!");
    }
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