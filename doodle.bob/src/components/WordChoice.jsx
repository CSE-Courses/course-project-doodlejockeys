import React, { Component } from 'react';
import "../styles.css";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link,
    Redirect
} from "react-router-dom";

class WordChoice extends Component {
    state = {
        choice: 0,
        options: []
    }

    componentDidMount() {
        this.setState({
            options: this.props.words
        })
    }

    render() {
        return (
            <form className="signupPage">
                <div className="SignUp">
                    <h1 className="signUpHeading">Your turn to be the artist!</h1>
                    <div>
                        <center>
                            <br />
                            <div>
                                <h3>Here are some suggestions for what to draw!</h3>
                                {this.state.options.map((option) => (
                                    <div>
                                        {this.state.choice == this.state.options.indexOf(option) && <button>{option}</button>}
                                        {this.state.choice != this.state.options.indexOf(option) && <button>{option}</button>}
                                    </div>
                                ))}
                            </div>
                            <br />
                            <div>
                                <div>
                                    <h3>Don't like these? Create your own!</h3>
                                    <textarea
                                        className="usernameBox"
                                        placeholder="Choose Key Word"
                                        rows="1"
                                        cols="30"
                                    ></textarea>
                                </div>
                            </div>
                        </center>
                        <center>

                            <Link to="/PlayPage">
                                <input type='submit' className="signUp_avatar" value="Let's Play!" />
                            </Link>

                        </center>
                    </div>
                </div>
            </form>
        );
    }
}

export default WordChoice;