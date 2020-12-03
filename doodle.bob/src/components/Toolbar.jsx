import React, { Component } from 'react';
import "../css/styles.scss";
import Canvas from './Canvas';

class Toolbar extends Component {
    constructor(props) {
        super(props);
        this.state = { isToggleOn: true };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(prevState => ({
            isToggleOn: !prevState.isToggleOn,
        }));
    }

    render() {
        return (
            <div className="toolbar">
                <button className="toolbar-button"
                    style={{ width: "auto" }}
                    onClick={this.handleClick}> {this.state.isToggleOn ? 'Show' : 'Hide'}
                </button>
                <Canvas 
                    room_code={this.props.room_code}
                    is_artist={this.props.is_artist}
                />
            </div>
        );
    }
}
export default Toolbar;