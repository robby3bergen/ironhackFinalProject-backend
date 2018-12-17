const express = require('express');
const router = express.Router();

const Ingredient = require('../models/ingredient-model');

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

module.exports = router;
