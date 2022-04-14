const shell = require('shelljs');
const logger = require('../util/logger')

if (!shell.which('mvn')) {
    logger.error("mvn command not found")
}

const generateTest = (repo) => {
    shell.cd("download/" + repo)
    const mvnOutput= shell.exec('mvn compile')
    if(mvnOutput.code!==0){
        logger.error("mvn compile error")
        logger.error(mvnOutput.stderr)
    }
    logger.info("mvn compile "+repo)
    const v=0;
    v;
    //shell.cd('../../..')
}
generateTest("")
shell.ls().forEach(e => {
    console.log(e)
})