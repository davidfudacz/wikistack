const wikiRouter = require('./wiki');
const userRouter = require('./user');
const express = require('express');
const router = express.Router();

router.use('/wiki', wikiRouter);
router.use('/user', userRouter);

console.log("line 9 routes/index");

router.get('/',function (req,res,next) {
	console.log("line 12 routes/index");
  	res.render('index', {title:'Wikistack'});
})

console.log("line 13 routes/index");

module.exports = router;


