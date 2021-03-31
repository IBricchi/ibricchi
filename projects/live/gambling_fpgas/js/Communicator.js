class Communicator {
    debug = false;

    username = "";

    serverIP = "http://18.132.52.158:3000";

    checkCredUrl = this.debug ? "./testCheck.json" : (this.serverIP + "/isAuthorised");
    checkCredRequest = {
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        method: "GET"
    };
    /* 
        Not implemented yet
    */
    async getCheckCred(username, password) {
        this.checkCredRequest.headers.Authorization = 'Basic ' + btoa(username + ":" + password);
        return fetch(this.checkCredUrl, this.checkCredRequest)
            .then(request => request.json())
            .then(data => { return data.valid })
            .catch(err => {
                console.warn(err);
                console.warn("Communicator: Unable to fetch data from ", this.checkCredUrl);
                return false;
            });
    }

    setAuthentication(username, password) {
        this.username = username;
        let auth = 'Basic ' + btoa(username + ":" + password);
        this.openGameRequest.headers.Authorization = auth;
        this.sendOpenGameRequest.headers.Authorization = auth;
        this.sendJoinRequest.headers.Authorization = auth;
        this.sendStartRequest.headers.Authorization = auth;
        this.activeGameRequest.headers.Authorization = auth;
        this.showdownRequest.headers.Authorization = auth;
        this.continueGameRequest.headers.Authorization = auth;
        this.terminateGameRequest.headers.Authorization = auth;
    }

    openGameUrl = this.debug ? "./testOpen.json" : (this.serverIP + "/poker/openGameStatus");
    openGameRequest = {
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        method: "GET"
    };
    /*
        curl http://test:test@18.132.52.158:3000/poker/openGameStatus
    */
    async getOpen() {
        return fetch(this.openGameUrl, this.openGameRequest)
            .then(request => request.json())
            .then(data => { return data })
            .catch(err => {
                console.warn(err);
                console.warn("Communicator: Unable to fetch data from ", this.openGameUrl);
                return false
            });
    }

    sendOpenGameUrl = this.serverIP + "/poker/openGame";
    sendOpenGameRequest = {
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        method: "POST"
    };
    /* 
        curl --header "Content-Type: application/json; charset=UTF-8" \
            --request POST \
            --data '{"initialPlayerMoney":2000,"smallBlindValue":5}' \
            http://test:test@18.132.52.158:3000/poker/openGame
    */
    async sendOpen(startingMoney, smallBlindValue) {
        this.sendOpenGameRequest.body = '{ "initialPlayerMoney": ' + startingMoney + ', "smallBlindValue": ' + smallBlindValue + ' }'
        return fetch(this.sendOpenGameUrl, this.sendOpenGameRequest)
            .then(request => {
                if (request.status >= 400 && request.status < 600) {
                    request.text()
                        .then(t => alert(t));
                }
            })
            .catch(err => {
                console.warn(err);
                console.warn("Communicatior: Unable to send request to open game to ", this.sendOpenGameUrl);
            })
    }

    sendJoinUrl = this.serverIP + "/poker/joinGame"
    sendJoinRequest = {
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        method: "POST"
    };
    /*
        curl --header "Content-Type: application/json; charset=UTF-8" \
            --request POST \
            http://test:test@localhost:3000/poker/joinGame

    */
    async sendJoin() {
        return fetch(this.sendJoinUrl, this.sendJoinRequest)
            .catch(err => {
                console.warn(err);
                console.warn("Communicator: Unable to join game.");
            });
    }

    sendStartUrl = this.serverIP + "/poker/startGame";
    sendStartRequest = {
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            method: "POST"
        }
        /*
            curl --header "Content-Type: application/json; charset=UTF-8" \
                --request POST \
                http://test:test@localhost:3000/poker/startGame
        */
    async sendStart() {
        fetch(this.sendStartUrl, this.sendStartRequest)
            .then(response => {
                if (response.status >= 400 && response.status < 600) {
                    response.text()
                        .then(t => alert(t));
                }
            })
            .catch(err => {
                console.warn(err);
                console.warn("Communicator: Unable to start game.");
            });
    }

    activeGameUrl = this.debug ? "./testActive.json" : (this.serverIP + "/poker/activeGameStatus");
    activeGameRequest = {
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        method: "GET"
    };
    /*
        curl http://test:test@18.132.52.158:3000/poker/activeGameStatus
    */
    async getActive() {
        return fetch(this.activeGameUrl, this.activeGameRequest)
            .then(request => request.json())
            .then(data => { return data })
            .catch(err => {
                console.warn(err);
                console.warn("Communicator: Unable to fetch data from ", this.activeGameUrl);
                return false
            });
    }

    showdownUrl = this.debug ? "./testShowdown.json" : (this.serverIP + "/poker/activeGameStatus/showdown");
    showdownRequest = {
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        method: "GET"
    };
    /*
         curl http://test:test@18.132.52.158:3000/poker/activeGameStatus/showdown
    */
    async getShowdown() {
        return fetch(this.showdownUrl, this.showdownRequest)
            .then(request => request.json())
            .then(data => { return data })
            .catch(err => {
                console.warn(err);
                console.warn("Communicator: Unable to fetch data from ", this.showdownUrl);
                return false;
            });
    }

    continueGameUrl = this.serverIP + "/poker/startNewGameSamePlayers";
    continueGameRequest = {
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        method: "POST"
    };
    /*
        curl --header "Content-Type: application/json; charset=UTF-8" \
            --request POST \
            http://test:test@localhost:3000/poker/startNewGameSamePlayers
    */
    async sendContinueGame() {
        return fetch(this.continueGameUrl, this.continueGameRequest)
            .catch(err => {
                console.warn(err);
                console.warn("Communiator: Unable to continue game from: " + this.continueGameUrl);
            });
    }

    terminateGameUrl = this.serverIP + "/poker/terminateGame"
    terminateGameRequest = {
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        method: "POST"
    };
    /*
        curl --header "Content-Type: application/json; charset=UTF-8" \
            --request POST \
            http://test:test@18.132.52.158:3000/poker/terminateGame
    */
    async terminate() {
        return fetch(this.terminateGameUrl, this.terminateGameRequest)
            .catch(err => {
                console.warn(err);
                console.warn("Communicator: Unable to terminate game to ", this.terminateGameUrl);
            });
    }

}