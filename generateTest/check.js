const shell = require('shelljs');

//ricerca la cartella contenente il file pom.xml
exports.isMaven = (repo) => {
    shell.cd("repository")
    let e= searchPom(repo)
    shell.cd("../")
    return e
}

//funzione ricorsiva che cerca in ogni directory il file pom.xml
function searchPom(dir){
    shell.cd(dir)
    //cerca tutti i file nella directory corrente
    file=""
    shell.ls().forEach((i)=>{
        //se esiste un file che si chiama pom.xml ritorna la directory dove è situato
        if(i==="pom.xml"){
            shell.cd("../")
            file=i;
        }
    })
    if(file!==""){
        return dir
    }
    //ottiene tutte le cartelle presenti nella directory corrente
    directory=""
    shell.ls("-d","*/").forEach(i=>{
        //richiama la funzione per ogni cartella presente
        let result = searchPom(i)
        //se il risultata non è la stringa vuota allora ritorna la il path dove è situato 
        //il file pom.xml
        if(result!==""){
            shell.cd("../")
            directory= dir+"/"+result;
        }
    })
    if (directory!=="") {
        return directory
    }
    //altrimenti ritorna la stringa vuota
    shell.cd("../")
    return ""
}