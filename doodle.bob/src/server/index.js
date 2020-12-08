const path = require('path');
const Commands = require('../commands');
const express = require('express');
const commands = require('../commands');
const app = express();

// Need this so that it works on localhost. *Remove it when pushing to heroku*.
const options = {
	cors: {
		origin: "http://localhost:3000",
		credentials: true
	}
}
const server = require('http').createServer(app);
const io = require('socket.io')(server, options);
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, '../../build')));

// Path to index file such that heroku can find it.
app.get('/', (req, res, next) => res.sendFile(__dirname + './index.html'));

/**
 * Contains all open rooms.
 * 
 * Stored as a (key, value) pair (room_code, data)
 * 
 * - Data contains a users object which contains all the users currently in the room.
 * - Host property that is equal to the user_id of the host.
 */
const OPEN_ROOMS = {};

/**
 * Contains all users.
 * 
 * Stored as a (key, value) pair (user_id, data).
 * 
 * - Data contains room_code of the user if they are assigned to some room.
 * - Their username
 */
const CONNECTED_USERS = {};
// let ARTIST_POOL = [];
// let timer_id;

function stop_timer(timer_id) {
	clearInterval(timer_id);
}

function timer_tick(io, room_code) {
	// console.log(`Current value of timer: ${OPEN_ROOMS[room_code].game_info.current_time}`);

	let current_room_game_info = OPEN_ROOMS[room_code].game_info;
	let timer_id = OPEN_ROOMS[room_code].game_info.timer_id;
	var current_artist_id = current_room_game_info.current_artist_id
	var currentRoundIndex = current_room_game_info.current_round - 1
	var currentSubroundIndex = current_room_game_info.current_subround - 1

	io.in(room_code).emit(Commands.RECEIVE_CLOCK_INFO, current_room_game_info.current_time);
	//This is to pass to playpage
	console.log(current_room_game_info.current_word)
	io.in(room_code).emit(Commands.CLOCK_PLAYPAGE, current_room_game_info);
	current_room_game_info.current_time -= 1;

	console.log(`Timer value: ${current_room_game_info.current_time}`);

	if (current_room_game_info.current_time < 0) {
		console.log('clear interval');
		clearInterval(timer_id);
		current_room_game_info.current_time = current_room_game_info.time_per_round;
		// TODO: Emit to indicate that round has ended
		chooseArtist(room_code);
		//io.in(room_code).emit(Commands.BEGIN_ROUND, OPEN_ROOMS[room_code]);
		OPEN_ROOMS[room_code].users[current_artist_id].points_history[currentRoundIndex][currentSubroundIndex] = calculateArtistScore(room_code)
		endOfRoundScore(room_code)
		io.in(room_code).emit(Commands.END_ROUND, OPEN_ROOMS[room_code])
		io.in(room_code).emit(Commands.SEND_SCOREBOARD_INFO, {
			room_info: OPEN_ROOMS[room_code],
			room_code: room_code
		})
	}
}

function calculateNonArtistScore(room_code, current_time, id) {
	var finalScore = 0
	var BASE = 100
	// SCALE_NUM_PLAYERS = 15
	var CORRECT_GUESS_SCORE = 5
	var TIME_BONUS = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.001]
	var hit_bonus = false
	var numPlayers = Object.keys(OPEN_ROOMS[room_code].users).length
	var totalTime = OPEN_ROOMS[room_code].game_info.time_per_round
	var currentRoundIndex = OPEN_ROOMS[room_code].game_info.current_round - 1
	var currentSubroundIndex = OPEN_ROOMS[room_code].game_info.current_subround - 1
	var allUsersDone = true

	for (var time of TIME_BONUS) {
		if (!hit_bonus) {
			if (current_time >= time * totalTime) {
				hit_bonus = true
				finalScore = BASE * time + CORRECT_GUESS_SCORE
			}
		}
	}
	for (var user of Object.keys(OPEN_ROOMS[room_code].users)) {
		if (OPEN_ROOMS[room_code].users[user].points_history[currentRoundIndex][currentSubroundIndex] == 0) {
			if (user != id && user != (OPEN_ROOMS[room_code].game_info.current_artist_id)) {
				allUsersDone = false
				break
			}
		}
	}
	if (allUsersDone) OPEN_ROOMS[room_code].game_info.current_time = 1
	return finalScore

}

function calculateArtistScore(room_code) {
	var currentRoundIndex = OPEN_ROOMS[room_code].game_info.current_round - 1
	var currentSubroundIndex = OPEN_ROOMS[room_code].game_info.current_subround - 1

	var finalScore = 0
	var BASE = 50
	var all_guessers = Object.keys(OPEN_ROOMS[room_code].users).length - 1
	var guess_value = BASE / all_guessers
	for (var user of Object.keys(OPEN_ROOMS[room_code].users)) {
		console.log(user, OPEN_ROOMS[room_code].users[user])
		if (OPEN_ROOMS[room_code].users[user].points_history[currentRoundIndex][currentSubroundIndex] != 0) {
			finalScore += guess_value
		}
	}
	return finalScore
}

function endOfRoundScore(room_code) {
	for (var user of Object.keys(OPEN_ROOMS[room_code].users)) {
		var runningTotal = 0
		for (var round of OPEN_ROOMS[room_code].users[user].points_history) {
			for (var subround of round) {
				console.log("subround val", subround)
				runningTotal += subround
			}
		}
		console.log("running total", runningTotal)
		OPEN_ROOMS[room_code].users[user].points = runningTotal
	}
}


//functions that will allow us to pick the artist, gets called once from wordBank (in Commands.PICK_WORDS) and then each subround after
function resetArtistPool(room_code) {
	var ARTIST_POOL = OPEN_ROOMS[room_code].game_info.artist_pool
	console.log("yo", ARTIST_POOL)
	if (ARTIST_POOL.length === 0) {
		for (var user of Object.keys(OPEN_ROOMS[room_code].users)) {
			ARTIST_POOL.push(user)
			OPEN_ROOMS[room_code].users[user].is_artist = false
		}
	}
	else {
		console.log("why would you call this function if artist pool is not empty, you absolute fool!")
	}
}
function chooseArtist(room_code) {
	var ARTIST_POOL = OPEN_ROOMS[room_code].game_info.artist_pool
	if (ARTIST_POOL.length == 0) {
		resetArtistPool(room_code)
	}

	var currentRoundIndex = OPEN_ROOMS[room_code].game_info.current_round - 1
	var currentSubroundIndex = OPEN_ROOMS[room_code].game_info.current_subround - 1

	if (OPEN_ROOMS[room_code].game_info.artist_history[currentRoundIndex][currentSubroundIndex] === '') {
		var randomlyChosen = Math.floor(Math.random() * ARTIST_POOL.length)
		var chosenArtist = ARTIST_POOL[randomlyChosen]
		ARTIST_POOL.splice(randomlyChosen, 1)

		OPEN_ROOMS[room_code].game_info.current_artist_id = chosenArtist
		OPEN_ROOMS[room_code].game_info.artist_history[currentRoundIndex][currentSubroundIndex] = chosenArtist
		console.log(currentRoundIndex, currentSubroundIndex, chosenArtist)
		OPEN_ROOMS[room_code].users[chosenArtist].is_artist = true
		for (var user of Object.keys(OPEN_ROOMS[room_code].users)) {
			if (OPEN_ROOMS[room_code].game_info.current_artist_id !== user) {
				// console.log(OPEN_ROOMS[room_code].game_info.current_artist_id, user)
				OPEN_ROOMS[room_code].users[chosenArtist].is_artist = false
			}
		}
	}

}

io.on('connection', socket => {

	let new_user_id = socket.id;
	console.log(`New Connection! ID: ${new_user_id}`);

	CONNECTED_USERS[new_user_id] = {
		room_code: '',
		username: '',
		profile_picture: ''
	};

	socket.emit(Commands.UPDATE_ROOMS, OPEN_ROOMS);

	// console.log(CONNECTED_USERS); 

	/**
	 * This event gets fired when a user disconnects.
	 * 
	 * - Remove user from CONNECTED_USERS dictionary.
	 * - Remover user from the OPEN_ROOMS's user's dictionary.
	 * - Leave room.
	 */
	socket.on('disconnect', (data) => {
		let user_id = socket.id;
		let room_code = CONNECTED_USERS[user_id].room_code;

		if (room_code !== '') {
			delete OPEN_ROOMS[room_code].users[user_id];
		}

		io.in(room_code).emit(Commands.USER_LEFT, {
			user_id: user_id,
			username: CONNECTED_USERS[user_id].username
		});

		delete CONNECTED_USERS[user_id];
		socket.leave(room_code);
	})

	/**
	 * This event gets fired when a new room is created.
	 * 
	 * Param data contains:
	 * 	   - user_id of host.
	 *     - username of host.
	 *     - room_code of the room created by host. 
	 * 
	 * - Update the CONNECTED_USERS dictionary by setting the data (username, room_code).
	 * - Create a room using room_code in OPEN_ROOMS.
	 * - Assign a host to the newly created room. (Setting host: host's user_id)
	 * - Add the host to the users dictionary of the newly created room.
	 * - Join the room.
	 * - Emit the event that the host has joined the room.
	 */
	socket.on(Commands.START_GAME, (data) => {

		let host_id = data.user_id;
		let username = data.username;
		let room_code = data.room_code;
		let game_info = data.game_info;

		CONNECTED_USERS[host_id].room_code = room_code;
		CONNECTED_USERS[host_id].username = username;

		OPEN_ROOMS[room_code] = {
			host_id: host_id,
			users: {

			},
			game_info: {
				rounds: game_info.rounds, // total rounds
				time_per_round: game_info.time_per_round,
				current_time: game_info.time_per_round,
				word_categories: [],
				current_round: 1,
				current_subround: 1,
				current_artist_id: '',
				artist_history: [],
				artist_pool: [],
				current_word: '',
				game_started: false,
				timer_id: -1
			}

		};

		OPEN_ROOMS[room_code].users[host_id] = {
			username: username,
			host: true,
			points: 0,
			profile_picture: '',
			is_artist: false,
			points_history: [],
		};

		// console.log(OPEN_ROOMS[room_code].users);
		// console.log(OPEN_ROOMS[room_code].game_info);

		socket.join(room_code);
		socket.emit(Commands.UPDATE_USERS, CONNECTED_USERS);
		io.in(room_code).emit(Commands.JOINED_ROOM, {
			username: username,
			user_id: host_id
		});
		socket.broadcast.emit(Commands.UPDATE_ROOMS, OPEN_ROOMS);
	});

	socket.on(Commands.UPDATE_USER_INFO, data => {
		let username = data.username;
		let user_id = data.user_id;
		CONNECTED_USERS[user_id].username = username;
	});


	/**
	 * This event gets fired when a user joins an existing room. 
	 * 
	 * Param data contains:
	 *     - room_code of the room the user is trying to join.
	 *     - user_id of the user trying to join the room.
	 *     - username of the user trying to join the room.
	 * 
	 * - Update the CONNECTED_USERS dictionary by setting the data (username, room_code).
	 * - Check if the room that the user is trying to join exists.
	 * - If it does then update the users dictionary of that room by setting the data (username, host, points).
	 * - Then emit the UPDATED_USERS event signifying that a new user has joined the room.
	 */
	socket.on(Commands.JOIN_GAME, (data) => {
		let room_code = data.room_code;
		let user_id = data.user_id;
		let username = CONNECTED_USERS[user_id].username;
		let profile_picture = CONNECTED_USERS[user_id].profile_picture;

		CONNECTED_USERS[user_id].room_code = room_code;

		if (room_code in OPEN_ROOMS) {
			OPEN_ROOMS[room_code].users[user_id] = {
				username: username,
				host: false,
				points: 0,
				profile_picture: profile_picture
			};

			socket.join(room_code);

			socket.emit(Commands.UPDATE_USERS, CONNECTED_USERS);
			io.in(room_code).emit(Commands.JOINED_ROOM, {
				username: username,
				user_id: user_id,
				profile_picture: '',
			});
		}
	});

	socket.on(Commands.SEND_PICTURE, (data) => {

		let room_code = data.room_code;
		let user_id = data.user_id;
		let profile_picture = data.profile_picture

		CONNECTED_USERS[user_id].profile_picture = profile_picture

		io.in(room_code).emit(Commands.UPDATE_ROOMS_CLIENT, OPEN_ROOMS[room_code]);
	})

	socket.on(Commands.PICK_WORDS, (data) => {
		let room_code = data.room_code;
		let user_id = data.user_id;
		let word_categories = data.word_categories
		var ARTIST_POOL = OPEN_ROOMS[room_code].game_info.artist_pool

		OPEN_ROOMS[room_code].game_info.word_categories = word_categories
		OPEN_ROOMS[room_code].game_info.game_started = true

		io.emit(Commands.UPDATE_ROOMS, OPEN_ROOMS);

		io.in(room_code).emit(Commands.MOVE_ON, {});

		io.in(room_code).emit(Commands.UPDATE_ROOMS_CLIENT, OPEN_ROOMS[room_code]);
		//for scoreboard
		io.in(room_code).emit(Commands.SEND_SCOREBOARD_INFO, {
			room_info: OPEN_ROOMS[room_code],
			room_code: room_code
		})
		//for roundsUI
		io.in(room_code).emit(Commands.SEND_ROUND_INFO, {
			room_info: OPEN_ROOMS[room_code],
			room_code: room_code
		})
		//choose the artist
		//update artist_history to have correct amount of slots

		for (let i = 0; i < OPEN_ROOMS[room_code].game_info.rounds; i++) {
			let round_history = [];
			for (let user of Object.keys(OPEN_ROOMS[room_code].users)) {
				round_history.push('')
			}
			OPEN_ROOMS[room_code].game_info.artist_history.push(round_history)
		}
		for (let user of Object.keys(OPEN_ROOMS[room_code].users)) {
			let points_history = []
			for (let i = 0; i < OPEN_ROOMS[room_code].game_info.rounds; i++) {
				let round_history_points = [];
				for (let user of Object.keys(OPEN_ROOMS[room_code].users)) {
					round_history_points.push(0)
				}
				points_history.push(round_history_points)
			}
			OPEN_ROOMS[room_code].users[user].points_history = points_history
		}
		console.log(OPEN_ROOMS[room_code].users)
		if (ARTIST_POOL.length == 0) {
			resetArtistPool(data.room_code)
		}
		chooseArtist(data.room_code)
		//for Clock
		io.in(room_code).emit(Commands.SEND_CLOCK_INFO, {
			room_info: OPEN_ROOMS[room_code],
			room_code: room_code
		})
		//for artist choosing
		console.log('Sending artist info');
		io.in(room_code).emit(Commands.SEND_ARTIST_INFO, {
			room_info: OPEN_ROOMS[room_code],
			room_code: room_code
		});

		io.in(room_code).emit(Commands.BEGIN_ROUND, OPEN_ROOMS[room_code]);
	});

	socket.on(Commands.UPDATE_CATEGORIES, (data) => {
		let room_code = data.room_code
		OPEN_ROOMS[room_code].game_info.word_categories = data.selected_categories;

		socket.to(room_code).emit(Commands.UPDATE_CATEGORIES, data);
	});

	// gets called when "Start new round" button clicked in CLock.jsx
	socket.on(Commands.RECEIVE_CLOCK_INFO, (data) => {
		let room_code = data.room_code;
		let current_round = data.room_info.game_info.current_round;
		let current_subround = data.room_info.game_info.current_subround;
		let time_per_round = data.room_info.game_info.time_per_round;
		let game_info = OPEN_ROOMS[room_code].game_info;
		var ARTIST_POOL = OPEN_ROOMS[room_code].game_info.artist_pool
		OPEN_ROOMS[room_code].game_info.current_round = current_round;
		OPEN_ROOMS[room_code].game_info.current_subround = current_subround;
		if (ARTIST_POOL.length == 0) {
			resetArtistPool(data.room_code)
		}
		chooseArtist(data.room_code)
		// Reset the timer before starting the next round.
		game_info.current_time = game_info.time_per_round;
		console.log(OPEN_ROOMS[room_code].users)
		console.log(OPEN_ROOMS[room_code].game_info)
		//where we want to emit back to all users, everything except timer count down gets emitted to all users
		io.in(room_code).emit(Commands.SEND_CLOCK_INFO, {
			room_info: OPEN_ROOMS[room_code],
			room_code: room_code
		})
		//for artist choosing
		io.in(room_code).emit(Commands.SEND_ARTIST_INFO, {
			room_info: OPEN_ROOMS[room_code],
			room_code: room_code
		})
		// io.in(room_code).emit(Commands.SEND_ROUND_INFO, {
		// 	room_info: data.room_info,
		// 	room_code: data.room_code
		// })

		io.in(room_code).emit(Commands.BEGIN_ROUND, OPEN_ROOMS[room_code]);

		//victoria
		io.in(room_code).emit(Commands.SKETCH_RESET, OPEN_ROOMS[room_code]);
	});

	// This event gets emitted when tthe artist starts the game.
	socket.on(Commands.START_TIMER, (data) => {
		let room_code = data.room_code;
		let game_info = OPEN_ROOMS[room_code].game_info;
		// Reset the timer before starting the next round.
		game_info.current_time = game_info.time_per_round;
		console.log(`Starting the timer`);
		timer_id = setInterval(() => {
			timer_tick(io, room_code);
		}, 1000);
	});

	// Sending strokes to all non-artist players
	socket.on(Commands.SEND_STROKES, (data) => {
		let room_code = data.room_code;
		let x = data.x;
		let y = data.y;
		let stroke_weight = data.stroke_weight;
		let stroke_color = data.stroke_color;

		socket.broadcast.to(room_code).emit(Commands.SEND_STROKES, { x, y, stroke_weight, stroke_color });
		// console.log("Sending strokes");
	})

	// Setting end points for next stroke to be sent to non-artist players
	socket.on(Commands.DONE_DRAWING, (data) => {
		let room_code = data.room_code;
		let x = data.x;
		let y = data.y;

		socket.broadcast.to(room_code).emit(Commands.DONE_DRAWING, { x, y });
		// console.log("Finished drawing");
	})

	// Reset Sketch
	socket.on(Commands.SKETCH_RESET, (data) => {
		let room_code = data.room_code;

		socket.broadcast.to(room_code).emit(Commands.SKETCH_RESET, {});
	})

	// Undo Stroke
	socket.on(Commands.UNDO_STROKE, (data) => {
		let room_code = data.room_code;

		socket.broadcast.to(room_code).emit(Commands.UNDO_STROKE, data);
	})

	socket.on(Commands.PUSH_STROKE, (data) => {
		let room_code = data.room_code;

		socket.broadcast.to(room_code).emit(Commands.PUSH_STROKE, data);
	})

	/**
	 * This event gets fired when a user sends a message in a room.
	 * 
	 * Emit the RECEIVE_MESSAGE event in the room in which the message was sent.
	 */
	socket.on(Commands.SEND_MESSAGE, (data) => {
		let room_code = data.room_code;

		io.in(room_code).emit(Commands.RECEIVE_MESSAGE, data);
	});

	socket.on(Commands.GET_USER_INFO, (room_code) => {
		io.in(room_code).emit(Commands.UPDATE_USERS, CONNECTED_USERS);
	});

	socket.on(Commands.GET_SELECTED_CATEGORIES, (room_code) => {
		io.in(room_code).emit(Commands.GET_SELECTED_CATEGORIES, OPEN_ROOMS[room_code].game_info.word_categories);
	});

	socket.on(Commands.BEGIN_ROUND, (data) => {
		console.log(data.current_word)
		// console.log(data.game_info);
		let room_code = CONNECTED_USERS[data.current_artist_id].room_code;
		OPEN_ROOMS[room_code].game_info.current_word = data.current_word
		// io.in(room_code).emit(Commands.SEND_ARTIST_INFO, {
		// 	room_info: OPEN_ROOMS[room_code],
		// 	room_code: room_code
		// });

		console.log(`Starting the timer`);
		OPEN_ROOMS[room_code].game_info.timer_id = setInterval((room_code) => {
			let current_room_game_info = OPEN_ROOMS[room_code].game_info;
			let timer_id = OPEN_ROOMS[room_code].game_info.timer_id;
			var current_artist_id = current_room_game_info.current_artist_id
			var currentRoundIndex = current_room_game_info.current_round - 1
			var currentSubroundIndex = current_room_game_info.current_subround - 1

			io.in(room_code).emit(Commands.RECEIVE_CLOCK_INFO, current_room_game_info.current_time);
			//This is to pass to playpage
			console.log(current_room_game_info.current_word)
			io.in(room_code).emit(Commands.CLOCK_PLAYPAGE, current_room_game_info);
			current_room_game_info.current_time -= 1;

			console.log(`Timer value: ${current_room_game_info.current_time}`);

			if (current_room_game_info.current_time < 0) {
				console.log('clear interval');
				stop_timer(timer_id);
				current_room_game_info.current_time = current_room_game_info.time_per_round;
				// TODO: Emit to indicate that round has ended
				chooseArtist(room_code);
				//io.in(room_code).emit(Commands.BEGIN_ROUND, OPEN_ROOMS[room_code]);
				OPEN_ROOMS[room_code].users[current_artist_id].points_history[currentRoundIndex][currentSubroundIndex] = calculateArtistScore(room_code)
				endOfRoundScore(room_code)
				io.in(room_code).emit(Commands.END_ROUND, OPEN_ROOMS[room_code])
				io.in(room_code).emit(Commands.SEND_SCOREBOARD_INFO, {
					room_info: OPEN_ROOMS[room_code],
					room_code: room_code
				})
			}
		}, 1000, room_code);
	});

	socket.on(Commands.GOT_CORRECT_WORD, (data) => {
		let room_code = data.room_code
		let current_time = data.current_time
		let user_id = data.user_id
		var current_artist_id = OPEN_ROOMS[room_code].game_info.current_artist_id
		var currentRoundIndex = OPEN_ROOMS[room_code].game_info.current_round - 1
		var currentSubroundIndex = OPEN_ROOMS[room_code].game_info.current_subround - 1
		var points_history = OPEN_ROOMS[room_code].users[user_id].points_history

		console.log(current_artist_id, user_id)
		console.log(currentRoundIndex, currentSubroundIndex)
		if (current_time > 0) {
			if (user_id === socket.id && user_id !== current_artist_id) {
				if (points_history[currentRoundIndex][currentSubroundIndex] === 0) {
					console.log("only this one", points_history[currentRoundIndex][currentSubroundIndex])
					var score_for_round = calculateNonArtistScore(room_code, current_time, socket.id)
					points_history[currentRoundIndex][currentSubroundIndex] = score_for_round
				}
			}
		}
	})

	socket.on(Commands.UPDATE_ROOMS, data => {
		io.emit(Commands.UPDATE_ROOMS, OPEN_ROOMS)
	})

});

server.listen(port, () => {
	console.log(`Listening on port: ${port}`);
})