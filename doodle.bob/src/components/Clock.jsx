import React, { Component } from 'react';


const ROUND_VALUE = 1;


class Clock extends Component {


	constructor(props) {
		super(props);


		this.state = {
			seconds: sessionStorage.getItem("time"),
			paused: false,
			status: "Pause",
			round: ROUND_VALUE,
			timervalue: sessionStorage.getItem("time"),
			maxrounds: sessionStorage.getItem("rounds")

		};
		this.clockToggle = this.clockToggle.bind(this);

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
				maxrounds: this.props.game.totalRounds
			});
		}
	}



	componentWillUnmount() {
		clearInterval(this.timerId);
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
			sessionStorage.setItem("sealedArtistStatus", false)
			window.location.reload(false);

			this.timerId = setInterval(
				() => this.tick(), 1000
			);
		}
	}

	tick() {
		console.log(this.state.seconds);
		if (this.state.seconds <= 1 && this.state.status != "Game Over") {
			clearInterval(this.timerId);
			this.setState({
				status: "Start Next Round",
				round: this.state.round
			})
		}

		if (this.state.round + 1 > this.state.maxrounds && Object.keys(this.props.userList).length == sessionStorage.getItem("currentSubRound")) {
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