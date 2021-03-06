/**
 * _API base class that handles interacting with state machine from outsite programs
 *
 * @typedef {Object} _API
 */
class _API {
    constructor() {
        this.translation_table = new Map();
        this.is_external = false;
        this.can_output = false;
        this.config = {
            "light-mode": true,
            "font": "italic 25px Times New Roman"
        };
    }

    clear() {
        this.translation_table.clear();
    }

    /**
     * adds a new function to be called with a defined action occurs
     * @param {String} func - name of the trigger
     * @param {Object} callback - a function to call when the trigger occurs
     */
    addFunc(func, callback) {
        let tgt = this.translation_table.get(func);
        let set = [];
        if (typeof tgt === "undefined") {
            set = [callback];
        } else {
            tgt.push(callback);
            set = tgt;
        }

        this.translation_table.set(func, set);
    }

    /**
     * call all functions related to a trigger
     * @param {String} func - name of the trigger
     * @param {Object} data - additional parameters to send to the functions associated with the given trigger
     */
    call(func, ...data) {
        let tgt = this.translation_table.get(func);
        if (typeof tgt === "undefined") {
            return;
        }

        let args = [];
        for (let x of data) {
            args.push(x);
        }

        let response = [];
        for (let x of tgt) {
            response.push(x.apply(null, args));
        }

        return response;
    }


    /**
     * @returns {String}
     */
    toString() {
        let ret = "";
        this.translation_table.forEach((val, key) => {
            ret += `${key} ==> \n"` + val.toString() + `"\n`;
        });
        return ret;
    }


    /**
     * print all current triggers and what functions they call
     * @param {Bool|Null} print to console, true by default
     * @returns {String} 
     */
    dump(console_log = true) {
        let ret = this.toString();
        if (console_log) {
            console.log(ret);
        }
        return ret;
    }
}

//global object shared between program
let API = null;

function initAPI() {
    API = new _API();
}

export {
    API,
    initAPI,
    _API /* used for testing */
}