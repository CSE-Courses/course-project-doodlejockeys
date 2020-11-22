import React, { Component } from 'react';
import socket from '../server/socket';
import Commands from "../commands";

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
    }

    componentDidMount() {
        socket.on(Commands.SEND_ARTIST_INFO, (data) => {
            let room_code = data.room_code
            let total_rounds = data.room_info.game_info.rounds
            let artist_id = data.room_info.game_info.current_artist_id
            let artist_history = data.room_info.game_info.artist_history
            let current_subround = data.room_info.game_info.current_subround
            let current_round = data.room_info.game_info.current_round
            let users = data.room_info.users

            // for (let i = 0; i < total_rounds; i++) {
            //     let roundHistory = []
            //     for (let j of Object.keys(data.room_info.users)) {
            //         roundHistory.push(j)
            //     }
            //     console.log(roundHistory)
            //     artist_history.push(roundHistory)
            // }
            console.log(artist_history)

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


    render() {
        return (<div style={{ backgroundColor: "rgb(41, 41, 41)", width: "100%", margin: "0px", display: "flex" }}>
            {this.state.artist_history.map((round_history) => (
                <div style={{ margin: "0px" }}>
                    {this.state.artist_history.indexOf(round_history) + 1 === this.state.current_round && <div style={{ padding: "0px", backgroundColor: "rgb(151, 0, 50)" }}>
                        <h3 style={{ color: "white", textAlign: "center" }}>Round {this.state.artist_history.indexOf(round_history) + 1}</h3>
                        <div style={{ display: "flex", margin: "10px" }}>
                            {round_history.map((subRound_artist) => (
                                <div>
                                    {subRound_artist !== '' && (
                                        <div>
                                            {/* {console.log("BLAH", this.state.profilePictures[this.props.userList[this.props.game.currentArtistId]["profilePic"]])} */}
                                            <img src={this.state.users[subRound_artist].profile_picture} style={{ width: "20px", borderRadius: "50%", margin: '5px', textAlign: "center" }} />
                                        </div>
                                    )}
                                    {subRound_artist === '' && (<div style={{ width: "20px", borderRadius: "50%", backgroundColor: "lightgrey", margin: '5px', textAlign: "center" }}>?
                                    </div>)}
                                </div>
                            ))}

                        </div>
                    </div>}
                    {this.state.artist_history.indexOf(round_history) + 1 !== this.state.current_round && <div style={{ padding: "0px" }}>
                        <h3 style={{ color: "white", textAlign: "center" }}>Round {this.state.artist_history.indexOf(round_history) + 1}</h3>
                        <div style={{ display: "flex", margin: "10px" }}>
                            {round_history.map((subRound_artist) => (
                                <div>
                                    {subRound_artist !== '' && (
                                        <div>
                                            {/* {console.log("BLAH", this.state.profilePictures[this.props.userList[this.props.game.currentArtistId]["profilePic"]])} */}
                                            <img src={this.state.users[subRound_artist].profile_picture} style={{ width: "20px", borderRadius: "50%", margin: '5px', textAlign: "center" }} />
                                        </div>
                                    )}
                                    {subRound_artist === '' && (<div style={{ width: "20px", borderRadius: "50%", backgroundColor: "lightgrey", margin: '5px', textAlign: "center" }}>?
                                    </div>)}
                                </div>
                            ))}

                        </div>
                    </div>}

                </div>
            ))}
        </div>);
    }
}

export default RoundsUI;