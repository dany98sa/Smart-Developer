const { createLogger, format, transports } = require("winston");

const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};

let d = new Date;
let fname = d.toLocaleString().replaceAll(" ", "").replaceAll("/", "-").replaceAll(":", "_") + ".log"

const logger = createLogger({
    levels: logLevels,
    format: format.combine(format.timestamp(), format.json()),
    transports: [new transports.File({
        dirname: "logs",
        filename: fname
    })],
});

module.exports = logger 