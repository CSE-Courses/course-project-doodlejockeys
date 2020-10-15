import React, { Component } from 'react';
import "../styles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faEraser, faFillDrip, faCircle, faTrashAlt, faUndoAlt, faPaintBrush } from "@fortawesome/free-solid-svg-icons";
import Canvas from './Canvas';

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
                    <Canvas /> 
            </div>
        );
      }
    }
export default Toolbar;