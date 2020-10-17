import React, { Component } from 'react';
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
            results: [],
            animal: ['Cat', 'Dog', 'Goldfish', 'Hamster', 'Mouse', 'Parrot', 'Rabbit', 'Fish', 'Turtle', 'Pigeon'],
            celebrities: ['Kim Kardashian', 'Beyoncé', 'Tom Hanks', 'Taylor Swift', 'Johnny Depp', 'Jim Carrey', 'Emma Watson', 'Leonardo DiCapro', 'Morgan Freeman', 'Robert Downey Jr.'],
            countries: ['USA', 'France', 'Spain', 'Russia', 'Canada', 'India', 'China', 'New Zealand', 'Portugal', 'Nigeria'],
            objects: ['Spoon', 'Mug', 'Shoe', 'Phone', 'Scissors', 'Pen', 'Pencil', 'Quarter', 'Laptop', 'Bottle'],
            actions: ['Swimming', 'Running', 'Cooking', 'Laughing', 'Surfing', 'Talking', 'Sleeping', 'Singing', 'Eating', 'Writing'],
            food: ['Burger', 'Bagel', 'Bacon', 'Apple', 'Spaghetti', 'Coffee', 'Lobster', 'Corn', 'Chocolate', 'Cake'],
            places: ['Church', 'Bank', 'Post Office', 'Restaurant', 'Hospital', 'School', 'Park', 'Stadium', 'House', 'Museum'],
            movies: ['Toy Story', 'Monsters Inc.', 'Finding Nemo', 'Cars', 'Ratatouille', 'WALL-E', 'UP', 'Brave', 'Finding Dory', 'Coco'],
            sports: ['Baseball', 'Rowing', 'Softball', 'Volleyball', 'Basketball', 'Archery', 'Climbing', 'Fishing', 'Hockey', 'Diving'],
        }
        this.submitWordBank = this.submitWordBank.bind(this);
    }
    addCategory = (array) => {
        const current = this.state.results
        current.push(array);
        this.setState({
            results: current
        })
    };

    removeCategory = (array) => {
        const current = this.state.results
        current.pop(array);
        this.setState({
            results: current
        })
    };

    // handleClick = () => {
    //     console.log('added!');

    // }

    submitWordBank() {
        console.log(this.state.results)
        sessionStorage.setItem("wordCategories", this.state.results)
        this.props.history.push("/PlayPage")
    }

    render() {
        return (
            <div>
                <form className="submit">
                    <h1 className="title">DOODLE.BOB</h1>
                    <p className="heading"> Choose a category </p>
                    <div className="catbuttons">
                        {this.state.results.includes("animal") && <button onClick={() => this.removeCategory("animal")} className="cat_animals" style={{ border: "3px solid green" }}> Animals<span role="img" aria-label="dog">🐶</span></button>}
                        {!this.state.results.includes("animal") && <button onClick={() => this.addCategory("animal")} className="cat_animals"> Animals<span role="img" aria-label="dog">🐶</span></button>}
                    </div>

                    <center>
                        {/* <Link to="/PlayPage"> */}
                        <span class="highlight"><input type='submit' className="startgame" value="Start Game" onClick={this.submitWordBank} /></span>
                        {/* </Link> */}
                    </center>
                </form>
            </div >
        )
    }
}
export default WordBank;
