import React, { Component } from 'react';
import socket from '../server/socket'
import Commands from "../commands";

class Scoreboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            user_id: '',
            room_code: ''
        }
    }

    componentDidMount() {
        console.log("this page exists")
        socket.on(Commands.SEND_SCOREBOARD_INFO, (data) => {
            console.log(data)
            console.log(data.room_info.game_info);
            let users = data.room_info.users
            let room_code = data.room_code

            this.setState({
                users: users,
                user_id: socket.id,
                room_code: room_code
            })
        })
    }

    render(props) {

        const userList = { "bob": "bob" };
        const tags = [];

        // user_id to access in OPEN_ROOMS[room_code].users[ each user id] --> username, their points, profile pics


        for (let user of Object.keys(this.state.users)) {
            tags.push(
                <div className="user-score">
                    {console.log("user", this.state.users[user])}
                    <img src={this.state.users[user].profile_picture} alt="my profile pic" className="myProPic" />
                    <div className="user-info">
                        <p className="user-name">{this.state.users[user].username}</p>
                        <p className="score">{this.state.users[user].points}</p>
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