const logger = require('./util/logger')
const EventSource = require('eventsource')
require('dotenv').config()
const { Webhooks, createNodeMiddleware } = require("@octokit/webhooks");
const { clone, switchBranch, push } = require("./git/shell");
const { isMaven } = require('./generateTest/check');
const {generateTest}=require("./generateTest/evosuiteRun")
const shell = require('shelljs')

logger.info("smarttesting start")

const webhooks = new Webhooks({
    secret: process.env.SECRET
});

const webhookProxyUrl = process.env.WEBHOOKPROXYURL;

const source = new EventSource(webhookProxyUrl);

//riceve un hook da github e effettua tutte le operazioni necessarie
source.onmessage = async (event) => {
    const webhookEvent = JSON.parse(event.data);
    webhooks.verifyAndReceive({
        id: webhookEvent["x-request-id"],
        name: webhookEvent["x-github-event"],
        signature: webhookEvent["x-hub-signature"],
        payload: webhookEvent.body,
    }).catch(console.error);
    switch (webhookEvent["x-github-event"]) {
        //caso in cui riceve un hook di push
        case "push":
            //se il nome di chi fa il push non è il bot allora
            if (webhookEvent.body.pusher.name !== process.env.EXCLUDEUSERNAME) {
                logger.info("push event received")
                //chiama la funzione per effettuare il clone
                clone(webhookEvent.body.repository.clone_url)
                //cambia il branch con quello dove è avvenuto il commit
                switchBranch(webhookEvent.body.ref.replace("refs/heads/", ""),
                    webhookEvent.body.repository.name)
                //controlla se è un progetto maven e ottiene la directory 
                //contenente il file pom.xml
                let dirMaven = isMaven(webhookEvent.body.repository.name)
                if (dirMaven !== ""){
                    //chiama la funzione per generare la test suite mediante evosuite
                    generateTest("repository/"+dirMaven)
                    //chiama la funzione per fare il push
                    push("repository/"+webhookEvent.body.repository.name)
                }
                //elimina la cartella del progetto dopo aver eseguito tutte le operazioni
                shell.rm("repository/"+webhookEvent.body.repository.name)
            }
            break;
        //altri casi di hook
        default:
            console.log("events received")
            console.log(webhookEvent)
            break;
    }
};

require("http").createServer(createNodeMiddleware(webhooks)).listen(3000);