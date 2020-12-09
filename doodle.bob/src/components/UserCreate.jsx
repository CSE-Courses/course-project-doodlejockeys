import React, {Component} from 'react';
import Sketch from 'react-p5';
//import "../styles.css";


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
}
//holds all strokes made
let ALL_STROKES = [];
let saveAvatarbtn;

class UserCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastStrokeIdx: -1,
      erasing: false,
      drawing: false,
      strokes: "black",
      strokeWidth: 2,
      saveClicked: false, //state to determine whether mousePressed has clicked btn
    }
}

setup = (p5, parent, ) => {
  let canvas = p5.createCanvas(350, 350).parent(parent)
  p5.background(255);
   
  var eraserbtn = p5.createButton("Clear");
  eraserbtn.parent(parent)
  eraserbtn.mousePressed(this.resetSketch);

  //save avatar button /don't call saveCanvas in here or it will download upon loading to page
  saveAvatarbtn = p5.createButton("Save Avatar")
  saveAvatarbtn.parent(parent)
  saveAvatarbtn.mousePressed(this.saveButtonClicked);  
}

//when save button is pressed, set save Click state true then execute p5.saveCanvas on mouseClick
saveButtonClicked = () => {
  this.setState({
    saveClicked: true
  })
}

draw = (p5) => {
  p5.background(255);
  p5.noLoop();
}

mousePressed = (p5) => {
if(this.state.saveClicked){  //perform saveCanvas since p5 is already passed through here
  saveAvatarbtn.mousePressed(p5.saveCanvas('myavatar','png'))
  this.setState({
    saveClicked: false
  })
  saveAvatarbtn.mousePressed(this.saveButtonClicked)
}

if(this.state.erasing){ //erasing
  p5.background(255);
  this.setState({erasing: false, lastStrokeIdx: -1});
  ALL_STROKES = [];
}

else{ //drawing
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


resetSketch = () => {
  this.setState({
    erasing: true
  })
  }

render(props) {
  return (
      <div id="canvas">
        <center>
          <Sketch
              setup={this.setup}
              draw={this.draw}
              mousePressed={this.mousePressed}
              mouseDragged={this.mouseDragged}
              mouseReleased={this.mouseReleased}/>
        </center>
        </div>
        );
    }
  }

  export default UserCreate;