import React, { Component } from 'react';
import Sketch from 'react-p5';
import "../css/styles.scss";
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
import Commands from '../commands';
import socket from '../server/socket';


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
        this.points.push(point);
        this.stroke = stroke;
        p5.stroke(this.stroke);
        p5.line(this.init.x, this.init.y, point.x, point.y);
        this.init.x = point.x;
        this.init.y = point.y;
    }

    draw(p5) {
        let temp_X = this.init.x;
        let temp_Y = this.init.y;

        for (let i = this.points.length - 1; i >= 0; i--) {
            p5.stroke(this.stroke)
            p5.strokeWeight(this.strokeWidth)
            p5.line(temp_X, temp_Y, this.points[i].x, this.points[i].y);
            temp_X = this.points[i].x;
            temp_Y = this.points[i].y;
        }
    }
}
//holds all strokes made
let ALL_STROKES = [];
let saveimgbtn;
let canv;
let initial_x = -1;
let initial_y = -1;



class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lastStrokeIdx: -1,
            erasing: false,
            drawing: false,
            strokes: "black",
            strokeWidth: 2,
            isToggleOn: true,
            diffBrush: true,
            SAVED: false,
            undo: false,
            room_code: props.room_code,
            is_artist: this.props.is_artist,
        }
        this.handleClick = this.handleClick.bind(this);
        this.changeBrush = this.changeBrush.bind(this);
        this.changeWidth = this.changeWidth.bind(this);
    }
    undoButtonClicked = () => {
        if (this.props.is_artist) {
            this.setState({
                undo: true
            });

            ALL_STROKES.pop();

            // this.setState((state, props) => ({
            //     lastStrokeIdx: ALL_STROKES.length
            // }));
        }
    }


    setup = (p5, parent) => {
        console.log(this.props.is_artist);

        canv = p5.createCanvas(700, 500).parent(parent)
        p5.background(255);

        var eraserbtn = p5.createButton("Reset");
        eraserbtn.parent(parent);
        eraserbtn.mousePressed(this.resetSketch);

        saveimgbtn = p5.createButton("Save Canvas");
        saveimgbtn.parent(parent)
        saveimgbtn.mousePressed(this.savebuttonClicked)

        var undoBtn = p5.createButton('Undo');
        undoBtn.parent(parent);
        undoBtn.mousePressed(this.undoButtonClicked);
        canv.canvas.addEventListener("mousedown", () => {

            ALL_STROKES.push(new Stroke(p5.createVector(p5.mouseX, p5.mouseY)));

            socket.emit(Commands.PUSH_STROKE, {
                room_code: this.state.room_code,
                x: p5.mouseX,
                y: p5.mouseY,
            })

            this.setState({
                drawing: true
            });
        })
        canv.canvas.addEventListener("mousemove", () => {
            if (this.props.is_artist && this.state.drawing) {
                ALL_STROKES[ALL_STROKES.length - 1].add(p5, p5.createVector(p5.mouseX, p5.mouseY), this.state.strokes, this.state.strokeWidth);

                socket.emit(Commands.SEND_STROKES, {
                    room_code: this.state.room_code,
                    x: p5.mouseX,
                    y: p5.mouseY,
                    stroke_weight: this.state.strokeWidth,
                    stroke_color: this.state.strokes,
                });
            }
        })
        canv.canvas.addEventListener("mouseup", () => {
            if (this.props.is_artist) {
                this.setState({ drawing: false, erasing: false });

                socket.emit(Commands.DONE_DRAWING, {
                    room_code: this.state.room_code,
                    x: -1,
                    y: -1,
                })
            }
        })
        canv.canvas.addEventListener("mouseout", () => {
            this.setState({
                drawing: false
            })
        })

        // Recieve strokes and display
        socket.on(Commands.SEND_STROKES, (data) => {
            if (initial_x > 0 || initial_y > 0) {
                ALL_STROKES[ALL_STROKES.length - 1].add(p5, p5.createVector(data.x, data.y), data.stroke_color, data.stroke_weight);

                // p5.stroke(data.stroke_color);
                // p5.strokeWeight(data.stroke_weight);
                // p5.line(initial_x, initial_y, data.x, data.y);

                initial_x = data.x;
                initial_y = data.y;


                console.log(data);
            }
            else {
                // ALL_STROKES.push(new Stroke(p5.createVector(data.x, data.y)));    
                initial_x = data.x;
                initial_y = data.y;
            }
        })

        socket.on(Commands.DONE_DRAWING, (data) => {
            initial_x = data.x;
            initial_y = data.y;
        })

        socket.on(Commands.SKETCH_RESET, (data) => {
            p5.background(255);
            ALL_STROKES = [];
            console.log("Sketch Reset");
        })

        socket.on(Commands.UNDO_STROKE, (data) => {
            p5.background(255);
            ALL_STROKES.pop();
            for (var i = 0; i < ALL_STROKES.length; i++) {
                ALL_STROKES[i].draw(p5);
            }
        })

        socket.on(Commands.PUSH_STROKE, (data) => {
            ALL_STROKES.push(new Stroke(p5.createVector(data.x, data.y)));
        })

    }

    //maybe refactor into switch statements. These functions change the brush color to said color.
    changeWhiteColor = () => {
        if (this.props.is_artist) {
            this.setState({ strokes: "white" })
        }
    }

    changeBlackColor = () => {
        if (this.props.is_artist) {
            this.setState({ strokes: "black" })
        }
    }

    changeRedColor = () => {
        if (this.props.is_artist) {
            this.setState({ strokes: "red" })
        }
    }

    changeOrangeColor = () => {
        if (this.props.is_artist) {
            this.setState({ strokes: "orange" })
        }
    }

    changeYellowColor = () => {
        if (this.props.is_artist) {
            this.setState({ strokes: "yellow" })
        }
    }

    changeGreenColor = () => {
        if (this.props.is_artist) {
            this.setState({ strokes: "#26A65B" })
        }
    }

    changeBlueColor = () => {
        if (this.props.is_artist) {
            this.setState({ strokes: "blue" })
        }
    }

    changeIndigoColor = () => {
        if (this.props.is_artist) {
            this.setState({ strokes: "indigo" })
        }
    }

    changeVioletColor = () => {
        if (this.props.is_artist) {
            this.setState({ strokes: "#c74691" })
        }
    }

    changeLightGrayColor = () => {
        if (this.props.is_artist) {
            this.setState({ strokes: "#c9c9c9" })
        }
    }

    changeDodgerBlueColor = () => {
        if (this.props.is_artist) {
            this.setState({ strokes: "dodgerblue" })
        }
    }

    changeLightPurpleColor = () => {
        if (this.props.is_artist) {
            this.setState({ strokes: "#d8a6ff" })
        }
    }

    changePinkColor = () => {
        if (this.props.is_artist) {
            this.setState({ strokes: "#ffa6da" })
        }
    }

    changeGrayColor = () => {
        if (this.props.is_artist) {
            this.setState({ strokes: "gray" })
        }
    }

    changeDarkRedColor = () => {
        if (this.props.is_artist) {
            this.setState({ strokes: "#850000" })
        }
    }

    changeDarkOrangeColor = () => {
        if (this.props.is_artist) {
            this.setState({ strokes: "#ad6b00" })
        }
    }

    changeDarkYellowColor = () => {
        if (this.props.is_artist) {
            this.setState({ strokes: "#e3e312" })
        }
    }

    changeDarkGreenColor = () => {
        if (this.props.is_artist) {
            this.setState({ strokes: "#006442" })
        }
    }

    changePurpleColor = () => {
        if (this.props.is_artist) {
            this.setState({ strokes: "#7918c4" })
        }
    }

    resetSketch = () => {
        if (this.props.is_artist) {
            this.setState({
                erasing: true
            })
        }
    }

    changeWidth = () => {
        if (this.props.is_artist) {
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
    }

    changeBrush() {
        if (this.props.is_artist) {
            this.setState(prevState => ({
                diffBrush: !prevState.diffBrush,
            }));
        }
    }

    handleClick() {
        if (this.props.is_artist) {
            this.setState(prevState => ({
                isToggleOn: !prevState.isToggleOn,
            }));
        }
    }

    componentDidUpdate() {

        // console.log(this.props.is_artist, this.props.is_artist);

    }

    draw = (p5) => {

        console.log("Redrawing");

        if (this.state.undo == true) {
            p5.background(255);

            for (var i = 0; i < ALL_STROKES.length; i++) {

                ALL_STROKES[i].draw(p5);
            }

            this.setState({
                undo: false
            })
        }
        p5.noLoop();
    }


    mousePressed = (p5) => {
        if (this.props.is_artist) {

            if (this.state.undo) {
                p5.redraw();

                socket.emit(Commands.UNDO_STROKE, {
                    room_code: this.state.room_code,
                })

                return;
            }

            if (this.state.SAVED == true) { //saving drawing.
                saveimgbtn.mousePressed(p5.saveCanvas(canv, 'my_canvas', 'png'));
                this.setState({
                    SAVED: false
                })
                saveimgbtn.mousePressed(this.savebuttonClicked)
            }

            if (this.state.erasing) {
                p5.background(255);
                this.setState({ erasing: false, lastStrokeIdx: -1 });
                ALL_STROKES = [];

                socket.emit(Commands.SKETCH_RESET, {
                    room_code: this.state.room_code,
                })
            }

        }
    }

    mouseDragged = (p5) => {

    }

    mouseReleased = () => {

    }

    render(props) {
        return (
            <div id="canvas">
                {/* {sessionStorage.getItem("userID") == sessionStorage.getItem("currentArtist") &&  */}
                <Sketch
                    setup={this.setup}
                    draw={this.draw}
                    mousePressed={this.mousePressed}
                    mouseDragged={this.mouseDragged}

                    mouseReleased={this.mouseReleased} />
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
                    {/*line break toolbar in half. */}
                    <br />
                    <button className="toolbar-button"
                        onClick={this.changeWidth}>
                        {this.state.diffWidth ? <FontAwesomeIcon icon={faCircle} size="sm" /> : <FontAwesomeIcon icon={faCircle} size="md" />}
                    </button>
                    <button
                        classname="toolbar-button"
                        style={{ height: "35px", width: "35px" }}
                        onClick={this.undoButtonClicked}>
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