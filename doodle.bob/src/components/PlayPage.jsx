import React, { Component } from 'react';
import Canvas from "./Canvas"
import ChatRoom from "./ChatRoom"
import Clock from "./Clock"
import RoundsUI from "./RoundsUI"
import Scoreboard from "./Scoreboard"
import Toolbar from "./Toolbar"


// Step 1, enter playpage, with modal for who is the artist open (if artist, choose word, if not, do not choose word)
//make function to be called in Commands.PICK_WORDS and onClick of start next round
// on exit of wordbank assign 1st artist, give role artist to selected, role guesser to not, add to artist history
// for selection have list of user_ids randomly pop until empty, when empty start next round with newly full list
//if artist, choose word
//set word to what artist chose in OPEN_ROOMS.game_info
//subround played
//call function on click of start next round


class PlayPage extends Component {
    constructor(props) {
		super(props);
		this.state = {
            preRoundState: false,
            room_code: props.match.params.room_code
		}

		console.log('Hello world');
	}
    render() {
        return (
            <React.Fragment>
            {!this.state.preRoundState && <div className="container">
                <div className="left-col">
                    <Scoreboard />
                    <Clock />
                    {/* ADDED FOR DEMONSTRATION PURPOSES REMOVE LATER */}
                    <button>Show end scoreboard</button>
                    <div className="debug">
                        <label htmlFor="players">Update score:</label>
                        <button>Update</button>
                    </div>
                    {/* DEMONSTRATION END */}
                </div>
                <div className="center-col">
                    {/* <ScoreboardEnd /> */}
                    <RoundsUI />
                    <Toolbar />
                </div>

                <div className="right-col">
                    <ChatRoom room_code={this.state.room_code} />
                </div>
            </div>}
        </React.Fragment>
        );
    }
}

export default PlayPage;