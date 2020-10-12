console.log("Requiring Wiki-Pages")
const {
    WikiPages
} = require('../../config/wikipages');
console.log("Requiring the Wiki-Requester")
const snoowrap = require('../../config/snoo-config');
const requester = snoowrap.wikiRequester;
const pages = new WikiPages();
const list = pages.list;

console.log("Creating a new WikiPages");

async function initWikiPages() {
    console.log("Initializing the wiki pages!");
    // const pages = await requester.getSubreddit(process.env.MASTER_SUB).getWikiPages();
    console.dir(pages);
    for (let i = 0; i < list.length; i++) {
        generatePage(list[i]);

    }
}

const generatePage = function (page) {
    console.log(`Generating page: ${pages.category}/${page}`)

}

const generateUserDirectory = function () {

}


module.exports = {
    initWikiPages
}