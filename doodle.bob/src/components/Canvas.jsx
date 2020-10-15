import React, { Component } from 'react';
import Sketch from 'react-p5';
import "../styles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faEraser, faFillDrip, faCircle, faTrashAlt, faUndoAlt, faPaintBrush } from "@fortawesome/free-solid-svg-icons";


class Stroke {
	// Default stroke settings
	constructor(_init) {
		this.init = _init;
		this.points = [];
		this.stroke = "black";
		this.strokeWidth = 2;
	}
	// Adds stroke
	add(p5, point, stroke, strokeWidth) {
		p5.smooth();
		this.strokeWidth = strokeWidth;
		p5.strokeWeight(this.strokeWidth);
		this.points.push(point);
		this.stroke = stroke;
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
			drawing: false,
			strokes: "black",
			strokeWidth: 2,
		}
	}

	setup = (p5, parent) => {
		p5.createCanvas(700,500).parent(parent)
		p5.background(255);

		// var eraserbtn = p5.createButton("Erase All");
		// eraserbtn.parent(parent);
		// eraserbtn.mousePressed(this.resetSketch);
	}
//maybe refactor into  switch statements
	changeWhiteColor = () => {
		this.setState({
			strokes: "white"
		})
	}

	changeBlackColor = () => {
		this.setState({
			strokes: "black"
		})
	}

	changeRedColor = () => {
		this.setState({
			strokes: "red"
		})
	}	

	changeOrangeColor = () => {
		this.setState({
			strokes: "orange"
		})
	}	

	changeYellowColor = () => {
		this.setState({
			strokes: "yellow"
		})
	}

	changeGreenColor = () => {
		this.setState({
			strokes: "green"
		})
	}	

	changeBlueColor = () => {
		this.setState({
			strokes: "blue"
		})
	}

	changeIndigoColor = () => {
		this.setState({
			strokes: "indigo"
		})
	}

	changeVioletColor = () => {
		this.setState({
			strokes: "violet"
		})
	}

	resetSketch = () => {
		this.setState({
			erasing:true
		})
	}

	changeWidth = () => {
		if(this.state.strokeWidth === 2){
		this.setState({
			strokeWidth: 5,
			})
		}
		else{
			this.setState({
				strokeWidth:2
			})
		}
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
			ALL_STROKES[this.state.lastStrokeIdx].add(p5, p5.createVector(p5.mouseX, p5.mouseY), this.state.strokes, this.state.strokeWidth);
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
			<button className="toolbar-button"
                    onClick={this.changeBrush}> {this.state.diffBrush ? <FontAwesomeIcon icon={faPencilAlt}/> : <FontAwesomeIcon icon={faPaintBrush}/> }
            </button>
			<button className="toolbar-button"
					onClick = {this.changeWhiteColor}>
					<FontAwesomeIcon icon={faEraser}/>
			</button>
			<button className="toolbar-button">
					<FontAwesomeIcon icon={faFillDrip}/>
			</button>
			<button className="toolbar-button"
					onClick={this.changeWidth}> {this.state.diffWidth ? <FontAwesomeIcon icon={faCircle} size="sm"/> : <FontAwesomeIcon icon={faCircle} size="md"/>   }
			</button>
			<button classname="toolbar-button"
					style = {{height:"35px", width: "35px"}}>
					<FontAwesomeIcon icon={faUndoAlt}/>
			</button>
			<button className="toolbar-button" 
					style = {{backgroundColor:"white"}}
					onClick={this.changeWhiteColor}>
					1
			</button>
			<button className="toolbar-button" 
					style = {{backgroundColor:"black",color:"white"}}
					onClick={this.changeBlackColor}>
					2
			</button>
			<button className="toolbar-button"
					style = {{backgroundColor:"red"}}
					onClick={this.changeRedColor}>
					3
			</button>
			<button className="toolbar-button"
					style = {{backgroundColor:"orange"}}
					onClick={this.changeOrangeColor}>
					
					4
			</button>
			<button className="toolbar-button"
					style = {{backgroundColor:"yellow"}}
					onClick={this.changeYellowColor}>
					5
			</button>
			<button className="toolbar-button"
					style = {{backgroundColor:"green"}}
					onClick={this.changeGreenColor}>
					6
			</button>
			<button className="toolbar-button"
					style = {{backgroundColor:"blue", color: "white"}}
					onClick={this.changeBlueColor}>
					7
			</button>
			<button className="toolbar-button"
					style = {{backgroundColor:"indigo", color: "white"}}
					onClick={this.changeIndigoColor}>
					8
			</button>
			<button className="toolbar-button"
					style = {{backgroundColor:"violet"}}
					onClick={this.changeVioletColor}>
					9
			</button> 
			|
			<button classname="toolbar-button"
					style ={{height:"35px", width: "35px"}}
					onClick={this.resetSketch}>
					<FontAwesomeIcon icon={faTrashAlt}/>
			</button>
		</div>
	);
    }
}

export default Canvas;