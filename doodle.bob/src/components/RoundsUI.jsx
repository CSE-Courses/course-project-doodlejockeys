import React, { Component } from 'react';
import socket from '../server/socket';
import Commands from "../commands";
import '../css/RoundsUI.scss'

class RoundsUI extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user_id: socket.id,
            room_code: '',
            total_rounds: 0,
            current_round: 0,
            current_subround: 0,
            artist_id: '',
            artist_history: [],
            users: {},

        }

        this.displayProfilePictures = this.displayProfilePictures.bind(this);
    }

    componentDidMount() {
        socket.off(Commands.SEND_ARTIST_INFO).on(Commands.SEND_ARTIST_INFO, (data) => {
            let room_code = data.room_code
            let total_rounds = data.room_info.game_info.rounds
            let artist_id = data.room_info.game_info.current_artist_id
            let artist_history = data.room_info.game_info.artist_history
            let current_subround = data.room_info.game_info.current_subround
            let current_round = data.room_info.game_info.current_round
            let users = data.room_info.users

            this.setState({
                room_code: room_code,
                total_rounds: total_rounds,
                current_round: current_round,
                current_subround: current_subround,
                artist_id: artist_id,
                artist_history: artist_history,
                users: users
            })
        })
    }

    displayProfilePictures(subRound_artist) {
        if(subRound_artist !== '') {
            return <img src={this.state.users[subRound_artist].profile_picture} alt="Player Profile picture"/>
       
        } else {
            return <div className="empty">?</div>
        }
    }


    render() {
        return(
            <div className="rounds-container">
                {this.state.artist_history.map((round_history) => (
                    <React.Fragment>
                        {this.state.artist_history.indexOf(round_history) + 1 === this.state.current_round &&
                        <div className="round">
                            <div className="round-num"><p>Round {this.state.artist_history.indexOf(round_history) + 1}</p></div>
                            
                            <div className="profile-pictures">
                                {round_history.map((subRound_artist) => (
                                    this.displayProfilePictures(subRound_artist)                                
                                ))}
                            </div>
                        </div>}

                        {this.state.artist_history.indexOf(round_history) + 1 !== this.state.current_round &&
                        <div className="round">
                            <div className="round-num"><p>Round {this.state.artist_history.indexOf(round_history) + 1}</p></div>
                            
                            <div className="profile-pictures">
                                {round_history.map((subRound_artist) => (
                                    this.displayProfilePictures(subRound_artist)                                
                                ))}
                            </div>
                        </div>}
                    </React.Fragment>
                ))}
            </div>
        );
    }
}

export default RoundsUI;