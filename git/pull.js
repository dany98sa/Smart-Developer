const { createProjectDir, createProjectSubDir, downloadContent } = require("../util/file")
const logger = require('../util/logger')

exports.pull = async (octokit, repo, ref) => {
    logger.info("start pull " + repo)
    createProjectDir(repo)
    await getContents(octokit, repo, ref)
    logger.info("finished pull " + repo)
}

async function getContents(octokit, repo, ref, path) {
    let { data } = await octokit.request({
        owner: repo.split('/')[0],
        repo: repo.split('/')[1],
        url: '/repos/{owner}/{repo}/contents/{path}?ref={ref}',
        method: 'GET',
        path,
        ref
    });
    const promises = data.map(async m => {
        if (m.type === 'dir') {
            await getContents(octokit, repo, ref, m.path)
            createProjectSubDir(repo, m.path)
        } else {
            await downloadContent(m.download_url, m.path, repo)
        }
    })
    return Promise.all(promises);
}