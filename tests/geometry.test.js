import {
	Point, getDistance, findAngle, getMidPoint
} from '../src/lib/geometry.js';

test('point test', () => {
	let p = new Point();
	expect(p.X).toBe(p.Y);
	expect(p.X).toBe(0);

	p = new Point(5,5);
	expect(p.X).toBe(p.Y);
	expect(p.X).toBe(5);

	p.set(10,10);
	expect(p.X).toBe(p.Y);
	expect(p.X).toBe(10);
});

test('distance test', () => {
	let p1 = new Point(0,0);
	let p2 = new Point(0,1);

	let d = getDistance(p1,p2);
	expect(d).toBe(1);
});

test('angle test', () => {
	let p1 = new Point(0,0);
	let p2 = new Point(0,1);

	let a = findAngle(p1,p2);
	expect(a* (180 / Math.PI)).toBe(270);

	let p3 = new Point(0,-1);
	let c = findAngle(p1,p3);
	expect(c*(180 / Math.PI)).toBe(90);

	let p4 = new Point(1,1);
	let d = findAngle(p1,p4);
	expect(d*(180 / Math.PI)).toBe(315);

	let p5 = new Point(-1,1);
	let e = findAngle(p1,p5);
	expect(e*(180 / Math.PI)).toBe(225);

	let p6 = new Point(-1,-1);
	let f = findAngle(p1,p6);
	expect(f*(180 / Math.PI)).toBe(135);

	let p7 = new Point(1,-1);
	let g = findAngle(p1,p7);
	expect(g*(180 / Math.PI)).toBe(45);
});

test('test midpoint', () => {
	let p1 = new Point(0,0);
	let p2 = new Point(2,2);
	let a = getMidPoint(p1,p2);

	expect(a.X).toBe(1);
	expect(a.Y).toBe(1);
});