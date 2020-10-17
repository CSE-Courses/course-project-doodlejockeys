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


class WordBank extends React.Component {
    constructor(props) {
        super(props);
        this.addCategory = this.addCategory.bind(this);
        this.state = {
            results : [],
            animal: ['Cat', 'Dog', 'Goldfish', 'Hamster', 'Mouse', 'Parrot', 'Rabbit', 'Fish', 'Turtle', 'Pigeon'],
            celebrities: ['Kim Kardashian', 'Beyoncé', 'Tom Hanks', 'Taylor Swift', 'Johnny Depp', 'Jim Carrey', 'Emma Watson', 'Leonardo DiCapro', 'Morgan Freeman', 'Robert Downey Jr.' ],
            countries: ['USA', 'France', 'Spain', 'Russia', 'Canada', 'India', 'China', 'New Zealand', 'Portugal', 'Nigeria'],
            objects: ['Spoon', 'Mug', 'Shoe', 'Phone', 'Scissors', 'Pen', 'Pencil', 'Quarter', 'Laptop', 'Bottle'],
            actions: ['Swimming', 'Running', 'Cooking', 'Laughing', 'Surfing', 'Talking', 'Sleeping', 'Singing', 'Eating', 'Writing'],
            food: ['Burger', 'Bagel', 'Bacon', 'Apple', 'Spaghetti', 'Coffee', 'Lobster', 'Corn', 'Chocolate', 'Cake'],
            places: ['Church', 'Bank', 'Post Office', 'Restaurant', 'Hospital', 'School', 'Park', 'Stadium', 'House', 'Museum'],
            movies: ['Toy Story', 'Monsters Inc.', 'Finding Nemo', 'Cars', 'Ratatouille', 'WALL-E', 'UP', 'Brave', 'Finding Dory', 'Coco'],
            sports: ['Baseball', 'Rowing', 'Softball', 'Volleyball', 'Basketball', 'Archery', 'Climbing', 'Fishing', 'Hockey', 'Diving'],
        }
    }

    addCategory = (array) => {
        const current = this.state.results
        current.push(array);
        this.setState({
            results: current
        })
    };

    handleClick = () => {
        console.log('added!');
        
    }

    render() {
        console.log(this.state.results);
        return (
            <div>
                <h1 className="title">DOODLE.BOB</h1>
                <p className="heading"> Choose a category </p>
                <div className="catbuttons">
                    <button onClick={() => this.addCategory(this.animal), this.handleClick} className="cat_animals"> Animals<span role="img" aria-label="dog">🐶</span></button>
                 </div>
              <div className="submit">
                            <center>
                                <Link to="/PlayPage">
                                   <span class="highlight"><input type='submit' className="startgame" value="Start Game" /></span>
                                </Link>
                            </center>
               </div> 
            </div>
        )
    }
}
export default WordBank;