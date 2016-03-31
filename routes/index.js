var express = require('express');
var assert = require('assert');
var router = express.Router();
var q_learning = require('../algorithm/q_learning');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

// Standard express router implementation. Nothing fancy.
router.post('/do_the_q_learning', function(req, res) {

	var args = {};
	args.map_file = "maps/" + req.body.map_file;
	args.learning_rate = req.body.learning_rate;
	args.discount = req.body.discount;
	args.epsilon = req.body.epsilon;
	args.train_episodes = req.body.train_episodes;
	args.eval_every = req.body.eval_every;
	args.eval_episodes = req.body.eval_episodes;

	args.verbose = false;
	args.plot = false;
	args.sleep = 80;
	args.final_show = true;

	result = q_learning(args);
	res.json(result);
});

module.exports = router;
