let project = window.location.hash;

async function load_page(text){
    insert_load("#devMain");
    
    let project = text;
    if(text == null) project = window.location.hash;

    window.location.hash = project;

    if(project == ""){
        load_def();
    }
    else{
        load_proj(project.slice(1));
    }
}

async function load_proj(name){
    let info = await ib_get_file("/src/data/dev/"+name+"/info.json");
    info = JSON.parse(info);
    
    let variables = {};
    variables["name"]=info["name"];
    variables["link"]=info["link"];
    variables["icon"]=info["icon"];
    variables["languages"]=info["languages"];
    variables["short"]=info["short"];
    variables["long"]=info["long"];

    ib_insert_ib_html("/templates/devProj.html", "#devMain", variables);
}

async function load_def(){
    let info = await ib_get_file("/src/data/dev/dev.json");
    info = JSON.parse(info);
    
    let variables = {
        "fav_count": 0,
        "fav_names": [],
        "fav_links": [],
        "fav_icons": [],
        "count": 0,
        "names": [],
        "links": [],
        "icons": []
    };
    
    info.forEach(data => {
        variables["count"]++;
        variables["names"].push(data["name"]);
        variables["links"].push(data["link"]);
        variables["icons"].push(data["icon"]);

        if(data["favourite"]){
            variables["fav_count"]++;
            variables["fav_names"].push(data["name"]);
            variables["fav_links"].push(data["link"]);
            variables["fav_icons"].push(data["icon"]);
        }
    });

    ib_insert_ib_html("/templates/devDef.html", "#devMain", variables);
}

load_page(null);