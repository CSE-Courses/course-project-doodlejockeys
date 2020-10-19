
import React, { Component } from "react";
import "./App.css";
import HomePage from "./components/Homepage";
import PlayPage from "./components/PlayPage";
import Avatar from "./components/Avatar";
import WordBank from "./components/WordBank";

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
        <Route path="/WordBank" component={WordBank}  />
      </Router>
    );
  }
}
export default App;
