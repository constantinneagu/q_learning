var assert = require('assert');
var mini_pacman = require('./mini_pacman');
var get_initial_state = mini_pacman.get_initial_state;	// get initial state from file
var get_legal_actions = mini_pacman.get_legal_actions;	// get the legal actions in a state
var is_final_state		= mini_pacman.is_final_state;		 // check if a state is terminal
var apply_action			= mini_pacman.apply_action;			 // apply an action in a given state
var display_state		 = mini_pacman.display_state;			// display the current state

function choice(array) {
	return array[Math.round(Math.random() * 100) % array.length];
};

function epsilon_greedy(Q, state, legal_actions, epsilon) {
	var prob = Math.random();
	if (prob < epsilon)
		return choice(legal_actions);
	else
		return best_action(Q, state, legal_actions);
};

function best_action(Q, state, legal_actions) {
	var result = "",
			best_value = Number.NEGATIVE_INFINITY;

	function find_best_action(action) {
		if (Q[state] == null)
			Q[state] = {};
		if (Q[state][action] == null)
			Q[state][action] = 0;
		if (Q[state][action] >= best_value) {
			best_value = Q[state][action];
			result = action;
		}
	};
	legal_actions.forEach(find_best_action);
	return result;
};

function q_learning(args) {
	var Q = {},
	train_scores = [],
	eval_scores = [];

	// for each episode ...
	for (var train_ep = 1; train_ep <= args.train_episodes; train_ep++) {
		// ... get the initial state,
		var score = 0,
		state = get_initial_state(args.map_file)
		// display current state and sleep
		if (args.verbose) {
				display_state(state);
				// there should be a sleep(args.sleep) here
		}
		// while current state is not terminal
		while (!is_final_state(state, score)) {
			// choose one of the legal actions
			var actions = get_legal_actions(state);
			var action = epsilon_greedy(Q, state, actions, args.epsilon);
			// Init accordingly.
			if (Q[state] == null)
				Q[state] = {};
			if (Q[state][action] == null)
				Q[state][action] = 0;
			/* apply action and get the next state and the reward
				new_state has 3 members:
				- state (the actual new state);
				- reward;
				- message (optional, looks pretty). */
			var new_state = apply_action(state, action);
			score += new_state.reward;
			// Get the best known action that we can do from the new state.
			var b_action = best_action(Q, new_state.state, get_legal_actions(new_state.state));
			// Q-Learning formula
			Q[state][action] = Q[state][action] +
													args.learning_rate * (new_state.reward +
																								args.discount * Q[new_state.state][b_action] -
																								Q[state][action]);
			state = new_state.state;
			// display current state
			if (args.verbose) {
					console.log(new_state.msg);
					display_state(state);
			}
		}

		console.log("Episode " + train_ep + " / " + args.train_episodes);
		// Keep track of those scores
		train_scores.push(score);
		// Evaluate. Please don't make eval_every smaller that eval_episodes. Bad things will happen.
		if ((train_ep % args.eval_every) == 0) {
				var avg_score = 0.0,
				sum_tmp = 0.0;

				for (var index = train_ep - args.eval_episodes; index < train_ep; index++) {
					sum_tmp += train_scores[index];
				}
				avg_score = sum_tmp / args.eval_episodes;
				eval_scores.push(avg_score);
		}
	}

	// Final solution demonstration. Like an exam if you will. Prints only to console.
	if (args.final_show) {
		var score = 0,
		state = get_initial_state(args.map_file),
		interval = setInterval(function() {
			if(!is_final_state(state, score)) {
				var action = best_action(Q, state, get_legal_actions(state));
				var new_state = apply_action(state, action);
				state = new_state.state;
				score += new_state.reward;
				console.log(new_state.msg);
				display_state(state);
			} else
				clearInterval(interval);
		}, args.sleep);
	}

	return { Q: Q, train_scores : train_scores, eval_scores : eval_scores }
};

exports = module.exports = q_learning;
