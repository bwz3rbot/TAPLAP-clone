const dotenv = require('dotenv').config({
    path: "./pw.env"
});
const mongo = require('../config/mongo');
mongo.connect();

const WikiInitializer = require('../service/Wiki/WikiInitializer');
const fullRefreshFlag = JSON.parse(process.argv[2] || false);
mongo.db.once('open', async () => {
    console.log("successfully connected to mongodb".green);
    console.log("Running the Wiki Pages Revitalizer... flag set to: ", fullRefreshFlag);

    await WikiInitializer.runRevitalizer(fullRefreshFlag);
    console.log("All done!");
    process.exit();
});