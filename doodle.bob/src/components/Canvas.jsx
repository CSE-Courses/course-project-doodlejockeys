import React, { Component } from 'react';
import Sketch from 'react-p5';
import "../css/styles.scss";
import "../css/Canvas.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPencilAlt,
    faEraser,
    faFillDrip,
    faCircle,
    faTrashAlt,
    faUndoAlt,
    faPaintBrush,
    faSave,
    faSquare,
    faRainbow
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
let initial_x = -1;
let initial_y = -1;



class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawing: false,
            stroke: "black",
            strokeWidth: 2,
            diffBrush: true,
            colors: [
                "white",
                "#c9c9c9",
                "red",
                "orange",
                "yellow",
                "#26A65B",
                "dodgerblue",
                "#d8a6ff",
                "#ffa6da",
                "black",
                "gray",
                "#850000",
                "#ad6b00",
                "#e3e312",
                "#006442",
                "blue",
                "#7918c4",
                "#c74691"
            ],
            room_code: props.room_code,
            is_artist: this.props.is_artist,
        }

        this.changeBrush = this.changeBrush.bind(this);
        this.changeWidth = this.changeWidth.bind(this);
        this.savebuttonClicked = this.savebuttonClicked.bind(this);
        this.changeColor = this.changeColor.bind(this);
    }

    undoButtonClicked(p5) {

        if (this.props.is_artist) {
            ALL_STROKES.pop();
            p5.redraw(1);

            socket.emit(Commands.UNDO_STROKE, {
                room_code: this.state.room_code,
            });

        } else {
            // Do Nothing...
        }
    }


    savebuttonClicked(p5, canvas) {
        p5.saveCanvas(canvas, 'my_canvas', 'png');
    }


    setup = (p5, parent) => {
        p5.noLoop();
        let center_col_width = document.querySelector('.center-col').clientWidth;
        let center_col_height = document.querySelector('.center-col').clientHeight;
        let toolbar_height = document.querySelector('.tools-container').clientHeight;
        let rounds_container_height = 90;

        let canvas_container = p5.createCanvas(center_col_width - 50, center_col_height - rounds_container_height - 2 * toolbar_height).parent(parent)
        p5.background(255);

        // Resize listener
        window.addEventListener("resize", () => {
            center_col_height = document.querySelector('.center-col').clientHeight;
            toolbar_height = document.querySelector('.tools-container').clientHeight;
            rounds_container_height = document.querySelector('.rounds-container').clientHeight;

            console.log("resize", center_col_height - rounds_container_height - 2 * toolbar_height, center_col_height, rounds_container_height, toolbar_height);

            canvas_container.canvas.style.height = `${center_col_height - rounds_container_height - 2 * toolbar_height}px`
        });

        // Toolbar buttons listeners.
        document.querySelector("#undo").addEventListener("click", () => {
            this.undoButtonClicked(p5);
        });

        document.querySelector("#reset").addEventListener("click", () => {
            this.resetSketch(p5);
        });

        document.querySelector("#save-canvas").addEventListener("click", () => {
            this.savebuttonClicked(p5, canvas_container);
        })
        // Toolbar buttons listeners end.

        // Canvas Listeners.
        canvas_container.canvas.addEventListener("mousedown", () => {

            ALL_STROKES.push(new Stroke(p5.createVector(p5.mouseX, p5.mouseY)));

            socket.emit(Commands.PUSH_STROKE, {
                room_code: this.state.room_code,
                x: p5.mouseX,
                y: p5.mouseY,
            })

            this.setState({
                drawing: true
            });
        });
        canvas_container.canvas.addEventListener("mousemove", () => {
            if (this.props.is_artist && this.state.drawing) {
                ALL_STROKES[ALL_STROKES.length - 1].add(p5, p5.createVector(p5.mouseX, p5.mouseY), this.state.stroke, this.state.strokeWidth);

                socket.emit(Commands.SEND_STROKES, {
                    room_code: this.state.room_code,
                    x: p5.mouseX,
                    y: p5.mouseY,
                    stroke_weight: this.state.strokeWidth,
                    stroke_color: this.state.stroke,
                });
            }
        });
        canvas_container.canvas.addEventListener("mouseup", () => {
            if (this.props.is_artist) {
                this.setState({ drawing: false });

                socket.emit(Commands.DONE_DRAWING, {
                    room_code: this.state.room_code,
                    x: -1,
                    y: -1,
                })
            }
        });
        canvas_container.canvas.addEventListener("mouseout", () => {
            this.setState({
                drawing: false
            })
        });
        // Canvas Listeners end.

        // Recieve strokes and display
        socket.on(Commands.SEND_STROKES, (data) => {
            if (initial_x > 0 || initial_y > 0) {
                ALL_STROKES[ALL_STROKES.length - 1].add(p5, p5.createVector(data.x, data.y), data.stroke_color, data.stroke_weight);

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
            ALL_STROKES = [];
            p5.redraw(1);
            console.log("Sketch Reset");
        })

        socket.on(Commands.UNDO_STROKE, (data) => {
            ALL_STROKES.pop();
            p5.redraw(1);
        })

        socket.on(Commands.PUSH_STROKE, (data) => {
            ALL_STROKES.push(new Stroke(p5.createVector(data.x, data.y)));
        })

    }

    changeColor(event) {
        let color = event.target.dataset.color;

        this.setState({
            stroke: color
        })
    }

    resetSketch = (p5) => {
        if (this.props.is_artist) {
            ALL_STROKES = [];
            p5.redraw(1);

            socket.emit(Commands.SKETCH_RESET, {
                room_code: this.state.room_code,
            });
        }
    }

    changeWidth() {
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

    componentDidUpdate() {

        // console.log(this.props.is_artist, this.props.is_artist);

    }

    draw = (p5) => {

        p5.background(255);
        for (let stroke of ALL_STROKES) {
            stroke.draw(p5);
        }
    }

    render(props) {
        let color_palette = [];

        for (let color of this.state.colors) {
            color_palette.push(
                <button
                    className="toolbar-button"
                    data-color={color}
                    style={{ backgroundColor: color }}
                    onClick={this.changeColor}>
                    <br />
                </button>
            )
        }

        return (
            <div id="canvas">
                {/* {sessionStorage.getItem("userID") == sessionStorage.getItem("currentArtist") &&  */}
                <Sketch
                    setup={this.setup}
                    draw={this.draw}
                    mousePressed={this.mousePressed}
                    mouseDragged={this.mouseDragged}

                    mouseReleased={this.mouseReleased} />
                <div className="tools-container">
                    <div className="tools">
                        <button className="toolbar-button" onClick={this.changeBrush}>
                            {this.state.diffBrush ? <FontAwesomeIcon icon={faPencilAlt} /> : <FontAwesomeIcon icon={faPaintBrush} />}
                        </button>

                        <button className="toolbar-button" onClick={this.changeBrush}>
                            {this.state.diffBrush ? <FontAwesomeIcon icon={faSquare} /> : <FontAwesomeIcon icon={faSquare} />}
                        </button>

                        <button className="toolbar-button" onClick={this.changeBrush}>
                            {this.state.diffBrush ? <FontAwesomeIcon icon={faRainbow} /> : <FontAwesomeIcon icon={faRainbow} />}
                        </button>


                        <button id="save-canvas" className="toolbar-button">
                            <FontAwesomeIcon icon={faSave} />
                        </button>

                        <button className="toolbar-button"
                            onClick={this.changeWidth}>
                            {this.state.diffWidth ? <FontAwesomeIcon icon={faCircle} size="sm" /> : <FontAwesomeIcon icon={faCircle} size="md" />}
                        </button>


                        <button className="toolbar-button" onClick={this.changeWhiteColor}>
                            <FontAwesomeIcon icon={faEraser} />
                        </button>

                        <button
                            classname="toolbar-button"
                            id="undo"
                            style={{ height: "35px", width: "35px" }}>
                            <FontAwesomeIcon icon={faUndoAlt} />
                        </button>

                        <button
                            id="reset"
                            classname="toolbar-button"
                            style={{ height: "35px", width: "35px" }}>
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                    </div>

                    <div className="color-palette">
                        {color_palette}
                    </div>
                </div>
            </div>
        );
    }
}

export default Canvas;