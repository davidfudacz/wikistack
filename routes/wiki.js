const express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page; 
const User = models.User; 

router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.get('/search', function(req, res, next) {
  let searchTerm = req.query.searchTerm;
  let lists = searchTerm.split(' ');
    Page.findAll({
      // $overlap matches a set of possibilities
      where : {
          tags: {
              $overlap: lists,
          }
      }    
  })
  .then(function (result) {
    res.render('search', {
      pages: result,
    })
  })
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
      tags: req.body.pageTags.split(','),
    });

    // page.tagInput(req.body.pageTags);

    return page.save().then(function (page) {
      return page.setAuthor(user);
    });
  
  })
  .then(function (page) {
    res.redirect(page.route);
  })
  .catch(next);


});

router.get('/:wikiUrl/similar', function(req, res) {
  let wikiUrl = req.params.wikiUrl;
  Page.findOne({
    where: {
      urlTitle: wikiUrl,
    },
  })
  .then(function (result) {
    let similarTags = result.tags
    
    Page.findAll({
      // $overlap matches a set of possibilities
      where : {
          tags: {
              $overlap: similarTags,
          }
      }    
  })
  .then(function (result) {
    res.render('index', {
      pages: result,
    })
  })
})


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