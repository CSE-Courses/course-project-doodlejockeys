import React, { Component } from 'react';
import Clock from './Clock';
import Scoreboard from './Scoreboard';
import Chat from './Chat';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import RoundsUI from './RoundsUI';
import WordChoice from './WordChoice';
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
			wordOptions: ['Cat', 'Dog', 'Goldfish', 'Hamster', 'Mouse', 'Parrot', 'Rabbit', 'Fish', 'Turtle', 'Pigeon'
				, 'Kim Kardashian', 'Beyoncé', 'Tom Hanks', 'Taylor Swift', 'Johnny Depp', 'Jim Carrey', 'Emma Watson', 'Leonardo DiCapro', 'Morgan Freeman', 'Robert Downey Jr.'
				, 'USA', 'France', 'Spain', 'Russia', 'Canada', 'India', 'China', 'New Zealand', 'Portugal', 'Nigeria'
				, 'Spoon', 'Mug', 'Shoe', 'Phone', 'Scissors', 'Pen', 'Pencil', 'Quarter', 'Laptop', 'Bottle'
				, 'Swimming', 'Running', 'Cooking', 'Laughing', 'Surfing', 'Talking', 'Sleeping', 'Singing', 'Eating', 'Writing'
				, 'Burger', 'Bagel', 'Bacon', 'Apple', 'Spaghetti', 'Coffee', 'Lobster', 'Corn', 'Chocolate', 'Cake'
				, 'Church', 'Bank', 'Post Office', 'Restaurant', 'Hospital', 'School', 'Park', 'Stadium', 'House', 'Museum'
				, 'Toy Story', 'Monsters Inc.', 'Finding Nemo', 'Cars', 'Ratatouille', 'WALL-E', 'UP', 'Brave', 'Finding Dory', 'Coco'
				, 'Baseball', 'Rowing', 'Softball', 'Volleyball', 'Basketball', 'Archery', 'Climbing', 'Fishing', 'Hockey', 'Diving'],
			perRoundChoices: [0, 0, 0],
			choice: 0,
			newKeyWord: "",

			gameInfo: {
				currentGames: [
					{ gameid: 0, joincode: "0000", currentRound: 1, totalRounds: 5, currentArtistId: 2, currentWord: "ball", currentSubRound: 1 },
					{ gameid: 1, joincode: "1111", currentRound: 1, totalRounds: 5, currentArtistId: 2, currentWord: "ball", currentSubRound: 1 }
				],
				users: {
					1: { userid: 1, username: "iguanaoverlord", profilePic: "duck", role: "guesser", preRoundScore: 0, thisRoundScore: 0 },
					2: { userid: 2, username: "chickennuggets", profilePic: "chicken", role: "artist", preRoundScore: 0, thisRoundScore: 0 },
					3: { userid: 3, username: "walrusparade", profilePic: "rhino", role: "guesser", preRoundScore: 0, thisRoundScore: 0 }
				},
			}
		}
		this.handleNewKeyWord = this.handleNewKeyWord.bind(this);
	}

	componentDidMount() {
		if (sessionStorage.getItem("preRound")) {
			console.log("bob")
			this.setState({
				preRoundState: true
			})
		}
		if (!sessionStorage.getItem("preRound")) {
			console.log("yo")
			this.setState({
				preRoundState: false
			})
		}
		this.setState({
			perRoundChoices: [this.state.wordOptions[Math.floor(Math.random() * this.state.wordOptions.length)], this.state.wordOptions[Math.floor(Math.random() * this.state.wordOptions.length)], this.state.wordOptions[Math.floor(Math.random() * this.state.wordOptions.length)]]
		})

	};

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
		console.log("new", this.state.preRoundState, sessionStorage.getItem("preRound"))
		this.componentDidMount()
		this.setState({
			preRoundState: false
		})
	}


	render() {
		console.log("rendering", this.state.preRoundState)
		return (
			<React.Fragment>
				{!this.state.preRoundState && <div className="container">
					<div className="left-col">
						<Scoreboard userList={this.state.gameInfo.users} />
						<Clock
						/>
					</div>
					<div className="center-col">
						<RoundsUI
							game={this.state.gameInfo.currentGames[0]}
							userList={this.state.gameInfo.users}
							round={this.state.gameInfo.currentGames[0].currentRound}
							word={this.state.gameInfo.currentGames[0].currentWord}
						/>
						<Canvas />
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
				{this.state.preRoundState &&
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
			</React.Fragment>
		);
	}
}

export default PlayPage;