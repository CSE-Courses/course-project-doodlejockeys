import React, { Component } from 'react';
import "../styles.css";
import chicken from "../tempAvatars/chicken.png";
import duck from "../tempAvatars/duck.png";
import rhino from "../tempAvatars/rhino.png";

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profilePictures: {
                "chicken": chicken,
                "duck": duck,
                "rhino": rhino
            },
            messages: [
                { userid: 1, messageid: 1, messageText: "hey man", correctFound: false },
                { userid: 2, messageid: 2, messageText: "I think it's an iguana", correctFound: false },
                { userid: 3, messageid: 3, messageText: "nah...that's a walrus", correctFound: false },
                { userid: 1, messageid: 4, messageText: "u guys r silly", correctFound: false },
                { userid: 3, messageid: 5, messageText: "ohhhhhh", correctFound: false },
                { userid: 3, messageid: 6, messageText: "it's definitely a shoe", correctFound: false },
                { userid: 3, messageid: 7, messageText: "what??? how is that wrong?", correctFound: false },
                { userid: 2, messageid: 8, messageText: "lol oops", correctFound: false }
            ],
            orderedMessages: [],
            newMessage: "",
            messageidLast: 8
        };
        this.handleNewMessage = this.handleNewMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    componentDidMount() {
        let temp = this.state.messages.sort()
        // if (this.state.messageidLast % 2 != 0) {
        this.setState({
            orderedMessages: temp.reverse()
        })
        // }
    }

    handleNewMessage(event) {
        this.setState({
            newMessage: event.target.value
        });
    }

    sendMessage(event) {
        if (this.state.newMessage.length > 0) {
            this.setState({
                orderedMessages: this.state.orderedMessages.reverse()
            })
            let copyMessages = this.state.messages;
            if (this.state.newMessage == this.props.word) {
                copyMessages.push({
                    userid: 1,
                    messageid: this.state.messageidLast + 1,
                    messageText: "Correct",
                    correctFound: true
                });
                this.props.userList[1].thisRoundScore = 1
                console.log(this.props.userList[1].thisRoundScore)
                this.setState({
                    messages: copyMessages,
                    newMessage: "",
                    messageidLast: this.state.messageidLast + 1
                });
            }
            else {
                copyMessages.push({
                    userid: 1,
                    messageid: this.state.messageidLast + 1,
                    messageText: this.state.newMessage,
                    correctFound: false
                });
                this.setState({
                    messages: copyMessages,
                    newMessage: "",
                    messageidLast: this.state.messageidLast + 1
                });
            }
            this.componentDidMount()
        }

    }

    render(props) {
        return (
            <div className="chat">
                <div className="conversation">
                    <header className="chatHeader">Chat and Guess!</header>
                    <p className="roundName">Round {this.props.round}</p>
                    <hr></hr>
                    <div className="chatHistory">
                        {this.state.orderedMessages.map((message) => (
                            <div>
                                {message.userid === 1 && (
                                    <div>
                                        <img src={this.state.profilePictures[this.props.userList[message.userid]["profilePic"]]} alt="my profile pic" className="myProPic" />
                                        <div>
                                            <p className="userNameChatSender">{this.props.userList[message.userid]["username"]}</p>
                                            {!message.correctFound && <div className="messageBoxSenderWrong">
                                                <h5 className="messageTextSender">{message.messageText}</h5>
                                            </div>}
                                            {message.correctFound && <div className="messageBoxSenderRight">
                                                <h5 className="messageTextSender">{message.messageText}</h5>
                                            </div>}
                                        </div>
                                    </div>
                                )}
                                {message.userid !== 1 && (
                                    <div>
                                        <img src={this.state.profilePictures[this.props.userList[message.userid]["profilePic"]]} alt="others profile pic" className="otherProPic" />
                                        <div>
                                            <p className="userNameChatReceiver">{this.props.userList[message.userid]["username"]}</p>
                                            {!message.correctFound && <div className="messageBoxReceiverWrong">
                                                <h5 className="messageTextReceiver">
                                                    {message.messageText}
                                                </h5>
                                            </div>}
                                            {message.correctFound && <div className="messageBoxReceiverRight">
                                                <h5 className="messageTextReceiver">
                                                    {message.messageText}
                                                </h5>
                                            </div>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="sending">
                        <textarea
                            onChange={this.handleNewMessage}
                            value={this.state.newMessage}
                            className="messageArea"
                            placeholder="Send A Message..."
                            rows="3" cols="1"
                        ></textarea>
                        <button
                            onClick={(event) => this.sendMessage(event)}
                            className="sendMessage"
                            type="submit"
                            value="Send"
                            name="PostContent"
                        >
                            Send
                </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;