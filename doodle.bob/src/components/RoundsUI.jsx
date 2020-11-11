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
            roundArtist: [[this.props.game.currentArtistId, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
            subRoundIndex: 0,
            roundIndex: 0,
        };
    }

    componentDidMount() {
        let totalRounds = this.props.game["totalRounds"]
        let rounds = []
        for (let i = 0; i < totalRounds; i++) {
            rounds.push(i + 1)
        }
        let users = []
        for (let user in this.props.userList) {
            users.push(user)
        }
        let artistHistory = sessionStorage.getItem("artistHistory").split(',')
        let zeros = (this.props.game.totalRounds * Object.keys(this.props.userList).length) - artistHistory.length

        for (let i = 0; i < zeros; i++) {
            artistHistory.push("0")
        }
        let historyReorganized = []
        let counter = 0
        for (let i = 0; i < artistHistory.length; i) {

            let roundHistory = []
            for (let user in this.props.userList) {
                roundHistory.push(parseInt(artistHistory[i]))
                i++
            }
            historyReorganized.push(roundHistory)
        }
        // console.log(historyReorganized)
        this.setState({
            roundArtist: historyReorganized
        })
        // let subRoundIndex = this.props.game["currentSubRound"] - 2
        // let roundIndex = this.props.game["currentRound"] - 1
        let currentArtist = parseInt(sessionStorage.getItem("currentArtist"))
        this.setState({
            subRoundIndex: this.props.game["currentSubRound"] - 2,
            roundIndex: this.props.game["currentRound"] - 1
        })
        // this.state.roundArtist[roundIndex][subRoundIndex] = currentArtist

    }

    render() {

        return (
            <div style={{ backgroundColor: "rgb(41, 41, 41)", width: "100%", margin: "0px", display: "flex" }}>
                {this.state.roundArtist.map((round) => (
                    <div style={{ margin: "0px" }}>
                        {this.props.game.currentRound === this.state.roundArtist.indexOf(round) + 1 && (<div style={{ backgroundColor: "rgb(151, 0, 50)", padding: "0px" }}>
                            <h3 style={{ color: "white", textAlign: "center" }}>Round {this.state.roundArtist.indexOf(round) + 1}</h3>
                            <div style={{ display: "flex", margin: "10px" }}>
                                {round.map((subRound) => (
                                    <div>
                                        {subRound !== 0 && this.props.userList[subRound] && (
                                            <div>
                                                <img src={this.state.profilePictures[this.props.userList[subRound]["profilePic"]]} style={{ width: "20px", borderRadius: "50%", margin: '5px', textAlign: "center" }} />
                                            </div>
                                        )}
                                        {(subRound !== 0 && !this.props.userList[subRound]) && (<div style={{ width: "20px", borderRadius: "50%", backgroundColor: "lightgrey", margin: '5px', textAlign: "center" }}>?
                                        </div>)}
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
                                                <img src={this.state.profilePictures[this.props.userList[subRound]["profilePic"]]} style={{ width: "20px", borderRadius: "50%", margin: '5px', textAlign: "center" }} />
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