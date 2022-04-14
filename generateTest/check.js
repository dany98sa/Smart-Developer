const fs = require('fs')

exports.isMaven = (repo) => {
    return fs.existsSync("download/"+repo+"/pom.xml")
}