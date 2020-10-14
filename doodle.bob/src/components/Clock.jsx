import React, { Component } from 'react';

const TIMER_VALUE = 10;
const ROUND_VALUE = 1;


class Clock extends Component {

    constructor(props) {
      super(props);

        
      this.state = {
        seconds: TIMER_VALUE,
        paused: false,
        status: "Pause",
	round : ROUND_VALUE
      };
      this.clockToggle = this.clockToggle.bind(this);
    }
    
    
    componentDidMount() {
        this.timerId = setInterval(
            () => this.tick(), 1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    clockToggle() {
      this.setState({
        paused: !this.state.paused,
        status: this.state.paused?"Pause":"Resume"
      });

      if(this.state.status == "Start Next Round") {
        this.setState({
          seconds: TIMER_VALUE,
          paused: false,
          status: "Pause"
        });

        this.timerId = setInterval(
          () => this.tick(), 1000
        );
      }
    }

    tick() {
      if(this.state.seconds <= 1) {
	clearInterval(this.timerId);
        this.setState({
        status: "Start Next Round",
	round : this.state.round + 1
        })
      }

      if(this.state.paused == false) {
        this.setState({
            seconds: this.state.seconds - 1
        });
    
      }   
    }

    render(props) {
        return (
        <div id="clock">
            <p>{this.state.seconds + "s"}</p>
            <button onClick={this.clockToggle}>{this.state.status}</button>
	    <p>{"Round " + this.state.round}</p>
        </div>
    );
    }
}

export default Clock;
