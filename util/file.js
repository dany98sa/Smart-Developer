const fs = require('fs');
const https = require('https');
const logger = require('./logger')

exports.createProjectDir = (repo) => {
    if (fs.existsSync("download/" + repo)) {
        removeProjectDir(repo)
    }
    fs.mkdirSync("download/" + repo, (err) => {
        if (err) {
            logger.error(err)
            return;
        }
        logger.info('Directory ' + repo + ' created successfully!');
    })
};

exports.createProjectSubDir = (repo, path) => {
    fs.mkdirSync("download/" + repo + "/" + path, (err) => {
        if (err) {
            logger.error(err)
            return;
        }
        logger.info('Directory ' + repo + "/" + path + 'created successfully!');
    })
}

const removeProjectDir = (repo) => {
    fs.rmSync("download/" + repo, { recursive: true, }, (err) => {
        if (err) {
            logger.error(err)
            return;
        }
        logger.info('Directory ' + repo + ' removed successfully!');
    })
}

exports.removeProjectDir = removeProjectDir;

exports.downloadContent = (url, path, repo) => {
    logger.info("download " + url)
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream("download/" + repo + "/" + path);
        https.get(url, res => {
            res.pipe(file);
            // Close the file
            file.on('finish', () => {
                file.close();
                logger.info("download finished " + url)
                resolve('download finished');
            });
        }).on('error', (err) => {
            logger.error(err)
            reject(new Error(err.message))
        })
    })
}

const getAllFile=(dir, file)=>{
    file = file || [];
    let dirContent=fs.readdirSync("download/"+dir);
    dirContent.forEach(f=>{
        let name = dir+"/"+f;
        if (fs.statSync(name).isDirectory()){
            getAllFile(name, file);
        } else {
            file.push(name);
        }
    })
    return file;
}

exports.getAllFile=getAllFile

exports.getContents=(file)=>{
    return fs.readFileSync("download/"+file)
}