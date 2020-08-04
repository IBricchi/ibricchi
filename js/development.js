let project = window.location.hash;

let variables = {
    "x": [Math.random(),Math.random(),Math.random(),Math.random(),Math.random()],
    "y": [Math.random(),Math.random(),Math.random(),Math.random(),Math.random()]
}

if(project == ""){
    ib_insert_ib_html("/templates/devSimple.html", "#devMain", variables);
}