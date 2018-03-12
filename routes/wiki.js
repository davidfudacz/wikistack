const express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page; 
const User = models.User; 

router.get('/', function(req, res, next) {
  res.redirect('/');
});


router.post('/', function(req, res, next) {
  User.findOrCreate({
    where: {
      name: req.body.authorName,
      email: req.body.authorEmail
    }
  })
  .then(function (values) {
  
    var user = values[0];
  
    var page = Page.build({
      title: req.body.title,
      content: req.body.pageContent
    });
  
    return page.save().then(function (page) {
      return page.setAuthor(user);
    });
  
  })
  .then(function (page) {
    res.redirect(page.route);
  })
  .catch(next);


});

router.get('/add', function(req, res) {
  res.render('addpage');
});





router.get('/:urlTitle', function (req, res, next) {
  Page.findOne({where: {urlTitle: req.params.urlTitle}})
    .then(result => res.render('wikipage',{page:result}))
    .catch(next);
    
});

module.exports = router;