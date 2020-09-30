import React, { Component } from "react";
import "../css/Homepage.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from "react-router-dom";
//Import all needed Component for this tutorial

//Functional Component
var rootStyle = {
  backgroundColor: "gold",
  color: "black",
  height: "100%"
};

//const HomePage = () => {
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onNewGameCard: true
    };
  }

  changeTabs = (event) => {
    event.preventDefault();
    this.setState({
      onNewGameCard: !this.state.onNewGameCard
    });
  };

  render() {
    return (
      <div>
        <div style={rootStyle}>
          <div className="pageContainer">
            <div className="left-col">
              <div class="logo">
                <img src={require("../images/logo.png")}
                  alt="dblogo"
                  class="dblogo" />
              </div>
              <div className="Welcome">
                <div>
                  <p>Welcome to</p>
                  <b>Doodle.bob</b>
                </div>
              </div>
            </div>
            <div className="right-col">
              <div className="game-card">
                {this.state.onNewGameCard && (
                  <div>
                    <div className="gameTabs">
                      <p className="tabOpen">New Game</p>
                      <button className="tabClosed" onClick={this.changeTabs}>
                        Join Game
                      </button>
                    </div>

                    <div className="literalCard">
                      <p className="enterGame">Game Code</p>
                      <textarea
                        className="gameCodeGiven"
                        value="RYCBAR"
                        rows="1"
                        cols="7"
                      ></textarea>

                      <p className="enterUsername">Choose a Username</p>
                      <textarea
                        className="usernameBox"
                        placeholder="Choose Username"
                        rows="1"
                        cols="30"
                      ></textarea>
                      <p className="enterUsername">Congratulations on starting the game!!! </p>
                      <p className="enterUsername">Make sure to share the code with your friends!</p>
                      <div>
                        <Link to="/Avatar"><button className="continueToPlay">
                          Continue to Play
                        </button> </Link>
                      </div>
                    </div>
                  </div>
                )}
                {!this.state.onNewGameCard && (
                  <div>
                    <div className="gameTabs">
                      <div className="inner">
                        <button className="tabClosed" onClick={this.changeTabs}>
                          New Game
                        </button>
                        <p className="tabOpen">Join Game</p>
                      </div>

                    </div>

                    <div className="literalCard">
                      <p className="enterGame">Enter Your Game Code to Join</p>
                      <textarea
                        className="gameCode"
                        placeholder="Enter Game Code Here"
                        rows="5"
                        cols="30"
                      ></textarea>

                      <p className="enterUsername">Choose a Username</p>
                      <textarea
                        className="usernameBox"
                        placeholder="Choose Username"
                        rows="1"
                        cols="30"
                      ></textarea>
                      <div>
                        <Link to="/Avatar"><button className="continueToPlay">
                          Continue to Play
                        </button> </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="footer">
            <div className="table">
              <ul className="horizontal-list">
                <li> Contact </li>
                <li> Terms of Service</li>
                <li> Credits </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
