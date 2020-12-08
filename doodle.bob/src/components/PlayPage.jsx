import React, { Component } from 'react';
import socket from '../server/socket';
import ChatRoom from "./ChatRoom"
import Clock from "./Clock"
import RoundsUI from "./RoundsUI"
import Scoreboard from "./Scoreboard"
import Toolbar from "./Toolbar"
import Commands from '../commands';
import Categories from '../categories';
import { Form, Button, Modal } from 'react-bootstrap';
import '../css/PlayPage.scss';


// Step 1, enter playpage, with modal for who is the artist open (if artist, choose word, if not, do not choose word)
// make function to be called in Commands.PICK_WORDS and onClick of start next round
// on exit of wordbank assign 1st artist, give role artist to selected, role guesser to not, add to artist history
// for selection have list of user_ids randomly pop until empty, when empty start next round with newly full list
// if artist, choose word
// set word to what artist chose in OPEN_ROOMS.game_info
// subround played
// call function on click of start next round


class PlayPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            preRoundState: false,
            room_code: props.match.params.room_code,
            game_info: {
                word_categories: [],
                rounds: 0,
                current_round: 0,
                current_subround: 0,
                current_word: '',
                time_per_round: 0,
                current_time: 0,
                current_artist_id: '',
                artist_history: []
            },
            is_artist: false,
            show_modal: false,
            users: {},
            game_over: false
        }

        this.closeModal = this.closeModal.bind(this);
        this.displayRandomWords = this.displayRandomWords.bind(this);
        this.random = this.random.bind(this);
        this.beginRound = this.beginRound.bind(this);
        this.setCustomWord = this.setCustomWord.bind(this);
        this.endScoreboard = this.endScoreboard.bind(this);
    }

    componentDidMount() {

        socket.off(Commands.BEGIN_ROUND).on(Commands.BEGIN_ROUND, (data) => {

            let sent_game_info = data.game_info;
            let is_artist = false
            if (data.game_info.current_artist_id === socket.id) is_artist = true

            console.log(`Is artist: ${is_artist}`);
            let game_info = {
                word_categories: sent_game_info.word_categories,
                rounds: sent_game_info.rounds,
                current_round: sent_game_info.current_round,
                current_subround: sent_game_info.current_subround,
                current_word: sent_game_info.current_word,
                time_per_round: sent_game_info.time_per_round,
                current_round: sent_game_info.current_round,
                current_artist_id: sent_game_info.current_artist_id,
                artist_history: sent_game_info.artist_history,
                current_time: sent_game_info.current_time
            };

            if (is_artist) {
                console.log("artist")
                // this.setState({
                //     show_modal: true,
                //     game_info: game_info
                // });

            } else {
                console.log("not artist")
                // this.setState({
                //     show_modal: false,
                //     game_info: game_info
                // })
            }

            this.setState({
                show_modal: true,
                game_info: game_info,
                is_artist: is_artist,
                users: data.users
            })
        });

        //This is for passing into ChatRoom so we can keep track of the score
        socket.on(Commands.CLOCK_PLAYPAGE, (data) => {
            this.state.game_info.current_time = data.current_time
            this.state.game_info.current_word = data.current_word
            this.setState((state) => { return { show_modal: state.show_modal } })
            this.closeModal()
            // console.log("time changing", this.state.game_info.current_time)
        })

        socket.on(Commands.END_ROUND, (data) => {
            console.log(data.users)
            this.setState({
                users: data.users
            });

            if(this.state.game_info.current_round >= this.state.game_info.rounds && this.state.game_info.current_subround >= Object.keys(this.state.users).length) {
                this.setState({
                    game_over: true
                });
            }
        })

    }

    beginRound(event) {
        this.setState({
            show_modal: false
        })
        console.log(event.target.dataset.value)
        this.state.game_info.current_word = event.target.dataset.value;
        socket.emit(Commands.BEGIN_ROUND, this.state.game_info);
        this.closeModal()
    }

    closeModal() {
        this.setState({
            show_modal: false,
            game_over: false
        })
    }

    random(a, b) {
        return Math.floor(a + Math.random() * (b - a));
    }

    onCustomWordChange(event) {
        this.setState({
            custom_word: event.target.value
        })
    }

    setCustomWord(event) {
        let custom_word = document.querySelector("#c-word").value;
        if (custom_word === '') {
            event.preventDefault();

        } else {
            event.target.dataset.value = custom_word;
            this.beginRound(event);
        }
    }

    displayRandomWords(categories) {

        console.log(categories, categories.length);

        let words = [];
        const MAX_WORDS = 3;
        let w = 0;

        for (let category of categories) {
            let random_category = categories[this.random(0, categories.length)];

            console.log(random_category);
            let available_words = Categories[random_category];
            let word = available_words[this.random(0, available_words.length)];

            words.push(<div className="choice" data-value={word} onClick={this.beginRound}>{word}</div>);
            w++;

            if (w >= MAX_WORDS) {
                break;
            }
        }

        words.push(
            <div className="custom-word">
                <Form.Control type="text" placeholder="Enter custom word" id="c-word" />
                <Button onClick={this.setCustomWord} variant="success">Submit Word</Button>
            </div>
        )

        console.log(words);

        return (
            <div className="choices">
                {words}
            </div>)
    }

    endScoreboard() {
        console.log(this.state.users);
        const user_list = Object.values(this.state.users);

        user_list.sort((u1, u2) => { return u2.points - u1.points });

        const tags = [];
        for(let i=0; i<user_list.length; ++i) {
            let user_obj = user_list[i];
            tags.push(
                <div className="user-score-end">
                    <div className="rank">{i+1}</div>
                    <img src={user_obj.profile_picture} alt={`${user_obj.username} avatar`} />
                    <div className="username-end">{user_obj.username}</div>
                    <div className="user-points-end">{user_obj.points}</div>
                </div>
            );
        }

        return <div className="scoreboard-end">{tags}</div>
    }

    render() {
        let pick_words = this.displayRandomWords(this.state.game_info.word_categories);
        console.log(this.state.game_info.current_time)
        return (
            <React.Fragment>

                <Modal animation={false} show={this.state.show_modal && this.state.is_artist} centered>
                    <Modal.Header>
                        <Modal.Title className="m-auto">Pick a word!</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {pick_words}
                    </Modal.Body>
                </Modal>
                <Modal animation={false} show={this.state.show_modal && !this.state.is_artist} onHide={this.closeModal} centered>
                    <Modal.Header>
                        <Modal.Title className="m-auto">The artist is picking a word.</Modal.Title>
                    </Modal.Header>
                </Modal>

                <Modal animation={false} show={this.state.game_over} centered>
                    <Modal.Header>
                        <Modal.Title className="m-auto">Game Over!</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {this.endScoreboard()}
                    </Modal.Body>

                    <Modal.Footer>
                        <p className="m-auto">To play another game goto: <a href="https://doodle-bob.herokuapp.com/">Doodle.bob homepage</a></p>
                    </Modal.Footer>
                </Modal>


                {!this.state.preRoundState && <div className="play-container">
                    <div className="left-col">
                        <Clock room_code={this.state.room_code} />
                        <Scoreboard
                            users={this.state.users}
                        />

                    </div>
                    <div className="center-col">
                        {/* <ScoreboardEnd /> */}
                        <RoundsUI artist_history={this.state.game_info.artist_history} />
                        <Toolbar
                            room_code={this.state.room_code}
                            is_artist={this.state.is_artist}
                            current_word={this.state.game_info.current_word}
                            current_time={this.state.game_info.current_time}
                            time_per_round={this.state.game_info.time_per_round}
                        />
                    </div>

                    <div className="right-col">
                        <ChatRoom
                            current_time={this.state.game_info.current_time}
                            current_word={this.state.game_info.current_word}
                            room_code={this.state.room_code}
                        />
                    </div>
                </div>}
            </React.Fragment>
        );
    }
}

export default PlayPage;