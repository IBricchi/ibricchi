let project = window.location.hash;

function getRandom() {
    let max = 400;
    let min = 200;
    return min + Math.floor(Math.random() * Math.floor(max-min));
  }

let variables = {
    "x": [getRandom(), getRandom(), getRandom(), getRandom(), getRandom()],
    "y": [getRandom(), getRandom(), getRandom(), getRandom(), getRandom()]
}

if(project == ""){
    ib_insert_ib_html("/templates/devSimple.html", "#devMain", variables);
}