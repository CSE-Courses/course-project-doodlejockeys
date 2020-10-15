import React, { Component } from 'react';
import Clock from './Clock';
import Scoreboard from './Scoreboard';
import Chat from './Chat';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import RoundsUI from './RoundsUI';


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

function PlayPage() {
	const preRoundState = false;
	const gameInfo = {
		currentGames: [
			{ gameid: 0, joincode: "0000", currentRound: 1, totalRounds: 5, currentArtistId: 2, currentWord: "ball", currentSubRound: 1 },
			{ gameid: 1, joincode: "1111", currentRound: 1, totalRounds: 5, currentArtistId: 2, currentWord: "ball", currentSubRound: 1 }
		],
		users: {
			1: { userid: 1, username: "iguanaoverlord", profilePic: "duck", role: "guesser", preRoundScore: 0, thisRoundScore: 0 },
			2: { userid: 2, username: "chickennuggets", profilePic: "chicken", role: "artist", preRoundScore: 0, thisRoundScore: 0 },
			3: { userid: 3, username: "walrusparade", profilePic: "rhino", role: "guesser", preRoundScore: 0, thisRoundScore: 0 }
		},
	};

	return (

		<React.Fragment>
			{!preRoundState && <div className="container">
				<div className="left-col">
					<Scoreboard userList={gameInfo.users} />
					<Clock />
				</div>
				<div className="center-col">
					<RoundsUI
						game={gameInfo.currentGames[0]}
						userList={gameInfo.users}
						round={gameInfo.currentGames[0].currentRound}
						word={gameInfo.currentGames[0].currentWord}
					/>
					<Canvas />
					<Toolbar />
				</div>

				<div className="right-col">
					<Chat
						gameid={gameInfo.currentGames[0].gameid}
						userList={gameInfo.users}
						round={gameInfo.currentGames[0].currentRound}
						word={gameInfo.currentGames[0].currentWord}
					/>
				</div>
			</div>}
		</React.Fragment>
	);
}

export default PlayPage;