
// var count = 1;

var diceArr = [];

diceArr[1] = '<div class="dice"><div class="dice_inner"><div class="circle" style="left: 44px;top: 44px;"></div></div></div>';
diceArr[2] = '<div class="dice"><div class="dice_inner"><div class="circle" style="left: 16px;top: 73px;"></div><div class="circle" style="left: 73px;top: -7px;"></div></div></div>';
diceArr[3] = '<div class="dice"><div class="dice_inner"><div class="circle" style="left: 16px;top: 73px;"></div><div class="circle" style="left: 44px;top: 21px;"></div><div class="circle" style="left: 73px;top: -30px;"></div></div>';
diceArr[4] = '<div class="dice"><div class="dice_inner"><div class="circle" style="left: 16px;top: 73px;"></div><div class="circle" style="left: 73px;top: 50px;"></div><div class="circle" style="left: 16px;top: -30px;"></div><div class="circle" style="left: 73px;top: -53px;"></div></div></div>';
diceArr[5] = '<div class="dice"><div class="dice_inner"><div class="circle" style="left: 44px;top: 44px;"></div><div class="circle" style="left: 16px;top: 50px"></div><div class="circle" style="left: 73px;top: 27px;"></div><div class="circle" style="left: 16px;top: -53px;"></div><div class="circle" style="left: 73px;top: -76px;"></div></div></div>';
diceArr[6] = '<div class="dice"><div class="dice_inner"><div class="circle" style="left: 16px;top: 44px;"></div><div class="circle" style="left: 16px;top: 50px;"></div><div class="circle" style="left: 73px;top: 27px;"></div><div class="circle" style="left: 16px;top: -53px;"></div><div class="circle" style="left: 73px;top: -76px;"></div><div class="circle" style="left: 73px;top: -71px;"></div></div></div>';

// var n = 2000;


//норамльная функция
// function rollOneDice(){
//     var dice1 = document.getElementById("dice1");
// 	for (i = 1; i <= count; i++) { 
// 		var rnd = Math.floor((Math.random() * 6) + 1);
// 		dice1.innerHTML = diceArr[rnd];
// 	}
// }

// var delayArr = [2000];

// function delay() {
// 	var delayTimer = setInterval(rollOneDice, 50);
		
// 	console.log('rolle_dice');
// 	// var delayRnd = Math.floor((Math.random() * 2000) + 100);

// 	setTimeout(function() {
// 		clearInterval(delayTimer);
// 		console.log('dice_rolled');
// 	}, n);
// 	// delayArr[delayRnd]);
// }


    

function rollOneDice(){
	var oneDice = document.getElementById('dice1');

	var rnd = [];
	var rnd = Math.floor((Math.random() * 6) + 1);
	dice1.innerHTML = diceArr[rnd];
	// console.log('Грань: ' + rnd);

	//var summa = rnd.slice(-1)[0];
	// var itogDice = document.getElementById('itog');
	// itog.innerHTML = 'Итог: ' ;// тут надо вывести последний член массива rnd

	
}

function delay() {
	var delaySpin = Math.floor((Math.random() * (100-25)) + 25);
	var delayTimer = setInterval(rollOneDice, delaySpin);

	var delayRnd = Math.floor((Math.random() * (3000-100)) + 100);
	console.log('Бросок кубика');
	console.log('Грань кубика меняется через: ' + delaySpin + ' мс');

	setTimeout(function() {
		clearInterval(delayTimer);
		take.play();
		console.log('Кубик остановился');
		console.log('Длительность всего броска: ' + delayRnd/1000 + ' с');
	}, delayRnd);
}

// function selectCount(c) {
// 	count = c;
// 	rollOneDice();
// }




// function RollTwoDices(){
//     var die1 = document.getElementById("die1");
//     var die2 = document.getElementById("die2");
//     var d1 = Math.floor(Math.random() * 6) + 1;
//     var d2 = Math.floor(Math.random() * 6) + 1;
//     var diceTotal = d1 + d2;
//     die1.innerHTML = d1;
//     die2.innerHTML = d2;
//     die2.className = "dice";    
// }





// AUDIO ---------------------------------------------------

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

var theme = loadAudio(['sounds/theme.ogg']);
var move = loadAudio(['sounds/move.ogg']);
var take = loadAudio(['sounds/take.ogg']);
var hit = loadAudio(['sounds/hit.ogg']);



