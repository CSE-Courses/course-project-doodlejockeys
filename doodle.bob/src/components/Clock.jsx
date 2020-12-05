import React, { Component } from 'react';
import socket from '../server/socket'
import Commands from "../commands";
import { Button } from 'react-bootstrap';


const ROUND_VALUE = 1;
var CURRENT_SUBROUND = 1;

class Clock extends Component {


    constructor(props) {
        super(props);


        this.state = {
            timervalue: sessionStorage.getItem("time"),
            seconds: sessionStorage.getItem("time"),
            paused: false,
            status: "Start Next Round",
            round: ROUND_VALUE,
            maxrounds: sessionStorage.getItem("rounds"),
            current_subround: 0,
            users: {},
            room_code: '',
            data: {},
            is_artist: false,
            on_last_round: false,
        };
        this.clockToggle = this.clockToggle.bind(this);
        this.startNextRound = this.startNextRound.bind(this);

    }

    // to start timer from server
    // one variable to hold the constant value of the timer (for reset)
    // one variable for the actual changing seconds
    // identify artist, when they click on start next round, client emit even start timer 
    // server has to have an interval variable


    componentDidMount() {
        socket.on(Commands.SEND_CLOCK_INFO, (data) => {
            console.log(data.room_info.game_info);
            let time_per_round = data.room_info.game_info.time_per_round;
            let rounds = data.room_info.game_info.rounds; //total rounds
            let current_round = data.room_info.game_info.current_round; // current round
            let current_subround = data.room_info.game_info.current_subround; //current sub round
            let is_artist = false; //is this the current artist, initially false

            if (data.room_info.game_info.current_artist_id === socket.id) {
                is_artist = true
            }

            let room_code = data.room_code;
            let users = data.room_info.users;


            // console.log(data.room_info.game_info);

            this.setState({
                timervalue: time_per_round,
                seconds: time_per_round,
                round: current_round,
                maxrounds: rounds,
                current_subround: current_subround,
                users: users,
                room_code: data.room_code,
                data: data,
                is_artist: is_artist
            })

            CURRENT_SUBROUND = current_subround;


            if (rounds == current_round && Object.keys(users).length == current_subround) {
                this.setState({
                    on_last_round: true
                })
            }

            /*if (is_artist) {
                socket.emit(Commands.START_TIMER, { room_code: this.state.room_code });
            }*/

        })

        socket.off(Commands.RECEIVE_CLOCK_INFO).on(Commands.RECEIVE_CLOCK_INFO, (data) => {
            let seconds = data
            // console.log("time getting called")
            this.setState({
                seconds: seconds
            })
        })
    }

    clockToggle() {
        if (this.state.status != "Game Over") {

            this.setState({
                paused: !this.state.paused,
                status: this.state.paused ? "Pause" : "Resume"
            });
        }

        if (this.state.status == "Start Next Round") {

        }
    }

    startNextRound() {
        // we are going to increment the subround, if that puts it to a subround that will not ext, we reset (line 86)
        CURRENT_SUBROUND += 1;
        //we want to pass the new round to the server before reloading the page
        var updated_round = this.state.round

        console.log("comparison: ", CURRENT_SUBROUND, Object.keys(this.state.users).length, "round: ", updated_round);

        if (CURRENT_SUBROUND > Object.keys(this.state.users).length) {
            //we reset here
            CURRENT_SUBROUND = 1;
            updated_round += 1;
            this.setState((prevState) => {
                return {
                    round: updated_round,
                    seconds: prevState.time_per_round,
                }
            })
        }

        // this.setState({
        //     paused: false,
        //     status: "Pause"
        // });

        if (updated_round > this.state.maxrounds) {
            this.setState({
                status: "Game Over"
            })
        } else {

            console.log("round after", updated_round, CURRENT_SUBROUND)
            //where we prep the room_info to send back to the server
            this.state.data.room_info.game_info.current_round = updated_round
            this.state.data.room_info.game_info.current_subround = CURRENT_SUBROUND

            // console.log(this.state.data.room_info.game_info.current_round, this.state.data.room_info.game_info.current_subround)

            //sending back to server
            socket.emit(Commands.RECEIVE_CLOCK_INFO, {
                room_info: this.state.data.room_info,
                room_code: this.state.room_code,
            })

            sessionStorage.setItem("preRound", true)
            sessionStorage.setItem("sealedArtistStatus", false)
            // window.location.reload(false);

            //THIS DOES NOT GET CALLED ON NON HOST SIDE
        }
    }

    tick() {
        if (this.state.seconds <= 1 && this.state.status != "Game Over") {
            clearInterval(this.timerId);
            this.setState({
                status: "Start Next Round",
                round: this.state.round
            })
        }

        if (this.state.round + 1 > this.state.maxrounds && Object.keys(this.state.users).length == this.state.current_subround) {
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
            <div id="clock">

                {/* {this.state.is_artist && <button onClick={this.clockToggle}>{this.state.status}</button>} */}
                {!this.state.is_artist && <div>{this.state.seconds + "s"}</div>}
                {this.state.is_artist && this.state.seconds !== 0 && <div>{this.state.seconds + "s"}</div>}
                {this.state.is_artist && (this.state.seconds <= 0) && !this.state.on_last_round && (<Button variant="success" onClick={this.startNextRound} className="startRound" >{this.state.status}</Button>)
                }

                {this.state.on_last_round && this.state.seconds <= 0 && (
                    <React.Fragment>
                        <div>Time is Up!</div>
                        <div>Game Over!</div>

                    </React.Fragment>)}

            </div>
        );
    }

}

export default Clock;