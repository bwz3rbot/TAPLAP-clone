const snoowrap = require('../../config/snoo').wikiRequester;

async function getWiki() {
    return snoowrap.getSubreddit(process.env.MASTER_SUB).getWikiPages()
}

async function runTest() {
    console.log("Running the Wiki Editor")
    console.log(await getWiki())
}

module.exports = {
    runTest
}