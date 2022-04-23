const shell = require('shelljs');
const logger = require('../util/logger')

if (!shell.which('mvn')) {
    logger.error("mvn command not found")
}

if (!shell.which('EVOSUITE')) {
    logger.error("EVOSUITE command not found")
}

const generateTest = (repo) => {
    shell.cd("download/" + repo)
    const mvnOutput = shell.exec('mvn compile')
    if (mvnOutput.code !== 0) {
        logger.error("mvn compile error")
        logger.error(mvnOutput.stderr)
    }
    logger.info("mvn compile " + repo)

    const evosuiteOutput = shell.exec('EVOSUITE -prefix ' + foundPrefix())

    if (evosuiteOutput.code !== 0) {
        logger.error("evosuite compile error")
        logger.error(evosuiteOutput.stderr)
    }
    logger.info("evosuite run " + repo)

    shell.cd('../../..')
}

const foundPrefix = () => {
    shell.cd("src/main/java")
    let e = shell.ls().pop()
    shell.cd('../../..')
    return e
}

generateTest("")
shell.ls().forEach(e => {
    console.log(e)
})