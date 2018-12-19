const express = require('express');
const router = express.Router();

const Ingredient = require('../models/ingredient-model');
const User = require('../models/user');

const { isLoggedIn } = require('../helpers/middlewares');

// ========= Router: gets the user preferences for the ingredients
router.post('/list', (req, res, next) => {
  if (req.session.currentUser) {
    // find any ingredient inside the array of ingredient objects
    const { ingredients } = req.body;
    Ingredient.find({ name: ingredients })
      .then((ingredientsInDB) => {
        console.log('ingredientsInDB: ' + ingredientsInDB);
        // find user preference for ingredient
        User.findOne({ _id: req.session.currentUser._id })
          .populate('ingredients.ingredient_id')
          .then((user) => {
            console.log('user: ' + user);
            res.json(user);
          });
        // res.json(user[0].ingredients);
      })
      .catch(next);
  } else {
    res.status(404).json({
      error: 'unauthorized'
    });
  }
});

// ========== Router: saves ingredients and user preferences
router.post('/', (req, res, next) => {
  // check if user is logged in
  if (!req.session.currentUser) {
    res.status(404).json({
      error: 'unauthorized'
    });
  }

  // create or update ingredient
  const { ingredientName, userPreference } = req.body;
  Ingredient.findOneAndUpdate(
    { name: ingredientName },
    { $set: { name: ingredientName } },
    { upsert: true, new: true } /* new always returns a document */
  )
    .then((ingredient) => {
      // create or update user preference
      const newUserIngredient = { ingredient_id: ingredient._id, preference: userPreference };
      User.findOneAndUpdate(
        { _id: req.session.currentUser._id, 'ingredients.ingredient_id': ingredient._id },
        { $set: { 'ingredients.$.preference': 'favorite' } }, /* $ stores the id of the found object to make it change only that one */
        { new: true }
      )
        .then((user) => {
          if (!user) {
            User.findById(req.session.currentUser._id)
              .then((user) => {
                user.ingredients.push(newUserIngredient);
                user.save();
              });
          }
        });
      res.json('ingredients and user preferences saved');
    })
    .catch(next);
});

module.exports = router;
