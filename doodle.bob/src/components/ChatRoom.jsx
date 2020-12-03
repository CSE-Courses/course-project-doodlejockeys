import React, { Component } from 'react';
import '../css/ChatRoom.scss';
import Commands from '../commands';
import socket from '../server/socket';
import 'animate.css';
// import '../css/Responsive.scss';
import { Button } from 'react-bootstrap';


class ChatRoom extends Component {
	constructor(props) {
		super(props);

		this.state = {
			room_code: props.room_code,
			messageToSend: '',
			user_info: '',
			messages: [],
			current_word: '',
			current_time: this.props.current_time
		}

		this.sendMessage = this.sendMessage.bind(this);
		this.onMessageChange = this.onMessageChange.bind(this);
		this.keyPressHandler = this.keyPressHandler.bind(this);
		this.addMessage = this.addMessage.bind(this);

		// Not sure why socket.io is firing the receive message event twice so using this hack.
		socket.off(Commands.RECEIVE_MESSAGE).on(Commands.RECEIVE_MESSAGE, (data) => {
			this.addMessage(data);
		});

		socket.off(Commands.JOINED_ROOM).on(Commands.JOINED_ROOM, (data) => {
			let messages = document.querySelector('.messages');
			let username = (socket.id === data.user_id) ? "You" : data.username;
			messages.innerHTML += `<li class="joining-message">${username} joined.</li>`;
		});

		socket.off(Commands.USER_LEFT).on(Commands.USER_LEFT, (user_data) => {
			let messages = document.querySelector('.messages');
			let username = (socket.id === user_data.user_id) ? "You" : user_data.username;
			messages.innerHTML += `<li class="joining-message">${username} left.</li>`;
		});
	}

	componentDidMount() {
		// console.log(this.props.current_time)
		socket.on(Commands.UPDATE_USERS, (data) => {
			this.setState({
				user_info: data[socket.id]
			});
		});

		socket.emit(Commands.GET_USER_INFO, this.state.room_code);

		socket.on(Commands.UPDATE_ROOMS_CLIENT, (data) => {
			console.log(data.game_info)
			this.setState({
				current_word: this.props.current_word
			})
			console.log(this.state)
		})

		console.log(socket.id);

	}

	addMessage(data) {

		const user_id = data.user_id;
		const current_user_id = socket.id;
		let message = data.message;
		let username = data.username;

		if (user_id === current_user_id) {
			username = 'You';
		}
		console.log(message.toLowerCase().trim(), this.props.current_word.toLowerCase().trim())
		if (message.toLowerCase().trim() === this.props.current_word.toLowerCase().trim()) {
			message = "Correct"
			if (user_id === current_user_id) {
				socket.emit(Commands.GOT_CORRECT_WORD, {
					current_time: this.props.current_time,
					user_id: socket.id,
					room_code: this.state.room_code
				})
			}
		}

		this.state.messages.push({
			username: username,
			message: message,
			sentByCurrentUser: user_id === current_user_id
		});

		this.setState((state) => {
			return { room_code: state.room_code }
		});

	}

	onMessageChange(event) {
		this.setState({
			messageToSend: event.target.value
		});
	}

	keyPressHandler(event) {

		if (event.key === 'Enter') {
			this.sendMessage(event);
			this.setState({
				messageToSend: ''
			});
		}
	}

	sendMessage(event) {

		if (this.state.messageToSend === '') {
			event.preventDefault();

			// TODO: Can't send empty message.

		} else {
			socket.emit(Commands.SEND_MESSAGE, {
				message: this.state.messageToSend,
				user_id: socket.id,
				username: this.state.user_info.username,
				room_code: this.state.room_code
			});

			this.setState({
				messageToSend: ''
			});
		}
	}

	render() {
		return (
			<div className="chat-room">
				<h1>{this.props.current_time}</h1>
				<div className="header">
					<div className="info">
						<div className="room-id">Room ID: <span className="grey">{this.state.room_code}</span></div>
						<div className="username">Username: <span className="grey">{this.state.user_info.username}</span></div>
					</div>
					<h1>Welcome to ChatRoom!</h1>
				</div>

				<ul className="messages">
					{this.state.messages.map((message, i) => (
						<li
							key={i}
							className={`animate__animated animate__faster message ${message.sentByCurrentUser ? "animate__fadeInRight current-user" : "animate__fadeInLeft other-user"}`}
						>
							<span>{message.message}</span>
							<div className="sender">{message.username}</div>
						</li>
					))}
				</ul>

				<div className="controls">
					<input onChange={this.onMessageChange} onKeyUp={this.keyPressHandler} type="text" placeholder="Type here..." value={this.state.messageToSend} />
					<Button variant="success" onClick={this.sendMessage}>Send</Button>
				</div>
			</div>
		);
	}
}

export default ChatRoom;