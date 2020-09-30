import React, { Component } from 'react';
import "../styles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faEraser, faFillDrip, faCircle, faTrashAlt, faUndoAlt, faPaintBrush } from "@fortawesome/free-solid-svg-icons";


class Toolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {isToggleOn: true,
                      diffBrush: true, 
                      diffWidth: true,
                      erase: false };
        this.handleClick = this.handleClick.bind(this);
        this.changeBrush = this.changeBrush.bind(this);
        this.changeWidth = this.changeWidth.bind(this);
        this.handleErase = this.handleErase.bind(this);
      }
    
      handleErase() {
              this.setState(prevState => ({
                erase: !prevState.erase,
              }));
              sessionStorage.setItem('eraser',this.state.erase)
      }

      handleClick() {
        this.setState(prevState => ({
          isToggleOn: !prevState.isToggleOn,
        }));
      }

      changeBrush() {
        this.setState(prevState => ({
          diffBrush: !prevState.diffBrush,
        }));
      }

      changeWidth() {
        this.setState(prevState => ({
          diffWidth: !prevState.diffWidth,
        }));
      }

      render() {
        return (
            <div className = "toolbar"> 
                    <button className="toolbar-button"
                            style = {{width:"auto"}} 
                            onClick={this.handleClick}> {this.state.isToggleOn ? 'Show' : 'Hide'}
                    </button>
                    <button className="toolbar-button"
                            onClick={this.changeBrush}> {this.state.diffBrush ? <FontAwesomeIcon icon={faPencilAlt}/> : <FontAwesomeIcon icon={faPaintBrush}/>   }
                    </button>
                    <button className="toolbar-button"
                            onClick = {this.handleErase}>
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
                            style = {{backgroundColor:"white"}}>
                            1
                    </button>
                    <button className="toolbar-button" 
                            style = {{backgroundColor:"black",color:"white"}}>
                            2
                    </button>
                    <button className="toolbar-button"
                            style = {{backgroundColor:"red"}}>
                            3
                    </button>
                    <button className="toolbar-button"
                            style = {{backgroundColor:"orange"}}>
                            4
                    </button>
                    <button className="toolbar-button"
                            style = {{backgroundColor:"yellow"}}>
                            5
                    </button>
                    <button className="toolbar-button"
                            style = {{backgroundColor:"green"}}>
                            6
                    </button>
                    <button className="toolbar-button"
                            style = {{backgroundColor:"blue", color: "white"}}>
                            7
                    </button>
                    <button className="toolbar-button"
                            style = {{backgroundColor:"indigo", color: "white"}}>
                            8
                    </button>
                    <button className="toolbar-button"
                            style = {{backgroundColor:"violet"}}>
                            9
                    </button> 
                    |
                    <button classname="toolbar-button"
                            style ={{height:"35px", width: "35px"}}>
                            <FontAwesomeIcon icon={faTrashAlt}/>
                    </button>
            </div>
        );
      }
    }
export default Toolbar;