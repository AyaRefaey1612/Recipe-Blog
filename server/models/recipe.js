const mongoose = require("mongoose");
const schema = mongoose.Schema;
const recipeSchema = new schema({
  name: {
    type: String,
    required: "this field is required",
  },
  image: {
    type: String,
    required: "this field is required",
  },
  publicId: {
    type: String,
  },
  description: {
    type: String,
    required: "this field is required",
  },
  ingredients: {
    type: [mongoose.Schema.Types.Mixed], // Allows mixed types (strings and numbers)
    required: "this field is required",
  },
  categoryName: {
    type: String,
    required: "this field is required",
  },
  email: {
    type: String,
    required: "this field is required",
  },
});

const recipe = mongoose.model("Recipe", recipeSchema);

module.exports = recipe;
