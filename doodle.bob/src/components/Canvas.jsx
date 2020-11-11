import React, { Component } from 'react';
import Sketch from 'react-p5';
import "../styles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPencilAlt,
    faEraser,
    faFillDrip,
    faCircle,
    faTrashAlt,
    faUndoAlt,
    faPaintBrush
} from
    "@fortawesome/free-solid-svg-icons";

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
        this.strokeWidth = strokeWidth;
        p5.strokeWeight(this.strokeWidth);
        this
            .points
            .push(point);
        this.stroke = stroke;
        p5.stroke(this.stroke);
        p5.line(this.init.x, this.init.y, point.x, point.y);
        this.init.x = point.x;
        this.init.y = point.y;
    }

}
//holds all strokes made
let ALL_STROKES = [];
let saveimgbtn;

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lastStrokeIdx: -1,
            erasing: false,
            drawing: false,
            strokes: "black",
            strokeWidth: 2,
            diffWidth: true,
            isToggleOn: true,
            diffBrush: true,
            SAVED: false,
		}
		this.handleClick = this.handleClick.bind(this);
		this.changeBrush = this.changeBrush.bind(this);
		this.changeWidth = this.changeWidth.bind(this);
    }

    buttonClicked = () => {
        this.setState({
            SAVED:true
        })
    }

    setup = (p5, parent) => {
        p5.createCanvas(700, 500).parent(parent)
        p5.background(255);

        var eraserbtn = p5.createButton("Reset");
        eraserbtn.parent(parent);
        // eraserbtn.parent(parent2);
        eraserbtn.mousePressed(this.resetSketch);

        saveimgbtn = p5.createButton("Save Canvas");
        saveimgbtn.parent(parent)
        saveimgbtn.mousePressed(this.buttonClicked)
     
    }
    //maybe refactor into switch statements. These functions change the brush color to said color.
    changeWhiteColor = () => {
        this.setState({ strokes: "white" })
    }

    changeBlackColor = () => {
        this.setState({ strokes: "black" })
    }

    changeRedColor = () => {
        this.setState({ strokes: "red" })
    }

    changeOrangeColor = () => {
        this.setState({ strokes: "orange" })
    }

    changeYellowColor = () => {
        this.setState({ strokes: "yellow" })
    }

    changeGreenColor = () => {
        this.setState({ strokes: "#26A65B" })
    }

    changeBlueColor = () => {
        this.setState({ strokes: "blue" })
    }

    changeIndigoColor = () => {
        this.setState({ strokes: "indigo" })
    }

    changeVioletColor = () => {
        this.setState({ strokes: "#c74691" })
    }

    changeLightGrayColor = () => {
        this.setState({ strokes: "#c9c9c9" })
    }

    changeDodgerBlueColor = () => {
        this.setState({ strokes: "dodgerblue" })
    }

    changeLightPurpleColor = () => {
        this.setState({ strokes: "#d8a6ff" })
    }

    changePinkColor = () => {
        this.setState({ strokes: "#ffa6da" })
    }

    changeGrayColor = () => {
        this.setState({ strokes: "gray" })
    }

    changeDarkRedColor = () => {
        this.setState({ strokes: "#850000" })
    }

    changeDarkOrangeColor = () => {
        this.setState({ strokes: "#ad6b00" })
    }

    changeDarkYellowColor = () => {
        this.setState({ strokes: "#e3e312" })
    }

    changeDarkGreenColor = () => {
        this.setState({ strokes: "#006442" })
    }

    changePurpleColor = () => {
        this.setState({ strokes: "#7918c4" })
    }

    resetSketch = () => {
        this.setState({
            erasing: true
        })
    }

    changeWidth = () => {

        if (this.state.strokeWidth == 2) {
            this.setState({
                strokeWidth: 5
            })
        }
        else if (this.state.strokeWidth == 5) {
            this.setState({
                strokeWidth: 15
            })
        }
        else if (this.state.strokeWidth == 15) {
            this.setState({
                strokeWidth: 30
            })
        }
        else {
            this.setState({
                strokeWidth: 2
            })
        }
        this.setState(prevState => ({ diffWidth: !prevState.diffWidth, }));
    }

    changeBrush() {
        this.setState(prevState => ({
            diffBrush: !prevState.diffBrush,
        }));
    }

    handleClick() {
        this.setState(prevState => ({
            isToggleOn: !prevState.isToggleOn,
        }));
    }


    draw = (p5) => {
        p5.background(255);
        p5.noLoop();
    }

	mousePressed = (p5) => {
        if(this.state.SAVED == true){
            saveimgbtn.mousePressed(p5.saveCanvas('my_canvas', 'png'));
            this.setState({
                SAVED: false
            })
            saveimgbtn.mousePressed(this.buttonClicked)
        }
 
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

    mouseDragged = (p5) => {
        if (this.state.drawing) {
            ALL_STROKES[this.state.lastStrokeIdx].add(p5, p5.createVector(p5.mouseX, p5.mouseY), this.state.strokes, this.state.strokeWidth);
        }
    }

    mouseReleased = () => {
        this.setState({ drawing: false, erasing: false });
    }

    render(props) {
        return (
            <div id="canvas">
                {sessionStorage.getItem("userID") == sessionStorage.getItem("currentArtist") && <Sketch
                    setup={this.setup}
                    draw={this.draw}
                    mousePressed={this.mousePressed}
                    mouseDragged={this.mouseDragged}
                    mouseReleased={this.mouseReleased} />}
                {sessionStorage.getItem("userID") != sessionStorage.getItem("currentArtist") &&
                    <Sketch
                        setup={this.setup} />
                }
                {/* <div> */}
                {/*style={{disply:"inline-block"}} > */}
                <div>
                    <button className="toolbar-button" onClick={this.changeBrush}>
                        {this.state.diffBrush ? <FontAwesomeIcon icon={faPencilAlt} /> : <FontAwesomeIcon icon={faPaintBrush} />}
                    </button>
                    <button className="toolbar-button" onClick={this.changeWhiteColor}>
                        <FontAwesomeIcon icon={faEraser} />
                    </button>
                    <button className="toolbar-button">
                        <FontAwesomeIcon icon={faFillDrip} />
                    </button>

                    <button
                        className="toolbar-button"
                        style={{
                            backgroundColor: "white"
                        }}
                        onClick={this.changeWhiteColor}>
                        <br />
                    </button>
                    <button
                        className="toolbar-button"
                        style={{
                            backgroundColor: "#c9c9c9"
                        }}
                        onClick={this.changeLightGrayColor}>
                        <br />
                    </button>
                    <button
                        className="toolbar-button"
                        style={{
                            backgroundColor: "red"
                        }}
                        onClick={this.changeRedColor}>
                        <br />
                    </button>
                    <button
                        className="toolbar-button"
                        style={{
                            backgroundColor: "orange"
                        }}
                        onClick={this.changeOrangeColor}>
                        <br />
                    </button>
                    <button
                        className="toolbar-button"
                        style={{
                            backgroundColor: "yellow"
                        }}
                        onClick={this.changeYellowColor}>
                        <br />
                    </button>
                    <button
                        className="toolbar-button"
                        style={{
                            backgroundColor: "#26A65B" //eucalyptis green
                        }}
                        onClick={this.changeGreenColor}>
                        <br />
                    </button>
                    <button
                        className="toolbar-button"
                        style={{
                            backgroundColor: "dodgerblue"
                        }}
                        onClick={this.changeDodgerBlueColor}>
                        <br />
                    </button>
                    <button
                        className="toolbar-button"
                        style={{
                            backgroundColor: "#d8a6ff"
                        }}
                        onClick={this.changeLightPurpleColor}>
                        <br />
                    </button>
                    <button
                        className="toolbar-button"
                        style={{
                            backgroundColor: "#ffa6da"
                        }}
                        onClick={this.changePinkColor}>
                        <br />
                    </button>
                    <br />  {/*line break toolbar in half. */}
                    <button className="toolbar-button"
                        onClick={this.changeWidth}>
                        {this.state.diffWidth ? <FontAwesomeIcon icon={faCircle} size="sm" /> : <FontAwesomeIcon icon={faCircle} size="md" />}
                    </button>
                    <button
                        classname="toolbar-button"
                        style={{ height: "35px", width: "35px" }}
                    >
                        <FontAwesomeIcon icon={faUndoAlt} />
                    </button>
                    <button
                        classname="toolbar-button"
                        style={{ height: "35px", width: "35px" }}
                        onClick={this.resetSketch}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                    <button
                        className="toolbar-button"
                        style={{
                            backgroundColor: "black"
                        }}
                        onClick={this.changeBlackColor}>
                        <br />
                    </button>
                    <button
                        className="toolbar-button"
                        style={{
                            backgroundColor: "gray"
                        }}
                        onClick={this.changeGrayColor}>
                        <br />
                    </button>
                    <button
                        className="toolbar-button"
                        style={{
                            backgroundColor: "#850000"
                        }}
                        onClick={this.changeDarkRedColor}>
                        <br />
                    </button>
                    <button
                        className="toolbar-button"
                        style={{
                            backgroundColor: "#ad6b00"
                        }}
                        onClick={this.changeDarkOrangeColor}>
                        <br />
                    </button>
                    <button
                        className="toolbar-button"
                        style={{
                            backgroundColor: "#e3e312"
                        }}
                        onClick={this.changeDarkYellowColor}>
                        <br />
                    </button>
                    <button
                        className="toolbar-button"
                        style={{
                            backgroundColor: "#006442"
                        }}
                        onClick={this.changeDarkGreenColor}>
                        <br />
                    </button>
                    <button
                        className="toolbar-button"
                        style={{
                            backgroundColor: "blue"
                        }}
                        onClick={this.changeBlueColor}>
                        <br />
                    </button>
                    <button
                        className="toolbar-button"
                        style={{
                            backgroundColor: "#7918c4"
                        }}
                        onClick={this.changePurpleColor}>
                        <br />
                    </button>
                    <button
                        className="toolbar-button"
                        style={{
                            backgroundColor: "#c74691" //violet
                        }}
                        onClick={this.changeVioletColor}>
                        <br />
                    </button>
                </div>
            </div>
        );
    }
}

export default Canvas;