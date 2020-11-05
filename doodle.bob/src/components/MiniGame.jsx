import React, { Component } from 'react';

class MiniGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            words: {
                "lilacs and rose": ["radicalness", "scadalise", "narcosis", "sidecars", "collider"],
                "doodle bobs": ["lobbed", "bobsled", "dodos", "oboes", "oodles"],
                "unheard of absurd": ["surfboarded", "surrounded", "hoarders", "harbor", "sundae"],
                "Un poquito Loco": ["lotion", "uncoil", "copilot", "quilt", "clout"],
                "ninety six thousand": ["destinations", "indents", "exhaustion", "antithesis", "antidote"],
                "eye of hurricane": ["reinforce", "carefree", "enrich", "archery", "cherry"],
                "elfish welfare": ["weasel", "whale", "wheelies", "whiffle", "waffle"],
                "hole in the ground": ["lightened", "thundering", "longitude", "undertone", "neutrino"],
                "shadow realms": ["homeward", "harmless", "malware", "smolder", "ordeal"],
                "wish upon a star": ["harpist", "piranhas", "snowsuit", "township", "unstrips"],
                "run you clever boy": ["overrule", "recovery", "bouncy", "nobler", "clone"],
                "prime directive": ["impeditive", "retrieve", "timepiece", "premeire", "riveted"],
                "john williams": ["womanish", "millions", "shallow", "aioli", "jowls"]
            },
            currentWord: "",
            showAnswers: false,
        }
        this.revealAnswers = this.revealAnswers.bind(this);
    }

    componentDidMount() {
        let keys = Object.keys(this.state.words);
        let chosen = keys[keys.length * Math.random() << 0];
        this.setState({
            currentWord: chosen
        })
    }

    revealAnswers(event) {
        this.setState({
            showAnswers: !this.state.showAnswers
        })
    }

    render() {
        return (
            <div>
                <h2>From the letters:</h2>
                <div style={{ color: "white", backgroundColor: "rgb(46, 46, 46)", width: "fit-content", borderRadius: "4px", padding: "5px" }}>
                    <h1>{this.state.currentWord}</h1>
                </div>
                <p>Find as many 3+ letter words as you can!</p>
                <br />
                <br />
                <div style={{ display: "flex" }}>
                    <div style={{ width: "45%", marginTop: "30px" }}>Click to see some of doodl.bob's favorite words they came up with</div>
                    <div style={{ width: "45%", height: "150px", backgroundColor: "rgb(151, 0, 50)", borderRadius: "10px" }} className="minigameReveal">
                        {this.state.showAnswers &&
                            <div style={{ backgroundColor: "rgb(151, 0, 50)" }}>
                                {this.state.words[this.state.currentWord].map((word) => (
                                    <div style={{ color: "white", marginTop: "8px" }}>{word}</div>
                                ))}
                            </div>
                        }
                        {!this.state.showAnswers &&
                            <button style={{ width: "100%", height: "150px", borderRadius: "10px", color: "white", cursor: "pointer" }} className="minigameReveal" onClick={(event) => this.revealAnswers(event)}>CLICK HERE!</button>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default MiniGame;