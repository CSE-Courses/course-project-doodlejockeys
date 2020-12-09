import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Avatar from "./components/Avatar"
import WordBank from "./components/WordBank"
import PlayPage from "./components/PlayPage";

function App() {

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/:room_code/PlayPage" component={PlayPage} />
        <Route exact path="/:room_code/Avatar" component={Avatar} />
        <Route exact path="/:room_code/WordBank" component={WordBank} />
      </Switch>
    </Router>
  );
}

export default App;
