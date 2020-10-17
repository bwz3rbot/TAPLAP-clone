const {
    WikiPages
} = require('../../config/wikipages');
const WikiEditor = require('../Wiki/WikiEditor');
const pages = new WikiPages();
const pagelist = pages.list;
const {
    Markdown
} = require('../../util/SnooMD');
const md = new Markdown();
const requester = require('../../config/snoo').wikiRequester;

/* Run Installer */
async function runInstaller() {
    await initWikiPages()
}

/* Run Revitalizer */
async function runRevitalizer(fullRefreshFlag) {
    console.log("Wiki Initializer is running the revitalizer with flag set to: ", fullRefreshFlag);
    console.log("Generating the index...");
    await generateIndex();
    console.log("Finished generating the index");


    if (fullRefreshFlag) {
        console.log("fullRefreshFlag set to true. Refreshing all pages...");
        console.log("iterating over pageList: ", pagelist);

        for await (const page of pagelist) {
            console.log("generating page: ", page);
            try {
                console.log(`Sending this to the wiki editor: userdirectory/${page.toLowerCase()}`)
                await WikiEditor.editWikiPage(`userdirectory/${page.toLowerCase()}`);
            } catch (err) {
                if (err) {
                    console.log("there was this error while editing the current wiki page: ", err);

                }
            }
        }
    }



}

// Initialize the Wiki Pages
async function initWikiPages() {
    console.log("Initializing the wiki pages! Please wait....");

    await generateIndex();
    console.log("Iterating over this pageList: ", pagelist);
    for await (page of pagelist) {
        try {
            console.log("Generating this page: ", page);
            await generatePage(page);
        } catch (err) {
            if (err) console.log(err);
        }
    }
    console.log("All done!")
}

async function generateIndex() {
    const welcome =
        `#${process.env.WIKI_WELCOME_MESSAGE}\n`
    const introduction =
        `#User Directory\nHere is a directory of all users who have traded on r/${process.env.MASTER_SUB} along with links to the trade discussion threads.\n\nAll users are stored alphabetically. Usernames beginning with special characters can be found within the ${md.apply("etc",md.bold_italic)} section.\n\n`
    const directory = generateDirectory("userdirectory");

    const howToUse =
        `#How to use this bot?\n\n` +
        `Users may submit reviews to this ${md.link(`/r/${process.env.MASTER_SUB}/comments/${process.env.THREAD_ID}`,"bot command thread")}.\n\n` +
        `Commands must be formated with a directive of \`!rate\`. The first command argument must be the name of the user to be updated. The second argument must be a rating number between 1 and 5 followed by the word stars. The next arg must be the type of interaction. Was it either (a. sale, b. trade, c. giveaway)? If no type is specified, it defaults to a sale. All arguments following interaction type will be converted to a string, and will go into the comments section of the review. Command MUST contain an interaction type of you wish to include a comment.\n\n` +
        md.apply(`!rate u/bwz3r 5 stars sale We had a great interaction! I'm rating u/bwz3r 5 stars!`, md.codeblock) + "\n\n" +
        `This command will be processed by the bot and will find u/bwz3r within the database. If the user does not exist within the database, the user will be added to the list of reviewed users and will retain the rating given along with any comments, and a link to the command comment. Any future ratings received by this user will be added to their file and any changes made will be instantly updated in the user directory under their alphabetized page. Users scores will be averaged according to number of reviews / scores rounded down. Stars will be awarded each user according to their calculated average rating. Any questions or errors found while using the bot can be submitted to u/bwz3r. Thank you for reading!`

    let fullmsg = welcome + introduction + "\n\n" + directory + "\n\n" + howToUse

    console.log(`Generating about page: r/${process.env.MASTER_SUB}/wiki/${pages.category}`)
    await requester.getSubreddit(process.env.MASTER_SUB).getWikiPage(`${pages.category}`).edit({
        text: fullmsg,
        reason: "Automatically generated about page."
    });
}

async function generatePage(page) {
    console.log(`Generating page: ${pages.category}/${page.toLowerCase()}`)
    const dir = generateDirectory(page);

    await requester.getSubreddit(process.env.MASTER_SUB).getWikiPage(`${pages.category}/${page}`).edit({
        text: dir,
        reason: "Automatically generated page."
    });
}

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

async function getWikiPage(name) {
    return requester.getSubreddit(process.env.MASTER_SUB).getWikiPage(`${name}`);
}

async function editWikiPage(page) {
    // const wiki = getWikiPage(page)
    console.log(`EDITING THE WIKI PAGE @r/${process.env.MASTER_SUB}/wiki/${page}`)
    let directory = generateDirectory("..");
    console.log("generated: ", directory)

    await requester.getSubreddit(process.env.MASTER_SUB).getWikiPage(page).edit({
        text: directory,
        reason: "Initial Testing"
    });



}



module.exports = {
    runInstaller,
    runRevitalizer
}