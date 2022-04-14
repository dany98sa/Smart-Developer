const { Octokit } = require('@octokit/rest');
const { pull } = require('./git/pull');
const logger = require('./util/logger')
const EventSource = require('eventsource')
require('dotenv').config()
const { Webhooks, createNodeMiddleware } = require("@octokit/webhooks");
const { isMaven } = require('./generateTest/check');
const { removeProjectDir, createProjectDir } = require('./util/file');

logger.info("app start")

const webhooks = new Webhooks({
    secret: process.env.SECRET
});

const octokit = new Octokit({
    auth: process.env.PERSONAL_ACCESS_TOKEN
})

const webhookProxyUrl = "https://smee.io/YhRaTdSdg41PI3x4";

const source = new EventSource(webhookProxyUrl);

source.onmessage = async (event) => {
    const webhookEvent = JSON.parse(event.data);
    webhooks.verifyAndReceive({
        id: webhookEvent["x-request-id"],
        name: webhookEvent["x-github-event"],
        signature: webhookEvent["x-hub-signature"],
        payload: webhookEvent.body,
    }).catch(console.error);
    switch (webhookEvent["x-github-event"]) {
        case "push":
            logger.info("push event received")
            await pull(
                octokit,
                webhookEvent.body.repository.full_name,
                webhookEvent.body.ref.replace("refs/heads/", "")
            )
            if (isMaven(webhookEvent.body.repository.full_name)) {
                logger.info("maven project")
            } else {
                logger.info("not a maven project")
                removeProjectDir(webhookEvent.body.repository.full_name)
            }
            break;
        case "installation":
            switch (webhookEvent.body.action) {
                case 'created':
                    createProjectDir(webhookEvent.installation.account.login)
                    break;
                case 'deleted':
                    removeProjectDir(webhookEvent.installation.account.login)
                    break;
                default:
                    console.log("events received")
                    console.log(webhookEvent)
                    break;
            }
            break;
        default:
            console.log("events received")
            console.log(webhookEvent)
            break;
    }
};

require("http").createServer(createNodeMiddleware(webhooks)).listen(3000);