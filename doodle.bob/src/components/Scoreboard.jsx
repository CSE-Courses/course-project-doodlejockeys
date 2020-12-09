import React, { Component } from 'react';
import socket from '../server/socket'
import Commands from "../commands";

class Scoreboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            user_id: '',
            room_code: '',
            highestScore: 0
        }
    }

    componentDidMount() {
        socket.on(Commands.SEND_SCOREBOARD_INFO, (data) => {
            let users = data.room_info.users
            let room_code = data.room_code

            this.setState({
                users: users,
                user_id: socket.id,
                room_code: room_code
            })
            for (var user of Object.keys(users)) {
                if (users[user].points > this.state.highestScore) {
                    this.setState({
                        highestScore: users[user].points
                    })
                }
            }

        })

    }

    render(props) {

        const userList = { "bob": "bob" };
        const tags = [];

        // user_id to access in OPEN_ROOMS[room_code].users[ each user id] --> username, their points, profile pics


        for (let user of Object.keys(this.state.users)) {
            tags.push(
                <div className={`user-score ${(this.state.highestScore <= this.state.users[user].points)?'highlight': ''}`}>
                    <img src={this.state.users[user].profile_picture} alt="my profile pic" className="myProPic" />
                    <div className="user-info">
                        <p className="user-name">{this.state.users[user].username}</p>
                        <p className="score" >{this.state.users[user].points}</p>
                    </div>
                </div>
            );
        }

        return (
            <div id="scoreboard">
                {tags}
            </div>
        );
    }
}

export default Scoreboard;