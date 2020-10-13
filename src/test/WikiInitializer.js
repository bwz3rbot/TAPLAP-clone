const dotenv = require('dotenv').config({
    path: "./pw.env"
});
const WikiInitializer = require('../service/Wiki/WikiInitializer');
(async () => {
    console.log("RUNNING TEST!")
    await WikiInitializer.runTest();
})();