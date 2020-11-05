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
            pokemon: ['Pikachu', 'Bulbasaur', 'Squirtle', 'Charmander', 'Mew', 'Suicune', 'Celebi', 'Shuckle', 'Wooper', 'Wooloo'],
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
        sessionStorage.setItem("preRound", true)
        sessionStorage.setItem("currentRound", 1)
        sessionStorage.setItem("currentSubRound", 0)
        sessionStorage.setItem("artistHistory", [])
        console.log(sessionStorage.getItem("artistHistory"))
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
                        {this.state.results.includes("celebrities") && <button onClick={() => this.removeCategory("celebrities")} className="cat_celebs" style={{ border: "3px solid green" }}> Celebrities<span role="img" aria-label="star">⭐</span></button>}
                        {!this.state.results.includes("celebrities") && <button onClick={() => this.addCategory("celebrities")} className="cat_celebs"> Celebrities<span role="img" aria-label="star">⭐</span></button>}
                        {this.state.results.includes("countries") && <button onClick={() => this.removeCategory("countries")} className="cat_count" style={{ border: "3px solid green" }}> Countries<span role="img" aria-label="flag">🎌</span></button>}
                        {!this.state.results.includes("countries") && <button onClick={() => this.addCategory("countries")} className="cat_count"> Countries<span role="img" aria-label="flag">🎌</span></button>}
                        {this.state.results.includes("objects") && <button onClick={() => this.removeCategory("objects")} className="cat_objs" style={{ border: "3px solid green" }}> Objects<span role="img" aria-label="spaceship">🛸</span></button>}
                        {!this.state.results.includes("objects") && <button onClick={() => this.addCategory("objects")} className="cat_objs"> Objects<span role="img" aria-label="spaceship">🛸</span></button>}
                        {this.state.results.includes("actions") && <button onClick={() => this.removeCategory("actions")} className="cat_act" style={{ border: "3px solid green" }}> Actions<span role="img" aria-label="action">🏃‍♀️</span></button>}
                        {!this.state.results.includes("actions") && <button onClick={() => this.addCategory("actions")} className="cat_act"> Actions<span role="img" aria-label="action">🏃‍♀️</span></button>}
                        {this.state.results.includes("food") && <button onClick={() => this.removeCategory("food")} className="cat_food" style={{ border: "3px solid green" }}> Food<span role="img" aria-label="food">🥐</span></button>}
                        {!this.state.results.includes("food") && <button onClick={() => this.addCategory("food")} className="cat_food"> Food<span role="img" aria-label="food">🥐</span></button>}
                        {this.state.results.includes("places") && <button onClick={() => this.removeCategory("places")} className="cat_pl" style={{ border: "3px solid green" }}> Places<span role="img" aria-label="sheep">🏢</span></button>}
                        {!this.state.results.includes("places") && <button onClick={() => this.addCategory("places")} className="cat_pl"> Places<span role="img" aria-label="sheep">🏢</span></button>}
                        {this.state.results.includes("movies") && <button onClick={() => this.removeCategory("movies")} className="cat_movie" style={{ border: "3px solid green" }}> Movies<span role="img" aria-label="movies">🎥</span></button>}
                        {!this.state.results.includes("movies") && <button onClick={() => this.addCategory("movies")} className="cat_movie"> Movies<span role="img" aria-label="movies">🎥</span></button>}
                        {this.state.results.includes("sports") && <button onClick={() => this.removeCategory("sports")} className="cat_sport" style={{ border: "3px solid green" }}> Sports<span role="img" aria-label="sports">⚾</span></button>}
                        {!this.state.results.includes("sports") && <button onClick={() => this.addCategory("sports")} className="cat_sport"> Sports<span role="img" aria-label="sports">⚾</span></button>}
                        {this.state.results.includes("pokemon") && <button onClick={() => this.removeCategory("pokemon")} className="cat_animals" style={{ border: "3px solid green" }}> Pokemon<span role="img" aria-label="pokemon">🎮</span></button>}
                        {!this.state.results.includes("pokemon") && <button onClick={() => this.addCategory("pokemon")} className="cat_animals"> Pokemon<span role="img" aria-label="sports">🎮</span></button>}
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
