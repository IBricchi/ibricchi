async function ib_insert_ib_html(path, destination, variables){
    let html = await ib_get_ib_html(path, variables);
    document.querySelector(destination).innerHTML = html;
}

async function ib_insert_file(path, destination){
    let html = await ib_get_file(path);
    document.querySelector(destination).innerHTML = html;
}

async function ib_get_ib_html(path, variables){
    let response = await fetch(path);
    let html = await response.text();
    html = ib_pre_process(variables, html);

    return html;
}

async function ib_get_file(path){
    let response = await fetch(path);
    let html = await response.text();

    return html;
}

class ib_parser{
    lines;
    current = 0;

    constructor(input_file){
        this.lines = input_file.split("\n");
        for(let i = 0; i < this.lines.length; i++){
            this.lines[i] = this.lines[i].trim();
        }
    }

    is_at_end(){
        return this.current >= this.lines.length;
    }

    advance(){
        if(this.is_at_end()){
            return null;
        }
        this.current++;
        return this.lines[this.current - 1];
    }

    peek(){
        if(this.is_at_end()){
            return null;
        }
        return this.lines[this.current];
    }

}

function ib_pre_process(variables, text){
    let parser = new ib_parser(text);
    
    let html = [];

    while(!parser.is_at_end()){
        let line = parser.advance();
        html.push(ib_line(parser, variables, line));
    }

    html = html.join("\n");
    return html;
}

function ib_line(parser, variables, line){
    if(line[0] == "$"){
        return ib_command(parser, variables, line.slice(1).trim());
    }

    if(line[0] == "\\" && line[1] == "$"){
        line.slice(1);
    }

    return ib_html(variables, line);
}

function ib_command(parser, variables, line){
    tokens = line.split(" ");
    switch (tokens[0]) {
        case "for":
            return ib_command_for(parser, variables, tokens);
        default:
            return "";
    }
}

function ib_command_for(parser, variables, tokens){
    let loopVariables = tokens[1].split(",");
    let loopCompVar = tokens[2];
    let loopCompComp = tokens[3];
    let loopCompConst = tokens[4];
    let loopEnd = tokens[5].split(",");

    for(let i = 0; i < loopVariables.length; i++){
        let loopVariable = loopVariables[i].split("=");
        let varName = loopVariable[0];
        let varValue = loopVariable.length==2?parseFloat(loopVariable[1]):0
        variables[varName] = varValue;
    }

    function checkCondition(){
        switch (loopCompComp) {
            case "==":
                return variables[loopCompVar] == loopCompConst;
            case "<":
                return variables[loopCompVar] < loopCompConst;
            case "<=":
                return variables[loopCompVar] <= loopCompConst;
            case ">":
                return variables[loopCompVar] > loopCompConst;
            case ">=":
                return variables[loopCompVar] >= loopCompConst;
            default:
                return false;
        }
    }

    function doEnd(){
        loopEnd.forEach(command => {
            commandTokens = command.split("+=");
            commandVar = commandTokens[0];
            commandDelta = parseFloat(commandTokens[1]);
            variables[commandVar] += commandDelta;
        });
    }

    lines = [];

    let nextLine = parser.peek();

    while(nextLine != null & (nextLine[0] != "$" || nextLine.slice(1).trim() != "end_for")){
        lines.push(parser.advance());
        nextLine = parser.peek();
    }

    let html = [];

    while(checkCondition()){
        lines.forEach(line => {
            html.push(ib_line(parser, variables, line));
        });
        doEnd();
    }

    html = html.join("\n");
    return html;
}

function ib_html(variables, line){
    let newLine = [];
    for(let i = 0; i < line.length; i++){
        if(i+1 < line.length && line[i] == "\\" && line[i+1] == "$"){
            newLine.push("$");
            i++;
        }
        else if(line[i] == "$"){
            let end = i + 1;
            let is_inline_var = true;
            if(end < line.length && line[end] == "$"){
                is_inline_var = false;
                end++;
            }
            
            while(end < line.length && line[end] != "$"){
                if(end + 1 < line.length && line[end] == "\\" && line[end+1] == "$"){
                    line = line.slice(0, end) + line.slice(end + 1);
                }
                end++;
            }
            var name = line.slice(i + (is_inline_var?1:2), end);
            
            if(is_inline_var){
                newLine.push(ib_inline_var(variables, name));
            }
            else{
                newLine.push(ib_inline_command(variables, name));
            }

            i = end;
        }
        else{
            newLine.push(line[i]);
        }
    }
    return newLine.join("");
}

function ib_inline_var(variables, name){
    if(name in variables){
        return variables[name];
    }
    else{
        return "null";
    }
}

function ib_inline_command(variables, name){
    let tokens = name.split(" ");
    switch(tokens[0]){
        case "array":
            return ib_inline_array(tokens, variables, name);
        default:
            return "null"
    }
}

function ib_inline_array(tokens, variables, name){
    if(tokens.length < 3) return "null";
    let array_name = tokens[1];
    let array_index = tokens[2];

    if(array_index[0] == "#"){
        array_index = ib_inline_var(variables, array_index.slice(1));
    }

    if(!array_name in variables) return "null";
    if(!array_index in variables[array_name]) return "null";
    return variables[array_name][array_index];
}