const express = require('express');
const router = express.Router();

const Ingredient = require('../models/ingredient-model');
const User = require('../models/user');

const { isLoggedIn } = require('../helpers/middlewares');

router.get('/list', (req, res, next) => {
  if (req.session.currentUser) {
    res.json([{ 'ingredient': 'salt' }, { 'ingredient': 'pepper' }]);
  } else {
    res.status(404).json({
      error: 'unauthorized'
    });
  }
});

router.post('/', (req, res, next) => {
  // check if user is logged in
  if (!req.session.currentUser) {
    res.status(404).json({
      error: 'unauthorized'
    });
  }

  console.log(req.body);

  // create or update ingredient
  const ingredientName = req.body[0];
  Ingredient.findOneAndUpdate(
    { name: ingredientName },
    { $set: { name: ingredientName } },
    { upsert: true, new: true } /* new always returns a document */
  )
    .then((ingredient) => {
      // create or update user preference
      const newUserIngredient = { ingredient_id: ingredient._id, preference: 'avoid' };
      User.findOneAndUpdate(
        { _id: req.session.currentUser._id, 'ingredients.ingredient_id': ingredient._id },
        { $set: { 'ingredients.$.preference': 'favorite' } }, /* $ stores the id of the found object to make it change only that one */
        { new: true }
      )
        .then((user) => {
          console.log(user);
          if (!user) {
            User.findById(req.session.currentUser._id)
              .then((user) => {
                user.ingredients.push(newUserIngredient);
                user.save();
              });
          }
        });
    })
    .catch(next);
});

module.exports = router;
