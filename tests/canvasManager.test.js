import {canvasManager} from '../src/canvasManager.js';
import {Node} from '../src/elements.js';
import {Point} from '../src/lib/geometry.js';
import {buildFakeCanvas} from './common.js';
import {initAPI,API} from '../src/api.js';

afterEach(()=>{
	initAPI();
	API.is_external = true;
	canvasManager.clear();
})

test('test build', () => {
	let CM = canvasManager.init(buildFakeCanvas());
	expect(CM).toStrictEqual(canvasManager.getInstance());		
});


test('add new node', () => {
	let CM = canvasManager.init(buildFakeCanvas());

	CM.addNewNode(new Node(new Point(), '1'));

	expect(CM.nodes.length).toBe(1);
	expect(CM.graph.graph.size).toBe(1);

	CM.deleteNode(0);

	expect(CM.nodes.length).toBe(0);
	expect(CM.graph.graph.size).toBe(0);
});