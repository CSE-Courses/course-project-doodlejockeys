import React, { Component } from 'react';
import Sketch from 'react-p5';
import "../styles.css";


class Stroke {
	constructor(_init) {
		this.init = _init;
		this.points = [];
		this.stroke = 0;
	}

	add(p5, point) {
		this.points.push(point);
		p5.stroke(this.stroke);
		p5.line(this.init.x, this.init.y, point.x, point.y);
		this.init.x = point.x;
		this.init.y = point.y;
	}
}

let ALL_STROKES = [];


class Canvas extends Component {

    constructor(props) {
		super(props);
		this.state = {
			lastStrokeIdx: -1,
			erasing: false,
			drawing: false
		}
	}

	setup = (p5, parent) => {
		p5.createCanvas(700,500).parent(parent)
		p5.background(255);

		var eraserbtn = p5.createButton("Erase All");
		eraserbtn.mousePressed(this.resetSketch);
		// eraserbtn.position();
	}

	resetSketch = () => {
		this.setState({
			erasing:true
		})
	}

	draw = (p5) => {
		p5.background(255);
		p5.noLoop();
	}

	mousePressed = (p5) => {
		if(this.state.erasing){
			p5.background(255);
			this.setState({erasing: false, lastStrokeIdx: -1});
			ALL_STROKES = [];
		}
		else{
			this.setState({
				lastStrokeIdx: this.state.lastStrokeIdx + 1,
				drawing: true
			});
			ALL_STROKES.push(new Stroke(p5.createVector(p5.mouseX, p5.mouseY)));
		}
	}

	mouseDragged =  (p5) => {

		if(this.state.drawing) {
			ALL_STROKES[this.state.lastStrokeIdx].add(p5, p5.createVector(p5.mouseX, p5.mouseY));
		}
	}

	mouseReleased = (p5) => {
		this.setState({
			drawing: false
		});
	}

	
    render(props) {
        return (
		<div id="canvas">
			<Sketch 
				setup={this.setup}
				draw = {this.draw}
				mousePressed = {this.mousePressed}
				mouseDragged = {this.mouseDragged}
				mouseReleased = {this.mouseReleased}
				/>
		</div>
	);
    }
}

export default Canvas;