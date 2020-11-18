import React, { Component } from "react";
import {
    Link,
} from "react-router-dom";
import chicken from "../tempAvatars/chicken.png";
import duck from "../tempAvatars/duck.png";
import rhino from "../tempAvatars/rhino.png";
import plus from "../tempAvatars/plus.png";
import upload from "../tempAvatars/upload.png";
import "../styles.css";
import UserCreate from "./UserAvatar";
import ImageUploader from 'react-images-upload';


class Avatar extends Component {
    constructor(props) {
        super(props);
		this.onDrop = this.onDrop.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.state = {
            pictures: [],
            showPopup:false,
            profilePictures: {
                "chicken": chicken,
                "duck": duck,
                "rhino": rhino,
                "plus": plus,
            },
            current: rhino,
        };
    }

    onDrop = (picture) => { //pushes image to the pictures array.
        var imager = this.state.pictures
        imager.push(picture); //pushes picture on to imager
		this.setState({
            pictures: imager, //sets imager equal to pictures
        })
        console.log('content:', this.state.pictures);
        //console.log('hi');
        this.componentDidMount();
        
        //console.log(this.state.imager);
    };
    

    componentDidMount(){
        if (this.state.pictures.length != 0) {
            this.setState({
                current: this.state.pictures[0]}
    )

    }
       console.log(this.state.pictures.length);
    }

    togglePopup() {
        this.setState({
          showPopup: !this.state.showPopup //might have to put componentDidMount w/ a print statement
        }); //check that function is being called correctly.
        //this.componentDidMount();
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

    handlePlus = event => {
        event.preventDefault();
        this.setState({
            current: this.togglePopup(),
        })
    };
    
    render(){
        return (
            <form className="signupPage">
                <div className="SignUp">
                    <h1 className="signUpHeading">
                        <p>Choose your Avatar</p>
                    </h1>
                    {this.state.showPopup == true && (<div className='popup'>
                    <div className='popup_inner'>
                    <UserCreate/>
                    <button onClick={this.saveImage} id="downloadLink" className="popupbtn"> Save </button>
                    </div>
                    </div>)}
                    <center>
                        <br />
                        <div className="current">
                       
                            <input type="image" src={this.state.current} className="currentPic" />
                            <p className="currentLabel">Current Picture</p>
                        </div>
                        <div className="optionPics">
                            {/* {this.state.pictures != undefined && (<div className='optionPics' src={userAvi} </div> )} */}
                            <input onClick={this.handleRhino} type="image" src={this.state.profilePictures["rhino"]} alt="avatar" className="optionPic" />
                            <input onClick={this.handleChicken} type="image" src={this.state.profilePictures.chicken} alt="avatar" className="optionPic" />
                            <input onClick={this.handleDuck} type="image" src={this.state.profilePictures.duck} alt="avatar" className="optionPic" />
                            <input onClick={this.handlePlus} type="image" src={this.state.profilePictures.plus} className="optionPic" alt="avatar" />
                            <input onClick={this.onDrop} type="file" alt="avatar" />
                        
                        </div>
                        <div className="signUpInputLineWidth">
                            <center>
                                <Link to="/WordBank">
                                    <input type='submit' className="signUp_avatar" value="Submit Avatar" />
                                </Link>
                            </center>
                        </div>
                    </center>
                </div>
            </form>
        )
    }
};

export default Avatar;