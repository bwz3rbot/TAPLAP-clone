const snoowrap = require('../../config/snoo-config').wikiRequester;
const wikipages = require('../../config/wikipages');

async function getWiki() {
    return snoowrap.getSubreddit(process.env.MASTER_SUB).getWikiPages()
}

async function run() {
    console.log("Running the Wiki Editor")
    console.log(await getWiki())
}

module.exports = {
    run
}