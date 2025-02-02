const mongoose = require("mongoose");
const schema = mongoose.Schema;
const categriesSchema = new schema({
  name: {
    type: String,
    required: "this field is required",
  },
  image: {
    type: String,
    required: "this field is required",
  },
});

const category = mongoose.model("Category", categriesSchema);
module.exports = category;
