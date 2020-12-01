import React, { Component } from 'react';
import { Link } from "react-router-dom";
import socket from '../server/socket';
import Commands from "../commands";
import '../css/WordBank.scss';
import Categories from '../categories';
import { Button, Modal } from 'react-bootstrap';

class WordBank extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room_code: props.match.params.room_code,
            user_info: '',
            results: new Set(),
            show_error: false,
            is_host: false
        }
        this.submitWordBank = this.submitWordBank.bind(this);
        this.updateCurrentCategories = this.updateCurrentCategories.bind(this);
        this.closeModal = this.closeModal.bind(this);

        socket.on(Commands.MOVE_ON, () => {

            if(!this.state.is_host) {
                this.submitWordBank()
            }
        });

        socket.off(Commands.UPDATE_CATEGORIES).on(Commands.UPDATE_CATEGORIES, (data) => {
            let categoryToUpdate = document.querySelector(`input[id="${data.category}"]`);
            let correspondingLabel = document.querySelector(`label[for="${data.category}"]`);
            categoryToUpdate.checked = data.checked;

            if(data.checked) {
                correspondingLabel.classList.add('selected');
            
            } else {
                correspondingLabel.classList.remove('selected');
            }
        });

        socket.off(Commands.GET_SELECTED_CATEGORIES).on(Commands.GET_SELECTED_CATEGORIES, (selected_categories) => {

            for(let category of selected_categories) {
                const label = document.querySelector(`label[for="${category}"]`);

                if(!label.classList.contains('selected')) {
                    label.classList.add('selected');
                }
            }
        });
    }

    componentDidMount() {
        socket.on(Commands.UPDATE_ROOMS_CLIENT, (data) => {

            if (data.host_id === socket.id) {
                this.setState({
                    is_host: true
                });
            } else {

                let all_labels = document.querySelectorAll('label');

                for (let label of all_labels) {
                    label.style.pointerEvents = "none";
                }
            }
        });

        socket.emit(Commands.GET_USER_INFO, this.state.room_code);

        socket.emit(Commands.GET_SELECTED_CATEGORIES, this.state.room_code);
    }

    submitWordBank(event) {
        let passedCategories = Array.from(this.state.results)

        if(this.state.is_host && passedCategories.length < 3) {
            this.setState({
                show_error: true
            });
            event.preventDefault();
        
        } else {

            if (this.state.is_host) {
                socket.emit(Commands.PICK_WORDS, {
                    room_code: this.state.room_code,
                    user_id: socket.id,
                    word_categories: passedCategories
                });
            }
            else {
                this.props.history.push(`/${this.state.room_code}/PlayPage`)
            }
        }
    }

    updateCurrentCategories(event) {
        const current = event.target.value

        if (!this.state.is_host) {

            event.preventDefault()
            event.stopPropagation()
        } else {
            let correspondingLabel = document.querySelector(`label[for="${event.target.id}"]`);

            if (event.target.checked) {
                correspondingLabel.classList.add('selected');
                this.state.results.add(current);
            }
            else {
                this.state.results.delete(current);
                correspondingLabel.classList.remove('selected');
            }

            socket.emit(Commands.UPDATE_CATEGORIES, {
                category: current,
                checked: event.target.checked,
                room_code: this.state.room_code,
                selected_categories: Array.from(this.state.results)
            });
        }

    }

    closeModal() {
        this.setState({
            show_error: false
        })
    }

    render() {
        const categories = [];

        for(let category of Object.keys(Categories)) {
            categories.push(
                <div key={category} className="category">
                    <label htmlFor={category}>{category}</label>
                    <input type="checkbox" value={category} id={category}></input>
                </div>
            );
        }

        return (
            <div className="categories">

                <Modal show={this.state.show_error} onHide={this.closeModal} centered>
                    <Modal.Header>
                        <Modal.Title className="text-danger">Error!</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Please select atleast 3 categories!</p>
                    </Modal.Body>
                </Modal>

                <h1 className="title">DOODLE.BOB</h1>
                <p className="heading"> Choose a category </p>

                <form onChange={this.updateCurrentCategories}>
                    {categories}
                </form>

                {this.state.is_host && <Link to={`/${this.state.room_code}/PlayPage`} onClick={this.submitWordBank}><Button variant="success">Start Game</Button></Link>}
            </div >
        )
    }
}
export default WordBank;
