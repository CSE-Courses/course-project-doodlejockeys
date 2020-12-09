import React, { Component } from 'react';
import "../css/styles.scss";
import Canvas from './Canvas';

let CURRENT_HINT = {}
let RAN = false

class Toolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isToggleOn: true,
            hint: "",
            timeBetweenHints: this.props.time_per_round,
            lettersRevealed: [],
            current_hint: {}
        };
        this.handleClick = this.handleClick.bind(this);
        this.formatHintString = this.formatHintString.bind(this);
        this.findHowManyLetters = this.findHowManyLetters.bind(this);
    }

    formatHintString(current_word_hint) {
        var hint = ""
        var current_word_broken_up = this.props.current_word.split("")
        for (var char of current_word_broken_up) {
            if (char == ' ') {
                hint += "\xa0\xa0\xa0"
            }
            else if (current_word_hint[char]) {
                hint += char + ' '
            }
            else {
                hint += '_ '
            }
        }
        return hint
    }

    findHowManyLetters() {
        RAN = !RAN
        if (!RAN) {
            var current_word_hint = CURRENT_HINT
            if (this.props.current_time >= this.props.time_per_round - 1) {
                CURRENT_HINT = {}
                var current_word_broken_up = this.props.current_word.split("")
                for (var char of current_word_broken_up) {
                    current_word_hint[char] = false
                }
            }
            else if (this.props.current_time <= 0) {
                var current_word_broken_up = this.props.current_word.split("")
                for (var char of current_word_broken_up) {
                    current_word_hint[char] = true
                }
            }
            else {
                var current_word_broken_up = this.props.current_word.split("")
                var timeBetweenHints = Math.floor(2 * (this.props.time_per_round / current_word_broken_up.length))
                var timeLost = this.props.time_per_round - this.props.current_time
                if (timeLost % timeBetweenHints == 0) {
                    var chosenChar = current_word_broken_up[Math.floor(Math.random() * current_word_broken_up.length)];
                    current_word_hint[chosenChar] = true
                }
            }
            var hint = this.formatHintString(current_word_hint)
            CURRENT_HINT = current_word_hint
            return hint
        }
        else {
            return this.formatHintString(CURRENT_HINT)
        }
    }

    handleClick() {
        this.setState(prevState => ({
            isToggleOn: !prevState.isToggleOn,
        }));
    }

    render() {
        return (
            <div className="toolbar">
                {!this.props.is_artist && <p>{this.findHowManyLetters()}</p>}
                {this.props.is_artist && <p>{this.props.current_word}</p>}
                <Canvas
                    room_code={this.props.room_code}
                    is_artist={this.props.is_artist}
                />
            </div>
        );
    }
}
export default Toolbar;