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
  User.findById(req.params.userId)
  Page.find({where:{id:req.params.userId}})
    .then(users => res.render('users',{users:users}))
    .catch(next);
})

module.exports = router;
