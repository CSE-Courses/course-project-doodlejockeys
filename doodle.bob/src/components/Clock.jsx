import React, { Component } from 'react';

const TIMER_VALUE = 5;


class Clock extends Component {

    constructor(props) {
      super(props);

        
      this.state = {
        seconds: TIMER_VALUE,
        paused: false,
        status: "Pause"
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

      if(this.state.status == "Reset") {
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
          status: "Reset"
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
        </div>
    );
    }
}

export default Clock;
