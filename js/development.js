let project = window.location.hash;

let variables = {
    "test": ["a", "b", "c", "d"]
}

if(project == ""){
    ib_insert_ib_html("/templates/devSimple.html", "#devMain", variables);
}