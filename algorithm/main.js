var q_learning = require('./q_learning');

var args = {};
// Default values for args. Change them as you will to test stuff out.
args.map_file = "maps/" + "mini_map";
args.learning_rate = 1;
args.discount = 0.99;
args.epsilon = 0.4;
args.train_episodes = 1000;
args.eval_every = 10;
args.eval_episodes = 10;

args.verbose = false;
args.plot = false;
args.sleep = 80;
args.final_show = true;

result = q_learning(args);
