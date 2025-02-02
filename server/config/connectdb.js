const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connnectTOMongo = function () {
  try {
    const connection = mongoose.connect(process.env.MONGO_URI);
    console.log("connected to mongodb");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connnectTOMongo;
