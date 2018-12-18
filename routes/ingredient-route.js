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
  if (!req.session.currentUser) {
    res.status(404).json({
      error: 'unauthorized'
    });
  }

  console.log(req.body);
  const ingredientName = req.body[0];
  let ingredientId = Ingredient.findOne({ name: ingredientName })
    .then((ingredient) => {
      if (!ingredient) {
        const newIngredient = Ingredient({
          name: ingredientName
        });

        newIngredient.save({ name: ingredientName })
          .then();
      }
      return ingredient._id;
    })
    .catch(next);

  User.findById(req.session.currentUser)
    .then((user) => {
      user.ingredients.forEach((ingredient) => {
        if (ingredient.name === ingredientName) {
          return res.json(ingredient);
        }

        user.ingredients.push({ _id: 'ingredientId', preference: 'avoid' });
        user.save();
      });
    })
    .catch();
});

module.exports = router;
