import React, { Component } from 'react';
import Clock from './Clock';
import Scoreboard from './Scoreboard';
import Chat from './Chat';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import RoundsUI from './RoundsUI';
import WordChoice from './WordChoice';
import ScoreboardEnd from './ScoreboardEnd';
import MiniGame from './MiniGame';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Link,
	Redirect
} from "react-router-dom";


class Back extends Component {
	render() {
		return (
			<div>
				<img src={require("../images/back.png")}
					alt="backbutton"
					class="backbutton" />
			</div>
		)
	}
}

class PlayPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			preRoundState: true,
			score_end_visible: false,
			wordOptions: [],
			allWords: {
				animal: ['Cat', 'Dog', 'Goldfish', 'Hamster', 'Mouse', 'Parrot', 'Rabbit', 'Fish', 'Turtle', 'Pigeon'],
				celebrities: ['Kim Kardashian', 'Beyoncé', 'Tom Hanks', 'Taylor Swift', 'Johnny Depp', 'Jim Carrey', 'Emma Watson', 'Leonardo DiCapro', 'Morgan Freeman', 'Robert Downey Jr.'],
				countries: ['USA', 'France', 'Spain', 'Russia', 'Canada', 'India', 'China', 'New Zealand', 'Portugal', 'Nigeria'],
				objects: ['Spoon', 'Mug', 'Shoe', 'Phone', 'Scissors', 'Pen', 'Pencil', 'Quarter', 'Laptop', 'Bottle'],
				actions: ['Swimming', 'Running', 'Cooking', 'Laughing', 'Surfing', 'Talking', 'Sleeping', 'Singing', 'Eating', 'Writing'],
				food: ['Burger', 'Bagel', 'Bacon', 'Apple', 'Spaghetti', 'Coffee', 'Lobster', 'Corn', 'Chocolate', 'Cake'],
				places: ['Church', 'Bank', 'Post Office', 'Restaurant', 'Hospital', 'School', 'Park', 'Stadium', 'House', 'Museum'],
				movies: ['Toy Story', 'Monsters Inc.', 'Finding Nemo', 'Cars', 'Ratatouille', 'WALL-E', 'UP', 'Brave', 'Finding Dory', 'Coco'],
				sports: ['Baseball', 'Rowing', 'Softball', 'Volleyball', 'Basketball', 'Archery', 'Climbing', 'Fishing', 'Hockey', 'Diving'],
				pokemon: ['Pikachu', 'Bulbasaur', 'Squirtle', 'Charmander', 'Mew', 'Suicune', 'Celebi', 'Shuckle', 'Wooper', 'Wooloo'],
			},
			perRoundChoices: [0, 0, 0],
			choice: 0,
			newKeyWord: "",
			artists: {},

			gameInfo: {
				currentGames: [
					{ gameid: 0, joincode: "0000", currentRound: 1, totalRounds: 5, currentArtistId: 1, currentWord: "ball", currentSubRound: 1 },
					{ gameid: 1, joincode: "1111", currentRound: 1, totalRounds: 5, currentArtistId: 1, currentWord: "ball", currentSubRound: 1 }
				],
				users: {
					1: { userid: 1, username: "iguanaoverlord", profilePic: "duck", role: "guesser", preRoundScore: 0, thisRoundScore: 0 },
					2: { userid: 2, username: "chickennuggets", profilePic: "chicken", role: "artist", preRoundScore: 0, thisRoundScore: 0 },
					3: { userid: 3, username: "walrusparade", profilePic: "rhino", role: "guesser", preRoundScore: 0, thisRoundScore: 0 }
				},
			}
		}
		this.handleNewKeyWord = this.handleNewKeyWord.bind(this);
		this.toggleVisibility = this.toggleVisibility.bind(this);
		this.updateScore = this.updateScore.bind(this);
	}

	componentDidMount() {
		this.loadArtistHistory()
		if (sessionStorage.getItem("preRound")) {
			this.setState({
				preRoundState: true
			})
		}
		if (!sessionStorage.getItem("preRound")) {
			this.setState({
				preRoundState: false
			})
		}
		if (this.state.preRoundState) {
			console.log("yo")
			this.putArtist()
			this.incrementRound()
		}
		console.log(sessionStorage.getItem("artistHistory"))
		this.wordChoice()

	};

	putArtist() {
		let tempArtists = {}
		for (let user of Object.keys(this.state.gameInfo.users)) {
			tempArtists[user] = 0
		}
		this.setState({
			artists: tempArtists
		})
		this.loadArtistHistory()
		// console.log(this.state.artists)
		if (sessionStorage.getItem("sealedArtistStatus") != "true") {
			console.log("yo")
			let thisRoundArtist = this.getRandomUnusedNumber()
			sessionStorage.setItem("currentArtist", thisRoundArtist)
		}
		if (sessionStorage.getItem("artistHistory").split(",").length <= (this.state.gameInfo.currentGames[0].currentRound - 1) * Object.keys(this.state.gameInfo.users).length + this.state.gameInfo.currentGames[0].currentSubRound + 1) {
			this.state.gameInfo.currentGames[0].currentArtistId = sessionStorage.getItem("currentArtist")
			let artistHistory = []
			if (sessionStorage.getItem("artistHistory") != "") {
				artistHistory = sessionStorage.getItem("artistHistory").split(",")
				if (sessionStorage.getItem("artistHistory").split(",").length >= (this.state.gameInfo.currentGames[0].currentRound - 1) * Object.keys(this.state.gameInfo.users).length + this.state.gameInfo.currentGames[0].currentSubRound) {
					// console.log("2.1")
					// artistHistory[artistHistory.length] = (sessionStorage.getItem("currentArtist"))
					//}
				}
				else {
					artistHistory.push(sessionStorage.getItem("currentArtist"))
				}
			}
			else {
				artistHistory.push(sessionStorage.getItem("currentArtist"))
			}
			sessionStorage.setItem("artistHistory", [artistHistory])
		}
	}

	wordChoice() {
		let categoriesChosen = sessionStorage.getItem("wordCategories").split(',');
		let current = []
		for (let category of categoriesChosen) {
			if (Object.keys(this.state.allWords).includes(category)) {
				for (let word of this.state.allWords[category]) {
					current.push(word)
				}
			}
		}
		this.setState({
			wordOptions: current,
			perRoundChoices: [current[Math.floor(Math.random() * current.length)], current[Math.floor(Math.random() * current.length)], current[Math.floor(Math.random() * current.length)]]
		})
	}

	incrementRound() {
		if (this.state.gameInfo.currentGames[0].currentSubRound > Object.keys(this.state.gameInfo.users).length) {
			this.state.gameInfo.currentGames[0].currentRound = parseInt(sessionStorage.getItem("currentRound")) + 1
			sessionStorage.setItem("currentRound", this.state.gameInfo.currentGames[0].currentRound)
			this.state.gameInfo.currentGames[0].currentSubRound = 1
			sessionStorage.setItem("currentSubRound", 1)

		}
		else {
			this.state.gameInfo.currentGames[0].currentRound = parseInt(sessionStorage.getItem("currentRound"))
			this.state.gameInfo.currentGames[0].currentSubRound = parseInt(sessionStorage.getItem("currentSubRound")) + 1
		}
	}

	loadArtistHistory() {
		let tempArtists = {}
		for (let user of Object.keys(this.state.gameInfo.users)) {
			tempArtists[user] = 0
		}
		let artistHistory = sessionStorage.getItem("artistHistory").split(',')
		let howDeepInRound = artistHistory.length % Object.keys(this.state.gameInfo.users).length
		// console.log(artistHistory)
		// console.log(howDeepInRound)
		for (let i = 1; i <= howDeepInRound; i++) {
			tempArtists[parseInt(artistHistory[artistHistory.length - i])] = 1
		}
		this.setState({
			artists: tempArtists
		})
	}

	getRandomUnusedNumber() {
		let tempArtists = {}
		let howDeepInRound = sessionStorage.getItem("artistHistory").split(",").length % Object.keys(this.state.gameInfo.users).length
		for (let i = 1; i <= howDeepInRound; i++) {
			tempArtists[parseInt(sessionStorage.getItem("artistHistory").split(",")[sessionStorage.getItem("artistHistory").split(",").length - i])] = 1
		}
		let currentChoice = Math.floor(Math.random() * (Object.keys(this.state.gameInfo.users).length + 1));
		let numIsGood = false;
		let allOnes = true;
		for (let artist of Object.keys(tempArtists)) {
			if (artist == 0) {
				allOnes = false;
			}
		}
		if (allOnes) {
			this.loadArtistHistory()
		}
		console.log(this.state.artists)
		while (!numIsGood) {
			if (currentChoice == 0) {
				currentChoice = Math.floor(Math.random() * (Object.keys(this.state.gameInfo.users).length + 1));
			}
			else if (tempArtists[currentChoice] == 1) {
				currentChoice = Math.floor(Math.random() * (Object.keys(this.state.gameInfo.users).length + 1));
			}
			else {
				numIsGood = true;
			}
		}
		return currentChoice;
	}

	changeWordChoice(index) {
		this.setState({
			choice: index
		});
	}

	handleNewKeyWord(event) {
		this.setState({
			newKeyWord: event.target.value,
			choice: this.state.perRoundChoices.length
		});
	}

	sendKeyWord(event) {
		event.preventDefault();
		if (this.state.choice < this.state.perRoundChoices.length) {
			this.state.gameInfo.currentGames[0].currentWord = this.state.perRoundChoices[this.state.choice]
		}
		else {
			this.state.gameInfo.currentGames[0].currentWord = this.state.newKeyWord
		}
		this.setState({
			preRoundState: false
		})
		sessionStorage.setItem("preRound", false)
		sessionStorage.setItem("currentRound", this.state.gameInfo.currentGames[0].currentRound)
		sessionStorage.setItem("currentSubRound", this.state.gameInfo.currentGames[0].currentSubRound)
		sessionStorage.setItem("sealedArtistStatus", true)
		this.state.artists[sessionStorage.getItem("currentArtist")] = 1
		this.loadArtistHistory()
		this.componentDidMount()
		this.setState({
			preRoundState: false
		})

	}


	/* ADDED FOR DEMONSTRATION PURPOSES REMOVE LATER */
	toggleVisibility(e) {
		this.setState({
			score_end_visible: !this.state.score_end_visible
		});

		if (!this.state.score_end_visible) {
			e.target.textContent = "Hide end scoreboard"

		} else {
			e.target.textContent = "Show end scoreboard"
		}
	}

	updateScore() {
		const select = document.querySelector("#players");
		const input = document.querySelector("#updateScore");

		const selectedOption = select.options[select.selectedIndex];
		const uid = selectedOption.dataset.uid;
		const updateValue = input.value;

		if (updateValue < 0) {
			return;
		}

		this.state.gameInfo.users[uid].preRoundScore = updateValue;

		this.setState({
			score_end_visible: this.state.score_end_visible
		})

	}

	/* DEMONSTRATION END */


	render() {
		/* ADDED FOR DEMONSTRATION PURPOSES REMOVE LATER */
		let grammarHolder = "s"
		if (this.state.gameInfo.users[sessionStorage.getItem("currentArtist")]["username"].split("")[this.state.gameInfo.users[sessionStorage.getItem("currentArtist")]["username"].length - 1] == 's') {
			console.log("grammar")
			grammarHolder = ""
		}
		const players = [];
		for (let key of Object.keys(this.state.gameInfo.users)) {
			players.push(
				<option data-uid={key} value={this.state.gameInfo.users[key].username}>{this.state.gameInfo.users[key].username}</option>
			);
		}
		const select = <select name="players" id="players">${players}</select>
		const input = <input type="number" id="updateScore"></input>
		/* DEMONSTRATION END */
		return (
			<React.Fragment>
				{!this.state.preRoundState && <div className="container">
					<div className="left-col">
						<Scoreboard userList={this.state.gameInfo.users} />
						<Clock
							game={this.state.gameInfo.currentGames[0]}
							userList={this.state.gameInfo.users}
							round={this.state.gameInfo.currentGames[0].currentRound}
						/>
						{/* ADDED FOR DEMONSTRATION PURPOSES REMOVE LATER */}
						<button onClick={this.toggleVisibility}>Show end scoreboard</button>
						<div className="debug">
							<label htmlFor="players">Update score:</label>
							{select}
							{input}
							<button onClick={this.updateScore}>Update</button>
						</div>
						{/* DEMONSTRATION END */}
					</div>
					<div className="center-col">
						<ScoreboardEnd
							userList={this.state.gameInfo.users}
							isVisible={this.state.score_end_visible}
						/>
						<RoundsUI
							game={this.state.gameInfo.currentGames[0]}
							userList={this.state.gameInfo.users}
							round={this.state.gameInfo.currentGames[0].currentRound}
							word={this.state.gameInfo.currentGames[0].currentWord}
						/>
						<Toolbar />
					</div>

					<div className="right-col">
						<Chat
							gameid={this.state.gameInfo.currentGames[0].gameid}
							userList={this.state.gameInfo.users}
							round={this.state.gameInfo.currentGames[0].currentRound}
							word={this.state.gameInfo.currentGames[0].currentWord}
						/>
					</div>
				</div>}
				{this.state.preRoundState && sessionStorage.getItem("userID") == sessionStorage.getItem("currentArtist") &&
					<div>
						<form className="signupPage">
							<div className="SignUp">
								<h1 className="signUpHeading">Your turn to be the artist!</h1>
								<div>
									<center>
										<br />
										<div>
											<h3>Here are some suggestions for what to draw!</h3>
											{this.state.perRoundChoices.map((option) => (
												<div style={{ display: "inline-block", marginRight: "10px" }}>
													{this.state.choice == this.state.perRoundChoices.indexOf(option) && <button style={{ border: "5px solid rgb(151, 0, 50)", width: "100%", height: "50px", borderRadius: "10px", marginRight: "50px", backgroundColor: "rgb(255, 214, 2)" }}>{option}</button>}
													{this.state.choice != this.state.perRoundChoices.indexOf(option) && <button style={{ width: "100%", height: "50px", borderRadius: "10px", marginRight: "50px", backgroundColor: "rgb(255, 214, 2)" }} onClick={() => this.changeWordChoice(this.state.perRoundChoices.indexOf(option))}>{option}</button>}
												</div>
											))}
										</div>
										<br />
										<div>
											<div>
												<h3>Don't like these? Create your own!</h3>
												<textarea
													onChange={this.handleNewKeyWord}
													className="usernameBox"
													placeholder="Choose Key Word"
													rows="1"
													cols="30"
												></textarea>
											</div>
										</div>
									</center>
									<center>

										<button type='submit' className="signUp_avatar" value="Let's Play!" onClick={(event) => this.sendKeyWord(event)}>Let's Play!</button>

									</center>
								</div>
							</div>
						</form>
					</div>}
				{this.state.preRoundState && sessionStorage.getItem("userID") != sessionStorage.getItem("currentArtist") &&
					<div>
						<form className="signupPage">
							<div className="SignUp" style={{ height: "fit-content" }}>
								<h1 style={{ marginLeft: "15%", marginRight: "15%", marginTop: "10px", textAlign: "center" }}>It is {this.state.gameInfo.users[sessionStorage.getItem("currentArtist")]["username"]}'{grammarHolder} turn to pick a word!</h1>
								<div>
									<center>
										<MiniGame />
										<br />
										<div>
											<div>
												<h3>Is your friend taking too long?</h3>
											</div>
										</div>
									</center>
									<center>

										<button type='submit' className="signUp_avatar" value="Let's Play!" onClick={(event) => this.sendKeyWord(event)}>Continue Anyways!</button>

									</center>
								</div>
							</div>
						</form>
					</div>
				}
			</React.Fragment>
		);
	}
}

export default PlayPage;