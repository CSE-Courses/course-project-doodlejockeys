
import React, { Component } from "react";
import "./App.css";
import HomePage from "./components/Homepage";
import PlayPage from "./components/PlayPage";
import Avatar from "./components/Avatar";

//Import all needed Component for this tutorial
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={HomePage} />
        {/* accessed thru the continue to play button in homepage component */}
        <Route path="/Avatar" component={Avatar} />
        <Route path="/PlayPage" component={PlayPage} />
      </Router>
    );
  }
}
export default App;

/*
import React from 'react';
import './App.css';
import Chat from "./components/Chat"
import Canvas from "./components/Canvas"
import Clock from "./components/Clock"
import Toolbar from './components/Toolbar';

function App() {
  const gameInfo = {
    gameid: 0,
    roundNumber: 1,
    users: {
      1: { userid: 1, username: "iguanaoverlord", profilePic: "duck", role: "artist" },
      2: { userid: 2, username: "chickennuggets", profilePic: "chicken", role: "guesser" },
      3: { userid: 3, username: "walrusparade", profilePic: "rhino", role: "guesser" }
    },
  };
  return (
    <div className="App">
      <Clock />
      <Canvas />

      <Chat
        gameid={gameInfo.gameid}
        userList={gameInfo.users}
        round={gameInfo.roundNumber}
      />
      <Toolbar />
    </div>


  );
}

export default App; */
