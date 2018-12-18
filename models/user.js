const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
  username: String,
  password: String,
  ingredients: [{
    type: ObjectId,
    ref: 'Ingredient',
    preference: { enum: ['favorite', 'avoid'] }
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
