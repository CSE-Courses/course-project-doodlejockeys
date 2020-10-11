import React, { Component } from "react";
import "../styles.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from "react-router-dom";

var backg = {
    backgroundColor: "blue",
    color: "black",
    height: "100%"
  };

class WordBank extends Component{
    render(){
        return(
            <div className="headers">
                <div>
                    <h1 className="heading"> Choose Categories or make up your own! </h1>
                    </div>
                    <div className="submit">
                            <center>
                                <Link to="/PlayPage">
                                    <input type='submit' className="startgame" value="Start Game" /> Play
                                </Link>
                            </center>
                        </div> 
                    </div>
        )
    }
}
export default WordBank;