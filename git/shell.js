const shell = require('shelljs')
const logger = require('../util/logger')
//controlla se esiste il commando git
if (!shell.which('git')) {
    logger.error("git command not found")
    shell.exit(1)
}
//clona una repository
exports.clone = (link) => {
    shell.cd('repository')
    logger.info('start git clone ' + link)
    let cloneOutput = shell.exec('git clone ' + link)
    if (cloneOutput.code !== 0) {
        logger.error(cloneOutput.stderr)
    } else {
        logger.info('git clone finished')
    }
    shell.cd('../')
}
//cambia il branch
exports.switchBranch = (branch, repo) => {
    shell.cd("repository/" + repo)
    logger.info('switch repository branch ' + branch)
    let switchOutput = shell.exec('git switch ' + branch)
    if (switchOutput.code !== 0) {
        logger.error(switchOutput.stderr)
        return false;
    }
    logger.info('branch switched')
    shell.cd("../..")
    return true
}
//effettua un commit e fa un push forzato per evitare merge
exports.push = (repo) => {
    // esegue il comando git add di tutti i file modificati o creati
    shell.cd("repository/" + repo)
    logger.info('git add .')
    let addOutput = shell.exec('git add .')
    if (addOutput.code !== 0) {
        logger.error(addOutput.stderr)
        shell.cd("../..")
        return;
    }
    //esegue un commit usando come standard per i messaggi di commit il Conventional Commits
    logger.info('git commit')
    let commitOutput = shell.exec('git commit -m "test: generate test case with evosuite"')
    if (commitOutput.code !== 0) {
        logger.error(addOutput.stderr)
        shell.cd("../..")
        return;
    }
    //esegue un push forzato per evitare merge e conflitti di versioning
    logger.info('git push -f')
    let pushOutput = shell.exec('git push -f')
    if (pushOutput.code !== 0) {
        logger.error(addOutput.stderr)
        shell.cd("../..")
        return;
    }
    console.log(pushOutput)
    shell.cd("../..")
}