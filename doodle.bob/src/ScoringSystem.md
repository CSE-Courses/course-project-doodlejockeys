# Scoring System

## Things that affect the score of a player.

### For Guessers:
* Number of players.
* Time taken to guess.

### For Artists:
* Number of players.
* Number of players who guessed correctly.

### Initial Information:
* There will be a base score. `BASE = 50`
* A scaling value such that the score scales according to the number of players. `SCALE_NUM_PLAYERS = 15`
* A correct guess scale (artist only). Based on the number of players that correctly guess the artists drawing the artist will receive a higher score. `CORRECT_GUESS_SCORE = 5`
* Time bonus array. If the players guess waiting a certain amount of time frame they'll receive a score bonus. `TIME_BONUS = [0.2, 0.3]`
* Artist base score. `artistBase = BASE + SCALE_NUM_PLAYERS * (numPlayers -1)`
* Number of players. `numPlayers`
* Number of correct guesses. `correctGuesses`

## Functions:

## Guesser score calculation:

* If the guesser guesses within the `TIME_BONUS[0]`
% of the allotted drawing time.
	* `Int(artistBase*(numPlayers-1) + BASE/2)`

* Else If the guesser guesses within the `TIME_BONUS[1]`
% of the allotted drawing time.
	* `Int(artistBase*(numPlayers-1) + BASE/3)`

* Else
	* `Int(artistBase*(numPlayers-1) + 0)`

## Artist score calculation:

* If nobody guessed the drawing.
    * `0`

* Else
	* `Int(artistBase + CORRECT_GUESS_SCORE*correctGuesses*(numPlayers - 1))`

## Tests:

### Guess score calculation tests:

* Returned score should be greater than `BASE` score.
* The score of the player who guessed in the earlier time frame should be higher than the player who guessed in the later time frame.
* The score of the players who guessed in the same time frame should have the same score.
* The players who ran out of time to guess should receive a score of `0`.
* The score should scale with respect to `numPlayers`.

### Artist score calculation tests:
* If `correctGuesses` is 0 then the artist should receive a score of `0`.
* If `correctGuesses` is negative throw `IllegalArgumentException`.
* Returned score should be greater than `BASE` score.
* If `correctGuesses` is greater than `(numPlayers - 1)` throw `IllegalArgumentException`.
* The score should sclae with respect to `correctGuesses`.
* The score should scale with respect to `numPlayers`.