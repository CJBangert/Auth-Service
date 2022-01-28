const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

exports.connect = () => {
  mongoose
    .connect(MONGO_URI, {
    })
    .then(() => {
      console.log("MongoDB connection successful");
    })
    .catch((error) => {
      console.log("MongoDB connection failed. exiting...");
      console.error(error);
      process.exit(1);
    });
};