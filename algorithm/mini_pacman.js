const fs = require('fs');
var assert = require('assert');
var abs = Math.abs;

var mini_pacman = {};
exports = module.exports = mini_pacman;

var ACTIONS = ["UP", "RIGHT", "DOWN", "LEFT", "STAY"];
var ACTION_EFFECTS = {
		"UP": [-1,0],
		"RIGHT": [0,1],
		"DOWN": [1,0],
		"LEFT": [0,-1],
		"STAY": [0,0]
};

MOVE_REWARD = -0.1;
WIN_REWARD = 10.0;
LOSE_REWARD = -10.0;

// Choice function, similar to the one in python
function choice(array) {
	return array[Math.round(Math.random() * 100) % array.length];
};

// Functions to serialize / deserialize game states
function __serialize_state(state) {
	result = "";
	function row_iter(row) {
		function col_iter(col) {
			result += col;
		};
		row.forEach(col_iter);
		result += "\n";
	};
	state.forEach(row_iter);
	return result.trim();
}

function __deserialize_state(str_state) {
	var state = [];
	str_state.split("\n").forEach(function(row) {
		state.push(row.split(""));
	});
	return state;
}

// Return the initial state of the game
function get_initial_state(map_file_path) {
	return fs.readFileSync('algorithm/' + map_file_path, 'utf8');
};

// Return the available actions in a given state
function get_legal_actions(str_state) {
		return ACTIONS;
};

// Get the coordinates of an actor
function __get_position(state, marker) {
	position = [-1, -1];
	for (var row_index = 0; row_index < state.length; row_index++)
		for (var col_index = 0; col_index < state[row_index].length; col_index++) {
			if (state[row_index][col_index] == marker) {
				position = [row_index, col_index];
				break;
			}
		}
	return position;
};
// Check if is a final state
function is_final_state(str_state, score) {
	//console.log(str_state);
	if (score < -20 || str_state.indexOf("G") == -1 || str_state.indexOf("o") == -1)
		return true;
	return false;
};

// Check if the given coordinates are valid (on map && not a wall)
function __is_valid_cell(state, row, col) {
	if (row >= 0 && row < state.length && col >= 0 && col < state[row].length && state[row][col] != "*")
		return true;
	return false;
};
// Move to next state
function apply_action(str_state, action) {
	assert.notEqual(-1, ACTIONS.indexOf(action));
	var message = "Greuceanu moved " + action;
	var state = __deserialize_state(str_state);
	var g_position = __get_position(state, "G");
	var g_row = g_position[0];
	var g_col = g_position[1];

	assert.equal(true, g_row >= 0 && g_col >= 0);						 // Greuceanu must be on the map

	var next_g_row = g_row + ACTION_EFFECTS[action][0];
	var next_g_col = g_col + ACTION_EFFECTS[action][1];

	if (!__is_valid_cell(state, next_g_row, next_g_col)) {
		next_g_row = g_row;
		next_g_col = g_col;
		message += " Not a valid cell there.";
	}
	state[g_row][g_col] = " ";
	if (state[next_g_row][next_g_col] == "B") {
			message += " Greuceanu stepped on the balaur.";
			return { state : __serialize_state(state), reward : LOSE_REWARD, msg : message };
	} else if (state[next_g_row][next_g_col] == "o") {
			state[next_g_row][next_g_col] = "G";
			message += " Greuceanu found 'marul fermecat'."
			return { state : __serialize_state(state), reward : WIN_REWARD, msg : message };
	}
	state[next_g_row][next_g_col] = "G";

	// Balaur moves now
	var b_position = __get_position(state, "B");
	var b_row = b_position[0];
	var b_col = b_position[1];

	assert.equal(true, b_row >= 0 && b_col >= 0);						 // Balaur must be on the map

	var dy = next_g_row - b_row, dx = next_g_col - b_col;

	is_good = function(dr, dc) { return __is_valid_cell(state, b_row + dr, b_col + dc); };

	var next_b_row = b_row, next_b_col = b_col;

	if (abs(dy) > abs(dx) && is_good(Math.round(dy / abs(dy)), 0)) {
			next_b_row = b_row + Math.round(dy / abs(dy));
	} else if (abs(dx) > abs(dy) && is_good(0, Math.round(dx / abs(dx)))) {
			next_b_col = b_col + Math.round(dx / abs(dx));
	} else {
		var options = [];
		if (abs(dx) > 0) {
			if (is_good(0, Math.round(dx / abs(dx))))
					options.push([b_row, b_col + Math.round(dx / abs(dx))]);
		} else {
			if (is_good(0, -1))
					options.push([b_row, b_col - 1]);
			if (is_good(0, 1))
					options.push([b_row, b_col + 1]);
		}
		if (abs(dy) > 0) {
			if (is_good(Math.round(dy / abs(dy)), 0))
				options.push([b_row + Math.round(dy / abs(dy)), b_col]);
		} else {
			if (is_good(-1, 0))
					options.push([b_row - 1, b_col]);
			if (is_good(1, 0))
					options.push([b_row + 1, b_col]);
		}
		if (options.length > 0) {
			var aux = choice(options);
			next_b_row = aux[0];
			next_b_col = aux[1];
		}
	}

	if (state[next_b_row][next_b_col] == "G") {
			message += " The balaur ate Greuceanu.";
			reward = LOSE_REWARD;
	} else if (state[next_b_row][next_b_col] == "o") {
			message += " The balaur found marul fermecat. Greuceanu lost!";
			reward = LOSE_REWARD;
	} else {
		message += " The balaur follows Greuceanu.";
		reward = MOVE_REWARD;
	}

	state[b_row][b_col] = " ";
	state[next_b_row][next_b_col] = "B";

	return { state : __serialize_state(state), reward : reward, msg : message };
};

function display_state(state) {
	console.log(state);
}

exports.get_initial_state = get_initial_state;	// get initial state from file
exports.get_legal_actions = get_legal_actions;	// get the legal actions in a state
exports.is_final_state		= is_final_state;		 // check if a state is terminal
exports.apply_action			= apply_action;			 // apply an action in a given state
exports.display_state		 = display_state;			// display the current state
