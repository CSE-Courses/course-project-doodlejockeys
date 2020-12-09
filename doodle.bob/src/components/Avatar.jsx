import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import chicken from "../tempAvatars/chicken.png";
import duck from "../tempAvatars/duck.png";
import rhino from "../tempAvatars/rhino.png";
import socket from '../server/socket'
import Commands from "../commands";
import '../css/Avatar.scss';
import { Button } from 'react-bootstrap';
import Sketch from 'react-p5';
//import "../styles.css";
import UserCreate from "./UserCreate";
import ImageUploader from 'react-images-upload';
import plus from "../tempAvatars/plus.png";
import upload from "../tempAvatars/upload.png";


class Avatar extends Component {
    constructor(props) {
        super(props);     
        this.state = {
            pictures: [],
            room_code: props.match.params.room_code,
            user_info: '',
            profilePictures: {
                "chicken": chicken,
                "duck": duck,
                "rhino": rhino,
            },
            current: rhino,
            open_rooms: []
        };
        this.submitPicture = this.submitPicture.bind(this);
        this.onPictureChange = this.onPictureChange.bind(this);
    
    }
    componentDidMount() {
        socket.emit(Commands.UPDATE_ROOMS, {
            room_code: this.state.room_code
        });

        socket.on(Commands.UPDATE_ROOMS, open_rooms => {
            console.log('Updating rooms...', Object.keys(open_rooms));
            let rooms = [];

            for (let room of Object.keys(open_rooms)) {
                let game_info = open_rooms[room].game_info;

                if (!game_info.game_started) {
                    rooms.push(room);
                }
            }

            this.setState({
                open_rooms: rooms
            });
        });
    }

    onPictureChange(event) {
        event.preventDefault();
        console.log(event.target.id);
        let current = event.target.id;

        this.setState((state) => {
            return { current: state.profilePictures[current] }
        })
    }

    submitPicture(event, pictureFiles) {
        this.setState({
            current: this.state.pictures.concat(pictureFiles)
        })
        if (this.state.open_rooms.includes(this.state.room_code)) {
            socket.emit(Commands.SEND_PICTURE, {
                room_code: this.state.room_code,
                user_id: socket.id,
                profile_picture: String(this.state.current)
            });

            console.log(this.state.room_code);

        } 
        else {
            event.preventDefault();
            this.props.history.push(`/`);
        }
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
                <p className="invite">Invite your Friends: {this.state.room_code}</p>
                <div className="avatar" >
                    <h1>Choose your profile picture.</h1>

                    <form className="options">
                        {options}
                        <p className="paragraph"> or upload your own</p>
                    </form>

                    <div className="imageup">
                    <ImageUploader
                    withIcon={false}
                    withPreview={true}
                    buttonText="Choose image"
                    onChange={this.submitPicture}
                    imgExtension={[ ".jpg", ".gif",  ".png",  ".gif"]}
                    maxFileSize={5242880}
                    />
                    </div>

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


