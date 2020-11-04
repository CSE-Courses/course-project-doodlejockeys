import React, { useEffect, useState } from "react";
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

import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:8000";

function App() {
  
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      setResponse(data);
    });
  }, []);

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
export default App;
