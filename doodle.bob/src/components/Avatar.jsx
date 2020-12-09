import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import antelope from "../tempAvatars/antelope.png";
import baby_penguin from "../tempAvatars/baby_penguin.png";
import bear from "../tempAvatars/bear.png";
import cat  from "../tempAvatars/cat.png";
import cobra from "../tempAvatars/cobra.png";
import cow from "../tempAvatars/cow.png";
import deer from "../tempAvatars/deer.png";
import dog from "../tempAvatars/dog.png";
import elephant from "../tempAvatars/elephant.png";
import fox from "../tempAvatars/fox.png";
import giraffe from "../tempAvatars/giraffe.png";
import gorilla from "../tempAvatars/gorilla.png";
import lion from "../tempAvatars/lion.png";
import monkey from "../tempAvatars/monkey.png";
import penguin from "../tempAvatars/penguin.png";
import pig  from "../tempAvatars/pig.png";
import rabbit from "../tempAvatars/rabbit.png";
import red_panda  from "../tempAvatars/red_panda.png";
import sheep from "../tempAvatars/sheep.png";
import koala from "../tempAvatars/koala.png";
import tiger from "../tempAvatars/tiger.png";
import wolf from "../tempAvatars/wolf.png";
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
        //this.onDrop = this.onDrop.bind(this);
     
        this.state = {
            pictures: [],
            room_code: props.match.params.room_code,
            user_info: '',
            profilePictures: {
                "chicken": chicken,
                "duck": duck,
                "rhino": rhino,
                "antelope": antelope,
                "baby penguin": baby_penguin,
                "bear": bear,
                "cat": cat,
                "cobra": cobra,
                "cow": cow,
                "deer": deer,
                "dog": dog,
                "elephant": elephant,
                "fox": fox,
                "giraffe": giraffe,
                "gorilla": gorilla,
                "koala": koala,
                "lion": lion,
                "monkey": monkey,
                "penguin": penguin,
                "pig": pig,
                "rabbit": rabbit,
                "red panda": red_panda,
                "sheep": sheep,
                "tiger": tiger,
                "wolf": wolf,
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
        let current = event.target.id;

        this.setState((state) => {
            return { current: state.profilePictures[current] }
        })
    }

    
    saveImage = (p5) => {
        p5.saveCanvas('myCanvas', 'jpg');
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

        } else {
            // event.preventDefault();
            // this.props.history.push(`/`);
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


