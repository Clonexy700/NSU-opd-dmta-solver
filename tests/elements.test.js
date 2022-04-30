import {Node, Arrow, deserializeNode, deserializeArrow} from '../src/elements.js';
import {Point} from '../src/lib/geometry.js';
import {canvasManager} from '../src/canvasManager.js';
    
function buildFakeNode(X,Y){
    let index = 0;
    let ret = new Node( new Point(X,Y), index.toString() );
    index ++;
    return ret;
}

function buildFakeCanvas(){
    return {
        getContext : function() { return null; }
    }
}


beforeEach(() => {
    canvasManager.init(buildFakeCanvas());
});


test('serialize node', () => {
    let n = buildFakeNode(500,500);
    let json = n.serialize();
    json = JSON.parse(json);

    expect(json["pos"]["X"]).toBe( n.pos.X );
    expect(json["pos"]["Y"]).toBe( n.pos.Y );

    expect(json["label"]).toStrictEqual( n.label );
});


test('serialize arrow', () => {
    let a = new Arrow ( 
        buildFakeNode(100,200), 
        buildFakeNode(300,500), 
        false, 0.0
    );
    
    let json = a.serialize(); 
    json = JSON.parse(json);
     
    expect(json["start_pos"]["X"]).toBe( 100 );
});

test('deserialize node', () => {
    let n = new Node(new Point(), "1");
    let data = n.serialize();

    let o = deserializeNode(data);

    for(let x in o){
        expect(o[x]).toEqual(n[x]);
    }

});

test('deserialize arrow', () => {
    let a = new Arrow(
        new Node(new Point(0,0), "1"),
        new Node(new Point(0,1), "2")
    );

    let data = a.serialize();
    let o = deserializeArrow(data);

    for(let x in a){
        if(x === "start_node" || x === "end_node"){
            continue;
        }

        expect(o[x]).toEqual(a[x]);
    }

});
