import React, { Component } from 'react';
import "../styles.css";
import chicken from "../tempAvatars/chicken.png";
import duck from "../tempAvatars/duck.png";
import rhino from "../tempAvatars/rhino.png";

class ScoreboardEnd extends Component {

	constructor(props) {
		super(props);

		this.state = {
			profilePictures: {
				"chicken": chicken,
				"duck": duck,
				"rhino": rhino
			}
		}
	}

	render() {

		const userList = [];
		for (let userId of Object.keys(this.props.userList)) {
			userList.push(this.props.userList[userId]);
		}

		console.log(this.props.userList);
		
		userList.sort((o1, o2) => {return o2.preRoundScore - o1.preRoundScore});

		const tags = [];

		for (let i=0; i<userList.length; ++i) {
			tags.push(
				<div className="user-score">
					<span>{i+1}</span>
					<img src={this.state.profilePictures[userList[i].profilePic]} alt="my profile pic" className="myProPic" />
					<div>	
						<p>{userList[i].username}</p>
						<p>{userList[i].preRoundScore}</p>
					</div>
				</div>
			);
		}

		return (
			<div className={`scoreboard-end ${this.props.isVisible?"":"hidden"}`}> 
				{tags}
			</div>
		);
	}
}

export default ScoreboardEnd;
