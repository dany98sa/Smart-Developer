const shell = require('shelljs');
const logger = require('../util/logger')

//controlla se esiste il comando mvn
if (!shell.which('mvn')) {
    logger.error("mvn command not found")
    shell.exit(1)
}

//controlla se esiste il comando EVOSUITE
/*if (!shell.which('$EVOSUITE')) {
    logger.error("EVOSUITE command not found")
    shell.exit(1)
}*/

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
    //se il progetto è stato compilato esegue evosuite

        const evosuiteOutput = shell.exec('java -jar /home/dany98/evosuite-1.0.6.jar -target target/classes')

        if (evosuiteOutput.code !== 0) {
            logger.error("evosuite compile error")
            logger.error(evosuiteOutput.stderr)
        }

    logger.info("evosuite run " + repo)
    let goBack = "";
    repo.split("/").forEach(() => {
        goBack = goBack + "../"
    })
    shell.cd(goBack)
}