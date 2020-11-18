import React, {Component} from 'react';
import Canvas from "./Canvas";
import Sketch from 'react-p5';
import "../styles.css";


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


class UserCreate extends React.Component {
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
}
this.handleClick = this.handleClick.bind(this);
  }
  setup = (p5, parent) => {
    p5.createCanvas(684, 540).parent(parent)
    p5.background(255);
   
    var eraserbtn = p5.createButton("Reset");
    eraserbtn.parent(parent);
    // eraserbtn.parent(parent2);
    eraserbtn.mousePressed(this.resetSketch);
}


resetSketch = () => {
  this.setState({
    erasing: true
  })
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
    this.setState({drawing: false, erasing: false});
}



render(props) {
  return (
      <div id="canvas">
          <Sketch
              setup={this.setup}
              draw={this.draw}
              mousePressed={this.mousePressed}
              mouseDragged={this.mouseDragged}
              mouseReleased={this.mouseReleased}/>
          </div>

        );
    }
  }

  export default UserCreate;