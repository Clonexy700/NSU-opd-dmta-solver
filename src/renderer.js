import {canvasManager} from './canvasManager.js';
import {inputManager} from './input.js';
import {findAngle} from './lib/geometry.js';
import {API} from './api.js';

/** @typedef { import('./lib/geometry.js').Point } Point */``

//Draw an arrow at the end of the curve to show the direction
// SRC : https://stackoverflow.com/questions/6576827/html-canvas-draw-curved-arrows


/**
* Draws an arrowhead at a given point - usually a node
*
* @param {Point} pos - position of node to draw the arrow at
* @param {Number} angle - angle arrow should point at in rads
* @param {Number} line_width - thickness to draw arrow 
*/
function drawArrowhead(pos, angle, line_width) {
    let CM = canvasManager.getInstance();

    CM.context.fillStyle = API.config["light-mode"] ? "black" : "white";

    let sizex = 8 + line_width,
        sizey = 8 + line_width;

    let hx = sizex / 2,
        hy = sizey / 2;

    CM.context.translate(pos.X, pos.Y);
    CM.context.rotate(angle);
    CM.context.translate(-hx,-hy);

    CM.context.beginPath();

    let pad = 5
    CM.context.moveTo(-(CM.node_radius+pad),0);
    CM.context.lineTo(-(CM.node_radius+pad),(1*sizey));   
    CM.context.lineTo((1*sizex)- (CM.node_radius+pad),1*hy);
    CM.context.closePath();
    CM.context.fill();

    CM.context.translate(hx,hy);
    CM.context.rotate(-angle);
    CM.context.translate(-pos.X,-pos.Y);

    CM.context.fillStyle = "black";
}  


/**
* Draws an arrow that starts and ends at the same node
*
* @param {Point} start_pos - position of node to draw at
*/
function drawSelfArrowHelper(start_pos){
    let CM = canvasManager.getInstance();
    let IM = inputManager.getInstance();

    let angle = findAngle(start_pos, IM.mouse_pos);

    let a_offset = angle + (Math.PI/5);

    let pad = 30;

    CM.context.strokeStyle = API.config["light-mode"] ? "black" : "white";
    CM.context.translate(start_pos.X, start_pos.Y);
    CM.context.rotate(-a_offset);

    CM.context.beginPath();
    CM.context.arc(pad,pad, CM.node_radius, 0, 2 * Math.PI);
    CM.context.stroke(); 

    CM.context.rotate(a_offset);
    CM.context.translate(-start_pos.X, -start_pos.Y);
} 


function initCanvas() {
    let ratio = window.devicePixelRatio;
    let CM = canvasManager.getInstance();
    CM.canvas.style.width = CM.width + "px";
    CM.canvas.style.height = CM.height + "px";
 
    CM.canvas.width = CM.width * ratio;
    CM.canvas.height = CM.height * ratio;
    CM.context.scale(ratio, ratio);
    if(API.config["light-mode"] === false){
        displayDarkMode();
    }
}


function displayDarkMode(){
    let body = document.getElementsByTagName("body")[0];
    body.className = "body-dark";
    body.style.color = "white";

    document.getElementsByTagName("canvas")[0].className = "border-dark";
}

function toggleDarkMode(){
    API.config["light-mode"] = !API.config["light-mode"];

    if(API.config["light-mode"]){
        let body = document.getElementsByTagName("body")[0];
        body.className = "";
        body.style.color = "black";

        document.getElementsByTagName("canvas")[0].className = "";
    }else{
        displayDarkMode();
    }
}


/**
* Draw a label on a node
* 
* @param {String} str string to draw
* @param {Point} _pos position of the node
*/
function drawLabel(str, _pos){
    const CM = canvasManager.getInstance();

    CM.context.font = API.config["font"];
    CM.context.fillStyle = "black";
    CM.context.fillText("S", _pos.X-8, _pos.Y+5);
    CM.context.font = "15px Times New Roman";
    CM.context.fillText(str, _pos.X+4, _pos.Y+10);
}


function drawText(str, _pos){
    let CM = canvasManager.getInstance();

    CM.context.font = API.config["font"];
    CM.context.fillStyle = API.config["light-mode"] ? "black" : "white";
    CM.context.fillText(str, _pos.X, _pos.Y);
}


function drawLine(a, b, thickness = 1){
    let CM = canvasManager.getInstance();
    CM.context.strokeStyle = API.config["light-mode"] ? "black" : "white";
    CM.context.beginPath();
    CM.context.moveTo(a.X,a.Y);
    CM.context.lineTo(b.X,b.Y);
    CM.context.lineWidth = thickness;
    CM.context.stroke();
}


function renderBackground(){
    let CM = canvasManager.getInstance();

    let background_col = API.config["light-mode"] ? "white" : "black";

    CM.context.fillStyle = background_col;
    CM.context.fillRect(0, 0, CM.width, CM.height);
}


export{
    initCanvas,
    drawArrowhead,
    drawSelfArrowHelper,
    drawLine,
    drawText,
    drawLabel,
    renderBackground,
    toggleDarkMode
}

