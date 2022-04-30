import {Graph, save, load} from '../src/lib/graph.js';
import {buildFakeCanvas} from './common.js';
import {canvasManager} from '../src/canvasManager.js';
import {Point} from '../src/lib/geometry.js';
import {Node, Arrow} from '../src/elements.js';
import {initAPI, API} from '../src/api.js';

beforeEach(() => {
	localStorage = new Map();
	canvasManager.init(buildFakeCanvas());
	canvasManager.getInstance().is_external = true;
	initAPI();
	API.is_external = true;
});

afterEach(() => {
	canvasManager.clear();
});


test('add vertex', () => {
	let g = new Graph();
	expect( g.size ).toBe(0);

	g.addVertex(0);
	expect( g.size ).toBe(1);
	expect( g.graph.get(0) ).toStrictEqual([]);
});


test('add edge', () => {
	let g = new Graph();
	expect( g.size ).toBe(0);

	g.addVertex(0);
	g.addVertex(1);
	g.addVertex(2);

	//0->1, 1->2;
	g.addEdge(0,1);
	g.addEdge(1,2);

	expect( g.size ).toBe(3);
	expect( g.graph.get(0) ).toStrictEqual([1]);
	expect( g.graph.get(1) ).toStrictEqual([2]);
	expect( g.graph.get(2) ).toStrictEqual([]);

});


test('delete vertex', () => {
	let g = new Graph();
	g.addVertex(0);
	g.addVertex(1);
	g.addVertex(2);
	g.addVertex(3);

	g.addEdge(1,2);
	g.addEdge(1,3);
	g.addEdge(3,0);

	//1->2, 1->3, 3->0
	g.deleteVertex(2);
	expect(g.size).toBe(3);

	expect( g.graph.get(1) ).toStrictEqual([3]);
	expect( g.graph.get(2) ).toBe(undefined);

	g.deleteVertex(3);

	expect( g.graph.get(1) ).toStrictEqual([]);
	expect( g.graph.size ).toBe(g.size);

});


test('delete edge', () => {
	let g = new Graph();

	g.addVertex(0);
	g.addVertex(1);
	g.addEdge(0,1);

	expect(g.graph.get(0)).toStrictEqual([1]);
	g.deleteEdge(0,1);
	expect(g.graph.get(0)).toStrictEqual([]);
});


test('save empty', () => {
	save();
	let expected = { object_map: "{}", nodes: "[]", arrows: "[]" };
	
	expect(localStorage.getItem('object_map')).toBe("{}");
	expect(localStorage.getItem('nodes')).toBe("[]");
	expect(localStorage.getItem('arrows')).toBe("[]");

})


test('save node', () => {
	let CM = canvasManager.getInstance();
	CM.addNewNode(new Node(new Point(), '1'));
	save();
	let copy = CM;
	CM.clearCanvas();
	load();
	
	for(let i = 0; i < CM.nodes.length; i++){
		expect(CM.nodes[i]).toEqual(copy.nodes[i]);
	}

});


test('save arrow', () => {
	let CM = canvasManager.getInstance();
	let a = new Node(new Point(), '1');
	let b = new Node(new Point(), '2');

	CM.addNewNode(a);
	CM.addNewNode(b);
	CM.addNewArrow(a,b);

	save();	
	let copy = canvasManager.getInstance();


	CM.clearCanvas();
	load();

	for(let i = 0; i < CM.nodes.length; i++){
		expect(CM.nodes[i]).toEqual(copy.nodes[i]);
	}

	for(let i = 0; i < CM.arrows.length; i++){
		expect(CM.arrows[i]).toEqual(copy.arrows[i]);
	}
});


test('save multiple', () => {
	let CM = canvasManager.getInstance();
	let a = new Node(new Point(), '1');
	let b = new Node(new Point(), '2');

	CM.addNewNode(a);
	CM.addNewNode(b);

	CM.addNewArrow(a,b);

	for(let times = 0; times < 5; times ++){
		save();	
		let copy = CM;

		CM.clearCanvas();

		load();

		for(let i = 0; i < CM.nodes.length; i++){
			expect(CM.nodes[i]).toEqual(copy.nodes[i]);
		}

		for(let i = 0; i < CM.arrows.length; i++){
			expect(CM.arrows[i]).toEqual(copy.arrows[i]);
		}
	}
})