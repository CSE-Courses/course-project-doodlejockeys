import React, { Component } from "react";
import { Button } from 'reactstrap';
import "../styles.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from "react-router-dom";

const animal = ['Cat', 'Dog', 'Goldfish', 'Hamster', 'Mouse', 'Parrot', 'Rabbit', 'Fish', 'Turtle', 'Pigeon']
const celebrities = ['Kim Kardashian', 'Beyoncé', 'Tom Hanks', 'Taylor Swift', 'Johnny Depp', 'Jim Carrey', 'Emma Watson', 'Leonardo DiCapro', 'Morgan Freeman', 'Robert Downey Jr.' ]
const countries = ['USA', 'France', 'Spain', 'Russia', 'Canada', 'India', 'China', 'New Zealand', 'Portugal', 'Nigeria']
const objects = ['Spoon', 'Mug', 'Shoe', 'Phone', 'Scissors', 'Pen', 'Pencil', 'Quarter', 'Laptop', 'Bottle']
const actions = ['Swimming', 'Running', 'Cooking', 'Laughing', 'Surfing', 'Talking', 'Sleeping', 'Singing', 'Eating', 'Writing']
const food = ['Burger', 'Bagel', 'Bacon', 'Apple', 'Spaghetti', 'Coffee', 'Lobster', 'Corn', 'Chocolate', 'Cake']
const places = ['Church', 'Bank', 'Post Office', 'Restaurant', 'Hospital', 'School', 'Park', 'Stadium', 'House', 'Museum']
const movies = ['Toy Story', 'Monsters Inc.', 'Finding Nemo', 'Cars', 'Ratatouille', 'WALL-E', 'UP', 'Brave', 'Finding Dory', 'Coco']
const sports = ['Baseball', 'Rowing', 'Softball', 'Volleyball', 'Basketball', 'Archery', 'Climbing', 'Fishing', 'Hockey', 'Diving']

class WordBank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results : [],
        }
    }

    addCategory(x) {
        this.setState.results.push(x)
    }
    
    updateContent(){
        this.setState({message: "Added!"});
    }
    
    handleClick = () => {
        console.log('added!')
        console.log(this.setState.results)
    }
    render() {
        return (
            <div>
                <h1 className="title">DOODLE.BOB</h1>
                <p className="heading"> Choose a category </p>
                <div className="catbuttons">
                    <button onClick={this.state.results.push(animal), this.handleClick} className="cat_animals"> Animals<span role="img" aria-label="dog">🐶</span></button>
                    <button onClick={this.state.results.push(celebrities)} className="cat_celebs"> Celebrities<span role="img" aria-label="star">⭐</span></button>
                    <button onClick={this.state.results.push(countries),this.updateContent} className="cat_count"> Countries <span role="img" aria-label="flag">🎌</span></button>
                    <button onClick={this.state.results.push(places)} className="cat_pl"> Places<span role="img" aria-label="sheep">🏢</span></button>
                    <button onClick={this.state.results.push(objects)} className="cat_objs"> Objects<span role="img" aria-label="spaceship">🛸</span></button>
                    <button onClick={this.state.results.push(movies)} className="cat_movie"> Movies<span role="img" aria-label="movies">🎥</span></button>
                    <button onClick={this.state.results.push(actions),this.updateContent} className="cat_act"> Actions<span role="img" aria-label="action">🏃‍♀️</span></button>
                    <button onClick={this.state.results.push(sports)} className="cat_sport"> Sports<span role="img" aria-label="sports">⚾</span></button>
                    <button onClick={this.state.results.push(food)} className="cat_food"> Food<span role="img" aria-label="food">🥐</span></button>
                 </div>
              <div className="submit">
                            <center>
                                <Link to="/PlayPage">
                                   <span class="highlight"><input type='submit' className="startgame" value="Start Game" /></span>
                                </Link>
                            </center>
               </div> 
            </div>
        );
    }
}

export default WordBank;