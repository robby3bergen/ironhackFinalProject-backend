const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
  name: String
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;
