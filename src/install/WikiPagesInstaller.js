const dotenv = require('dotenv').config({
    path: "./pw.env"
});
const WikiInitializer = require('../service/Wiki/WikiInitializer');
(async () => {
    console.log("Running the Wiki Pages Installer...")
    await WikiInitializer.runInstaller();
})();