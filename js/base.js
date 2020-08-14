function insert_loading(destination){
    var load = '<div class="lds-ripple"><div></div><div></div><div></div></div>';
    document.querySelector(destination).innerHTML = load;
}

function copy_to_clipboard(value){
    let textArea = document.createElement("textarea");

    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';

    textArea.value = value;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        let successful = document.execCommand('copy');
        if(successful){
            UIkit.notification({
                message: 'Text coppied to clipboard!',
                status: 'primary',
                pos: 'top-center',
                timeout: 1000
            });
        }else{
            UIkit.notification({
                message: 'Error occured while coppying.',
                status: 'primary',
                pos: 'top-center',
                timeout: 1000
            });
        }
        
    } catch (err) {
        UIkit.notification({
            message: 'Error occured while coppying.',
            status: 'primary',
            pos: 'top-center',
            timeout: 1000
        });
    }

  document.body.removeChild(textArea);
    
}