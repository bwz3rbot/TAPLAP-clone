const requester = require('../../config/snoo').actionRequester;
const __ = require('colors');
const mongo = require('../../config/mongo');
const {
    WikiPages
} = require('../../config/wikipages');
const pages = new WikiPages();
const pagelist = pages.list;
const {
    Markdown
} = require('../../util/SnooMD');
const md = new Markdown();

const STAR = `★`;
const STAR0 = `☆`;

const generateDirectory = function (page) {
    let links = new Array();
    // If page = current iteration, bold the page in link text
    for (let i = 0; i < pagelist.length; i++) {
        let text = new String(pagelist[i]);
        if (pagelist[i] === page) {
            text = md.apply(text, md.bold);
        }
        const link = md.link(`https://www.reddit.com/r/${process.env.MASTER_SUB}/wiki/${pages.category}/${pagelist[i].toLowerCase()}`, text);
        links.push(link)
    }
    let linkstring = links.join(" |\n ");
    return linkstring.concat("\n\n-----");
}

// Edit Wiki Page
async function editWikiPage(page) {
    console.log("Updating Wiki Page: ".yellow, page);
 
    // Get the correct page and generate a directory
    let p = page.replace("userdirectory/", "");
    const dir = generateDirectory(p.toUpperCase());

    // Find the correct model for the alphabetized page
    const foundModel = mongo.AlphabetizedModels.find(model => model.category === p);
    let CategorizedUsers;
    await foundModel.model.find({}, (err, users) => {
        CategorizedUsers = users;
    })

    // Generate tables for each user
    const AllTables = [];
    CategorizedUsers.forEach(user => {
        let reviews = [];
        user.reviews.forEach(review => {
            reviews.push(review);
        })

        // Format Username
        const fUsername = `#${user.username}`;
        AllTables.push(fUsername);
        const score = calculateScore(user);
        console.log("Calculated Score: ", score)
        let stars = "";
        let c = 0;
        for (c; c < score; c++) {
            stars +=STAR;
        }
        for(c; c<5;c++){
            stars += STAR0;
        }

        let fullMessage = stars.concat(`(average score:${score}, total reviews:${user.reviewCount})`);
        AllTables.push(fullMessage);

        // Push user Table Data
        const t = md.table(["Rating", "Type", "Comments", "Permalink"], reviews);
        AllTables.push(t);
    });


    // Format the data into strings
    let AllTablesString = AllTables.join("\n\n");
    console.log("Updating the wiki page...".magenta);
    const fullMessage = dir + "\n\n" + AllTablesString;

    // Update the wiki page
    await requester.getSubreddit(process.env.MASTER_SUB).getWikiPage(page).edit({
        reason: `New user data added.`,
        text: fullMessage
    });

}

// Calculate Number of stars.
// Takes in a user and gets the average score
// Returns how many 
const calculateScore = function (user) {
    console.log("Calculating Score from User: ", user)
    const count = user.reviewCount;
    console.log("User Review Count: ", count);
    let total = 0;
    user.reviews.forEach(review => {
        total += parseInt(review.rating);
    })
    return Math.floor(total / count);
}


module.exports = {
    editWikiPage
}