class text_slider{
    constructor(element){
        this.parent = element;
        this.children = element.children;
        this.count = element.childElementCount;
        this.current = 0;
    }

    next(){
        let next = (this.current+1)%this.count;
        
        this.children[next].style.width = "100%";
        this.children[next].style.float = "right";

        this.children[this.current].style.width = "0";
        this.children[this.current].style.float = "left";
        this.current = next;
    }
}

let nationalities = new text_slider(document.querySelector("#nationalities"));
let about = new text_slider(document.querySelector("#about"));

window.setInterval(() => {
    nationalities.next();
    about.next();
}, 3000);