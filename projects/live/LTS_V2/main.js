function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let chart = new Chart('chart', {
    type: 'scatter',
    data: {
        datasets: [{
            label: "N/A",
            data: [{
                x: 0,
                y: 0
            }]
        }]
    },
    options: {
        animation: {
            duration: 0 // general animation time
        },
        hover: {
            animationDuration: 0 // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0 // animation duration after a resize
    }
})

let runLTS = async () => {
    document.querySelector("button").innerText = "LOADING...";

    let ran = false;
    let count = 0;

    runEverything();

    let readToCSVDATA = async () => {
        while(LTS_OUT == ""){
            await sleep(100);           
        }
        let out = d3.csvParseRows(LTS_OUT);
        LTS_OUT = "";
        return out;
    }

    let chartData = await readToCSVDATA();
    let chartTitle = chartData[0];
    chartData.shift();

    let datasets = [];
    
    for(let i = 1; i < chartTitle.length; i++){
        datasets.push({
            label: chartTitle[i],
            data: []
        });
    }
    
    for(let i = 0; i < chartData.length; i++){
        for(let j = 0; j < chartTitle.length - 1; j++){
            datasets[j].data.push({
                x: chartData[i][0],
                y: chartData[i][j + 1]
            })
        }
    }

    chart.data.datasets = datasets;
    chart.update();

    document.querySelector("button").innerText = "RUN";
}
