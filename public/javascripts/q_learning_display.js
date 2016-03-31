
// Lots of options for a simple spinner.
// Spinner courtesy of spin.js (http://fgnass.github.io/spin.js/)
var spinner_opts = {
	lines: 13 // The number of lines to draw
, length: 11 // The length of each line
, width: 14 // The line thickness
, radius: 42 // The radius of the inner circle
, scale: 1 // Scales overall size of the spinner
, corners: 1 // Corner roundness (0..1)
, color: '#000' // #rgb or #rrggbb or array of colors
, opacity: 0.25 // Opacity of the lines
, rotate: 0 // The rotation offset
, direction: 1 // 1: clockwise, -1: counterclockwise
, speed: 1 // Rounds per second
, trail: 60 // Afterglow percentage
, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
, zIndex: 2e9 // The z-index (defaults to 2000000000)
, className: 'spinner' // The CSS class to assign to the spinner
, top: '50%' // Top position relative to parent
, left: '50%' // Left position relative to parent
, shadow: false // Whether to render a shadow
, hwaccel: false // Whether to use hardware acceleration
, position: 'absolute' // Element positioning
};

var options = {};
var default_options = { "map_file":"mini_map",
												"learning_rate":"0.01",
												"discount":"0.99",
												"epsilon":"0.4",
												"train_episodes":"1000",
												"eval_every":"10",
												"eval_episodes":"10"
											};

// Test submition routine. AJAX powered.
function submit_test(event) {
	event.preventDefault();
  var options_form_data = new FormData(document.querySelector("#options"));
  var game_board = document.querySelector("#gameboard");
  game_board.innerHTML = "";
	var spinner = new Spinner(spinner_opts).spin(document.body);

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			spinner.stop();
			var Q = JSON.parse(xhttp.responseText);
			console.log(Q);
			populate_graph(Q.eval_scores);
		} else if (xhttp.readyState == 4 && Math.round(xhttp.status/100) >= 4 ) {
				spinner.stop();
				console.log(xhttp.statusText);
        game_board.innerHTML = xhttp.statusText + "<br></br>" + xhttp.responseText;
		}
	};

	for(var pair of options_form_data.entries()) {
		options[pair[0]] = pair[1];
	}
	xhttp.open("post", "/do_the_q_learning", true);
	xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8")
	xhttp.send(JSON.stringify(options));
}

// The data plot comes courtesy of dygraphs. If you have a better library, please advise.
function populate_graph(data) {
	display_data = [];
	data.forEach(function (point, index) {
		display_data[index] = [index * options.eval_every, point];
	})
	g = new Dygraph(document.getElementById("graph"),
								// For possible data formats, see http://dygraphs.com/data.html
								// The x-values could also be dates, e.g. "2012/03/15"
								display_data,
								{
										// options go here. See http://dygraphs.com/options.html
										legend: 'always',
										animatedZooms: true,
										title: 'Greuceanu vs. The Balaur plot',
										labels: ["Episode", "Score"],
										xlabel: "Episode",
										ylabel: "Score"
								 });
}

// Load defaults in case you get lost.
function load_defaults(event) {
	event.preventDefault()
	Object.keys(default_options).forEach(function(option_key){
		var option_field = document.querySelector("#" + option_key);
		option_field.value = default_options[option_key];
	});
}

// The name says it all.
function init() {
	var submit_test_button = document.querySelector("#submit");
	var load_defaults_button = document.querySelector("#reload");
	submit_test_button.addEventListener("click", submit_test);
	load_defaults_button.addEventListener("click", load_defaults);
}
