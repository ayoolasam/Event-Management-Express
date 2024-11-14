const mongoose = require("mongoose");

const DB = process.env.MONGO_DB;

const databaseConnection = () => {
  mongoose.connect(DB).then(() => {
    console.log("Database Connected Successfully");
  });
};
module.exports = databaseConnection;
