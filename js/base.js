function insert_loading(destination){
    var load = '<div class="lds-ripple"><div></div><div></div><div></div></div>';
    document.querySelector(destination).innerHTML = load;
}