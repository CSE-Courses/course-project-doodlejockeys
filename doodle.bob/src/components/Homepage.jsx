import React, { Component } from "react";
import "../css/Homepage.scss";
import { Link } from "react-router-dom";
import { customAlphabet } from "nanoid";
import { Button, Modal } from 'react-bootstrap';
import socket from '../server/socket';
import Commands from "../commands";
import '../css/Responsive.scss';
import logo from '../images/logo.png';
//Import all needed Component for this tutorial

//const HomePage = () => {
class Homepage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			onNewGameCard: true,
			room_code: customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz', 8)(),
			username: '',
			show_username_error: false,
			show_code_error: false,
			entered_code: '',
			open_rooms: [],
			game_info: {
				rounds: 3,
				time_per_round: 2
			}
		};

		this.closeModal = this.closeModal.bind(this);
		this.startGame = this.startGame.bind(this);
		this.onUsernameChange = this.onUsernameChange.bind(this);
		this.onRoomCodeChange = this.onRoomCodeChange.bind(this);
		this.joinGame = this.joinGame.bind(this);
		this.updateRounds = this.updateRounds.bind(this);
		this.updateTimePerRound = this.updateTimePerRound.bind(this);

		socket.off(Commands.UPDATE_ROOMS).on(Commands.UPDATE_ROOMS, (open_rooms) => {

			console.log('Updating rooms...', open_rooms);

			this.setState({
				open_rooms: open_rooms
			});
		});
	}

	changeTabs = (event) => {
		event.preventDefault();
		this.setState({
			onNewGameCard: !this.state.onNewGameCard
		});
	};

	updateRounds(event) {
		this.setState((state) => {
			return {
				game_info: {
					rounds: parseInt(event.target.value),
					time_per_round: state.game_info.time_per_round
				}
			}
		});
		console.table(this.state.game_info);
	}

	updateTimePerRound(event) {
		this.setState((state) => {
			return {
				game_info: {
					rounds: state.game_info.rounds,
					time_per_round: parseInt(event.target.value)
				}
			}
		});
		console.table(this.state.game_info);
	}

	startGame(event) {
		if (this.state.username === '') {
			event.preventDefault();
			this.setState({
				show_username_error: true
			});

		} else {

			socket.emit(Commands.START_GAME, {
				room_code: this.state.room_code,
				username: this.state.username,
				user_id: socket.id,
				game_info: this.state.game_info
			});

			this.state.open_rooms.push(this.state.room_code);
		}
	}

	joinGame(event) {

		if (this.state.username === '') {
			event.preventDefault();
			this.setState({
				show_username_error: true
			});

		} else if (!this.state.open_rooms.includes(this.state.entered_code)) {
			event.preventDefault();
			this.setState({
				show_code_error: true
			});

		} else {
			socket.emit(Commands.JOIN_GAME, {
				room_code: this.state.entered_code,
				username: this.state.username,
				user_id: socket.id
			});
		}

	}

	closeModal() {
		this.setState({
			show_username_error: false,
			show_code_error: false
		});
	}

	onUsernameChange(event) {
		this.setState({
			username: event.target.value
		});
	}

	onRoomCodeChange(event) {
		this.setState({
			entered_code: event.target.value
		});
	}

	render() {
		return (
			<div className="home-container">

				<Modal animation={false} show={this.state.show_username_error} onHide={this.closeModal} centered>
					<Modal.Header closeButton>
						<Modal.Title className="text-danger">Error!</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						<p>Username cannot be empty.</p>
					</Modal.Body>
				</Modal>

				<Modal animation={false} show={this.state.show_code_error} onHide={this.closeModal} centered>
					<Modal.Header closeButton>
						<Modal.Title className="text-danger">Error!</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						<p>Invalid room code.</p>
					</Modal.Body>
				</Modal>

				<div className="col">
					<div className="logo">
						<img src={logo} alt="" />
					</div>

					<div className="greetings">
						<h2>Welcome to</h2>
						<h1>Doodle.bob</h1>
					</div>
				</div>

				<div className="col">
					<div className="game-card">
						{this.state.onNewGameCard && (
							<div className='game-state'>
								<div className="gameTabs">
									<button className="tabOpen">New Game</button>
									<button className="tabClosed" onClick={this.changeTabs}>Join Game</button>
								</div>

								<div className="literalCard">
									
									<h2>Game Code</h2>

									<input className="game-code" type="text" value={this.state.room_code} disabled />

									<input className="username" type="text" placeholder="Username..." maxLength="10" value={this.state.username} onChange={this.onUsernameChange} />

									<div className="settings">
										<form className="rounds" onChange={this.updateRounds}>
											<input type="radio" id="3" name="round" defaultChecked value="3" />
											<label htmlFor="3">3 rounds</label>

											<input type="radio" id="5" name="round" value="5" />
											<label htmlFor="5">5 rounds</label>

											<input type="radio" id="7" name="round" value="7" />
											<label htmlFor="7">7 rounds</label>
										</form>

										<form className="time" onChange={this.updateTimePerRound}>
											<input type="radio" id="2" name="tm" defaultChecked value="2" />
											<label htmlFor="2">2 seconds</label>

											<input type="radio" id="60" name="tm" value="60" />
											<label htmlFor="60">60 seconds</label>

											<input type="radio" id="90" name="tm" value="90" />
											<label htmlFor="90">90 seconds</label>
										</form>
									</div>

									<p className="enterUsername">Make sure to share the code with your friends!</p>
									
									<Link to={`/${this.state.room_code}/Avatar`} onClick={this.startGame}><Button variant="success" className="continueToPlay">Continue to Play</Button></Link>
								</div>
							</div>
						)}
						{!this.state.onNewGameCard && (
							<div className="game-state">
								<div className="gameTabs">
									<button className="tabClosed" onClick={this.changeTabs}>New Game</button>
									<button className="tabOpen">Join Game</button>
								</div>

								<div className="literalCard">
									<h2 className="enterGame">Enter Your Game Code to Join</h2>
									<input type="text" placeholder="Enter Code" value={this.state.entered_code} onChange={this.onRoomCodeChange} />

									<input type="text" placeholder="Choose Username" maxLength="10" value={this.state.username} onChange={this.onUsernameChange} />
									
									<div className="continue">
									<Link to={`/${this.state.entered_code}/Avatar`} onClick={this.joinGame}><Button variant="success" className="continueToPlay">Continue to Play</Button></Link>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default Homepage;
