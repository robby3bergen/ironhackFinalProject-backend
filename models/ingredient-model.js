const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Ingredient name is required'],
    unique: true
  }
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;
