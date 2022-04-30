import {_API} from '../src/api.js';

var API = new _API();

beforeEach(() => {
    API = new _API();
});

test('basic test', () => {
    let foo = function (response){ expect(response).toBe(2); } ;

    API.addFunc( "test1" , foo);
    API.call("test1", 2);
});


test('test empty', () => {
    API.call("foo", "foo");
});


test('test multiple funcs', () => {
    let foo = function (response){ expect(response).toBe("test"); } ;
    let bar = function (response){ expect(response).toBe("test"); } ;
    let baz = function (response){ expect(response).toBe("test"); } ;
        
    API.addFunc( "a" , foo);
    API.addFunc( "a" , bar);
    API.addFunc( "a" , baz);

    API.call("a", "test");
});


test('test multiple args', () => {
    let foo = function (a,b,c){ 
        expect(a).toBe(1);
        expect(b).toBe("foo");
        expect(c).toBe(3.14); 
    } ;

    API.addFunc("test", foo);
    API.call("test", 1, "foo", 3.14 );
});


test('test return', () => {
    let foo = function(){ return 1};

    API.addFunc("test", foo);
    expect(API.call("test")).toStrictEqual([1]);
});


test('test multiple return', () => {
    let a = function(){ return 1};
    let b = function(){ return "test" };
    let c = function(){ return {} };
    let d = function(x){ return x * 2 };

    API.addFunc("test", a);
    API.addFunc("test", b);
    API.addFunc("test", c);
    API.addFunc("test", d);

    expect(API.call("test", 2)).toStrictEqual([1,"test", {}, 4]);
});


test('test API to string', () => {
    let a = function(){ return 1 };
    
    API.addFunc("test", a); 
    API.addFunc("test", () => {return "str";}); 
    API.addFunc("test_other", () => {return "str2";}); 

    let expected =`test ==> 
      "function () {
          return 1;
        },() => {
          return "str";
        }"
      test_other ==> 
      "() => {
          return "str2";
        }"`.replace(/\n|\t|\s/g,"")

    let test = API.dump(false).replace(/\n|\t|\s/g,"");
    expect(test).toBe(expected);
});
