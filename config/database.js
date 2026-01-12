const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB Connection successful");
    } catch (err) {
        console.error("Issue with DB: ");
        console.error(err);
        process.exit(1);
    }
};
