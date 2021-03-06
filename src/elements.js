import {canvasManager} from './canvasManager.js';
import {isOverNode, getClosestNode} from './canvas.js';
import {inputManager, drawArrowMenu} from './input.js';
import {getMidPoint, findAngle, Point} from './lib/geometry.js';
import {drawArrowhead, drawLabel, drawText} from './renderer.js';
import {simManager} from './simulate.js';
import {API} from './api.js';

/**
* Node:
* Represents a state in a FSM
*/

class Node{
    /**
    * @param {Point} pos
    * @param {string} str - label to give node
    */
    constructor(pos_, str, index_){
        this.pos = pos_;
        this.connected_arrows = [];
        this.label = str;
        this.is_active = false;
        this.is_accept = false;
        this.is_mouse_over = false;
        this.index = index_;
        this.id = getRandomString();

        canvasManager.getInstance().updateMap(this);
    }

    serialize(){
        function replacer(key,value){
            if(key === "connected_arrows"){
                return [];
            }

            return value;
        }
    
        return JSON.stringify( this, replacer );
    }

    /**
    * Move this node along to a new position, will drag the ends of 
    * connected arrows with it
    *
    * @param {Point} new_pos
    */
    moveTo(new_pos){
        let CM = canvasManager.getInstance();
        const thresh = 10;
        //are we near another node, if so snap to it
        for(let n of CM.nodes){

            let x_adjust = false;
            let y_adjust = false;

            if (n.id === this.id){
                continue;
            }

            //x 
            let x_diff = Math.abs(n.pos.X - new_pos.X);
            if(x_diff < thresh){
                new_pos.X = n.pos.X;
                x_adjust = true;
            }

            let y_diff = Math.abs(n.pos.Y - new_pos.Y);
            if(y_diff < thresh){
                new_pos.Y = n.pos.Y;
                y_adjust = true;
            }

            if(x_adjust || y_adjust){
                break;
            }
        }

        this.pos = new_pos;
        for (var i = this.connected_arrows.length - 1; i >= 0; i--) {
            this.connected_arrows[i].moveByNode(new_pos, this);
        }
    }

    /** @returns {string} */
    toString(){
        return this.label;
    }

    draw(){
        let CM = canvasManager.getInstance();
        let SM = simManager.getInstance();

        CM.context.beginPath();
        CM.context.arc(this.pos.X, this.pos.Y, CM.node_radius, 0, 2 * Math.PI);
        CM.context.stroke();
       
        if(!this.is_mouse_over){
            CM.context.beginPath();
            CM.context.arc(this.pos.X, this.pos.Y, CM.node_radius - 0.5, 0, 2 * Math.PI);
            CM.context.fillStyle = this.is_active && 
                (SM.getCurrentBranch().current_node_index === this.index || SM.display_all) 
                ?  "yellow" : "white";
            CM.context.fill();
        }
        else{
            CM.context.save();
            CM.context.globalAlpha = 0.75;
            CM.context.fillStyle = "CornflowerBlue";
            CM.context.fill();
            CM.context.restore();
        }
    
        if(this.is_accept){
            CM.context.beginPath();
            CM.context.arc(this.pos.X, this.pos.Y, CM.node_radius - 7, 0, 2 * Math.PI);
            CM.context.stroke();
        }
    
        this.is_mouse_over = this.mouseOver();
        drawLabel(this.label, this.pos);
    }

    /**
    * Draw a grid line for this node, other nodes 'snap' to its
    * X and Y axis'. This function visualizes what gets snapped to what for debugging
    */ 
    drawGridLines(){
        let CM = canvasManager.getInstance();
        //y
        CM.context.beginPath();
        CM.context.moveTo(this.pos.X, 0);
        CM.context.lineTo(this.pos.X, CM.height);
        CM.context.stroke();

        //x
        CM.context.beginPath();
        CM.context.moveTo(0, this.pos.Y);
        CM.context.lineTo(CM.width, this.pos.Y);
        CM.context.stroke();
    }

    /** @returns {boolean} **/
    mouseOver(){
        return isOverNode() && getClosestNode() === this;
    }

}


/** 
* ARROW - an arrow represents a connection in a FSM
* start_pos: the position where the arrow started from
* end_pos: the position where the arrow ends
* ctrl_pos: the position between the start & end points
*/
class Arrow{
    /**
    * @param {Node} start
    * @param {Node} end
    * @param {boolean} is_self_ - does the arrow enter and leave the same node
    * @param {number}   angle_off angle offset the mouse clicked on, used for self arrows
    */
    constructor(start, end, is_self_, angle_off){
        this.start_pos = start.pos;
        this.end_pos = end.pos;
        this.t = 0.5;
        this.ctrl_pos = getMidPoint(this.start_pos, this.end_pos);
        this.is_mouse_over = false;
        this.start_node = start;
        this.end_node = end;
        this.is_self = is_self_;
        this.angle_offset = angle_off;

        this.mid_point = this.getCurveMidPoint();
        this.id = getRandomString();

        this.IF = "";
        this.OUT = "";

        canvasManager.getInstance().updateMap(this);
    }
        
    isDeparting(node){
        return node !== this.start_node && !this.is_self;
    }
    
    serialize(){
        function replacer(key,value){
            if(key === "start_node" || key === "end_node"){
                return value.id;
            }

            return value;
        }
    
        return JSON.stringify( this, replacer );
    }

    /* 
    * @returns {Point}
    */
    getCurveMidPoint(){
        var ax = getMidPoint( this.ctrl_pos, this.start_pos );
        var bx = getMidPoint( this.ctrl_pos, this.end_pos)

        return getMidPoint(ax,bx);
    }

    draw(){
        let CM = canvasManager.getInstance();

        if (this.is_self){
            this.drawSelfArrow();
            return;
        }

        let background_col = API.config["light-mode"] ? "black" : "white";
        CM.context.fillStyle = background_col;
        CM.context.strokeStyle = background_col;
        let line_width = 2;

        if(this.is_mouse_over || this === CM.selected_arrow){
            line_width = 4;
        }

        CM.context.lineWidth = line_width;
        this.path = new Path2D();
        this.path.moveTo(this.start_pos.X, this.start_pos.Y);
        this.path.quadraticCurveTo(
            this.ctrl_pos.X,
            this.ctrl_pos.Y, 
            this.end_pos.X, 
            this.end_pos.Y
        );

        CM.context.stroke(this.path);
        let ang = findAngle(this.ctrl_pos, this.end_pos);
        drawArrowhead(this.end_pos, -ang, line_width );

        this.hooverPath = new Path2D();
        this.hooverPath.moveTo(this.start_pos.X, this.start_pos.Y);
        this.hooverPath.quadraticCurveTo(
            this.ctrl_pos.X,
            this.ctrl_pos.Y, 
            this.end_pos.X, 
            this.end_pos.Y
        );

        CM.context.lineWidth = 50;
        CM.context.save();
        CM.context.globalAlpha = 0.0;
        CM.context.stroke(this.hooverPath); 
        CM.context.restore();
    
        this.is_mouse_over = this.isMouseOver();        
        CM.context.lineWidth = 1;

        if(this === CM.selected_arrow){
            drawArrowMenu(this.mid_point,this.IF,this.OUT);
        }else{

            let text = this.IF;
            if(this.IF === ""){
                text = '??';
            }

            let w = CM.context.measureText(text).width;
            let Y = this.mid_point.Y;
            let X = this.mid_point.X; 
            let m = getMidPoint( this.start_pos, this.end_pos );

            if ( this.mid_point.Y > m.Y ){
                Y += 25;
            }else{
                Y -= 10;
            }

            if( this.mid_point.X > m.X ){
                X += (w + 5);
            }else{
                X -= (w);
            }
                
            let pt = new Point( X - w, Y );
            drawText(text, pt);
        }

        CM.context.strokeStyle = "black";
    }

    drawSelfArrow(){
        let line_width = 2;
        let CM = canvasManager.getInstance();

        if(this.is_mouse_over || this === CM.selected_arrow){
            line_width = 4;
            CM.is_over_arrow = true;
        }

        CM.context.strokeStyle = API.config["light-mode"] ? "black" : "white";
        CM.context.lineWidth = line_width;
        let pad = 30;

        CM.context.translate(this.start_pos.X, this.start_pos.Y);
        let a_offset = this.angle_offset + (Math.PI/5);


        CM.context.rotate(-a_offset);

        CM.context.beginPath();
        CM.context.arc(pad,pad, CM.node_radius, 0, 2 * Math.PI);
        CM.context.stroke();

        this.hooverPath = new Path2D();
        this.hooverPath.arc(pad,pad, CM.node_radius, 0, 2 * Math.PI);

        CM.context.lineWidth = 7;
        CM.context.save();
        CM.context.globalAlpha = 0.0;
        CM.context.stroke(this.hooverPath); 
        CM.context.restore();

        this.is_mouse_over = this.isMouseOver();

        CM.context.rotate(a_offset);
        CM.context.translate(-this.start_pos.X, -this.start_pos.Y);

        CM.context.lineWidth = 1;
        drawArrowhead(
            this.end_pos, 
            -(a_offset + Math.PI - Math.PI/17), 
            line_width
        );       
        
        let r = 90;
        let x = r * Math.cos(-this.angle_offset);
        let y = r * Math.sin(-this.angle_offset);


        let pt = new Point(x + this.start_node.pos.X,y + this.start_node.pos.Y);
       
        if(this === CM.selected_arrow){
            drawArrowMenu(pt ,this.IF,this.OUT);
        }else{
            let text = this.IF;
            if(this.IF === ""){
                text = '??';
            }

            CM.context.font = API.config["font"];
            let w = CM.context.measureText(text).width;
            
            let offset_x = pt.X;
            if(this.angle_offset < 5 && this.angle_offset > 2){
                //arrow is left of node
                offset_x -= w;
            }else{
                offset_x += (w/15) ;
            }

            pt = pt.set(offset_x, pt.Y);
            drawText(text,pt); 
        }

        CM.context.strokeStyle = "black";
    }


    isMouseOver(){  
        let mp = inputManager.getInstance().mouse_pos.product( window.devicePixelRatio );
        return canvasManager.getInstance().context.isPointInStroke( 
            this.hooverPath, mp.X, mp.Y
        );
    }

    /**
    * moveByNode updates the arrows position when a conencted node is moved
    * should be called by moveTo on a node object
    *
    * @param {Point} new_pos - tgt pos
    * @param {Node} selected_node - node moving this arrow
    */
    moveByNode(new_pos, selected_node){
        if(this.is_self){
            this.start_pos = new_pos;
            this.end_pos = new_pos;
        }

        //the point connected to the selected node should be moved
        if(selected_node === this.start_node ){
            this.start_pos = new_pos;
        }else{
            this.end_pos = new_pos;
        }

        this.mid_point = this.getCurveMidPoint();
    }
     
    moveToMouse(){
        let CM = canvasManager.getInstance();
        let IM = inputManager.getInstance();

        CM.current_arrow.ctrl_pos = IM.mouse_pos;
        if(this.is_self){
            this.angle_offset = findAngle(this.start_pos, IM.mouse_pos);
        }

        this.mid_point = this.getCurveMidPoint();
    }
}


function deserializeNode(data){
    let tmp = JSON.parse(data);
    let ret = new Node();

    for(let x in tmp){
        ret[x] = tmp[x];
    }

    return ret;
}


function deserializeArrow(data){
    let tmp = JSON.parse(data);
    let ret = new Arrow(
        new Node(new Point()), 
        new Node(new Point())
    );

    for(let x in tmp){
        ret[x] = tmp[x];
    }

    ret.start_node = null;
    ret.end_node = null;

    return tmp;
}


/**
* create a unique random string
* @return {String}
*/
function getRandomString(){
    let array = "";
    for(let i = 0; i < 5; i++){
        let t = (Math.floor(Math.random() * Math.floor(500)));
        array += t.toString();
    }
   
    return array;
}


export{
    Node,
    Arrow,
    deserializeArrow,
    deserializeNode
}