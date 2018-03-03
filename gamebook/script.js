//   ОТОБРАЖЕНИЕ И СКРЫТИЕ ПАРАГРАФОВ
function viewdiv(id) {
	var element = document.getElementById(id);
	var link = document.getElementById('toggleLink');
	if (element.style.display == "block") {
		element.style.display = "none";
		//move.play();
		//console.log('player_move');
	} else {
		element.style.display = "block";
	}
}

function hidediv(id) {
	var element = document.getElementById(id);
	var link = document.getElementById('toggleLink');
	if (element.style.display == "block") {
		element.style.display = "none";
		move.play();
		console.log('player_move');
		playerMoves += 1;
	} else {
		element.style.display = "none";
	}
}
//------------------------------------------------

//   ВОСПРОИЗВЕДЕНИЕ ЗВУКОВ

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

var theme = loadAudio(['theme.ogg']);
var move = loadAudio(['move.ogg']);
var take = loadAudio(['take.ogg']);
var hit = loadAudio(['hit.ogg']);

//theme.play();

//------------------------------------------------


// СТАТИСТИКА ИГРЫ
var playerMoves = 0;
var drinkSkooma = 0;

function statistic() {
	var element = document.getElementById('stats');
	stats.innerHTML = 'Пройдено, шагов: ' + playerMoves + '<br>' + 'Упоролся skooma, раз: ' + drinkSkooma;
}













