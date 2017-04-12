var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.put('/board', function(req, res, next) {
	var x,y;

	if(req.body.round == 1){
		x = 7;
		y = 7;
	}else if(req.body.round == 2){
		x = 7;
		y = 5;
	}else{
		x = Math.floor((Math.random() * 18) + 0)
		y = Math.floor((Math.random() * 18) + 0)
	}
	var json = {
		"x": x,
		"y": y
	}

	res.json(json);
});

module.exports = router;
