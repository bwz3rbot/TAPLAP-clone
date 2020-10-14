const dotenv = require('dotenv').config({
    path: "./pw.env"
});
const mongo = require('../config/mongo');
(async () => {
    await mongo.connect();
})();
const WikiEditor = require('../service/Wiki/WikiEditor');
let page = 'userdirectory/a';
(async () => {
    console.log("RUNNING TEST!")
    await WikiEditor.editWikiPage(page);
})();

// https://www.reddit.com/r/Bwz3rBot/wiki/userdirectory/b
// https://www.reddit.com/r/Bwz3rBot/wiki/userdirectory/b