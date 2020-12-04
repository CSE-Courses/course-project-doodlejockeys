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
                    console.log("HELLLLLOOOOOO")
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

    // findHowManyLettersNO() {
    //     var hint = ""
    //     if (this.props.current_time == this.props.time_per_round) {
    //         this.setState({
    //             lettersRevealed: []
    //         })
    //     }
    //     else if (this.props.current_time > 0) {
    //         var timeBetweenHints = 2 * (this.props.time_per_round / this.props.current_word.split("").length)
    //         var chosenIndex = -1
    //         if ((this.props.time_per_round - this.props.current_time) % timeBetweenHints == 0) {
    //             var chosenIndex = Math.floor(Math.random() * this.props.current_word.split("").length);
    //         }
    //         var tempArr = this.state.lettersRevealed
    //         for (var char of this.props.current_word.split("")) {
    //             if (chosenIndex == -1) {
    //                 if (char === ' ') {
    //                     console.log(this.props.current_word)
    //                     hint += "\xa0\xa0\xa0"
    //                 }
    //                 else {
    //                     hint += '_ '
    //                 }
    //             }
    //             else {
    //                 var chosenLetter = this.props.current_word.split("")[chosenIndex]
    //                 console.log(this.state.lettersRevealed, chosenLetter)
    //                 if (this.state.lettersRevealed.includes(char)) {
    //                     hint += char + '\xa0'
    //                 }
    //                 else if (char === chosenLetter) {
    //                     hint += chosenLetter + '\xa0'
    //                     tempArr.push(char)
    //                 }
    //                 else if (char === ' ') {
    //                     console.log(this.props.current_word)
    //                     hint += "\xa0\xa0\xa0"
    //                 }
    //                 else {
    //                     hint += '_ '
    //                 }
    //             }
    //         }
    //         this.setState({
    //             lettersRevealed: tempArr
    //         })
    //     }
    //     else {
    //         hint = this.props.current_word
    //     }
    //     return hint
    // }

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