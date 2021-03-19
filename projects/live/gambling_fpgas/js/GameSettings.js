// let q;
class GameSettings {
    refreshRate = 1000;

    comm = {};
    intervalGet;

    me = {};
    players = [];

    communityCards;
    currentPlayer;
    currentPot;
    currentRound;
    winningReason;

    constructor(comm) {
        this.comm = comm;
    }

    start() {
        let t = this;
        t.updateOpen();
        this.intervalGet = setInterval(() => { t.updateOpen() }, t.refreshRate);
    }

    updateOpen() {
        this.comm.getOpen()
            .then(data => this.processOpen(data))
            .catch(err => {
                console.warn(err);
                console.warn("GameSettings: Unable to obtain new data.")
            });
    }

    processOpen(data) {
        // data.active = true;
        if (form.name != "OPEN" && !data.open) {
            removeForm();
            createOpenForm();
            removeTerminate();
        }
        if (form.name != "JOIN" && data.open && (data.players == null || !data.players.some(element => element.name == comm.username))) {
            removeForm();
            createJoinForm();
            createTerminate();
        }
        if (form.name != "START" && data.players != null && data.players.some(element => element.name == comm.username)) {
            removeForm();
            createStartForm();
            createTerminate();
        }
        if (data.active) {
            removeForm();
            canvas.show();
            loop();
            clearInterval(this.intervalGet);
            let t = this;
            t.updateActive();
            this.intervalGet = setInterval(() => { t.updateActive() }, t.refreshRate);
            createTerminate();
        }
    }

    updateActive() {
        this.comm.getActive()
            .then(data => this.processActive(data))
            .catch(err => {
                console.warn(err);
                console.warn("GameSettings: Unable to obtain new data.")
            });
    }

    processActive(data) {
        // if (data.hasEnded) {
        //     clearInterval(this.intervalGet);
        //     let t = this;
        //     t.updateShowdown();
        //     this.intervalGet = setInterval(() => { t.updateShowdown() }, t.refreshRate);
        //     createTerminate();
        // }
        if (!data.active) {
            canvas.hide();
            noLoop();
            clearInterval(this.intervalGet);
            let t = this;
            t.updateOpen();
            this.intervalGet = setInterval(() => { t.updateOpen() }, t.refreshRate);
            createTerminate();
        }
        this.communityCards = data.communityCards;
        this.currentPlayer = data.currentPlayer;
        this.currentPot = 0;
        this.me = {};
        this.players = [];
        for (let i = 0; i < data.players.length; i++) {
            let player = data.players[i];
            this.currentPot += player.totalMoneyBetAmount;
            player.order = i;
            if (player.name == comm.username) {
                this.me = player;
            }
            this.players.push(player);
        }
        this.currentRound = data.currentRound;
    }

    updateShowdown() {
        this.comm.getShowdown()
            .then(data => this.processShowdown(data))
            .catch(err => {
                console.warn(err);
                console.warn("GameSettings: Unable to obtain new data.")
            });
    }

    processShowdown(data) {
        if (data.gameStarted) {
            clearInterval(this.intervalGet);
            let t = this;
            t.updateActive();
            this.intervalGet = setInterval(() => { t.updateActive() }, t.refreshRate);
            createTerminate();
        }
        if (!data.active) {
            canvas.hide();
            noLoop();
            clearInterval(this.intervalGet);
            let t = this;
            t.updateOpen();
            this.intervalGet = setInterval(() => { t.updateOpen() }, t.refreshRate);
            createTerminate();
        }
        this.communityCards = data.communityCards;
        this.players = [];
        this.winningReason = data.winningReason;
        this.currentPot = data.potMoneyAmount;
        let k = 0;
        for (let i = 0; i < data.players.length; i++) {
            let player = data.players[i];
            player.order = i;
            player.winner = false;
            for (let j = 0; j < data.winners.length; j++) {
                if (player.name == data.winners[j].name) {
                    player.winnerOrder = k;
                    k++;
                    player.winner = true;
                }
            }
            if (player.name == comm.username) {
                this.me = player;
            }
            this.players.push(player);
        }
    }

}