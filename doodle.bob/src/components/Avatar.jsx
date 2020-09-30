import React, { Component } from "react";
import {
    Link,
    withRouter
} from "react-router-dom";
import chicken from "../tempAvatars/chicken.png";
import duck from "../tempAvatars/duck.png";
import rhino from "../tempAvatars/rhino.png";
import "../styles.css";

class Avatar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profilePictures: {
                "chicken": chicken,
                "duck": duck,
                "rhino": rhino,
            },
            current: rhino,
        };
    }

    handleRhino = event => {
        event.preventDefault();
        this.setState({
            current: rhino,
        });
    };
    handleChicken = event => {
        event.preventDefault();
        this.setState({
            current: chicken,
        });
    };

    handleDuck = event => {
        event.preventDefault();
        this.setState({
            current: duck,
        });
    };


    render() {
        return (
            <form className="signupPage">

                <div className="SignUp">

                    <h1 className="signUpHeading">
                        <p>Choose your Avatar</p>
                    </h1>

                    <center>

                        <br />
                        <div className="current">

                            <input type="image" src={this.state.current} alt="avatar" className="currentPic" />
                            <p className="currentLabel">Current Picture</p>
                        </div>
                        <div className="optionPics">

                            <input onClick={this.handleRhino} type="image" src={this.state.profilePictures["rhino"]} alt="avatar" className="optionPic" />
                            <input onClick={this.handleChicken} type="image" src={this.state.profilePictures.chicken} alt="avatar" className="optionPic" />
                            <input onClick={this.handleDuck} type="image" src={this.state.profilePictures.duck} alt="avatar" className="optionPic" />
                        </div>
                        <div className="signUpInputLineWidth">
                            <center>

                                <Link to="/PlayPage">
                                    <input type='submit' className="signUp_avatar" value="Submit Avatar" />
                                </Link>

                            </center>

                        </div>
                    </center>
                </div>

            </form>
        )
    }
}

export default Avatar;