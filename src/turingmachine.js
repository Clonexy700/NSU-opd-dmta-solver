"use strict";

//////////////Table Of Rules control/////////////////////////////////
// Add new symbol
const asym = document.getElementById("asym");
asym.onclick = function() {
    let table = document.getElementById("table_rules");
    let rlength = table.rows[0].length;
    let ncell = table.rows[0].insertCell(rlength);
    ncell.className = "spectd";
    ncell.innerHTML = "<input type=\"text\ class=\"symbol\">";
    for (let i = 1; i < table.rows.length; i++) {
        let a = table.rows[i].insertCell(rlength);
        a.innerHTML = "<input type=\"text\" class=\"rule\">";
    }
    return;
}


// Remove last symbol
const rsym = document.getElementById("rsym");
rsym.onclick = function() {
    let table = document.getElementById("table_rules");
    let cellindex = table.rows[0].cells.length - 1;
    if (cellindex > 1) {
        for (let i = 0; i < table.rows.length; i++) {
            table.rows[i].deleteCell(cellindex);
        }
    } else alert("You can't delete more cells");
    return;
}

// Add new state
const astate = document.getElementById("astate");
astate.onclick = function() {
    let table = document.getElementById("table_rules");
    let rc = table.rows.length;
    let nrow = table.insertRow(rc);
    let cell = nrow.insertCell(0);
    cell.className = "state";
    cell.innerHTML = `q${rc}`;
    for (let i = 1; i < table.rows[0].cells.length; i++) {
        let ncell = nrow.insertCell(i);
        ncell.innerHTML = "<input type=\"text\" class=\"rule\">"
    }
    return;
}

// Remove last state
const rstate = document.getElementById("rstate");
rstate.onclick = function() {
    let table = document.getElementById("table_rules");
    let rc = table.rows.length;
    if (rc > 2) {
        table.deleteRow(rc - 1);
    } else alert("You can't delete more rows");
    return;
}


//////////////////////// Turing Machine /////////////////////////
const charset = ['L', 'N', 'R'];

const tapeinput = document.getElementById("tapeinput");
const run = document.getElementById("run");
const temptape = document.getElementById("temptape");
let alphabet = []; // symbols that turing machine use
let states = []; // state of turing machine
let rules = []; // instructions for turing machine
let tape; // just tape -_-

function getInput() {
    tape = tapeinput.value.split("");
    let table = document.getElementById("table_rules");

    // reading alphabet from the instruction table
    for (let i = 1; i < table.rows[0].cells.length; i++) {
        alphabet.push(table.rows[0].cells[i].getElementsByTagName("input")[0].value);
    }

    // reading number of states in use from the instruction table 
    for (let i = 0; i < table.rows.length; i++) {
        states.push(i);
    }

    // reading instructions from the instruction table 
    for (let i = 1; i < table.rows.length; i++) {
        rules[i] = [];
        for (let j = 1; j < table.rows[0].cells.length; j++) {
            rules[i][j - 1] = table.rows[i].cells[j].getElementsByTagName("input")[0].value;
        }
    }
    console.debug("Alphabet is", alphabet);
    console.debug("States are", states);
    console.debug("Instructions are:", rules);
    return;
}

// clears alphabet, states, rules array and clear tape for user
function clearInput() {
    temptape.innerHTML = '';
    alphabet = [];
    states = [];
    rules = [];
    step_state = 1;
    step_RWH = 0;
    first_step = true;
    return;
}

// this function was supposed to be in use each step of turing machine to show turing machine step by step
function updateTape(newtape) {
    temptape.innerHTML = newtape.join('');
    return;
}


// checks each character to be one symbol
let checkAlphabet = function() {
    for (let i = 0; i < alphabet.length; i++) {

        if (alphabet[i].length > 1) {
            console.error(`${alphabet[i]} is not allowed. You must use only one character.`);
            alert(`${alphabet[i]} is not allowed. You must use only one character.`);
            return false;
        }
    }
    return true;
}

// checks each symbol in tape to be declared in alphabet
let checkTape = function() {
    for (let i = 0; i < tape.length; i++) {
        if (alphabet.indexOf(tape[i]) == -1) {
            console.error(`Symbol ${tape[i]} is not declared in alphabet.`);
            alert(`Symbol ${tape[i]} is not declared in alphabet.`);
            return false;
        }
    }
    return true;
}

// check each rule to be written according to the rules
let checkRules = function() {
    let sym;
    let mov;
    let state;
    let rule;
    for (let i = 1; i < rules.length; i++) {
        for (let j = 0; j < rules[i].length; j++) {
            rule = rules[i][j];
            if (rule != '-') {
                sym = rules[i][j][0];
                mov = rules[i][j][1];
                state = rules[i][j].slice(2);

                // the first symbol in a rule must be declared in alphabet
                if (alphabet.indexOf(sym) == -1) {
                    console.error(`Symbol ${sym} is not declared in alphabet.`);
                    alert(`Symbol ${sym} is not declared in alphabet.`);
                    return false;
                }

                // the second symbol in a rule must be L, N or R.
                else if (charset.indexOf(mov) == -1) {
                    console.error(`Symbol ${mov} is not allowed.`)
                    alert(`Symbol ${mov} is not allowed. You can use only L, N or R.`)
                    return false;
                }

                // the third symbol must be q
                else if (state[0] != 'q') {
                    console.error(`You have to use 'q' before state number.`);
                    alert(`You have to use 'q' before state number.`);
                    return false;
                }

                //the last symbols must be declared with 'add state' button
                else if (states.indexOf(Number(state.slice(1))) == -1) {
                    console.error(`${state} is not declared.`);
                    alert(`${state} is not declared.`);
                    return false;
                }
            }
        }
    }
    return true;
}

run.onclick = function() {
    // Input
    clearInput();
    getInput();


    // Check input in general
    if (!checkAlphabet() || !checkTape() || !checkRules())
        return false;

    //Turing Machine start
    const endless_cycle_limit = 400; // Endless cycle protection
    let loop = 0; // Endless cycle protection
    let rule;
    let state = 1;
    let last_state = 0; // Endless cycle protection
    let RWH = 0;
    let mov;
    let newsym;

    // that's turing machine
    while (state != 0) {
        rule = rules[state][alphabet.indexOf(tape[RWH])];
        if (rule != '-') {
            newsym = rule[0];
            mov = rule[1];
            last_state = state;
            state = rule.slice(3);
            loop = (last_state == state) ? loop + 1 : 0;
            tape[RWH] = newsym;
            switch (mov) {
                case 'L':
                    RWH--;
                    if (tape[RWH] == undefined) tape[RWH] = '_';
                    break;
                case 'R':
                    RWH++;
                    if (tape[RWH] == undefined) tape[RWH] = '_';
                    break;
            }
        } else {
            alert(`Turing machine tried to use rule here: "state = q${state}, symbol = ${tape[RWH]}"`);
            break;
        }
        if (loop > endless_cycle_limit) {
            alert('Looks like your program got into an endless loop');
            break;
        }

    }
    updateTape(tape);
    return;
}


const clear = document.getElementById("clear");
clear.onclick = function() {
    clearInput();
}

const step = document.getElementById("step");
let step_state = 1;
let step_RWH = 0
let first_step = true;
let last_tape;

function step_updateTape(newtape, state, RWH) {
    let inner = newtape.join('') + "<br>";
    let rwhead = document.createElement("span");
    rwhead.setAttribute("id", "rwhead");
    let rwtext = document.createTextNode(`^ [q${state}]`);
    rwhead.appendChild(rwtext);
    rwhead.style.fontSize = '0.9em';
    rwhead.style.marginLeft = `${9.2*RWH + 3}px`;
    //temptape.innerHTML = newtape.slice(0, RWH).join('') + `[${newtape[RWH]}]` + newtape.slice(RWH+1).join('') + ` [q${state}]`;
    temptape.innerHTML = inner;
    temptape.appendChild(rwhead);
    rwhead
    return;
}

step.onclick = function() {


    if (first_step) {
        getInput();
        if (!checkAlphabet() || !checkTape() || !checkRules())
            return false;
        last_tape = tapeinput.value.split("");
        first_step = false;
    } else {
        tape = last_tape;
        let rule;
        let mov;
        let newsym;
        if (step_state != 0) {
            rule = rules[step_state][alphabet.indexOf(tape[step_RWH])];
            if (rule != '-') {
                newsym = rule[0];
                mov = rule[1];
                step_state = rule.slice(3);
                tape[step_RWH] = newsym;
                last_tape = tape;
                switch (mov) {
                    case 'L':
                        step_RWH--;
                        if (tape[step_RWH] == undefined) { tape.unshift('_');
                            step_RWH++; }
                        break;
                    case 'R':
                        step_RWH++;
                        if (tape[step_RWH] == undefined) tape[step_RWH] = '_';
                        break;
                }
            } else {
                first_step = true;
                alert(`Turing machine tried to use rule here: "state = q${step_state}, symbol = ${tape[step_RWH]}"`);
                return false;
            }
        } else {
            alert(`Turing machine have already completed program`);
        }
    }
    step_updateTape(tape, step_state, step_RWH);
    return true;
}