
//------ Постоянные
var COLS = 10;
var ROWS = 20;
var TILE_WIDTH = 20;
var SCOREBOARD_WIDTH = 100;
var font_size = 20;

var EMPTY = 0;
var SNAKE = 1;
var FRUIT = 2;

// Классическое монохромное оформление
var CANVAS_BGCOLOR = "#b1c2b1";
var EMPTY_COLOR = "#a9b9a9";
var SNAKE_COLOR = "#000000";
var FRUIT_COLOR = "#666666";

// Цветное оформление
// var CANVAS_BGCOLOR = "#dddddd";
// var EMPTY_COLOR = "#d0d0d0";
// var SNAKE_COLOR = "#339900";
// var SNAKE_COLOR = "#000000";
// var FRUIT_COLOR = "#ee0000";

// Массив цветов для фруктов
// var FRUIT_COLOR;

// var colorArray = [
//     "#ff0000",
//     "#ff9900",
//     "#ffff00",
//     // "#00ff00",
//     "#339900",
//     "#0099ff",
//     "#0000ff",
//     "#9900ff"
// ];

var LEFT  = 0;
var UP    = 1;
var RIGHT = 2;
var DOWN  = 3;
var SPACE = 4;
var SOUND = 5; //PAUSE = 4,

// var KEY_LEFT  = 65;
// var KEY_UP    = 87;
// var KEY_RIGHT = 68;
// var KEY_DOWN  = 83;
var KEY_LEFT  = 37;
var KEY_UP    = 38;
var KEY_RIGHT = 39;
var KEY_DOWN  = 40;
var KEY_P 	  = 80;
var KEY_SPACE = 32;
var KEY_S 	  = 77; //M

//------ КОНЕЦ объявления постоянных

//------ Игровые объекты
var canvas;	  /* HTMLCanvas */
var ctx;	  /* CanvasRenderingContext2d */
var keystate; /* Object, used for keyboard inputs */
var frames;   /* number, used for animation */
var score;	  /* number, keep track of the player score */

//var level;
var hiscore;

// hiscore = localStorage.clear('hiscoreValue');
hiscore = localStorage.getItem('hiscoreValue');
//attempt;
//attempt = 3;

// localStorage.setItem('hiscoreValue', hiscore);

// var localStorage.setItem('hiscoreValue', hiscore);

//------  КОНЕЦ объявления игровых объектов

//------ Функция воспроизведения звука -------------------------------------------

function loadAudio(arr) {

	var audio = document.createElement('audio');

	for (var i = 0, len = arr.length; i < len; i += 1) {
		var source = document.createElement('source');
		source.src = arr[i];
		audio.appendChild(source);
	}

	var o = {
		dom : false,
		state : 'stop',

		play : function () {
			this.dom.currentTime = 0;
			this.dom.play();
			this.state = 'play';
		},

		pause : function () {
			this.dom.pause();
			this.state = 'pause';
		},

		stop : function () {
			this.dom.pause();
			this.dom.currentTime = 0;
			this.state = 'stop';
		}

	};

	o.dom = audio;

	return o;

}

// var theme = loadAudio(['sounds/theme2.ogg']);
var move = loadAudio(['sounds/move.ogg']);
var take = loadAudio(['sounds/take.ogg']);
var hit = loadAudio(['sounds/hit.ogg']);
var a;


// setInterval(function () {

// 	if (a == 1) {
// 		move.play();
// 	}
// 	a = 0;

// }, 350);

// var body = document.getElementById('body');

// body.onkeyup = function (e) {

// 	a = (e.keyCode == 32);

// }

//------ КОНЕЦ Функции воспроизведения звука -----------------------------------------


//Grid datastructor, usefull in games where the game world is
//confined in absolute sized chunks of data or information.
// @type {Object}

grid = {

    width: null,  // number, the number of columns
    height: null, // number, the number of rows
    _grid: null,  // Array<any>, data representation

	
	 // Initiate and fill a c x r grid with the value of d
	 // @param  {any}    d default value to fill with
	 // @param  {number} c number of columns
	 // @param  {number} r number of rows
	 
    init: function(d, c, r) {
        this.width = c;
        this.height = r;

        this._grid = [];
        for (var x=0; x < c; x++) {
            this._grid.push([]);
            for (var y=0; y < r; y++) {
                this._grid[x].push(d);
            }
        }
    },

	/**
	 * Set the value of the grid cell at (x, y)
	 * 
	 * @param {any}    val what to set
	 * @param {number} x   the x-coordinate
	 * @param {number} y   the y-coordinate
	 */
    set: function(val, x, y) {
        this._grid[x][y] = val;
    },

	/**
	 * Get the value of the cell at (x, y)
	 * 
	 * @param  {number} x the x-coordinate
	 * @param  {number} y the y-coordinate
	 * @return {any}   the value at the cell
	 */
    get: function(x, y) {
        return this._grid[x][y];
    }
}

/**
 * The snake, works as a queue (FIFO, first in first out) of data
 * with all the current positions in the grid with the snake id
 * 
 * @type {Object}
 */
snake = {

    direction: null,/* number, the direction */
    last: null,     /* Object, pointer to the last element in the queue */
    _queue: null,   /* Array<number>, data representation*/

	/**
	 * Clears the queue and sets the start position and direction
	 * 
	 * @param  {number} d start direction
	 * @param  {number} x start x-coordinate
	 * @param  {number} y start y-coordinate
	 */
    init: function(d, x, y) {
        this.direction = d;

        this._queue = [];
        this.insert(x, y);
    },

	/**
	 * Adds an element to the queue
	 * 
	 * @param  {number} x x-coordinate
	 * @param  {number} y y-coordinate
	 */
    insert: function(x, y) {
        // unshift prepends an element to an array
        this._queue.unshift({x:x, y:y});
        this.last = this._queue[0];
    },

	/**
	 * Removes and returns the first element in the queue.
	 * 
	 * @return {Object} the first element
	 */
    remove: function() {
        // pop returns the last element of an array
        return this._queue.pop();
    }
};

// Set a food id at a random free cell in the grid
function setFood() {

	var empty = [];
	// iterate through the grid and find all empty cells
	for (var x = 0; x < grid.width; x += 1) {
		for (var y = 0; y < grid.height; y += 1) {
			if (grid.get(x, y) === EMPTY) {
				empty.push({x:x, y:y});
			}
		}
	}
	// Выбор фруктом случайной свободной ячейки
	var randpos = empty[Math.round(Math.random()*(empty.length - 1))];
	grid.set(FRUIT, randpos.x, randpos.y);
	// Случайный выбор цвета фрукта
	// FRUIT_COLOR = colorArray[Math.floor(Math.random() * 7)];

}

// Запуск игры
function main() {

	// Создание и инициация элемента холста (canvas)
	canvas = document.createElement("canvas");
	ctx = canvas.getContext("2d");
	canvas.width = COLS*TILE_WIDTH+SCOREBOARD_WIDTH;
	canvas.height = ROWS*TILE_WIDTH;
	canvas.style.backgroundColor = CANVAS_BGCOLOR;

	// add the canvas element to the body of the document
	document.body.appendChild(canvas);

	// sets an base font for bigger score display
	//ctx.font = "12px Helvetica";
	//ctx.font = "12px Lucida Console";
    //ctx.font = "12px PressStart2P";

	frames = 0;
	keystate = {};
	// keeps track of the keybourd input
	document.addEventListener("keydown", function(evt) {
		keystate[evt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evt) {
		delete keystate[evt.keyCode];
	});

	// intatiate game objects and starts the game loop
	init();
	loop();

}

// Сброс и инициация игровых объектов
function init() {

	score = 0;
	// hiscore = 0;
	// if (attempt > 0) {score = score;}
	// if (attempt == 0) {score = 0;}

	//level = 1;
	//if (attempt == 0) {attempt = 3;}

	grid.init(EMPTY, COLS, ROWS);

	var sp = {x:Math.floor(COLS/2), y:ROWS-1};
	snake.init(UP, sp.x, sp.y);
	grid.set(SNAKE, sp.x, sp.y);

	setFood();

}

// The game loop function, used for game updates and rendering
function loop() {

	update();
	draw();
	
	// When ready to redraw the canvas call the loop function
	// first. Runs about 60 frames a second
	window.requestAnimationFrame(loop, canvas) ||
	window.webkitRequestAnimationFrame(loop, canvas) ||
	window.mozRequestAnimationFrame(loop, canvas) ||
	window.oRequestAnimationFrame(loop, canvas) ||
	window.msRequestAnimationFrame(loop, canvas);

}

// Обновление игровой логики
function update() {
	
	frames += 1;

	// changing direction of the snake depending on which keys that are pressed
	if (keystate[KEY_LEFT] && snake.direction !== RIGHT) {
		snake.direction = LEFT;
		console.log('push_left');
		move.play();
	}
	if (keystate[KEY_UP] && snake.direction !== DOWN) {
		snake.direction = UP;
		console.log('push_up');
		move.play();
	}
	if (keystate[KEY_RIGHT] && snake.direction !== LEFT) {
		snake.direction = RIGHT;
		console.log('push_right');
		move.play();
	}
	if (keystate[KEY_DOWN] && snake.direction !== UP) {
		snake.direction = DOWN;
		console.log('push_down');
		move.play();
	}
	// pause/start
	if (keystate[KEY_P]) {
		console.log('pause');
		ctx.clearRect(canvas.width-SCOREBOARD_WIDTH+41, canvas.height-40, 50, 60);
		ctx.font = "24px PressStart2P";
		ctx.fillStyle = "#000000";
		ctx.fillText("\u2615", canvas.width-60, canvas.height-20);
		alert( "\t         PAUSE\t\n\n" + "Press [ENTER] to continiue");
	} /* else {
		ctx.clearRect(canvas.width-SCOREBOARD_WIDTH+41, canvas.height-40, 50, 60);
		ctx.font = "24px PressStart2P";
		ctx.fillStyle = EMPTY_COLOR;
		ctx.fillText("\u2615", canvas.width-60, canvas.height-20);
	} */
	// mute/sound
	if (keystate[KEY_S]) {
		console.log('sound/mute');
		ctx.clearRect(canvas.width-SCOREBOARD_WIDTH+1, canvas.height-40, 40, 60);
		ctx.font = "24px PressStart2P";
		ctx.fillStyle = EMPTY_COLOR;
		ctx.fillText("\u266B", canvas.width-80, canvas.height-20);
	} else {
		ctx.clearRect(canvas.width-SCOREBOARD_WIDTH+1, canvas.height-40, 40, 60);
		ctx.font = "24px PressStart2P";
		ctx.fillStyle = "#000000";
		ctx.fillText("\u266B", canvas.width-80, canvas.height-20);
	}
	// action button
	if (keystate[KEY_SPACE]) {
		console.log('action!');
	}

	// каждые 5 кадров (frames) обновлять игровое состояние (game state) 12
	if (frames%8 === 0) {
		// pop the last element from the snake queue i.e. the head
		var nx = snake.last.x;
		var ny = snake.last.y;
		// score++;

		// move.play();
		// score += 1;

		// updates the position depending on the snake direction
		switch (snake.direction) {
			case LEFT:
				console.log('move_left');
				nx -= 1;
				break;
			case UP:
				console.log('move_up');
				ny -= 1;
				break;
			case RIGHT:
				console.log('move_right');
				nx += 1;
				break;
			case DOWN:
				console.log('move_down');
				ny += 1;
				break;
		}

		// checks all gameover conditions
		if (0 > nx || nx > grid.width-1  ||
			0 > ny || ny > grid.height-1 ||
			grid.get(nx, ny) === SNAKE) {

			//attempt -= 1;
				hit.play();
			//if (attempt == 0) {
				console.log('game_over');
				alert("\t    GAME OVER\n\n" + "\t    Your score: " + score + "\nPress [ENTER] to restart game");
				// ctx.innerHTML = showGameOver();
				console.log('restart_game');
			//}

			return init();
		}

		// check wheter the new position are on the fruit item
		if (grid.get(nx, ny) === FRUIT) {
			// increment the score and sets a new fruit position
			console.log('eat_food');
			score += 1;
			setFood();
			take.play();






		} else {
			// take out the first item from the snake queue i.e
			// the tail and remove id from grid
			var tail = snake.remove();
			grid.set(EMPTY, tail.x, tail.y);
		  }



			// Если кол-во score больше hiscore, то происходит запись рекорда hiscore в локальное хранилище (localStorage)
			if (score > hiscore) {
				hiscore = score;

				localStorage.setItem('hiscoreValue', hiscore);
				
				// localStorage.removeItem("hiscoreValue");
				// localStorage.clear();
			} else {hiscore;}
			//if (score < hiscore) {
				//hiscore;
				// localStorage.setItem('hiscoreValue', hiscore);

				// localStorage.removeItem("hiscoreValue");
				// localStorage.clear();
			//}



		// add a snake id at the new position and append it to 
		// the snake queue
		grid.set(SNAKE, nx, ny);
		snake.insert(nx, ny);
	}

}





var active = true;

function showGameOver() {

    // Disable the game.
    active = false;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000';
    ctx.font = '16px sans-serif';
    
    ctx.fillText('Game Over!', ((canvas.width / 2) - (ctx.measureText('Game Over!').width / 2)), 50);

    ctx.font = '12px sans-serif';

    ctx.fillText('Your Score Was: ' + score, ((canvas.width / 2) - (ctx.measureText('Your Score Was: ' + score).width / 2)), 70);

}




// Отрисовка сетки (grid) на холсте (canvas)
function draw() {

	// Расчёт ширины (tile-width) и высоты (tile-height) ячеек
	var tw = (canvas.width-SCOREBOARD_WIDTH)/grid.width;
	var th = canvas.height/grid.height;

	ctx.fillStyle = "#000000";
	ctx.beginPath();
	ctx.moveTo(canvas.width-SCOREBOARD_WIDTH, 0);
	ctx.lineTo(canvas.width-SCOREBOARD_WIDTH, canvas.height);
	ctx.stroke();

	// iterate through the grid and draw all cells
	for (var x = 0; x < grid.width; x += 1) {
		for (var y = 0; y < grid.height; y += 1) {
			// sets the fillstyle depending on the id of each cell
			switch (grid.get(x, y)) {
				case EMPTY:
					ctx.fillStyle = EMPTY_COLOR;
					break;
				case SNAKE:
					ctx.fillStyle = SNAKE_COLOR;
					break;
				case FRUIT:
					ctx.fillStyle = FRUIT_COLOR;
					break;
			}
			// ctx.fillRect(x*tw, y*th, tw, th);
			ctx.clearRect(x*tw, y*th, tw, th);
			ctx.fillRect(x*tw+1, y*th+1, tw-2, th-2);
			ctx.clearRect(x*tw+4, y*th+4, tw-8, th-8);
			ctx.fillRect(x*tw+6, y*th+6, tw-12, th-12);
		}
	}

	ctx.clearRect(canvas.width-SCOREBOARD_WIDTH+1, 0, 99, 100);

	// changes the fillstyle once more and draws the score message to the canvas
	ctx.fillStyle = "#000000";
    ctx.font = "8px PressStart2P";

	ctx.fillText("HISCORE:", canvas.width-80, 20);
    ctx.fillText(("000000" + localStorage.getItem('hiscoreValue')).slice(-6), canvas.width-60, 40);

	ctx.fillText("SCORE:", canvas.width-80, 60);
    ctx.fillText(("000000" + score).slice(-6), canvas.width-60, 80);

    ctx.clearRect(canvas.width-SCOREBOARD_WIDTH+1, 90, 99, 160);
    ctx.fillText("LEVEL:", canvas.width-80, 100);
    ctx.fillText("\u25B2 " + "1" + " \u25BC", canvas.width-60, 120);
    ctx.fillText("SPEED:", canvas.width-80, 140);
    ctx.fillText("\u25C4 " + "1" + " \u25BA", canvas.width-60, 160);
    // ctx.fillText("ATTEMPTS:", canvas.width-80, 180);
    // ctx.fillText(attempt, canvas.width-50, 200);

}

// start and run the game
main();
//theme.play();
// window.localStorage.setItem("hiscoreValue", hiscore);
console.log('start_game');