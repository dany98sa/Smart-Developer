const { getAllFile, getContents } = require("../util/file");

exports.push = async (octokit, ownerRepo, ref, author) => {
    let owner = ownerRepo.split('/')[0]
    let repo = ownerRepo.split('/')[1]

    const commits = await octokit.repos.listCommits({
        owner,
        repo,
    });

    const latestCommitSHA = commits.data[0].sha;

    // make changes
    //TODO caricare i file generati da evosuite
    const files=[]
    const f=getAllFile(ownerRepo)
    f.forEach(nameFile=>{
        files.push({
            mode:'100644',
            path: nameFile,
            content: getContents(nameFile)
        })
    })

    const {
        data: { sha: treeSHA },
    } =  await octokit.git.createTree({
        owner,
        repo,
        tree: files,
        base_tree: latestCommitSHA,
    });

    const {
        data: { sha: newCommitSHA },
    } =  await octokit.git.createCommit({
        owner,
        repo,
        author,
        tree: treeSHA,
        message: 'automatic generate test with evosuite',
        parents: [latestCommitSHA],
    });

    const result = await octokit.git.updateRef({
        owner,
        repo,
        ref,
        sha: newCommitSHA,
    });

    return result
}