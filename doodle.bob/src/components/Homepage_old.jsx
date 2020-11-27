import { customAlphabet  } from 'nanoid';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import '../css/Homepage.scss'
import Commands from '../commands';
import socket from '../server/socket';
import { Button, Modal } from 'react-bootstrap';

class Homepage_old extends Component {
	constructor(props) {
		super(props);

		this.state = {
			room_code: customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz', 15)(),
			entered_code: '',
			username: '',
			user_id: '',
			open_rooms: [],
			show_empty_string_error: false,
			show_invalid_room_code_error: false
		};

		socket.off(Commands.UPDATE_ROOMS).on(Commands.UPDATE_ROOMS, (open_rooms) => {
			this.setState({
				open_rooms: open_rooms
			});
		});

		socket.off(Commands.ADD_ROOM).on(Commands.ADD_ROOM, (newly_created_room) => {
			this.state.open_rooms.push(newly_created_room);
		})

		this.setHost = this.setHost.bind(this);
		this.onUsernameChange = this.onUsernameChange.bind(this);
		this.joinRoom = this.joinRoom.bind(this);
		this.onRoomCodeChange = this.onRoomCodeChange.bind(this);
		this.keyPressHandlerJoinRoom = this.keyPressHandlerJoinRoom.bind(this);
		this.keyPressHandlerSetHost = this.keyPressHandlerSetHost.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	keyPressHandlerJoinRoom(event) {

		if(event.key === "Enter") {
			document.querySelector('#join-room').click();
		}
	}

	keyPressHandlerSetHost(event) {

		if(event.key === "Enter") {
			document.querySelector('#create-room').click();
		}
	}

	onUsernameChange(event) {
		this.setState({
			username: event.target.value
		});
	}

	onRoomCodeChange(event) {
		this.setState({
			entered_code: event.target.value
		});
	}

	closeModal() {
		this.setState({
			show_empty_string_error: false,
			show_invalid_room_code_error: false
		});
	}

	setHost (event) {
		
		if(this.state.username === '') {
			event.preventDefault();
			this.setState({
				show_empty_string_error: true
			});
		
		} else {

			socket.emit(Commands.SET_HOST, {
				user_id: socket.id,
				room_code: this.state.room_code,
				username: this.state.username
			});

			this.state.open_rooms.push(this.state.room_code);
		}
	}

	joinRoom(event) {
		if(this.state.username === '') {
			event.preventDefault();
			this.setState({
				show_empty_string_error: true
			});
		
		} else if(!this.state.open_rooms.includes(this.state.entered_code)) {
			event.preventDefault();
			this.setState({
				show_invalid_room_code_error: true
			});
		} else{

			socket.emit(Commands.JOIN_ROOM, {
				user_id: socket.id,
				room_code: this.state.entered_code,
				username: this.state.username
			});
		}
	}

	render() {

		return(
			<div className="homepage">

				<Modal show={this.state.show_empty_string_error} onHide={this.closeModal} centered>
					<Modal.Header closeButton>
						<Modal.Title className="text-danger">Error!</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						<p>Username cannot be empty.</p>
					</Modal.Body>
				</Modal>

				<Modal show={this.state.show_invalid_room_code_error} onHide={this.closeModal} centered>
					<Modal.Header closeButton>
						<Modal.Title className="text-danger">Error!</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						<p>Invalid room code.</p>
					</Modal.Body>
				</Modal>

				<div className="create-room">
					<h2>Create a room</h2>

					<div className="join-code">
						{this.state.room_code}
					</div>

					<input type="text" placeholder="Username" value={this.state.username} onChange={this.onUsernameChange} onKeyUp={this.keyPressHandlerSetHost} />
					
					<Link id="create-room" to={`/${this.state.room_code}/Chat`} onClick={this.setHost}>
						<Button variant="primary">Create Room!</Button>
					</Link>
				</div>

				<div className="join-room">
					<h2>Join a room</h2>

					<input type="text" placeholder="Paste code here." value={this.state.entered_code} onChange={this.onRoomCodeChange} onKeyUp={this.keyPressHandlerJoinRoom} />

					<input type="text" placeholder="Username" value={this.state.username} onChange={this.onUsernameChange} onKeyUp={this.keyPressHandlerJoinRoom} />

					<Link id="join-room" to={`/${this.state.entered_code}/Chat`} onClick={this.joinRoom}>
						<Button variant="primary">Join Room!</Button>
					</Link>
				</div>
			</div>
		);
	}
}

export default Homepage_old;