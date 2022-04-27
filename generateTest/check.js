const shell = require('shelljs');

//ricerca la cartella contenente il file pom.xml
exports.isMaven = (repo) => {
    return searchPom("repository/"+repo)
}

//funzione ricorsiva che cerca in ogni directory il file pom.xml
function searchPom(dir){
    shell.cd(dir)
    //cerca tutti i file nella directory corrente
    shell.ls().forEach(i=>{
        //se esiste un file che si chiama pom.xml ritorna la directory dove è situato
        if(i==="pom.xml"){
            shell.cd("../")
            return dir;
        }
    })
    //ottiene tutte le cartelle presenti nella directory corrente
    shell.ls("-d */").forEach(i=>{
        //richiama la funzione per ogni cartella presente
        let result = searchPom(i)
        //se il risultata non è la stringa vuota allora ritorna la il path dove è situato 
        //il file pom.xml
        if(result!==""){
            shell.cd("../")
            return dir+"/"+result;
        }
    })
    //altrimenti ritorna la stringa vuota
    shell.cd("../")
    return ""
}