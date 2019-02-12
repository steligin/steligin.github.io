var brick_size = 10;
var canvas;
var ctx;
var CANVAS_BGCOLOR = "#000000";

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
//making the canvas full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.backgroundColor = CANVAS_BGCOLOR;

document.body.appendChild(canvas);

var columns = canvas.width/brick_size;
var drops = [];

for (var x = 0; x < columns; x++) {
    drops[x] = 0;
}

var colorArray = [
    "#ff0000",
    "#ff9900",
    "#ffff00",
    "#00ff00",
    "#0099ff",
    "#0000ff",
    "#9900ff"
];

function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ff00";
    // ctx.fillStyle = "#000000";

    for(var i = 0; i < drops.length; i++) {

        ctx.fillStyle = colorArray[Math.floor(Math.random() * (colorArray.length))];

        ctx.clearRect(i*brick_size, drops[i]*brick_size, brick_size, brick_size);
        ctx.fillRect(i*brick_size+1, drops[i]*brick_size+1, brick_size-2, brick_size-2);
        // ctx.clearRect(i*brick_size+4, drops[i]*brick_size+4, brick_size-8, brick_size-8);
        // ctx.fillRect(i*brick_size+6, drops[i]*brick_size+6, brick_size-12, brick_size-12);

        if(drops[i]*brick_size > canvas.height && Math.random() > 0.975) { //0.975
            drops[i] = -1; // = -1
        }
        drops[i]++;

    }
}

// 1000/17 = ~60 times a second 1000/33 = ~30 1000/50 = ~20 1000/65 = ~15
function runMatrix() {
    if (typeof Game_Interval != "undefined") {
        clearInterval(Game_Interval);
    }
    Game_Interval = setInterval(draw, 64);
    console.log("run_brickrain");
}

function stopMatrix() {
    clearInterval(Game_Interval);
    console.log("stop_brickrain");
}

runMatrix();