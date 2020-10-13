const {
    WikiPages
} = require('../../config/wikipages');
const pages = new WikiPages();
const pagelist = pages.list;
const {
    Markdown
} = require('../../util/SnooMD');
const md = new Markdown();
const snoowrap = require('../../config/snoo');
const {
    bold
} = require('colors');
const requester = snoowrap.wikiRequester;

// Initialize the Wiki Pages
async function initWikiPages() {
    console.log("Initializing the wiki pages! Please wait....");

    await generateIndex();
    for await (page of pagelist) {
        try {
            await generatePage(page);
        } catch (err) {
            console.log(err)
        }
    }
    console.log("All done!")
}

async function generateIndex() {
    const introduction =
        `#User Directory\nHere is a directory of all users who have traded on r/${process.env.MASTER_SUB} along with links to the trade discussion threads.\n\nAll users are stored alphabetically. Usernames beginning with special characters can be found within the ${md.apply("etc",md.bold_italic)} section.\n\n`
    const directory = generateDirectory("userdirectory");

    const howToUse =
        `#How to Use\n\n` +
        `Users may submit reviews to this ${md.link("https://www.reddit.com/fail_link","bot command thread")}.\n\n` +
        `Commands must be formated as such:\n\n` +
        md.apply(`u/${process.env.REDDIT_USER} !command arg1 arg2 arg3`, md.codeblock);

    let fullmsg = introduction + "\n\n" + directory + "\n\n" + howToUse

    console.log(`Generating about page: r/${process.env.MASTER_SUB}/wiki/${pages.category}`)
    await requester.getSubreddit(process.env.MASTER_SUB).getWikiPage(`${pages.category}`).edit({
        text: fullmsg,
        reason: "initial testing"
    });
}

async function generatePage(page) {
    console.log(`Generating page: ${pages.category}/${page.toLowerCase()}`)
    const dir = generateDirectory(page);

    await requester.getSubreddit(process.env.MASTER_SUB).getWikiPage(`${pages.category}/${page}`).edit({
        text: dir,
        reason: "initial testing"
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

async function runInstaller() {
    await initWikiPages()
}

module.exports = {
    runInstaller
}