let project = window.location.hash;

let info = null;

window.addEventListener("hashchange", load_page, false);

document.querySelector("#nav-projects").addEventListener("click", () => {
    document.querySelector("#nav-control").checked = false;
}, false)

async function load_page(){
    insert_loading("#projMain");

    if(info == null){
        info = await ib.get_file("/src/data/proj/proj.json");
        info = JSON.parse(info);
    }
    
    let project = window.location.hash.slice(1);

    if(project == ""){
        load_def();
    }
    else{
        load_proj(project);
    }
}

async function load_proj(name){
    if(info[name] == undefined){
        // window.location.replace("/404.html");
    }

    let variables = new Map();
    variables["name"]=info[name]["name"];
    variables["project"]=name;
    variables["icon"]=info[name]["icon"];
    variables["languages"]=info[name]["languages"];
    variables["short"]=info[name]["short"];

    ib.insert_ib_html("/templates/projDetails.html", "#projMain", variables);
}

async function load_def(){    
    let variables = new Map();
    variables["fav_count"] = 0;
    variables["fav_names"] = [];
    variables["fav_projects"] = [];
    variables["fav_icons"] = [];
    variables["fav_sources"] = [];
    variables["fav_shorts"] = [];
    variables["count"] = 0;
    variables["names"] = [];
    variables["projects"] = [];
    variables["icons"] = [];
    variables["sources"] = [];
    variables["shorts"] = [];
    
    Object.keys(info).forEach(key => {
        variables["count"]++;
        variables["names"].push(info[key]["name"]);
        variables["projects"].push(key);
        variables["icons"].push(info[key]["icon"]);
        variables["sources"].push(info[key]["source"]);
        variables["shorts"].push(info[key]["short"]);

        if(info[key]["favourite"]){
            variables["fav_count"]++;
            variables["fav_names"].push(info[key]["name"]);
            variables["fav_projects"].push(info[key]["link"]);
            variables["fav_icons"].push(info[key]["icon"]);
            variables["fav_sources"].push(info[key]["source"]);
            variables["fav_shorts"].push(info[key]["short"]);
        }
    });

    ib.insert_ib_html("/templates/projOverview.html", "#projMain", variables);
}

load_page();