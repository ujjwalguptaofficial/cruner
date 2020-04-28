import Axios from "axios";
import { createWriteStream } from "fs-extra";
const ProgressBar = require('progress');
import { tmpdir } from "os";
import * as Path from "path";
const request = Axios.create({
    validateStatus: function (status) {
        return true; // status >= 200 && status < 300; // default
    }
})
export class Github {
    static async getRepoInfo(repo: string) {
        // https://api.github.com/repos/ujjwalguptaofficial/fortjs
        return request.get(`https://api.github.com/repos/${repo}`);
    }
    static async downloadRepo(repo: string, tag: string = "latest"): Promise<String> {
        const repoInforesponse = await Github.getRepoInfo(repo);
        if (repoInforesponse.status === 200 || repoInforesponse.status === 201) {
            let response = await request.get(`https://api.github.com/repos/${repo}/releases/${tag}`);
            if (response.status === 200) {
                const tarBallUrl = response.data["tarball_url"];
                console.log("downloading app");
                const { data, headers } = await Axios.get(tarBallUrl, {
                    responseType: 'stream'
                })
                const totalLength = headers['content-length'];
                const progressBar = new ProgressBar('-> downloading [:bar] :percent :etas', {
                    width: 40,
                    complete: '=',
                    incomplete: ' ',
                    renderThrottle: 1,
                    total: parseInt(totalLength)
                });
                const fileDownloadPath = Path.resolve(tmpdir(), headers["content-disposition"].split(";")[1].split("=")[1]);
                const writer = createWriteStream(fileDownloadPath);
                data.on('data', (chunk) => progressBar.tick(chunk.length))
                data.pipe(writer);
                return new Promise((resolve, reject) => {
                    writer.on('finish', () => {
                        resolve(fileDownloadPath);
                    })
                    writer.on('error', reject)
                })
            }
        }
        else {
            console.log(`Invalid repo - repo ${repo} does not exist`);
        }
        return Promise.reject("Invalid repo");
    }

}