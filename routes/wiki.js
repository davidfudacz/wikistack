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
      content: req.body.pageContent,
      tagString: req.body.pageTags,
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
   
  // Page.findOne({where: {urlTitle: req.params.urlTitle}})
  //   .then(result => 
  //     result.getAuthor().then(authorResult => 
  //     res.render('wikipage',{ page:result, author:authorResult})))    
  //   .catch(next);
  
  Page.findOne({
      where: {
          urlTitle: req.params.urlTitle
      },
      include: [
          {model: User, as: 'author'}
      ]
  })
  .then(function (page) {
      // page instance will have a .author property
      // as a filled in user object ({ name, email })
      if (page === null) {
          res.status(404).send();
      } else {
          res.render('wikipage', {
              tags: page.tags.join(','),
              page: page
          });
      }
  })
  .catch(next);    
    
});

module.exports = router;