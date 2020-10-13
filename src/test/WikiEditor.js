const dotenv = require('dotenv').config({
    path: "./pw.env"
});
const WikiEditor = require('../service/Wiki/WikiEditor');
(async () => {
    console.log("RUNNING TEST!")
    await WikiEditor.runTest();
})();

// https://www.reddit.com/r/Bwz3rBot/wiki/userdirectory/b
// https://www.reddit.com/r/Bwz3rBot/wiki/userdirectory/b