# ML assignment 1 - Q_learning
Template for Machine Learning assignment 1.

It is implemented in javascript running on Node.js.
It offers 2 interfaces:
- web based, powered by express.js. Able to display the graph;
- console based, powered by a small script. Able to display verbose content and the final solution test.

From a functional point of view, the template replicates the python code we used in our 5th lab,
and it implements the Q learning algorithm with epsilon-greedy.

All the relevant files for the assignment are in the 'algorithm/' folder.

In order to complete this homework you will need to change 
the mini_pacman.js file in order to reflect the given requirements.

More precisely, you will need to come up with your own version of the following functions:
```
get_initial_state;  // get initial state of the env
get_legal_actions;  // get the legal actions in a state (for our deer)
is_final_state;     // check if a state is terminal
apply_action;       // apply an action in a given state (this is where the heavy lifting will be done)
display_state;      // display the current state (for pretty printing in the console)
```

All of this can be accomplished without changing the functions signature & return values.

Bear in mind that the state, action, reward tuples are stored in a JSON object of JSON objects.
At the first level we have as keys all the states (in serialised form) that where reached up until that moment.
At the second level we have as keys all the possible actions from that state.
The entry thus identified represents the reward for that particular state and action pair.
Choose a simple way to represents your states, so that they can easily be serialised and de-serialised.

# Requirements
- Node.js v5.91 Stable https://nodejs.org/en/

# Installation
- Install Node.js
- ```git clone https://github.com/constantinneagu/q_learning.git```
- ```npm install``` (for dependencies installation)

# Usage
For console mode, go to the 'algorithm/' folder, open main.js, adjust the options to your taste, and type ```node main.js```.

For web mode, use: ```DEBUG=q_learning:* npm start``` (for Linux & OSX) or ```set DEBUG=myapp:* & npm start``` (for Windows) and navigate (in your browser) to ```http://localhost:8080/```
