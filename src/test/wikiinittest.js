const dotenv = require('dotenv').config({
    path: "./pw.env"
});
console.log("Requiring the Wiki-Initializer")
const WikiInitializer = require('../service/Wiki/WikiInitializer');
WikiInitializer.initWikiPages();