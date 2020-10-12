import React, { Component } from 'react';
import "../styles.css";
import chicken from "../tempAvatars/chicken.png";
import duck from "../tempAvatars/duck.png";
import rhino from "../tempAvatars/rhino.png";

class RoundsUI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profilePictures: {
                "chicken": chicken,
                "duck": duck,
                "rhino": rhino
            },
            roundArtist: [[this.props.game.currentArtistId, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]
        };
    }

    render() {
        let totalRounds = this.props.game["totalRounds"]
        let rounds = []
        for (let i = 0; i < totalRounds; i++) {
            rounds.push(i + 1)
        }
        let users = []
        for (let user in this.props.userList) {
            users.push(user)
        }
        console.log(rounds)
        return (
            <div style={{ backgroundColor: "rgb(41, 41, 41)", width: "100%", margin: "0px", display: "flex" }}>
                {this.state.roundArtist.map((round) => (
                    <div style={{ margin: "0px" }}>
                        {this.props.game.currentRound === this.state.roundArtist.indexOf(round) + 1 && (<div style={{ backgroundColor: "rgb(151, 0, 50)", padding: "0px" }}>
                            <h3 style={{ color: "white", textAlign: "center" }}>Round {this.state.roundArtist.indexOf(round) + 1}</h3>
                            <div style={{ display: "flex", margin: "10px" }}>
                                {round.map((subRound) => (
                                    <div>
                                        {subRound !== 0 && (
                                            <div>
                                                {/* {console.log("BLAH", this.state.profilePictures[this.props.userList[this.props.game.currentArtistId]["profilePic"]])} */}
                                                <img src={this.state.profilePictures[this.props.userList[this.props.game.currentArtistId]["profilePic"]]} style={{ width: "20px", borderRadius: "50%", margin: '5px', textAlign: "center" }} />
                                            </div>
                                        )}
                                        {subRound === 0 && (<div style={{ width: "20px", borderRadius: "50%", backgroundColor: "lightgrey", margin: '5px', textAlign: "center" }}>?
                                        </div>)}
                                    </div>
                                ))}

                            </div>
                        </div>)}
                        {this.props.game.currentRound !== this.state.roundArtist.indexOf(round) + 1 && (<div style={{ padding: "0px" }}>
                            <h3 style={{ color: "white", textAlign: "center" }}>Round {this.state.roundArtist.indexOf(round) + 1}</h3>
                            <div style={{ display: "flex", margin: "10px" }}>
                                {round.map((subRound) => (
                                    <div>
                                        {subRound !== 0 && (
                                            <div>
                                                {/* {console.log("BLAH", this.state.profilePictures[this.props.userList[this.props.game.currentArtistId]["profilePic"]])} */}
                                                <img src={this.state.profilePictures[this.props.userList[this.props.game.currentArtistId]["profilePic"]]} style={{ width: "20px", borderRadius: "50%", margin: '5px', textAlign: "center" }} />
                                            </div>
                                        )}
                                        {subRound === 0 && (<div style={{ width: "20px", borderRadius: "50%", backgroundColor: "lightgrey", margin: '5px', textAlign: "center" }}>?
                                        </div>)}
                                    </div>
                                ))}

                            </div>
                        </div>)}

                    </div>
                ))}
            </div>
        );
    }
}

export default RoundsUI;