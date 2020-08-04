function insert_load(destination){
    var load = '<div class="lds-ripple"><div></div><div></div><div></div></div>';
    document.querySelector(destination).innerHTML = load;
}