let c = 0;

function stdin(){
    if(c == 0){
        c = 1;
        return document.querySelector("textarea").value;
    }
    else{
        c = 0;
        return null;
    }
}

let LTS_OUT = "";
function stdout(a){
    if(a == null){
        LTS_OUT = "";
    }
    else{
        LTS_OUT += a + "\n";
    }
}

let LTS_ERR = "";
function stderr(a){
    if(a == null){

    }
    else{
        LTS_ERR += a + "\n";
    }
}

let setupComplete = false;

var _old_prompt = window.prompt;
window.prompt = function() {
        //breakpoint
    return stdin();
    // _old_alert.apply(window,arguments);
};

var _old_log = console.log;
console.log = function() {
    stdout(arguments[0]);
}

var _old_warn = console.warn;
console.warn = function() {
    stderr(arguments[0]);
}