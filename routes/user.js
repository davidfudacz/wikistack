const express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page; 
const User = models.User; 


router.get('/', function (req,res,next) {
  User.findAll()
    .then(users => res.render('users',{users:users}))
    .catch(next);
});


router.get('/:userId', function (req,res,next) {
  const userPromise = User.findById(req.params.userId);
  const pagesPromise = Page.findAll({
    where:{
      authorId: req.params.userId
    }
  });
  Promise.all([
    userPromise,
    pagesPromise
  ])
    .then(function(values) {
        const user = values[0];
        const pages = values[1];
        res.render('user', {user:user, pages:pages});
    }) 
    .catch(next);
})

module.exports = router;
