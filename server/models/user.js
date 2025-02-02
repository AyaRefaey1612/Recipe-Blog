const mongoose = require("mongoose");
const schema = mongoose.Schema;
const userSchema = new schema({
  name: {
    type: String,
    required: "this field is required",
  },
  email: {
    type: String,
    required: "this field is required",
  },
  pass: {
    type: String,
    required: "this field is required",
    minLength: 8,
  },
});

const user = mongoose.model("User", userSchema);
module.exports = user;
