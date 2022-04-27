const shell = require('shelljs');
const logger = require('../util/logger')

//controlla se esiste il comando mvn
if (!shell.which('mvn')) {
    logger.error("mvn command not found")
    shell.exit(1)
}

//controlla se esiste il comando EVOSUITE
if (!shell.which('EVOSUITE')) {
    logger.error("EVOSUITE command not found")
    shell.exit(1)
}

//funzione che genera la test case mediante evosuite
exports.generateTest = (repo) => {
    shell.cd(repo)
    //compila il progetto
    const mvnOutput = shell.exec('mvn compile')
    if (mvnOutput.code !== 0) {
        logger.error("mvn compile error")
        logger.error(mvnOutput.stderr)
    }
    logger.info("mvn compile " + repo)
    //se il progetto è stato compilato esegue evosuite per ogni cartella nella directory 
    //src/main/java
    foundPrefix().forEach(e => {
        const evosuiteOutput = shell.exec('EVOSUITE -prefix ' + e)

        if (evosuiteOutput.code !== 0) {
            logger.error("evosuite compile error")
            logger.error(evosuiteOutput.stderr)
        }
    })
    logger.info("evosuite run " + repo)
    let goBack = "";
    repo.split("/").forEach(() => {
        goBack = goBack + "../"
    })
    shell.cd(goBack)
}

//cerca tutte le directory presenti in src/main/java
const foundPrefix = () => {
    shell.cd("src/main/java")
    let e = shell.ls("-d */")
    shell.cd('../../..')
    return e
}