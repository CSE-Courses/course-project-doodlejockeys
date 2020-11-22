import React, { Component } from "react";
import { Link } from "react-router-dom";
import chicken from "../tempAvatars/chicken.png";
import duck from "../tempAvatars/duck.png";
import rhino from "../tempAvatars/rhino.png";
import socket from '../server/socket'
import Commands from "../commands";
import '../css/Avatar.scss';
import { Button } from 'react-bootstrap';

class Avatar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room_code: props.match.params.room_code,
            user_info: '',
            profilePictures: {
                "chicken": chicken,
                "duck": duck,
                "rhino": rhino,
            },
            current: rhino,
        };
        this.submitPicture = this.submitPicture.bind(this);
        this.onPictureChange = this.onPictureChange.bind(this);
    }

    componentDidMount() {
    }

    onPictureChange(event) {
        event.preventDefault();
        console.log(event.target.id);
        let current = event.target.id;

        this.setState((state) => {
            return { current: state.profilePictures[current] }
        })
    }

    submitPicture() {
        socket.emit(Commands.SEND_PICTURE, {
            room_code: this.state.room_code,
            user_id: socket.id,
            profile_picture: String(this.state.current)
        });

        console.log(this.state.room_code);
    }


    render() {

        const options = [];

        for (let picture of Object.keys(this.state.profilePictures)) {
            options.push(
                <img id={picture} key={picture} src={this.state.profilePictures[picture]} alt={`Cartoon ${picture}`} className="option" onClick={this.onPictureChange} />
            );
        }

        return (
            <div className="avatar-container">
                <div className="avatar" >
                    <h1>Choose your profile picture.</h1>

                    <form className="options">
                        {options}
                    </form>

                    <div className="current-container">
                        <h2>Current picture</h2>
                        <img src={this.state.current} alt={`Cartoon`} className="current" />
                    </div>

                    <Link to={`/${this.state.room_code}/WordBank`} onClick={this.submitPicture}><Button variant="success">Submit Picture</Button></Link>
                </div>
            </div>
        )
    }
}

export default Avatar;