//Document Elements
let grid = $('.deck');
let restart = $('.restart');
let stars = $('.stars');
let thirdStar = $('.third-star');
let secondStar = $('.second-star');
let replayButton = $('#finish-game-restart');
let moves = document.getElementById('moves');
let timer = document.getElementById('timer-clock');
let modal = document.getElementById('modal');
let finalMoves = document.getElementById('finish-moves');
let finalTime = document.getElementById('finish-time');
let finalStars = document.getElementById('finish-stars');

//JS Elements
let cards = ['fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-bomb', 'fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-bomb'];
let firstClick = 0;
let clickCount = 0;
let clickedCards = [];
let firstCard;
let secondCard;
let movesCount = 0;
let minutes = 0;
let seconds = 0;
let timeOut;
let timer_on = 0;
let matchCount = 0;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

/**
* @description Shuffles cards
* Shuffle function from http://stackoverflow.com/a/2450976
* @param {array} array - array of symbols that will be shown on cards
* @returns {array} array - shuffled array of symbols
*/
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
* @description creates HTML for each card and adds card HTML to page
* @param {array} array - array of symbols that will be shown on cards
*/
function makeGrid(array) {
	let list = document.getElementById('deck');
	let item;
	let child;
	for (const element of array) {
		item = document.createElement('li');
		child = document.createElement('i');
		item.className = 'card';
		child.className = element;
		item.appendChild(child);
		list.appendChild(item);
	}

}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


/**
* @description Event that is triggered when a card is clicked
* @param {object} evt - object on which event happened
* function populates the following variables:
*   clickedCards, firstClick, secondClick, firstSymbol, secondSymbol
*   clickCount, movesCount
* function calls the following functions:
*   startTimer()
* 	setMoves()
*	  checkMatch()
*/
function showSymbol(evt) {
	removeListener(this);
	$(evt.target).toggleClass('open show');
	clickedCards.push($(evt.target).find('i').attr('class'));
	firstClick = firstClick + 1;
	if (firstClick == 1) {
		grid.on('click','li', startTimer);
	}
	if (clickCount === 0) {
		clickCount=1;
		firstCard = $(evt.target);
		firstSymbol = $(evt.target).find('i').attr('class').split(' ');
	} else if (clickCount === 1) {
		clickCount = 0;
		movesCount = movesCount + 1;
		setMoves();
		secondCard = $(evt.target);
		secondSymbol = $(evt.target).find('i').attr('class').split(' ');
	}
	if (clickedCards.length == 2){
		checkMatch();
	}
}

/**
* @description Checks if two cards clicked match or not
* function populates the following variables:
*   matchCount
* function calls the following functions:
*   correctMatch()
*   incorrectMatch()
*   finishGame()
*/
function checkMatch(){
  // if cards match, call correctMatch function
	if (clickedCards[0] == clickedCards[1]) {
		correctMatch(firstCard, secondCard);
		matchCount = matchCount + 1;
	}
  // if cards do not match, call two incorrectMatch functions and add back event listener
	else {
		incorrectMatch(firstCard, secondCard);
		firstCard[0].addEventListener('click',showSymbol);
		secondCard[0].addEventListener('click',showSymbol);
	}
  // reset clickedCards array
	clickedCards = [];
  // if game board all matched, call finishGame (show modal)
  if (matchCount == 8) {
		finishGame();
	}
}

/**
* @description shows number of moves in HTML, determines star rating and changes rating HTML
*/
function setMoves() {
	moves.innerHTML = movesCount;
	if (movesCount === 0) {
		if (secondStar.children().attr('class') == 'fa fa-star-o') {
			secondStar.children().toggleClass('fa-star fa-star-o');
		}
		if (thirdStar.children().attr('class') == 'fa fa-star-o') {
			thirdStar.children().toggleClass('fa-star fa-star-o');
		}
	} else if (movesCount === 12) {
		thirdStar.children().toggleClass('fa-star fa-star-o');
	} else if (movesCount === 20) {
		secondStar.children().toggleClass('fa-star fa-star-o');
	}
}

/**
* @description when two elements match, shows that they match
* @param {element} cardFirst - first card 'li' element selected
* @param {element} cardSecond - second card 'li' element selected
*/
function correctMatch(cardFirst, cardSecond) {
	cardFirst.toggleClass('open show match');
	cardSecond.toggleClass('open show match');
}

/**
* @description when two cards do not match, shows that match is wrong, then flips cards back over
* @param {element} cardOne - first card 'li' element selected
* @param {element} cardTwo - second card 'li' element selected
*/
function incorrectMatch(cardOne, cardTwo) {
		setTimeout(function() {
      cardOne.toggleClass('wrong');
		  cardTwo.toggleClass('wrong');
    }, 200);
    setTimeout(function() {
  		cardOne.toggleClass('open show wrong');
  		cardTwo.toggleClass('open show wrong');
  	}, 800);
}

/**
* @description counts time and displays time in HTML
*   timerCount, startTimer, and stopTimer functions based on https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_win_settimeout_cleartimeout2
*/
function timerCount() {
	seconds = seconds + 1;
	if (seconds < 10) {
		timer.innerHTML = minutes + ':0' + seconds;
	} else if (seconds >= 10 && seconds < 60) {
		timer.innerHTML = minutes + ':' + seconds;
	} else if (seconds === 60) {
		minutes = minutes + 1;
		seconds = 0;
		timer.innerHTML = minutes + ':0' + seconds;
	}
	timeOut = setTimeout(timerCount,1000);
}

/**
* @description starts timer
*   timerCount, startTimer, and stopTimer functions based on https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_win_settimeout_cleartimeout2
*/
function startTimer() {
	if (!timer_on) {
		timer_on = 1;
		timerCount();
	}
}

/**
* @description stops timer
*   timerCount, startTimer, and stopTimer functions based on https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_win_settimeout_cleartimeout2
*/
function stopTimer() {
	clearTimeout(timeOut);
}

/**
* @description restarts timer and time variables
*/
function restartTimer() {
	stopTimer();
	seconds = 0;
	minutes = 0;
	timer.innerHTML = minutes + ':0' + seconds;
}

/**
* @description shows modal and populates modal elements (moves, time, star rating)
* Modal javascript based on https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal2
*/
function finishGame() {
	stopTimer();
	modal.style.display = 'block';
	// Show final moves
	finalMoves.innerHTML = movesCount;
	// Show final time
	if (seconds < 10) {
		finalTime.innerHTML = minutes + ':0' + seconds;
	} else {
		finalTime.innerHTML = minutes + ':' + seconds;
	}
	// Show final stars
	if (secondStar.children().attr('class') == 'fa fa-star-o') {
		finalStars.innerHTML = '1 star';
	} else if (thirdStar.children().attr('class') == 'fa fa-star-o') {
		finalStars.innerHTML = '2 stars';
	} else {
		finalStars.innerHTML = '3 stars';
	}
}

/**
* @description resets all game elements and Javascript variables
*/
function restartGame() {
	//reset board
	grid.find().className = 'card';
	grid.empty();
	makeGrid(shuffle(cards));
	addListener();
	restartTimer();
	//reset all variables
	movesCount = 0;
  setMoves();
	matchCount = 0;
	firstCard='';
	secondCard='';
	firstClick = 0;
	clickCount = 0;
	timer_on=0;
	clickedCards = [];

	modal.style.display = 'none';
}

/**
* @description adds event listener to card 'li' elements on click
*/
function addListener() {
	let cardsLI = document.getElementsByClassName('card');
	for (cardLI of cardsLI){
		cardLI.addEventListener('click',showSymbol);
	}
}

/**
* @description removes event listener from card 'li' element when clicked
*/
function removeListener(target) {
	target.removeEventListener('click',showSymbol);
}

// call functions needed when page is loaded
window.onload = makeGrid(shuffle(cards));
$(document).ready(addListener);

// when reset icon or replay button are clicked
restart.click(restartGame);
replayButton.click(restartGame);
