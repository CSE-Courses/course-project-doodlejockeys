import React, { Component } from 'react';


const ROUND_VALUE = 1;
const DEFAULT_TIMER = 2;


class Clock extends Component {

	constructor(props) {
		super(props);


		this.state = {
			seconds: DEFAULT_TIMER,
			paused: false,
			status: "Pause",
			round: ROUND_VALUE,
			timervalue: DEFAULT_TIMER,
			maxrounds: 3

		};
		this.clockToggle = this.clockToggle.bind(this);
		this.setTimer = this.setTimer.bind(this);
		this.setRounds = this.setRounds.bind(this);
	}


	componentDidMount() {
		this.timerId = setInterval(
			() => this.tick(), 1000
		);
		this.setState({
			round: this.props.round
		})
		var newTimer = parseInt(sessionStorage.getItem("timeAmount"));
		if (newTimer) {
			this.setState({
				timervalue: newTimer,
				seconds: newTimer,

			});
		}
	}

	componentWillUnmount() {
		clearInterval(this.timerId);
	}

	setRounds(obj) {
		var newMaxRound = parseInt(obj.target.value);

		this.setState({
			maxrounds: newMaxRound
		});
	}

	setTimer(obj) {
		var newTimer = parseInt(obj.target.value);

		this.setState({
			timervalue: newTimer
		});
		sessionStorage.setItem("timeAmount", obj.target.value)
	}

	clockToggle() {
		if (this.state.status != "Game Over") {
			this.setState({
				paused: !this.state.paused,
				status: this.state.paused ? "Pause" : "Resume"
			});
		}
		if (this.state.status == "Start Next Round") {
			this.setState({
				seconds: this.state.timervalue,
				paused: false,
				status: "Pause"
			});
			sessionStorage.setItem("preRound", true)
			window.location.reload(false);
		}
	}

	tick() {
		if (this.state.seconds <= 1 && this.state.status != "Game Over") {

			clearInterval(this.timerId);
			this.setState({
				status: "Start Next Round",
			})
			if (this.props.game.currentSubRound > Object.keys(this.props.userList).length) {
				this.setState({
					round: this.state.round + 1
				})
			}
		}

		if (this.state.round > this.state.maxrounds) {
			this.setState({
				status: "Game Over",
				seconds: 0,
				round: "has ended"

			});
		}
		if (this.state.paused == false && this.state.status != "Game Over") {
			this.setState({
				seconds: this.state.seconds - 1
			});

		}
	}

	render(props) {
		return (
			<div>
				<div>
					<button value="5" onClick={this.setRounds}>5 Rounds</button>
					<button value="10" onClick={this.setRounds}>10 Rounds</button>
					<button value="15" onClick={this.setRounds}>15 Rounds</button>

				</div>
				<div>
					<button value="2" onClick={this.setTimer}>2 seconds</button>
					<button value="30" onClick={this.setTimer}>30 seconds</button>
					<button value="60" onClick={this.setTimer}>60 seconds</button>
					<button value="90" onClick={this.setTimer}>90 seconds</button>
				</div>
				<div id="clock">
					<p>{this.state.seconds + "s"}</p>
					<button onClick={this.clockToggle}>{this.state.status}</button>
					<p>{"Round " + this.state.round}</p>
				</div>
			</div>
		);
	}
}

export default Clock;