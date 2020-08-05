let project = window.location.hash;

let info = null;

async function load_page(project_name){
    insert_loading("#devMain");

    if(info == null){
        info = await ib_get_file("/src/data/dev/dev.json");
        info = JSON.parse(info);
    }
    
    let project = project_name;
    if(project_name == null){
        project = window.location.hash;
        project = project.slice(1);
    }

    window.location.hash = project;

    if(project == ""){
        load_def();
    }
    else{
        load_proj(project);
    }
}

async function load_proj(name){
    if(info[name] == undefined){
        window.location.replace("/404.html");
    }

    let variables = new Map();
    variables["name"]=info[name]["name"];
    variables["project"]=name;
    variables["icon"]=info[name]["icon"];
    variables["languages"]=info[name]["languages"];
    variables["short"]=info[name]["short"];

    ib_insert_ib_html("/templates/devProj.html", "#devMain", variables);
}

async function load_def(){    
    let variables = new Map({
        "fav_count": 0,
        "fav_names": [],
        "fav_projects": [],
        "fav_icons": [],
        "count": 0,
        "names": [],
        "projects": [],
        "icons": []
    });
    
    Object.keys(info).forEach(key => {
        variables["count"]++;
        variables["names"].push(info[key]["name"]);
        variables["projects"].push(key);
        variables["icons"].push(info[key]["icon"]);

        if(info[key]["favourite"]){
            variables["fav_count"]++;
            variables["fav_names"].push(info[key]["name"]);
            variables["fav_projects"].push(info[key]["link"]);
            variables["fav_icons"].push(info[key]["icon"]);
        }
    });

    ib_insert_ib_html("/templates/devDef.html", "#devMain", variables);
}

load_page(null);