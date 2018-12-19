const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
  username: String,
  password: String,
  ingredients: [{
    ingredient_id: {
      type: ObjectId,
      ref: 'Ingredient'
    },
    preference: {
      type: String,
      enum: ['favorite', 'avoid']
    }
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
